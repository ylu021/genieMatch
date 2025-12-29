import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Define valid values
const VALID_IDS = [
	"mind_energy",
	"perception_style",
	"decision_style",
	"pet_energy",
	"identity_assertiveness",
] as const;

const VALID_CHOICES: Record<string, readonly string[]> = {
	mind_energy: ["introvert", "extrovert"],
	perception_style: ["sensing", "intuition"],
	decision_style: ["thinking", "feeling"],
	pet_energy: ["cat_person", "dog_person"],
	identity_assertiveness: ["assertive", "passive", "balanced"],
} as const;

const VALID_PHASES = ["self", "partner"] as const;

// Schema for a single choice object
const choiceItemSchema = z.object({
	id: z.string(),
	choice: z.string(),
	phase: z.string(),
});

// Input schema: array of choice objects
const inputSchema = z.object({
	items: z.array(choiceItemSchema),
});

// Output schema: same structure
const outputSchema = z.object({
	items: z.array(choiceItemSchema),
});

export const validationTool = createTool({
	id: "validation-tool",
	description:
		"Validates choice items, ensuring all fields are filled and values are recognized",
	inputSchema,
	outputSchema,
	execute: async ({ context }) => {
		const { items } = context;

		if (!items || !Array.isArray(items)) {
			throw new Error("Input must be an array of items");
		}

		// Validate each item
		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			// Check all fields are filled
			if (!item.id || item.id.trim() === "") {
				throw new Error(
					`Item at index ${i}: id field is required and cannot be empty`
				);
			}

			if (!item.choice || item.choice.trim() === "") {
				throw new Error(
					`Item at index ${i}: choice field is required and cannot be empty`
				);
			}

			if (!item.phase || item.phase.trim() === "") {
				throw new Error(
					`Item at index ${i}: phase field is required and cannot be empty`
				);
			}

			// Validate id is recognized
			if (!VALID_IDS.includes(item.id as any)) {
				throw new Error(
					`Item at index ${i}: Unrecognized id "${item.id}". Valid ids are: ${VALID_IDS.join(", ")}`
				);
			}

			// Validate choice is valid for the given id
			const validChoices = VALID_CHOICES[item.id];
			if (!validChoices) {
				throw new Error(
					`Item at index ${i}: No valid choices defined for id "${item.id}"`
				);
			}

			if (!validChoices.includes(item.choice)) {
				throw new Error(
					`Item at index ${i}: Unrecognized choice "${item.choice}" for id "${item.id}". Valid choices are: ${validChoices.join(", ")}`
				);
			}

			// Validate phase is recognized
			if (!VALID_PHASES.includes(item.phase as any)) {
				throw new Error(
					`Item at index ${i}: Unrecognized phase "${item.phase}". Valid phases are: ${VALID_PHASES.join(", ")}`
				);
			}
		}

		// If all validations pass, return the items
		return { items };
	},
});
