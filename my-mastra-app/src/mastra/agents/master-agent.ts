import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { translatorWorkflow } from "../workflows/translator-workflow";
import { recommendationWorkflow } from "../workflows/recommendation-workflow";
import { scorers } from "../scorers/weather-scorer";

export const masterAgent = new Agent({
	name: "Master Agent",
	instructions: `
      You are a master orchestration agent that coordinates the matchmaking process.

      Your primary function is to:
      1. Process user choices through the translatorWorkflow to build user profiles and preferences
      2. Use the recommendationWorkflow to find matching candidates based on those profiles

      When a user provides their choices:
      - First, run translatorWorkflow to translate choices into a structured profile
      - Then, run recommendationWorkflow to find matching candidates
      - Present the results clearly to the user

      Always use the workflows in sequence: translatorWorkflow → recommendationWorkflow
  `,
	model: "openai/gpt-4o-mini",
	workflows: { translatorWorkflow, recommendationWorkflow },
	scorers: {
		toolCallAppropriateness: {
			scorer: scorers.toolCallAppropriatenessScorer,
			sampling: {
				type: "ratio",
				rate: 1,
			},
		},
		completeness: {
			scorer: scorers.completenessScorer,
			sampling: {
				type: "ratio",
				rate: 1,
			},
		},
		translation: {
			scorer: scorers.translationScorer,
			sampling: {
				type: "ratio",
				rate: 1,
			},
		},
	},
	memory: new Memory({
		storage: new LibSQLStore({
			url: "file:../mastra.db", // path is relative to the .mastra/output directory
		}),
	}),
});
