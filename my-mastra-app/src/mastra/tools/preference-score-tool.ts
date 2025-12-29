import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Allowed axis types
type AllowedAxis =
	| "mind_energy"
	| "perception_style"
	| "decision_style"
	| "pet_energy"
	| "identity_assertiveness";

// Trait keys
type TraitKey =
	| "introversion"
	| "practicality"
	| "logic"
	| "calm_affinity"
	| "assertiveness";

// Choice item schema
const choiceItemSchema = z.object({
	id: z.string(),
	choice: z.string(),
	phase: z.string(),
});

// Translation mappings
const TRANSLATION_MAP: Record<
	AllowedAxis,
	Record<string, { trait: TraitKey; value: number }>
> = {
	mind_energy: {
		introvert: { trait: "introversion", value: 0.9 },
		extravert: { trait: "introversion", value: 0.1 },
	},
	perception_style: {
		sensing: { trait: "practicality", value: 0.7 },
		intuition: { trait: "practicality", value: 0.3 },
	},
	decision_style: {
		thinking: { trait: "logic", value: 0.8 },
		feeling: { trait: "logic", value: 0.2 },
	},
	pet_energy: {
		cat_person: { trait: "calm_affinity", value: 0.7 },
		dog_person: { trait: "calm_affinity", value: 0.3 },
	},
	identity_assertiveness: {
		assertive: { trait: "assertiveness", value: 0.6 },
		turbulent: { trait: "assertiveness", value: 0.4 },
	},
};

// Full trait universe
const FULL_TRAIT_UNIVERSE: TraitKey[] = [
	"introversion",
	"practicality",
	"logic",
	"calm_affinity",
	"assertiveness",
];

// Input schema
const inputSchema = z.object({
	self: z.array(choiceItemSchema),
	partner: z.array(choiceItemSchema),
	missing_policy: z.enum(["skip", "neutral_0_5"]).default("skip"),
});

// Output schema
const outputSchema = z.object({
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

// Clamp value to [0, 1]
function clamp(value: number): number {
	return Math.max(0, Math.min(1, value));
}

// Derive MBTI from choice items
function deriveMBTI(
	items: Array<{ id: string; choice: string; phase: string }>
): string | null {
	const choiceMap: Record<string, string> = {};

	// Build a map of id -> choice (last write wins for duplicates)
	for (const item of items) {
		choiceMap[item.id] = item.choice;
	}

	// Derive MBTI components
	// I/E from mind_energy
	const mindEnergy = choiceMap["mind_energy"];
	const iOrE =
		mindEnergy === "introvert" ? "I" : mindEnergy === "extravert" ? "E" : null;

	// S/N from perception_style
	const perceptionStyle = choiceMap["perception_style"];
	const sOrN =
		perceptionStyle === "sensing"
			? "S"
			: perceptionStyle === "intuition"
				? "N"
				: null;

	// T/F from decision_style
	const decisionStyle = choiceMap["decision_style"];
	const tOrF =
		decisionStyle === "thinking"
			? "T"
			: decisionStyle === "feeling"
				? "F"
				: null;

	// A/T from identity_assertiveness
	const assertiveness = choiceMap["identity_assertiveness"];
	const aOrT =
		assertiveness === "assertive"
			? "A"
			: assertiveness === "turbulent"
				? "T"
				: null;

	// J/P - not directly available, default to J or derive if needed
	// For now, we'll use J as default (can be made configurable)
	const jOrP = "J";

	// Build MBTI string if we have all required components
	if (iOrE && sOrN && tOrF && aOrT) {
		return `${iOrE}${sOrN}${tOrF}${jOrP}-${aOrT}`;
	}

	return null;
}

// Translate choice array to traits
function translateToTraits(
	items: Array<{ id: string; choice: string; phase: string }>,
	warnings: Array<{
		code: string;
		message: string;
		meta?: Record<string, unknown>;
	}>
): Record<TraitKey, number> {
	const traits: Partial<Record<TraitKey, number>> = {};
	const seenIds = new Set<string>();

	// Process items (last write wins for duplicates)
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const { id, choice } = item;

		// Check for duplicate id
		if (seenIds.has(id)) {
			warnings.push({
				code: "duplicate_id",
				message: `Duplicate id "${id}" found, using last value`,
				meta: { index: i, id, choice },
			});
		}
		seenIds.add(id);

		// Check if id is known
		if (!(id in TRANSLATION_MAP)) {
			warnings.push({
				code: "unknown_id",
				message: `Unknown id "${id}", skipping`,
				meta: { index: i, id, choice },
			});
			continue;
		}

		const axisMap = TRANSLATION_MAP[id as AllowedAxis];

		// Check if choice is known for this id
		if (!(choice in axisMap)) {
			warnings.push({
				code: "unknown_choice",
				message: `Unknown choice "${choice}" for id "${id}", skipping`,
				meta: { index: i, id, choice },
			});
			continue;
		}

		// Apply translation (last write wins)
		const mapping = axisMap[choice];
		traits[mapping.trait] = clamp(mapping.value);
	}

	// Return traits with all values clamped
	const result: Record<TraitKey, number> = {} as Record<TraitKey, number>;
	for (const trait of FULL_TRAIT_UNIVERSE) {
		result[trait] = traits[trait] ?? 0; // Default to 0 if not set
	}
	return result;
}

export const preferenceScoreTool = createTool({
	id: "preference-score-tool",
	description:
		"Scores candidate traits against preference traits using Setup A (preference-only)",
	inputSchema,
	outputSchema,
	execute: async ({ context }) => {
		const { self, partner, missing_policy } = context;
		const warnings: Array<{
			code: string;
			message: string;
			meta?: Record<string, unknown>;
		}> = [];

		// Translate both arrays to traits
		const candidate_traits = translateToTraits(self, warnings);
		const preference_traits = translateToTraits(partner, warnings);

		// Derive MBTI from choice items
		const mbti = deriveMBTI(self);
		const preferred_mbti = deriveMBTI(partner)
			? [deriveMBTI(partner)!]
			: undefined;

		let score: number;
		let normalized_distance: number;
		let used_traits: TraitKey[];
		let reason: string | undefined;

		if (missing_policy === "skip") {
			// Use intersection of traits that exist in both
			used_traits = FULL_TRAIT_UNIVERSE.filter(
				(trait) =>
					candidate_traits[trait] !== 0 || preference_traits[trait] !== 0
			).filter(
				(trait) =>
					candidate_traits[trait] !== 0 && preference_traits[trait] !== 0
			);

			if (used_traits.length === 0) {
				score = 0.5;
				normalized_distance = 0.5;
				reason = "no_observed_traits";
			} else {
				// Calculate average distance over used traits
				const distances = used_traits.map((trait) =>
					Math.abs(candidate_traits[trait] - preference_traits[trait])
				);
				normalized_distance =
					distances.reduce((sum, d) => sum + d, 0) / distances.length;
				score = clamp(1 - normalized_distance);
			}
		} else {
			// missing_policy === 'neutral_0_5'
			// Use full trait universe with 0.5 defaults
			used_traits = [...FULL_TRAIT_UNIVERSE];
			let hasImputation = false;

			const distances = used_traits.map((trait) => {
				const pref = preference_traits[trait] ?? 0.5;
				const cand = candidate_traits[trait] ?? 0.5;

				if (
					preference_traits[trait] === undefined ||
					candidate_traits[trait] === undefined
				) {
					hasImputation = true;
				}

				return Math.abs(cand - pref);
			});

			normalized_distance =
				distances.reduce((sum, d) => sum + d, 0) / distances.length;
			score = clamp(1 - normalized_distance);

			if (hasImputation) {
				reason = "neutral_imputation";
			}
		}

		// Build per_trait breakdown
		const per_trait: Record<
			string,
			{ preference: number; candidate: number; diff: number }
		> = {};

		for (const trait of FULL_TRAIT_UNIVERSE) {
			const pref = preference_traits[trait] ?? 0;
			const cand = candidate_traits[trait] ?? 0;
			per_trait[trait] = {
				preference: pref,
				candidate: cand,
				diff: Math.abs(cand - pref),
			};
		}

		return {
			score,
			normalized_distance,
			used_traits,
			preference_traits: preference_traits as Record<string, number>,
			candidate_traits: candidate_traits as Record<string, number>,
			warnings,
			reason,
			mbti: mbti ?? undefined,
			preferred_mbti,
			reporting: {
				per_trait,
			},
		};
	},
});
