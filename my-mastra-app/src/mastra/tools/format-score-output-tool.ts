import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Input schema: output from preference-score-tool
const inputSchema = z.object({
	score: z.number().min(0).max(1),
	normalized_distance: z.number().min(0).max(1),
	used_traits: z.array(z.string()),
	preference_traits: z.record(z.string(), z.number()),
	candidate_traits: z.record(z.string(), z.number()),
	warnings: z.array(
		z.object({
			code: z.string(),
			message: z.string(),
			meta: z.record(z.string(), z.unknown()).optional(),
		})
	),
	reason: z.string().optional(),
	mbti: z.string().optional(),
	preferred_mbti: z.array(z.string()).optional(),
	reporting: z
		.object({
			per_trait: z.record(
				z.string(),
				z.object({
					preference: z.number(),
					candidate: z.number(),
					diff: z.number(),
				})
			),
		})
		.optional(),
	// Optional: user_id and weights if available
	user_id: z.string().optional(),
	weights: z
		.object({
			mbti: z.number().optional(),
			traits: z.number().optional(),
			demographics: z.number().optional(),
		})
		.optional(),
});

// Output schema: matches user-profile-example.json structure (without demographics)
const outputSchema = z.object({
	user_profile: z.object({
		user_id: z.string().optional(),
		mbti: z.string().optional(),
		traits: z.record(z.string(), z.number()),
	}),
	preferences: z.object({
		preferred_mbti: z.array(z.string()).optional(),
		preferred_traits: z.record(z.string(), z.number()),
		weights: z
			.object({
				mbti: z.number().optional(),
				traits: z.number().optional(),
				demographics: z.number().optional(),
			})
			.optional(),
	}),
	reporting: z.object({
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
		reason: z.string().optional(),
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
	}),
});

export const formatScoreOutputTool = createTool({
	id: "format-score-output-tool",
	description:
		"Formats preference score output into user_profile and preferences structure",
	inputSchema,
	outputSchema,
	execute: async ({ context }) => {
		const {
			score,
			normalized_distance,
			used_traits,
			preference_traits,
			candidate_traits,
			warnings,
			reason,
			user_id,
			mbti,
			preferred_mbti,
			weights,
			reporting,
		} = context;

		return {
			user_profile: {
				user_id,
				mbti,
				traits: candidate_traits,
			},
			preferences: {
				preferred_mbti,
				preferred_traits: preference_traits,
				weights,
			},
			reporting: {
				score,
				normalized_distance,
				used_traits,
				warnings,
				reason,
				per_trait: reporting?.per_trait,
			},
		};
	},
});
