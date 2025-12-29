import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { recommendationScoringTool } from "../tools/recommendation-scoring-tool";
import userDemographics from "../mocks/user_demographics.json" with { type: "json" };

// Input schema: matches the actual input structure from translator-workflow output
const inputSchema = z.object({
	user_profile: z.object({
		mbti: z.string().optional(),
		traits: z.object({}).passthrough(),
		user_id: z.string().optional(),
	}),
	preferences: z.object({
		preferred_mbti: z.array(z.string()).optional(),
		preferred_traits: z.object({}).passthrough(),
		weights: z
			.object({
				mbti: z.number().optional(),
				traits: z.number().optional(),
				demographics: z.number().optional(),
			})
			.optional(),
	}),
	reporting: z
		.object({
			score: z.number().min(0).max(1),
			normalized_distance: z.number().min(0).max(1),
			used_traits: z.array(z.string()),
			warnings: z.array(
				z.object({
					code: z.string(),
					message: z.string(),
					meta: z.record(z.string(), z.unknown()).optional(),
				})
			),
			per_trait: z
				.record(
					z.string(),
					z.object({
						preference: z.number(),
						candidate: z.number(),
						diff: z.number(),
					})
				)
				.optional(),
			reason: z.string().optional(),
		})
		.optional(),
});

// Output schema: includes recommendations
const outputSchema = z.object({
	user_profile: z.object({
		mbti: z.string().optional(),
		traits: z.object({}).passthrough(),
		user_id: z.string().optional(),
	}),
	preferences: z.object({
		preferred_mbti: z.array(z.string()).optional(),
		preferred_traits: z.object({}).passthrough(),
		weights: z
			.object({
				mbti: z.number().optional(),
				traits: z.number().optional(),
				demographics: z.number().optional(),
			})
			.optional(),
	}),
	recommendations: z.array(
		z.object({
			user_id: z.string(),
			score: z.number(),
		})
	),
	reporting: z
		.object({
			score: z.number().min(0).max(1),
			normalized_distance: z.number().min(0).max(1),
			used_traits: z.array(z.string()),
			warnings: z.array(
				z.object({
					code: z.string(),
					message: z.string(),
					meta: z.record(z.string(), z.unknown()).optional(),
				})
			),
			per_trait: z
				.record(
					z.string(),
					z.object({
						preference: z.number(),
						candidate: z.number(),
						diff: z.number(),
					})
				)
				.optional(),
			reason: z.string().optional(),
		})
		.optional(),
});

const getRecommendations = createStep({
	id: "get-recommendations",
	description:
		"Gets recommendations by calling recommendationScoringTool to score candidates against the user profile",
	inputSchema,
	outputSchema,
	execute: async ({ inputData, runtimeContext }) => {
		if (!inputData || !inputData.user_profile) {
			throw new Error("User profile is required");
		}

		// Convert traits and preferred_traits from object to record for the tool
		const traits =
			inputData.user_profile.traits &&
			typeof inputData.user_profile.traits === "object"
				? (inputData.user_profile.traits as Record<string, number>)
				: {};

		const preferred_traits =
			inputData.preferences.preferred_traits &&
			typeof inputData.preferences.preferred_traits === "object"
				? (inputData.preferences.preferred_traits as Record<string, number>)
				: {};

		// Call the recommendation scoring tool directly
		// Use demographics from mock file (user_demographics.json)
		const recommendations = await recommendationScoringTool.execute({
			context: {
				target_user: {
					user_id: inputData.user_profile.user_id || "unknown",
					mbti: inputData.user_profile.mbti,
					traits,
					demographics: userDemographics,
				},
				preferences: {
					...inputData.preferences,
					preferred_traits,
				},
				useOpenAI: !!process.env.OPENAI_API_KEY,
			},
			runtimeContext,
		});

		// Return the combined result
		return {
			user_profile: inputData.user_profile,
			preferences: inputData.preferences,
			recommendations,
			reporting: inputData.reporting || {
				score: 0,
				normalized_distance: 0,
				used_traits: [],
				warnings: [],
			},
		};
	},
});

const recommendationWorkflow = createWorkflow({
	id: "recommendation-workflow",
	inputSchema,
	outputSchema,
}).then(getRecommendations);

recommendationWorkflow.commit();

export { recommendationWorkflow };

