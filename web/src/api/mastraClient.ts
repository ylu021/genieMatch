import { MastraClient } from "@mastra/client-js";

// Initialize Mastra Client pointing to your Mastra server
export const mastraClient = new MastraClient({
	baseUrl: import.meta.env.VITE_MASTRA_API_URL || "http://localhost:4111",
});

// Helper function to call masterAgent
export async function callMasterAgent(
	messages: Array<{ role: string; content: string }> | string
) {
	try {
		const agent = mastraClient.getAgent("masterAgent");

		// agent.generate() accepts either a string or an object with messages array
		// Use the same format as recommendationsApi.ts
		const response = await agent.generate({
			messages:
				typeof messages === "string"
					? messages
					: messages.map((msg) => ({
							role: msg.role as "user" | "assistant" | "system",
							content: msg.content,
					  })),
		} as Parameters<typeof agent.generate>[0] & { messages: unknown });

		// Return structured output (object) if available, otherwise fall back to text
		return response.object || response.text;
	} catch (error) {
		console.error("Error calling masterAgent:", error);
		throw error;
	}
}

// Helper function to get recommendations with pagination
export async function getRecommendations(
	inputData: {
		user_profile: Record<string, unknown>;
		preferences: Record<string, unknown>;
		reporting?: Record<string, unknown>;
	},
	pagination?: {
		limit?: number;
		cursor?: string;
	}
) {
	try {
		const workflow = mastraClient.getWorkflow("recommendationWorkflow");

		const run = await workflow.createRunAsync();

		const result = await run.startAsync({
			inputData: {
				...inputData,
				pagination: pagination || { limit: 20 },
			},
		});

		// Return the workflow result with recommendations and pagination info
		return result;
	} catch (error) {
		console.error("Error getting recommendations:", error);
		throw error;
	}
}
