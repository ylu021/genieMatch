import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { validationTool } from "../tools/validation-tool";
import { groupingTool } from "../tools/grouping-tool";
import { preferenceScoreTool } from "../tools/preference-score-tool";
import { formatScoreOutputTool } from "../tools/format-score-output-tool";

// Schema for a single choice item
const choiceItemSchema = z.object({
	id: z.string(),
	choice: z.string(),
	phase: z.string(),
});

// Input schema: array of choice objects
const inputSchema = z.object({
	items: z.array(choiceItemSchema),
});

// Schema for grouped data
const groupedSchema = z.object({
	grouped: z.object({
		self: z.array(choiceItemSchema),
		partner: z.array(choiceItemSchema),
	}),
});

// Schema for scoring output (from preference-score-tool)
const scoringOutputSchema = z.object({
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
});

// Final output schema (from format-score-output-tool)
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

const validateData = createStep({
	id: "validate-data",
	description: "Validates choice items using validation tool",
	inputSchema,
	outputSchema: inputSchema, // Output is same as input (validated items)
	execute: async ({ inputData, runtimeContext }) => {
		if (!inputData || !inputData.items) {
			throw new Error("Input data with items array is required");
		}

		// Call the validation tool
		const result = await validationTool.execute({
			context: {
				items: inputData.items,
			},
			runtimeContext,
		});

		// Return validated items
		return result;
	},
});

const groupData = createStep({
	id: "group-data",
	description: "Groups validated items by phase using grouping tool",
	inputSchema: inputSchema, // Takes validated items
	outputSchema: groupedSchema,
	execute: async ({ inputData, runtimeContext }) => {
		if (!inputData || !inputData.items) {
			throw new Error("Input data with items array is required");
		}

		// Call the grouping tool
		const result = await groupingTool.execute({
			context: {
				items: inputData.items,
			},
			runtimeContext,
		});

		// Return grouped data
		return result;
	},
});

const scoreData = createStep({
	id: "score-data",
	description: "Scores candidate traits against preference traits",
	inputSchema: groupedSchema,
	outputSchema: scoringOutputSchema,
	execute: async ({ inputData, runtimeContext }) => {
		if (!inputData || !inputData.grouped) {
			throw new Error("Grouped data is required");
		}

		const { self, partner } = inputData.grouped;

		// Call the preference score tool
		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip", // or "neutral_0_5" if preferred
			},
			runtimeContext,
		});

		return result;
	},
});

const formatData = createStep({
	id: "format-data",
	description:
		"Formats scoring output into user_profile and preferences structure",
	inputSchema: scoringOutputSchema,
	outputSchema,
	execute: async ({ inputData, runtimeContext }) => {
		if (!inputData) {
			throw new Error("Scoring output is required");
		}

		// Call the format score output tool
		const result = await formatScoreOutputTool.execute({
			context: inputData,
			runtimeContext,
		});

		return result;
	},
});

const translatorWorkflow = createWorkflow({
	id: "translator-workflow",
	inputSchema,
	outputSchema,
})
	.then(validateData)
	.then(groupData)
	.then(scoreData)
	.then(formatData);

translatorWorkflow.commit();

export { translatorWorkflow };
