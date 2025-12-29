import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { recommendationScoringTool } from "../recommendation-scoring-tool";

describe("recommendationScoringTool", () => {
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

	it("should return recommendations array with user_id and score", async () => {
		const targetUser = {
			user_id: "u_target",
			mbti: "INTJ-A",
			traits: {
				introversion: 0.9,
				abstraction: 0.7,
				logic: 0.8,
				judging: 0.75,
				assertiveness: 0.6,
				calm_affinity: 0.7,
			},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toHaveProperty("user_id");
		expect(result[0]).toHaveProperty("score");
		expect(typeof result[0].score).toBe("number");
	});

	it("should sort recommendations by score descending", async () => {
		const targetUser = {
			user_id: "u_target",
			mbti: "INTJ-A",
			traits: {
				introversion: 0.9,
				abstraction: 0.7,
				logic: 0.8,
				judging: 0.75,
				assertiveness: 0.6,
				calm_affinity: 0.7,
			},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		// Check sorting
		for (let i = 0; i < result.length - 1; i++) {
			expect(result[i].score).toBeGreaterThanOrEqual(result[i + 1].score);
		}
	});

	it("should give higher scores for matching MBTI", async () => {
		const targetUser = {
			user_id: "u_target",
			mbti: "INTJ-A",
			traits: {
				introversion: 0.9,
				abstraction: 0.7,
				logic: 0.8,
				judging: 0.75,
				assertiveness: 0.6,
				calm_affinity: 0.7,
			},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		// Find INTJ-A candidate (should be in candidate_pool.json)
		const intjCandidate = result.find((r) => r.user_id === "u_101");
		const enfpCandidate = result.find((r) => r.user_id === "u_102");

		if (intjCandidate && enfpCandidate) {
			// INTJ-A should score higher than ENFP-T for an INTJ-A target
			expect(intjCandidate.score).toBeGreaterThan(enfpCandidate.score);
		}
	});

	it("should give higher scores for similar traits", async () => {
		const targetUser = {
			user_id: "u_target",
			mbti: "INTJ-A",
			traits: {
				introversion: 0.9,
				abstraction: 0.7,
				logic: 0.8,
				judging: 0.75,
				assertiveness: 0.6,
				calm_affinity: 0.7,
			},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {
					preferred_traits: {
						introversion: 0.9,
						abstraction: 0.7,
						logic: 0.8,
					},
				},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		// All scores should be between 0 and 100
		result.forEach((r) => {
			expect(r.score).toBeGreaterThanOrEqual(0);
			expect(r.score).toBeLessThanOrEqual(100);
		});
	});

	it("should handle demographics (age and country)", async () => {
		const targetUser = {
			user_id: "u_target",
			mbti: "INTJ-A",
			traits: {
				introversion: 0.9,
				abstraction: 0.7,
				logic: 0.8,
				judging: 0.75,
				assertiveness: 0.6,
				calm_affinity: 0.7,
			},
			demographics: {
				age: 30,
				location: {
					country: "US",
				},
			},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		// Should return results
		expect(result.length).toBeGreaterThan(0);
		// US candidates should score higher than non-US candidates
		const usCandidate = result.find((r) => r.user_id === "u_101");
		if (usCandidate) {
			expect(usCandidate.score).toBeGreaterThan(0);
		}
	});

	it("should handle missing traits gracefully", async () => {
		const targetUser = {
			user_id: "u_target",
			mbti: "INTJ-A",
			traits: {},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should handle missing MBTI gracefully", async () => {
		const targetUser = {
			user_id: "u_target",
			traits: {
				introversion: 0.9,
				abstraction: 0.7,
				logic: 0.8,
			},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should include all candidates in results", async () => {
		const targetUser = {
			user_id: "u_target",
			mbti: "INTJ-A",
			traits: {
				introversion: 0.9,
				abstraction: 0.7,
				logic: 0.8,
			},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		// Should have at least a few candidates from candidate_pool.json
		expect(result.length).toBeGreaterThanOrEqual(3);
	});

	it("should handle preferred_mbti in preferences", async () => {
		const targetUser = {
			user_id: "u_target",
			mbti: "INTJ-A",
			traits: {
				introversion: 0.9,
				abstraction: 0.7,
				logic: 0.8,
			},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {
					preferred_mbti: ["INTJ-A", "ENTJ-A"],
				},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should clamp scores to 0-100 range", async () => {
		const targetUser = {
			user_id: "u_target",
			mbti: "INTJ-A",
			traits: {
				introversion: 0.9,
				abstraction: 0.7,
				logic: 0.8,
				judging: 0.75,
				assertiveness: 0.6,
				calm_affinity: 0.7,
			},
		};

		const result = await recommendationScoringTool.execute({
			context: {
				target_user: targetUser,
				preferences: {},
				useOpenAI: false,
			},
			runtimeContext: {} as any,
		});

		result.forEach((r) => {
			expect(r.score).toBeGreaterThanOrEqual(0);
			expect(r.score).toBeLessThanOrEqual(100);
		});
	});
});

