import { describe, it, expect } from "vitest";
import { preferenceScoreTool } from "../preference-score-tool";

describe("preferenceScoreTool", () => {
	it("should calculate score for matching traits", async () => {
		const self = [
			{ id: "mind_energy", choice: "introvert", phase: "self" },
			{ id: "perception_style", choice: "sensing", phase: "self" },
		];

		const partner = [
			{ id: "mind_energy", choice: "introvert", phase: "partner" },
			{ id: "perception_style", choice: "sensing", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		expect(result.score).toBeGreaterThan(0.8); // Should be high for matching traits
		expect(result.normalized_distance).toBeLessThan(0.2);
		expect(result.used_traits.length).toBeGreaterThan(0);
		expect(result.preference_traits).toBeDefined();
		expect(result.candidate_traits).toBeDefined();
	});

	it("should calculate score for different traits", async () => {
		const self = [{ id: "mind_energy", choice: "introvert", phase: "self" }];

		const partner = [
			{ id: "mind_energy", choice: "extravert", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		expect(result.score).toBeLessThan(0.5); // Should be lower for different traits
		expect(result.normalized_distance).toBeGreaterThan(0.5);
	});

	it("should handle missing_policy skip", async () => {
		const self = [{ id: "mind_energy", choice: "introvert", phase: "self" }];

		const partner = [
			{ id: "perception_style", choice: "sensing", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		// Should only use traits present in both
		expect(result.used_traits.length).toBe(0);
		expect(result.score).toBe(0.5); // Default when no traits match
		expect(result.reason).toBe("no_observed_traits");
	});

	it("should handle missing_policy neutral_0_5", async () => {
		const self = [{ id: "mind_energy", choice: "introvert", phase: "self" }];

		const partner = [
			{ id: "perception_style", choice: "sensing", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "neutral_0_5",
			},
			runtimeContext: {} as any,
		});

		// Should use all traits with 0.5 defaults
		expect(result.used_traits.length).toBe(5); // All traits in universe
		expect(result.reason).toBe("neutral_imputation");
	});

	it("should derive MBTI from choices", async () => {
		const self = [
			{ id: "mind_energy", choice: "introvert", phase: "self" },
			{ id: "perception_style", choice: "sensing", phase: "self" },
			{ id: "decision_style", choice: "thinking", phase: "self" },
			{ id: "identity_assertiveness", choice: "assertive", phase: "self" },
		];

		const partner = [
			{ id: "mind_energy", choice: "extravert", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		expect(result.mbti).toBe("ISTJ-A");
		expect(result.preferred_mbti).toBeUndefined(); // Partner doesn't have all required
	});

	it("should derive preferred MBTI from partner choices", async () => {
		const self = [{ id: "mind_energy", choice: "introvert", phase: "self" }];

		const partner = [
			{ id: "mind_energy", choice: "extravert", phase: "partner" },
			{ id: "perception_style", choice: "intuition", phase: "partner" },
			{ id: "decision_style", choice: "feeling", phase: "partner" },
			{
				id: "identity_assertiveness",
				choice: "turbulent",
				phase: "partner",
			},
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		expect(result.preferred_mbti).toEqual(["ENFJ-T"]);
	});

	it("should generate warnings for duplicate ids", async () => {
		const self = [
			{ id: "mind_energy", choice: "introvert", phase: "self" },
			{ id: "mind_energy", choice: "extravert", phase: "self" }, // Duplicate
		];

		const partner = [
			{ id: "mind_energy", choice: "introvert", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		const duplicateWarning = result.warnings.find(
			(w) => w.code === "duplicate_id"
		);
		expect(duplicateWarning).toBeDefined();
		// Last write wins, so should use extravert (0.1) not introvert (0.9)
		expect(result.candidate_traits.introversion).toBe(0.1);
	});

	it("should generate warnings for unknown ids", async () => {
		const self = [{ id: "unknown_id", choice: "some_choice", phase: "self" }];

		const partner = [
			{ id: "mind_energy", choice: "introvert", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		const unknownWarning = result.warnings.find((w) => w.code === "unknown_id");
		expect(unknownWarning).toBeDefined();
	});

	it("should generate warnings for unknown choices", async () => {
		const self = [
			{ id: "mind_energy", choice: "unknown_choice", phase: "self" },
		];

		const partner = [
			{ id: "mind_energy", choice: "introvert", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		const unknownChoiceWarning = result.warnings.find(
			(w) => w.code === "unknown_choice"
		);
		expect(unknownChoiceWarning).toBeDefined();
	});

	it("should include per_trait reporting", async () => {
		const self = [{ id: "mind_energy", choice: "introvert", phase: "self" }];

		const partner = [
			{ id: "mind_energy", choice: "introvert", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		expect(result.reporting).toBeDefined();
		expect(result.reporting?.per_trait).toBeDefined();
		expect(result.reporting?.per_trait?.introversion).toBeDefined();
		expect(result.reporting?.per_trait?.introversion.preference).toBe(0.9);
		expect(result.reporting?.per_trait?.introversion.candidate).toBe(0.9);
		expect(result.reporting?.per_trait?.introversion.diff).toBe(0);
	});

	it("should clamp score values to [0, 1]", async () => {
		const self = [{ id: "mind_energy", choice: "introvert", phase: "self" }];

		const partner = [
			{ id: "mind_energy", choice: "extravert", phase: "partner" },
		];

		const result = await preferenceScoreTool.execute({
			context: {
				self,
				partner,
				missing_policy: "skip",
			},
			runtimeContext: {} as any,
		});

		expect(result.score).toBeGreaterThanOrEqual(0);
		expect(result.score).toBeLessThanOrEqual(1);
		expect(result.normalized_distance).toBeGreaterThanOrEqual(0);
		expect(result.normalized_distance).toBeLessThanOrEqual(1);
	});
});
