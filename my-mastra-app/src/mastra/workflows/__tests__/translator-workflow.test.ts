import { describe, it, expect, beforeEach } from "vitest";
import { translatorWorkflow } from "../translator-workflow";

describe("translatorWorkflow", () => {
	const mockRuntimeContext = {} as any;

	it("should execute full workflow with valid input", async () => {
		const input = {
			items: [
				{ id: "mind_energy", choice: "introvert", phase: "self" },
				{ id: "perception_style", choice: "sensing", phase: "self" },
				{ id: "decision_style", choice: "thinking", phase: "self" },
				{ id: "identity_assertiveness", choice: "assertive", phase: "self" },
				{ id: "mind_energy", choice: "introvert", phase: "partner" },
				{ id: "perception_style", choice: "intuition", phase: "partner" },
				{ id: "decision_style", choice: "thinking", phase: "partner" },
			],
		};

		const result = await translatorWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result).toBeDefined();
		expect(result.user_profile).toBeDefined();
		expect(result.user_profile.traits).toBeDefined();
		expect(result.preferences).toBeDefined();
		expect(result.preferences.preferred_traits).toBeDefined();
		expect(result.reporting).toBeDefined();
		expect(result.reporting.score).toBeGreaterThanOrEqual(0);
		expect(result.reporting.score).toBeLessThanOrEqual(1);
	});

	it("should validate input in first step", async () => {
		const invalidInput = {
			items: [{ id: "invalid_id", choice: "introvert", phase: "self" }],
		};

		await expect(
			translatorWorkflow.execute({
				inputData: invalidInput,
				runtimeContext: mockRuntimeContext,
			})
		).rejects.toThrow();
	});

	it("should group items by phase correctly", async () => {
		const input = {
			items: [
				{ id: "mind_energy", choice: "introvert", phase: "self" },
				{ id: "perception_style", choice: "sensing", phase: "self" },
				{ id: "mind_energy", choice: "extravert", phase: "partner" },
			],
		};

		const result = await translatorWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		// Verify traits are derived from self items
		expect(result.user_profile.traits).toBeDefined();
		// Verify preferences are derived from partner items
		expect(result.preferences.preferred_traits).toBeDefined();
	});

	it("should calculate score between self and partner traits", async () => {
		const input = {
			items: [
				{ id: "mind_energy", choice: "introvert", phase: "self" },
				{ id: "mind_energy", choice: "introvert", phase: "partner" },
			],
		};

		const result = await translatorWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		// Should have high score for matching traits
		expect(result.reporting.score).toBeGreaterThan(0.7);
		expect(result.reporting.normalized_distance).toBeLessThan(0.3);
	});

	it("should handle different traits correctly", async () => {
		const input = {
			items: [
				{ id: "mind_energy", choice: "introvert", phase: "self" },
				{ id: "mind_energy", choice: "extravert", phase: "partner" },
			],
		};

		const result = await translatorWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		// Should have lower score for different traits
		expect(result.reporting.score).toBeLessThan(0.5);
		expect(result.reporting.normalized_distance).toBeGreaterThan(0.5);
	});

	it("should derive MBTI from self choices", async () => {
		const input = {
			items: [
				{ id: "mind_energy", choice: "introvert", phase: "self" },
				{ id: "perception_style", choice: "sensing", phase: "self" },
				{ id: "decision_style", choice: "thinking", phase: "self" },
				{ id: "identity_assertiveness", choice: "assertive", phase: "self" },
				{ id: "mind_energy", choice: "extravert", phase: "partner" },
			],
		};

		const result = await translatorWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result.user_profile.mbti).toBe("ISTJ-A");
	});

	it("should derive preferred MBTI from partner choices", async () => {
		const input = {
			items: [
				{ id: "mind_energy", choice: "introvert", phase: "self" },
				{ id: "mind_energy", choice: "extravert", phase: "partner" },
				{ id: "perception_style", choice: "intuition", phase: "partner" },
				{ id: "decision_style", choice: "feeling", phase: "partner" },
				{ id: "identity_assertiveness", choice: "turbulent", phase: "partner" },
			],
		};

		const result = await translatorWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result.preferences.preferred_mbti).toEqual(["ENFJ-T"]);
	});

	it("should include per_trait reporting", async () => {
		const input = {
			items: [
				{ id: "mind_energy", choice: "introvert", phase: "self" },
				{ id: "mind_energy", choice: "introvert", phase: "partner" },
			],
		};

		const result = await translatorWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result.reporting.per_trait).toBeDefined();
		expect(result.reporting.per_trait?.introversion).toBeDefined();
		expect(result.reporting.per_trait?.introversion.preference).toBeDefined();
		expect(result.reporting.per_trait?.introversion.candidate).toBeDefined();
		expect(result.reporting.per_trait?.introversion.diff).toBeDefined();
	});

	it("should handle warnings from tools", async () => {
		const input = {
			items: [
				{ id: "mind_energy", choice: "introvert", phase: "self" },
				{ id: "mind_energy", choice: "extravert", phase: "self" }, // Duplicate
				{ id: "mind_energy", choice: "introvert", phase: "partner" },
			],
		};

		const result = await translatorWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		// Should include warnings from preference-score-tool
		expect(result.reporting.warnings).toBeDefined();
		expect(Array.isArray(result.reporting.warnings)).toBe(true);
	});

	it("should handle empty items array", async () => {
		const input = {
			items: [],
		};

		await expect(
			translatorWorkflow.execute({
				inputData: input,
				runtimeContext: mockRuntimeContext,
			})
		).rejects.toThrow();
	});

	it("should handle missing required fields", async () => {
		const input = {
			items: [{ id: "mind_energy", choice: "", phase: "self" }],
		};

		await expect(
			translatorWorkflow.execute({
				inputData: input,
				runtimeContext: mockRuntimeContext,
			})
		).rejects.toThrow();
	});

	it("should process all workflow steps in sequence", async () => {
		const input = {
			items: [
				{ id: "mind_energy", choice: "introvert", phase: "self" },
				{ id: "perception_style", choice: "sensing", phase: "self" },
				{ id: "decision_style", choice: "thinking", phase: "self" },
				{ id: "pet_energy", choice: "cat_person", phase: "self" },
				{ id: "identity_assertiveness", choice: "assertive", phase: "self" },
				{ id: "mind_energy", choice: "extravert", phase: "partner" },
				{ id: "perception_style", choice: "intuition", phase: "partner" },
				{ id: "decision_style", choice: "feeling", phase: "partner" },
				{ id: "pet_energy", choice: "dog_person", phase: "partner" },
			],
		};

		const result = await translatorWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		// Verify all steps completed
		expect(result.user_profile.traits).toHaveProperty("introversion");
		expect(result.user_profile.traits).toHaveProperty("practicality");
		expect(result.user_profile.traits).toHaveProperty("logic");
		expect(result.user_profile.traits).toHaveProperty("calm_affinity");
		expect(result.user_profile.traits).toHaveProperty("assertiveness");

		expect(result.preferences.preferred_traits).toHaveProperty("introversion");
		expect(result.preferences.preferred_traits).toHaveProperty("practicality");
		expect(result.preferences.preferred_traits).toHaveProperty("logic");
		expect(result.preferences.preferred_traits).toHaveProperty("calm_affinity");

		expect(result.reporting.used_traits.length).toBeGreaterThan(0);
		expect(result.reporting.score).toBeDefined();
		expect(result.reporting.normalized_distance).toBeDefined();
	});
});






