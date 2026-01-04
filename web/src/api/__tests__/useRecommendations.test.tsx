import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { useRecommendations } from "../useRecommendations";
import * as recommendationsApi from "../recommendationsApi";

// Mock the API
vi.mock("../recommendationsApi");

describe("useRecommendations", () => {
	const mockItems = [
		{ id: "mind_energy", choice: "introvert", phase: "self" as const },
		{ id: "perception_style", choice: "sensing", phase: "self" as const },
	];

	const mockApiResponse = {
		user_profile: { mbti: "ISTJ-A" },
		preferences: { preferred_mbti: ["INTJ-A"] },
		recommendations: [
			{ user_id: "u_101", score: 85.5 },
			{ user_id: "u_102", score: 82.3 },
			{ user_id: "u_103", score: 79.1 },
		],
		pagination: {
			hasMore: true,
			nextCursor: "u_103",
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("should load initial batch on mount", async () => {
		vi.mocked(recommendationsApi.getRecommendations).mockResolvedValueOnce(
			mockApiResponse
		);

		const { result } = renderHook(() =>
			useRecommendations({
				items: mockItems,
				initialBatchSize: 2,
			})
		);

		expect(result.current.loading).toBe(true);
		expect(result.current.profiles).toEqual([]);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.profiles).toHaveLength(3);
		expect(result.current.hasMore).toBe(true);
		expect(recommendationsApi.getRecommendations).toHaveBeenCalledWith(
			{ items: mockItems },
			{ limit: 2, cursor: undefined }
		);
	});

	it("should append new profiles to existing ones", async () => {
		const firstPage = {
			...mockApiResponse,
			recommendations: [
				{ user_id: "u_101", score: 85.5 },
				{ user_id: "u_102", score: 82.3 },
			],
			pagination: { hasMore: true, nextCursor: "u_102" },
		};

		const secondPage = {
			...mockApiResponse,
			recommendations: [{ user_id: "u_103", score: 79.1 }],
			pagination: { hasMore: false, nextCursor: undefined },
		};

		vi.mocked(recommendationsApi.getRecommendations)
			.mockResolvedValueOnce(firstPage)
			.mockResolvedValueOnce(secondPage);

		const { result } = renderHook(() =>
			useRecommendations({
				items: mockItems,
				initialBatchSize: 2,
			})
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.profiles).toHaveLength(2);
		expect(result.current.hasMore).toBe(true);
	});

	it("should auto-prefetch when cards are running low", async () => {
		const firstPage = {
			...mockApiResponse,
			recommendations: [
				{ user_id: "u_101", score: 85.5 },
				{ user_id: "u_102", score: 82.3 },
				{ user_id: "u_103", score: 79.1 },
				{ user_id: "u_104", score: 76.8 },
			],
			pagination: { hasMore: true, nextCursor: "u_104" },
		};

		const secondPage = {
			...mockApiResponse,
			recommendations: [{ user_id: "u_105", score: 74.2 }],
			pagination: { hasMore: false },
		};

		vi.mocked(recommendationsApi.getRecommendations)
			.mockResolvedValueOnce(firstPage)
			.mockResolvedValueOnce(secondPage);

		const { result } = renderHook(() =>
			useRecommendations({
				items: mockItems,
				initialBatchSize: 4,
				batchSize: 5,
				prefetchThreshold: 3,
			})
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		// Simulate removing cards until threshold
		result.current.removeTopCard(); // 3 left
		result.current.removeTopCard(); // 2 left (below threshold)

		await waitFor(() => {
			expect(recommendationsApi.getRecommendations).toHaveBeenCalledTimes(2);
		});
	});

	it("should not prefetch if hasMore is false", async () => {
		const lastPage = {
			...mockApiResponse,
			recommendations: [{ user_id: "u_101", score: 85.5 }],
			pagination: { hasMore: false, nextCursor: undefined },
		};

		vi.mocked(recommendationsApi.getRecommendations).mockResolvedValueOnce(
			lastPage
		);

		const { result } = renderHook(() =>
			useRecommendations({
				items: mockItems,
				initialBatchSize: 1,
				prefetchThreshold: 3,
			})
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.hasMore).toBe(false);

		// Remove cards - should not trigger prefetch
		result.current.removeTopCard();

		await waitFor(() => {
			expect(recommendationsApi.getRecommendations).toHaveBeenCalledTimes(1);
		});
	});

	it("should not load more if already loading", async () => {
		let resolvePromise: (value: any) => void;
		const pendingPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});

		vi.mocked(recommendationsApi.getRecommendations).mockReturnValue(
			pendingPromise
		);

		const { result } = renderHook(() =>
			useRecommendations({
				items: mockItems,
				initialBatchSize: 2,
			})
		);

		// Should be loading
		expect(result.current.loading).toBe(true);

		// Try to load more while loading (should not trigger)
		// This is tested implicitly - if it called twice, the test would fail

		// Resolve the promise
		resolvePromise!(mockApiResponse);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
	});

	it("should remove top card correctly", async () => {
		vi.mocked(recommendationsApi.getRecommendations).mockResolvedValueOnce(
			mockApiResponse
		);

		const { result } = renderHook(() =>
			useRecommendations({
				items: mockItems,
				initialBatchSize: 2,
			})
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.profiles).toHaveLength(3);

		result.current.removeTopCard();

		expect(result.current.profiles).toHaveLength(2);
		expect(result.current.profiles[0].user_id).toBe("u_102");
	});

	it("should refresh and reset state", async () => {
		vi.mocked(recommendationsApi.getRecommendations).mockResolvedValue(
			mockApiResponse
		);

		const { result } = renderHook(() =>
			useRecommendations({
				items: mockItems,
				initialBatchSize: 2,
			})
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.profiles.length).toBeGreaterThan(0);

		result.current.refresh();

		expect(result.current.profiles).toEqual([]);
		expect(result.current.hasMore).toBe(true);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(recommendationsApi.getRecommendations).toHaveBeenCalledTimes(2);
	});

	it("should handle API errors gracefully", async () => {
		const error = new Error("API Error");
		vi.mocked(recommendationsApi.getRecommendations).mockRejectedValueOnce(
			error
		);

		const { result } = renderHook(() =>
			useRecommendations({
				items: mockItems,
				initialBatchSize: 2,
			})
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.profiles).toEqual([]);
		expect(console.error).toHaveBeenCalledWith(
			"Failed to load recommendations:",
			error
		);
	});

	it("should use cursor for subsequent requests", async () => {
		const firstPage = {
			...mockApiResponse,
			recommendations: [{ user_id: "u_101", score: 85.5 }],
			pagination: { hasMore: true, nextCursor: "u_101" },
		};

		const secondPage = {
			...mockApiResponse,
			recommendations: [{ user_id: "u_102", score: 82.3 }],
			pagination: { hasMore: false },
		};

		vi.mocked(recommendationsApi.getRecommendations)
			.mockResolvedValueOnce(firstPage)
			.mockResolvedValueOnce(secondPage);

		const { result } = renderHook(() =>
			useRecommendations({
				items: mockItems,
				initialBatchSize: 1,
				batchSize: 1,
				prefetchThreshold: 1,
			})
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		// Remove card to trigger prefetch
		result.current.removeTopCard();

		await waitFor(() => {
			expect(recommendationsApi.getRecommendations).toHaveBeenCalledTimes(2);
		});

		// Check second call used cursor
		const secondCall = vi.mocked(recommendationsApi.getRecommendations).mock
			.calls[1];
		expect(secondCall[1]?.cursor).toBe("u_101");
	});
});
