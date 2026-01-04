import { describe, it, expect } from "vitest";
import { groupingTool } from "../grouping-tool";

describe("groupingTool", () => {
	it("should group items by phase", async () => {
		const items = [
			{ id: "mind_energy", choice: "introvert", phase: "self" },
			{ id: "perception_style", choice: "sensing", phase: "self" },
			{ id: "mind_energy", choice: "extravert", phase: "partner" },
			{ id: "perception_style", choice: "intuition", phase: "partner" },
		];

		const result = await groupingTool.execute({
			context: { items },
			runtimeContext: {} as any,
		});

		expect(result.grouped.self).toHaveLength(2);
		expect(result.grouped.partner).toHaveLength(2);
		expect(result.grouped.self[0].phase).toBe("self");
		expect(result.grouped.partner[0].phase).toBe("partner");
	});

	it("should handle empty self phase", async () => {
		const items = [
			{ id: "mind_energy", choice: "introvert", phase: "partner" },
		];

		const result = await groupingTool.execute({
			context: { items },
			runtimeContext: {} as any,
		});

		expect(result.grouped.self).toHaveLength(0);
		expect(result.grouped.partner).toHaveLength(1);
	});

	it("should handle empty partner phase", async () => {
		const items = [{ id: "mind_energy", choice: "introvert", phase: "self" }];

		const result = await groupingTool.execute({
			context: { items },
			runtimeContext: {} as any,
		});

		expect(result.grouped.self).toHaveLength(1);
		expect(result.grouped.partner).toHaveLength(0);
	});

	it("should handle empty items array", async () => {
		const items: any[] = [];

		const result = await groupingTool.execute({
			context: { items },
			runtimeContext: {} as any,
		});

		expect(result.grouped.self).toHaveLength(0);
		expect(result.grouped.partner).toHaveLength(0);
	});

	it("should throw error for missing items", async () => {
		await expect(
			groupingTool.execute({
				context: {} as any,
				runtimeContext: {} as any,
			})
		).rejects.toThrow("Input must be an array of items");
	});

	it("should preserve all item properties when grouping", async () => {
		const items = [
			{ id: "mind_energy", choice: "introvert", phase: "self" },
			{ id: "decision_style", choice: "thinking", phase: "partner" },
		];

		const result = await groupingTool.execute({
			context: { items },
			runtimeContext: {} as any,
		});

		expect(result.grouped.self[0]).toEqual(items[0]);
		expect(result.grouped.partner[0]).toEqual(items[1]);
	});
});






