import { createTool } from "@mastra/core/tools";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import candidatePool from "../mocks/candidate_pool.json" with { type: "json" };

// Create an agent for OpenAI-based scoring with the prompt from openaiClient.ts
const scoringAgent = new Agent({
	name: "recommendation-scoring-agent",
	instructions: `You are an assistant that scores candidate users for a matchmaking app.
Given a target user's profile and preferences, and a candidate pool, compute a numeric match score between 0 and 100 for each candidate.

Scoring guidance (apply reasonably):
- MBTI: if MBTI matches exactly, give bonus points. Partial matches (same letters) get smaller bonus.
- Traits: compute similarity across numeric trait fields (e.g., introversion, abstraction, logic, judging, assertiveness, calm_affinity). Use weighted Euclidean or cosine-like similarity and scale to 0-60 points depending on closeness.
- Demographics: prefer similar age (within ~5 years) and same country; add/subtract up to ~20 points.

Output requirements:
1) Return ONLY a single valid JSON array (no extra text, no explanation) of objects with exactly two fields: {"user_id": string, "score": number}.
2) Scores must be numbers between 0 and 100.
3) The array must be sorted in descending order by score.
4) Include every candidate from the pool (even if score is 0).

Now evaluate the following data and return the JSON array as specified.`,
	model: "openai/gpt-4o-mini",
});

// Local deterministic scorer used when OPENAI_API_KEY is not provided
function computeLocalScores(target: any, candidates: any[]) {
	function clamp(v: number, a = 0, b = 100) {
		return Math.max(a, Math.min(b, v));
	}

	function traitSimilarity(a: any = {}, b: any = {}) {
		// compute 1 - normalized euclidean distance over known trait keys
		const keys = [
			"introversion",
			"abstraction",
			"logic",
			"judging",
			"assertiveness",
			"calm_affinity",
		];
		let sumSq = 0;
		let count = 0;
		for (const k of keys) {
			if (typeof a[k] === "number" && typeof b[k] === "number") {
				const d = a[k] - b[k];
				sumSq += d * d;
				count++;
			}
		}
		if (count === 0) return 0.5;
		const dist = Math.sqrt(sumSq / count); // max possible dist is ~1.0
		return 1 - dist; // higher is more similar
	}

	const results = candidates.map((c) => {
		let score = 0;

		// traits: up to 60
		const tSim = traitSimilarity(target.traits || {}, c.traits || {});
		score += tSim * 60;

		// MBTI: up to 20
		if (target.mbti && c.mbti) {
			if (target.mbti === c.mbti) score += 20;
			else {
				// partial match: count matching letters
				const a = String(target.mbti).toUpperCase();
				const b = String(c.mbti).toUpperCase();
				let match = 0;
				for (let i = 0; i < Math.min(a.length, b.length); i++) {
					if (a[i] === b[i]) match++;
				}
				score += (match / 4) * 20; // scale
			}
		}

		// demographics: age and country up to 20
		const ageT = target.demographics && target.demographics.age;
		const ageC = c.demographics && c.demographics.age;
		if (typeof ageT === "number" && typeof ageC === "number") {
			const diff = Math.abs(ageT - ageC);
			if (diff <= 5) score += 10;
			else if (diff <= 10) score += 5;
		}

		const countryT =
			target.demographics &&
			target.demographics.location &&
			target.demographics.location.country;
		const countryC =
			c.demographics &&
			c.demographics.location &&
			c.demographics.location.country;
		if (countryT && countryC && countryT === countryC) score += 10;

		// keep within 0-100
		return {
			user_id: c.user_id,
			score: Math.round(clamp(score) * 100) / 100,
		};
	});

	// sort desc
	results.sort((a, b) => b.score - a.score);
	return results;
}

export const recommendationScoringTool = createTool({
	id: "recommendation-scoring",
	description:
		"Scores candidate users for a matchmaking app based on target user profile and preferences. Returns an array of {user_id, score} sorted by score descending.",
	inputSchema: z.object({
		target_user: z.object({
			user_id: z.string().optional(),
			mbti: z.string().optional(),
			traits: z.record(z.string(), z.number()).optional(),
			demographics: z
				.object({
					age: z.number().optional(),
					gender: z.string().optional(),
					location: z
						.object({
							city: z.string().optional(),
							country: z.string().optional(),
						})
						.optional(),
				})
				.optional(),
		}),
		preferences: z
			.object({
				preferred_mbti: z.array(z.string()).optional(),
				preferred_traits: z.record(z.string(), z.number()).optional(),
				weights: z
					.object({
						mbti: z.number().optional(),
						traits: z.number().optional(),
						demographics: z.number().optional(),
					})
					.optional(),
			})
			.optional(),
		useOpenAI: z.boolean().optional().default(false),
	}),
	outputSchema: z.array(
		z.object({
			user_id: z.string(),
			score: z.number(),
		})
	),
	execute: async ({ context }) => {
		const { target_user, preferences, useOpenAI } = context;

		// Load candidate pool from mock (candidates are in the users array)
		const candidates = Array.isArray(candidatePool)
			? candidatePool
			: candidatePool.users || [];

		// If OpenAI is requested and API key is available, use AI scoring
		if (useOpenAI && process.env.OPENAI_API_KEY) {
			// Build prompt using the exact format from openaiClient.ts
			const userPart = `TARGET_USER:\n${JSON.stringify(target_user, null, 2)}\nPREFERENCES:\n${JSON.stringify(
				preferences || {},
				null,
				2
			)}`;

			const candidatesPart = `CANDIDATE_POOL (array length ${candidates.length}):\n${JSON.stringify(
				candidates,
				null,
				2
			)}`;

			const fullPrompt = `${userPart}\n\n${candidatesPart}`;

			const result = await scoringAgent.generate(fullPrompt, {
				modelSettings: {
					temperature: 1,
					maxOutputTokens: 2048,
					topP: 1,
					frequencyPenalty: 0,
					presencePenalty: 0,
				},
				providerOptions: {
					openai: {
						responseFormat: { type: "json_object" },
					},
				},
			});

			// Parse the response using the same logic as openaiClient.ts
			let rawContent: any = result.text || result.object;
			if (
				result.object &&
				typeof result.object === "object" &&
				"content" in (result.object as any)
			) {
				rawContent = (result.object as any).content;
			}

			// If content is an object/array, assume it's already parsed JSON
			let scores: { user_id: string; score: number }[] = [];
			if (typeof rawContent === "object") {
				if (Array.isArray(rawContent)) {
					scores = rawContent;
				} else if (Array.isArray(rawContent.result)) {
					scores = rawContent.result;
				} else {
					// Fallback to local scoring if parsing fails
					return computeLocalScores(target_user, candidates);
				}
			} else {
				// Otherwise it's likely a JSON string. Try to parse
				const text = String(rawContent);
				try {
					const parsed = JSON.parse(text);
					if (Array.isArray(parsed)) {
						scores = parsed;
					} else if (parsed && Array.isArray(parsed.result)) {
						scores = parsed.result;
					} else {
						// Fallback to local scoring if parsing fails
						return computeLocalScores(target_user, candidates);
					}
				} catch (e) {
					// try to extract JSON substring
					const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/m);
					if (jsonMatch) {
						try {
							const parsed = JSON.parse(jsonMatch[0]);
							if (Array.isArray(parsed)) {
								scores = parsed;
							} else {
								return computeLocalScores(target_user, candidates);
							}
						} catch (_) {
							// Fallback to local scoring if parsing fails
							return computeLocalScores(target_user, candidates);
						}
					} else {
						// Fallback to local scoring if parsing fails
						return computeLocalScores(target_user, candidates);
					}
				}
			}

			return scores;
		}

		// Use local deterministic scoring
		return computeLocalScores(target_user, candidates);
	},
});
