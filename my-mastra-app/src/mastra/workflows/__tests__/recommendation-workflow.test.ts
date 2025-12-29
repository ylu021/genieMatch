import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { recommendationWorkflow } from "../recommendation-workflow";

describe("recommendationWorkflow", () => {
	const mockRuntimeContext = {} as any;
	const originalEnv = process.env.OPENAI_API_KEY;

	beforeEach(() => {
		// Ensure we test local scoring (no OpenAI key)
		delete process.env.OPENAI_API_KEY;
	});

	afterEach(() => {
		// Restore original env
		if (originalEnv) {
			process.env.OPENAI_API_KEY = originalEnv;
		} else {
			delete process.env.OPENAI_API_KEY;
		}
	});

	it("should execute workflow with valid input and return recommendations", async () => {
		const input = {
			user_profile: {
				user_id: "u_001",
				mbti: "ISTJ-A",
				traits: {
					introversion: 0.9,
					practicality: 0.7,
					logic: 0.8,
					calm_affinity: 0.7,
					assertiveness: 0.6,
				},
			},
			preferences: {
				preferred_mbti: ["INTJ-A"],
				preferred_traits: {
					introversion: 0.9,
					practicality: 0.3,
					logic: 0.8,
					calm_affinity: 0.7,
					assertiveness: 0.6,
				},
			},
		};

		const result = await recommendationWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result).toBeDefined();
		expect(result.user_profile).toBeDefined();
		expect(result.user_profile.mbti).toBe("ISTJ-A");
		expect(result.preferences).toBeDefined();
		expect(result.recommendations).toBeDefined();
		expect(Array.isArray(result.recommendations)).toBe(true);
		expect(result.recommendations.length).toBeGreaterThan(0);
		expect(result.recommendations[0]).toHaveProperty("user_id");
		expect(result.recommendations[0]).toHaveProperty("score");
	});

	it("should preserve user_profile and preferences in output", async () => {
		const input = {
			user_profile: {
				user_id: "u_001",
				mbti: "ISTJ-A",
				traits: {
					introversion: 0.9,
					practicality: 0.7,
				},
			},
			preferences: {
				preferred_mbti: ["INTJ-A"],
				preferred_traits: {
					introversion: 0.9,
				},
			},
		};

		const result = await recommendationWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result.user_profile.user_id).toBe("u_001");
		expect(result.user_profile.mbti).toBe("ISTJ-A");
		expect(result.preferences.preferred_mbti).toEqual(["INTJ-A"]);
	});

	it("should include reporting if provided in input", async () => {
		const input = {
			user_profile: {
				user_id: "u_001",
				mbti: "ISTJ-A",
				traits: {
					introversion: 0.9,
					practicality: 0.7,
				},
			},
			preferences: {
				preferred_mbti: ["INTJ-A"],
				preferred_traits: {
					introversion: 0.9,
				},
			},
			reporting: {
				score: 0.85,
				normalized_distance: 0.15,
				used_traits: ["introversion", "practicality"],
				warnings: [],
			},
		};

		const result = await recommendationWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result.reporting).toBeDefined();
		expect(result.reporting?.score).toBe(0.85);
		expect(result.reporting?.used_traits).toEqual([
			"introversion",
			"practicality",
		]);
	});

	it("should create default reporting if not provided", async () => {
		const input = {
			user_profile: {
				user_id: "u_001",
				mbti: "ISTJ-A",
				traits: {
					introversion: 0.9,
				},
			},
			preferences: {
				preferred_mbti: ["INTJ-A"],
			},
		};

		const result = await recommendationWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result.reporting).toBeDefined();
		expect(result.reporting?.score).toBe(0);
		expect(result.reporting?.normalized_distance).toBe(0);
		expect(result.reporting?.used_traits).toEqual([]);
		expect(result.reporting?.warnings).toEqual([]);
	});

	it("should throw error if user_profile is missing", async () => {
		const input = {
			preferences: {
				preferred_mbti: ["INTJ-A"],
			},
		} as any;

		await expect(
			recommendationWorkflow.execute({
				inputData: input,
				runtimeContext: mockRuntimeContext,
			})
		).rejects.toThrow("User profile is required");
	});

	it("should handle optional fields gracefully", async () => {
		const input = {
			user_profile: {
				traits: {
					introversion: 0.9,
				},
			},
			preferences: {},
		};

		const result = await recommendationWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result).toBeDefined();
		expect(result.recommendations).toBeDefined();
		expect(Array.isArray(result.recommendations)).toBe(true);
	});

	it("should handle traits as passthrough objects", async () => {
		const input = {
			user_profile: {
				user_id: "u_001",
				mbti: "ISTJ-A",
				traits: {
					introversion: 0.9,
					custom_trait: 0.5,
					another_trait: 0.8,
				},
			},
			preferences: {
				preferred_traits: {
					introversion: 0.9,
					custom_trait: 0.5,
				},
			},
		};

		const result = await recommendationWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result).toBeDefined();
		expect(result.user_profile.traits).toBeDefined();
		expect(result.recommendations.length).toBeGreaterThan(0);
	});

	it("should return recommendations sorted by score descending", async () => {
		const input = {
			user_profile: {
				user_id: "u_001",
				mbti: "ISTJ-A",
				traits: {
					introversion: 0.9,
					practicality: 0.7,
					logic: 0.8,
				},
			},
			preferences: {
				preferred_mbti: ["INTJ-A"],
				preferred_traits: {
					introversion: 0.9,
				},
			},
		};

		const result = await recommendationWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		// Check sorting
		for (let i = 0; i < result.recommendations.length - 1; i++) {
			expect(result.recommendations[i].score).toBeGreaterThanOrEqual(
				result.recommendations[i + 1].score
			);
		}
	});

	it("should handle weights in preferences", async () => {
		const input = {
			user_profile: {
				user_id: "u_001",
				mbti: "ISTJ-A",
				traits: {
					introversion: 0.9,
				},
			},
			preferences: {
				preferred_mbti: ["INTJ-A"],
				preferred_traits: {
					introversion: 0.9,
				},
				weights: {
					mbti: 0.4,
					traits: 0.4,
					demographics: 0.2,
				},
			},
		};

		const result = await recommendationWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		expect(result).toBeDefined();
		expect(result.preferences.weights).toBeDefined();
		expect(result.recommendations.length).toBeGreaterThan(0);
	});

	it("should use demographics from mock file (user_demographics.json)", async () => {
		const input = {
			user_profile: {
				user_id: "u_001",
				mbti: "ISTJ-A",
				traits: {
					introversion: 0.9,
					practicality: 0.7,
					logic: 0.8,
				},
			},
			preferences: {
				preferred_mbti: ["INTJ-A"],
				preferred_traits: {
					introversion: 0.9,
				},
			},
		};

		const result = await recommendationWorkflow.execute({
			inputData: input,
			runtimeContext: mockRuntimeContext,
		});

		// Demographics from mock file should be used in scoring
		// US candidates should score higher due to country match (from user_demographics.json)
		expect(result.recommendations.length).toBeGreaterThan(0);
		
		// Verify recommendations are returned (demographics from mock are used internally)
		const usCandidate = result.recommendations.find((r) => r.user_id === "u_101");
		if (usCandidate) {
			expect(usCandidate.score).toBeGreaterThan(0);
		}
	});
});

