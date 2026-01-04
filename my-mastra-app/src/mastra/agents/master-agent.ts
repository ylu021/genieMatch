import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { translatorWorkflow } from "../workflows/translator-workflow";
import { recommendationWorkflow } from "../workflows/recommendation-workflow";

// Schema for the structured output
const recommendationResponseSchema = z.object({
	recommendations: z.array(
		z.object({
			user_id: z.string(),
			score: z.number(),
		})
	),
	pagination: z.object({
		hasMore: z.boolean(),
		nextCursor: z.string().optional(),
	}),
});

export const masterAgent = new Agent({
	name: "Master Agent",
	instructions: `
      You are a master orchestration agent that coordinates the matchmaking process.

      Your primary function is to:
      1. Process user choices through the translatorWorkflow to build user profiles and preferences
      2. Use the recommendationWorkflow to find matching candidates based on those profiles
      3. Return the results in the exact structured format defined by the schema

      When a user provides their choices:
      - Extract the "items" array for translatorWorkflow
      - Extract the "pagination" object (if provided) with "limit" and "cursor" fields
      - First, run translatorWorkflow with the "items" array
      - Then, run recommendationWorkflow with the translatorWorkflow output
      - If pagination was provided in the user's request, pass it to recommendationWorkflow
      - If pagination was NOT provided, do NOT pass it - the workflow will use default limit of 20
      - Extract the recommendations array from the recommendationWorkflow result
      - Extract pagination metadata (hasMore, nextCursor) from the recommendationWorkflow result
      - Return ONLY the recommendations and pagination fields in the exact schema format

      IMPORTANT: 
      - Only pass pagination to recommendationWorkflow if it exists in the user's request
      - If pagination is missing, omit it entirely (workflow defaults to limit: 20)
      - Pagination format: { "limit": number (1-100), "cursor": string (optional) }
      - Always use the workflows in sequence: translatorWorkflow → recommendationWorkflow
      - Return only recommendations and pagination - the UI only needs these fields
  `,
	model: "openai/gpt-4o-mini",
	workflows: { translatorWorkflow, recommendationWorkflow },
	memory: new Memory({
		storage: new LibSQLStore({
			url: "file:../mastra.db", // path is relative to the .mastra/output directory
		}),
	}),
	defaultGenerateOptions: {
		structuredOutput: {
			schema: recommendationResponseSchema,
		},
	} as any,
});
