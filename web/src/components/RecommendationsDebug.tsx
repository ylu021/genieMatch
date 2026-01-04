import { useState, useEffect } from "react";
import { mastraClient } from "@/api/mastraClient";
import { useRecommendations } from "@/api/useRecommendations";
import { getRecommendations } from "@/api/recommendationsApi";
import type { RecommendationResponse } from "@/api/recommendationsApi";
import testItems from "@/constants/testItems.json";

/**
 * Debug component to view the exact API response from recommendationsApi
 * Shows the items array being passed to the hook and the full API response
 */
export default function RecommendationsDebug() {
	// Items array imported from JSON - you can modify testItems.json to test different inputs
	const items = testItems.map((item) => ({
		...item,
		phase: item.phase as "self" | "partner",
	}));

	const { profiles, loading, hasMore } = useRecommendations({
		items,
		initialBatchSize: 10,
		batchSize: 10,
		prefetchThreshold: 3,
	});

	// Store the raw API response
	const [rawApiResponse, setRawApiResponse] =
		useState<RecommendationResponse | null>(null);
	const [rawHttpResponse, setRawHttpResponse] = useState<{
		text?: string;
		object?: RecommendationResponse;
		[key: string]: unknown;
	} | null>(null);
	const [apiLoading, setApiLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	// Fetch the raw API response to show exactly what's returned
	useEffect(() => {
		const fetchRawResponse = async () => {
			setApiLoading(true);
			setApiError(null);
			try {
				// Use mastraClient to get the FULL response
				const inputData = {
					items,
					pagination: { limit: 10 },
				};

				const agent = mastraClient.getAgent("masterAgent");

				const httpResponse = await agent.generate({
					messages: [
						{
							role: "user",
							content: `Process these user choices and get recommendations: ${JSON.stringify(
								inputData
							)}`,
						},
					],
				});

				// Store the FULL response from mastraClient
				setRawHttpResponse(httpResponse);

				// Also try to parse it using the API function
				const response = await getRecommendations({ items }, { limit: 10 });
				setRawApiResponse(response);
			} catch (error) {
				setApiError(
					error instanceof Error ? error.message : "Unknown error occurred"
				);
				// Store error response if available
				if (error && typeof error === "object" && "response" in error) {
					const errorResponse = (error as { response: unknown }).response;
					if (
						errorResponse &&
						typeof errorResponse === "object" &&
						"data" in errorResponse
					) {
						setRawHttpResponse(
							(errorResponse as { data: typeof rawHttpResponse }).data
						);
					}
				}
			} finally {
				setApiLoading(false);
			}
		};

		fetchRawResponse();
	}, [items]);

	return (
		<div style={{ padding: "20px", fontFamily: "monospace" }}>
			<style>
				{`
					@keyframes spin {
						0% { transform: rotate(0deg); }
						100% { transform: rotate(360deg); }
					}
				`}
			</style>
			<h1 style={{ marginBottom: "20px" }}>
				Recommendations API Debug
				{(loading || apiLoading) && (
					<span
						style={{
							marginLeft: "15px",
							fontSize: "18px",
							opacity: 0.7,
						}}
					>
						⏳
					</span>
				)}
			</h1>

			{/* Items Array Section */}
			<section style={{ marginBottom: "30px" }}>
				<h2 style={{ marginBottom: "10px", color: "#333" }}>
					Items Array (Input to Hook)
				</h2>
				<pre
					style={{
						background: "#f5f5f5",
						padding: "15px",
						borderRadius: "5px",
						overflow: "auto",
						border: "1px solid #ddd",
						height: "100px",
					}}
				>
					{JSON.stringify(items, null, 2)}
				</pre>
			</section>

			{/* Loading State for Hook */}
			{loading && (
				<div
					style={{
						padding: "15px",
						background: "#fff3cd",
						border: "1px solid #ffc107",
						borderRadius: "5px",
						marginBottom: "20px",
						display: "flex",
						alignItems: "center",
						gap: "10px",
					}}
				>
					<div
						style={{
							width: "20px",
							height: "20px",
							border: "3px solid #ffc107",
							borderTop: "3px solid transparent",
							borderRadius: "50%",
							animation: "spin 1s linear infinite",
						}}
					/>
					<strong>Loading recommendations from hook...</strong>
				</div>
			)}

			{/* Request Message Section */}
			<section style={{ marginBottom: "30px" }}>
				<h2 style={{ marginBottom: "10px", color: "#333" }}>
					Request Message (sent to masterAgent)
				</h2>
				<pre
					style={{
						background: "#fff3cd",
						padding: "15px",
						borderRadius: "5px",
						overflow: "auto",
						border: "1px solid #ffc107",
					}}
				>
					{JSON.stringify(
						{
							messages: [
								{
									role: "user",
									content: `Process these user choices and get recommendations: ${JSON.stringify(
										{
											items,
											pagination: { limit: 10 },
										}
									)}`,
								},
							],
						},
						null,
						2
					)}
				</pre>
			</section>

			{/* Raw HTTP Response Section - Shows EXACT response from server */}
			<section style={{ marginBottom: "30px" }}>
				<h2 style={{ marginBottom: "10px", color: "#333" }}>
					Raw HTTP Response (EXACT response from Mastra server)
					{apiLoading && (
						<span
							style={{
								marginLeft: "10px",
								fontSize: "14px",
								color: "#ffc107",
								fontWeight: "normal",
							}}
						>
							⏳ Loading...
						</span>
					)}
				</h2>
				{rawHttpResponse && (
					<pre
						style={{
							background: "#e3f2fd",
							padding: "15px",
							borderRadius: "5px",
							overflow: "auto",
							border: "2px solid #2196f3",
							maxHeight: "600px",
							fontSize: "12px",
						}}
					>
						{JSON.stringify(rawHttpResponse, null, 2)}
					</pre>
				)}
			</section>

			{/* Parsed API Response Section */}
			<section style={{ marginBottom: "30px" }}>
				<h2 style={{ marginBottom: "10px", color: "#333" }}>
					Parsed API Response (from recommendationsApi.getRecommendations)
					{apiLoading && (
						<span
							style={{
								marginLeft: "10px",
								fontSize: "14px",
								color: "#ffc107",
								fontWeight: "normal",
							}}
						>
							⏳ Loading...
						</span>
					)}
				</h2>
				{apiLoading && (
					<div
						style={{
							padding: "20px",
							background: "#fff3cd",
							border: "1px solid #ffc107",
							borderRadius: "5px",
							marginBottom: "10px",
							display: "flex",
							alignItems: "center",
							gap: "15px",
						}}
					>
						<div
							style={{
								width: "24px",
								height: "24px",
								border: "3px solid #ffc107",
								borderTop: "3px solid transparent",
								borderRadius: "50%",
								animation: "spin 1s linear infinite",
							}}
						/>
						<div>
							<strong>Fetching API response...</strong>
							<p
								style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8 }}
							>
								Calling masterAgent API endpoint
							</p>
						</div>
					</div>
				)}
				{apiError && (
					<div
						style={{
							padding: "15px",
							background: "#f8d7da",
							border: "1px solid #dc3545",
							borderRadius: "5px",
							marginBottom: "10px",
							color: "#721c24",
						}}
					>
						<strong>Error:</strong> {apiError}
					</div>
				)}
				{!apiLoading && !rawApiResponse && !apiError && (
					<div
						style={{
							padding: "15px",
							background: "#f8f9fa",
							border: "1px solid #dee2e6",
							borderRadius: "5px",
							color: "#6c757d",
							fontStyle: "italic",
						}}
					>
						No response yet. API call will be made automatically.
					</div>
				)}
				{rawApiResponse && (
					<pre
						style={{
							background: "#d4edda",
							padding: "15px",
							borderRadius: "5px",
							overflow: "auto",
							border: "1px solid #28a745",
							maxHeight: "600px",
						}}
					>
						{JSON.stringify(rawApiResponse, null, 2)}
					</pre>
				)}
			</section>

			{/* Summary Stats */}
			<section>
				<h2 style={{ marginBottom: "10px", color: "#333" }}>Summary</h2>
				<div
					style={{
						background: "#e7f3ff",
						padding: "15px",
						borderRadius: "5px",
						border: "1px solid #b3d9ff",
					}}
				>
					<p>
						<strong>Total Recommendations:</strong> {profiles.length}
					</p>
					<p>
						<strong>Has More:</strong> {hasMore ? "Yes" : "No"}
					</p>
					{rawApiResponse?.pagination?.nextCursor && (
						<p>
							<strong>Next Cursor:</strong>{" "}
							{rawApiResponse.pagination.nextCursor}
						</p>
					)}
				</div>
			</section>

			{/* Recommendations List */}
			<section style={{ marginTop: "30px" }}>
				<h2 style={{ marginBottom: "10px", color: "#333" }}>
					Recommendations List
					{loading && (
						<span
							style={{
								marginLeft: "10px",
								fontSize: "14px",
								color: "#ffc107",
								fontWeight: "normal",
							}}
						>
							⏳ Loading...
						</span>
					)}
				</h2>
				{loading && profiles.length === 0 ? (
					<div
						style={{
							background: "#f9f9f9",
							padding: "20px",
							borderRadius: "5px",
							border: "1px solid #ddd",
							textAlign: "center",
						}}
					>
						<div
							style={{
								width: "40px",
								height: "40px",
								border: "4px solid #ddd",
								borderTop: "4px solid #ffc107",
								borderRadius: "50%",
								animation: "spin 1s linear infinite",
								margin: "0 auto 15px",
							}}
						/>
						<p style={{ color: "#6c757d", margin: 0 }}>
							Loading recommendations...
						</p>
					</div>
				) : profiles.length > 0 ? (
					<div
						style={{
							background: "#f9f9f9",
							padding: "15px",
							borderRadius: "5px",
							border: "1px solid #ddd",
						}}
					>
						{profiles.map((profile, index) => (
							<div
								key={profile.user_id}
								style={{
									padding: "10px",
									marginBottom: "10px",
									background: "white",
									borderRadius: "3px",
									border: "1px solid #eee",
								}}
							>
								<strong>#{index + 1}</strong> User ID: {profile.user_id} |
								Score: {profile.score}
							</div>
						))}
					</div>
				) : (
					<div
						style={{
							background: "#f9f9f9",
							padding: "15px",
							borderRadius: "5px",
							border: "1px solid #ddd",
							color: "#6c757d",
							fontStyle: "italic",
						}}
					>
						No recommendations loaded yet.
					</div>
				)}
			</section>
		</div>
	);
}
