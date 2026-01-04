import { describe, it, expect } from "vitest";
import { formatScoreOutputTool } from "../format-score-output-tool";

describe("formatScoreOutputTool", () => {
	it("should format scoring output correctly", async () => {
		const input = {
			score: 0.85,
			normalized_distance: 0.15,
			used_traits: ["introversion", "practicality"],
			preference_traits: {
				introversion: 0.9,
				practicality: 0.7,
			},
			candidate_traits: {
				introversion: 0.85,
				practicality: 0.65,
			},
			warnings: [],
			reason: "test_reason",
			mbti: "INTJ-A",
			preferred_mbti: ["INTJ-A"],
			reporting: {
				per_trait: {
					introversion: {
						preference: 0.9,
						candidate: 0.85,
						diff: 0.05,
					},
					practicality: {
						preference: 0.7,
						candidate: 0.65,
						diff: 0.05,
					},
				},
			},
		};

		const result = await formatScoreOutputTool.execute({
			context: input,
			runtimeContext: {} as any,
		});

		expect(result.user_profile.mbti).toBe("INTJ-A");
		expect(result.user_profile.traits).toEqual(input.candidate_traits);
		expect(result.preferences.preferred_mbti).toEqual(["INTJ-A"]);
		expect(result.preferences.preferred_traits).toEqual(
			input.preference_traits
		);
		expect(result.reporting.score).toBe(0.85);
		expect(result.reporting.normalized_distance).toBe(0.15);
		expect(result.reporting.used_traits).toEqual(input.used_traits);
		expect(result.reporting.warnings).toEqual([]);
		expect(result.reporting.reason).toBe("test_reason");
		expect(result.reporting.per_trait).toEqual(input.reporting.per_trait);
	});

	it("should handle optional user_id and weights", async () => {
		const input = {
			score: 0.8,
			normalized_distance: 0.2,
			used_traits: ["introversion"],
			preference_traits: { introversion: 0.9 },
			candidate_traits: { introversion: 0.8 },
			warnings: [],
			user_id: "u_001",
			weights: {
				mbti: 0.4,
				traits: 0.4,
				demographics: 0.2,
			},
			reporting: {
				per_trait: {},
			},
		};

		const result = await formatScoreOutputTool.execute({
			context: input,
			runtimeContext: {} as any,
		});

		expect(result.user_profile.user_id).toBe("u_001");
		expect(result.preferences.weights).toEqual(input.weights);
	});

	it("should handle missing optional fields", async () => {
		const input = {
			score: 0.8,
			normalized_distance: 0.2,
			used_traits: ["introversion"],
			preference_traits: { introversion: 0.9 },
			candidate_traits: { introversion: 0.8 },
			warnings: [],
			reporting: {
				per_trait: {},
			},
		};

		const result = await formatScoreOutputTool.execute({
			context: input,
			runtimeContext: {} as any,
		});

		expect(result.user_profile.user_id).toBeUndefined();
		expect(result.user_profile.mbti).toBeUndefined();
		expect(result.preferences.preferred_mbti).toBeUndefined();
		expect(result.preferences.weights).toBeUndefined();
		expect(result.reporting.reason).toBeUndefined();
	});

	it("should preserve all warnings", async () => {
		const warnings = [
			{ code: "duplicate_id", message: "Test warning", meta: { test: true } },
		];

		const input = {
			score: 0.8,
			normalized_distance: 0.2,
			used_traits: ["introversion"],
			preference_traits: { introversion: 0.9 },
			candidate_traits: { introversion: 0.8 },
			warnings,
			reporting: {
				per_trait: {},
			},
		};

		const result = await formatScoreOutputTool.execute({
			context: input,
			runtimeContext: {} as any,
		});

		expect(result.reporting.warnings).toEqual(warnings);
	});

	it("should handle empty per_trait reporting", async () => {
		const input = {
			score: 0.8,
			normalized_distance: 0.2,
			used_traits: ["introversion"],
			preference_traits: { introversion: 0.9 },
			candidate_traits: { introversion: 0.8 },
			warnings: [],
		};

		const result = await formatScoreOutputTool.execute({
			context: input,
			runtimeContext: {} as any,
		});

		expect(result.reporting.per_trait).toBeUndefined();
	});
});






