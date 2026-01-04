/**
 * Hook for fetching recommendations with smart pagination and prefetching
 *
 * Features:
 * - Automatic prefetching when cards are running low
 * - Cursor-based pagination
 * - Configurable batch sizes
 *
 * Strategy:
 * - Initial load: 10 cards (fast initial render)
 * - Prefetch when threshold reached (smooth experience)
 * - Batch size: 10-15 cards per fetch (optimal for one-at-a-time viewing)
 */

import { useState, useEffect, useCallback } from "react";
import { getRecommendations } from "./recommendationsApi";

interface Profile {
	user_id: string;
	score: number;
}

interface ChoiceItem {
	id: string;
	choice: string;
	phase: "self" | "partner";
}

interface UseRecommendationsOptions {
	items: ChoiceItem[]; // Translator workflow input format
	initialBatchSize?: number; // Default: 10
	batchSize?: number; // Default: 10
	prefetchThreshold?: number; // Default: 3 (fetch when 3 cards left)
}

export function useRecommendations({
	items,
	initialBatchSize = 10,
	batchSize = 10,
	prefetchThreshold = 3,
}: UseRecommendationsOptions) {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [cursor, setCursor] = useState<string | undefined>();

	const loadMore = useCallback(
		async (limit: number) => {
			if (loading || !hasMore) return;

			setLoading(true);
			try {
				const result = await getRecommendations(
					{
						items,
					},
					{
						limit,
						cursor: cursor,
					}
				);

				setProfiles((prev) => [...prev, ...result.recommendations]);
				setHasMore(result.pagination.hasMore);
				setCursor(result.pagination.nextCursor);
			} catch (error) {
				console.error("Failed to load recommendations:", error);
			} finally {
				setLoading(false);
			}
		},
		[items, cursor, loading, hasMore]
	);

	// Load initial batch on mount
	useEffect(() => {
		loadMore(initialBatchSize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run once on mount

	// Prefetch when cards are running low
	useEffect(() => {
		if (
			profiles.length > 0 &&
			profiles.length <= prefetchThreshold &&
			hasMore &&
			!loading
		) {
			loadMore(batchSize);
		}
	}, [
		profiles.length,
		prefetchThreshold,
		hasMore,
		loading,
		batchSize,
		loadMore,
	]);

	// Remove top item from the list (useful for card swiping or queue-based UIs)
	const removeTopCard = useCallback(() => {
		setProfiles((prev) => prev.slice(1));
	}, []);

	return {
		profiles,
		loading,
		hasMore,
		removeTopCard,
		// Manual refresh if needed
		refresh: () => {
			setProfiles([]);
			setHasMore(true);
			setCursor(undefined);
			loadMore(initialBatchSize);
		},
	};
}
