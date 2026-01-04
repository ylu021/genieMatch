import { describe, it, expect } from "vitest";
import { validationTool } from "../validation-tool";

describe("validationTool", () => {
	it("should validate correct items", async () => {
		const validItems = [
			{ id: "mind_energy", choice: "introvert", phase: "self" },
			{ id: "perception_style", choice: "sensing", phase: "partner" },
		];

		const result = await validationTool.execute({
			context: { items: validItems },
			runtimeContext: {} as any,
		});

		expect(result.items).toEqual(validItems);
	});

	it("should throw error for missing items array", async () => {
		await expect(
			validationTool.execute({
				context: {} as any,
				runtimeContext: {} as any,
			})
		).rejects.toThrow("Input must be an array of items");
	});

	it("should throw error for empty id", async () => {
		const invalidItems = [{ id: "", choice: "introvert", phase: "self" }];

		await expect(
			validationTool.execute({
				context: { items: invalidItems },
				runtimeContext: {} as any,
			})
		).rejects.toThrow("id field is required");
	});

	it("should throw error for empty choice", async () => {
		const invalidItems = [{ id: "mind_energy", choice: "", phase: "self" }];

		await expect(
			validationTool.execute({
				context: { items: invalidItems },
				runtimeContext: {} as any,
			})
		).rejects.toThrow("choice field is required");
	});

	it("should throw error for empty phase", async () => {
		const invalidItems = [
			{ id: "mind_energy", choice: "introvert", phase: "" },
		];

		await expect(
			validationTool.execute({
				context: { items: invalidItems },
				runtimeContext: {} as any,
			})
		).rejects.toThrow("phase field is required");
	});

	it("should throw error for unrecognized id", async () => {
		const invalidItems = [
			{ id: "invalid_id", choice: "introvert", phase: "self" },
		];

		await expect(
			validationTool.execute({
				context: { items: invalidItems },
				runtimeContext: {} as any,
			})
		).rejects.toThrow("Unrecognized id");
	});

	it("should throw error for invalid choice for id", async () => {
		const invalidItems = [
			{ id: "mind_energy", choice: "invalid_choice", phase: "self" },
		];

		await expect(
			validationTool.execute({
				context: { items: invalidItems },
				runtimeContext: {} as any,
			})
		).rejects.toThrow("Unrecognized choice");
	});

	it("should throw error for invalid phase", async () => {
		const invalidItems = [
			{ id: "mind_energy", choice: "introvert", phase: "invalid_phase" },
		];

		await expect(
			validationTool.execute({
				context: { items: invalidItems },
				runtimeContext: {} as any,
			})
		).rejects.toThrow("Unrecognized phase");
	});

	it("should validate all valid choice combinations", async () => {
		const allValidItems = [
			{ id: "mind_energy", choice: "introvert", phase: "self" },
			{ id: "mind_energy", choice: "extravert", phase: "partner" },
			{ id: "perception_style", choice: "sensing", phase: "self" },
			{ id: "perception_style", choice: "intuition", phase: "partner" },
			{ id: "decision_style", choice: "thinking", phase: "self" },
			{ id: "decision_style", choice: "feeling", phase: "partner" },
			{ id: "pet_energy", choice: "cat_person", phase: "self" },
			{ id: "pet_energy", choice: "dog_person", phase: "partner" },
			{
				id: "identity_assertiveness",
				choice: "assertive",
				phase: "self",
			},
			{
				id: "identity_assertiveness",
				choice: "passive",
				phase: "partner",
			},
			{
				id: "identity_assertiveness",
				choice: "balanced",
				phase: "partner",
			},
		];

		const result = await validationTool.execute({
			context: { items: allValidItems },
			runtimeContext: {} as any,
		});

		expect(result.items).toEqual(allValidItems);
	});
});






