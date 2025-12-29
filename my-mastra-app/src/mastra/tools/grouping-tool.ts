import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Schema for a single choice item
const choiceItemSchema = z.object({
	id: z.string(),
	choice: z.string(),
	phase: z.string(),
});

// Input schema: array of choice objects (validated items)
const inputSchema = z.object({
	items: z.array(choiceItemSchema),
});

// Output schema: grouped by phase
const outputSchema = z.object({
	grouped: z.object({
		self: z.array(choiceItemSchema),
		partner: z.array(choiceItemSchema),
	}),
});

export const groupingTool = createTool({
	id: "grouping-tool",
	description: "Groups choice items by phase (self/partner)",
	inputSchema,
	outputSchema,
	execute: async ({ context }) => {
		const { items } = context;

		if (!items || !Array.isArray(items)) {
			throw new Error("Input must be an array of items");
		}

		// Group items by phase
		const grouped = {
			self: items.filter((item) => item.phase === "self"),
			partner: items.filter((item) => item.phase === "partner"),
		};

		return { grouped };
	},
});

