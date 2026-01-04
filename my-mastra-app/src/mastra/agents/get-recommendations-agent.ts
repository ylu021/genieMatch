import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { recommendationScoringTool } from "../tools/recommendation-scoring-tool";

export const getRecommendationsAgent = new Agent({
	name: "Get Recommendations Agent",
	instructions: `
      You are a helpful matchmaking assistant that provides personalized user recommendations based on profiles and preferences.

      Your primary function is to help users find compatible matches. When responding:
      - Always ask for a target user profile if none is provided
      - Use the recommendationScoringTool to score candidates against the target user
      - Consider user preferences, personality traits (MBTI), and demographics
      - Provide clear, helpful explanations of match scores
      - Keep responses concise but informative
      - When presenting recommendations, explain why certain candidates are good matches

      Use the recommendationScoringTool to score and rank candidate users.
  `,
	model: "openai/gpt-4o-mini",
	tools: { recommendationScoringTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: "file:../mastra.db", // path is relative to the .mastra/output directory
		}),
	}),
});
