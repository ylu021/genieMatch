import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { translatorWorkflow } from "./workflows/translator-workflow";
import { recommendationWorkflow } from "./workflows/recommendation-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { getRecommendationsAgent } from "./agents/get-recommendations-agent";
import { masterAgent } from "./agents/master-agent";
import {
	toolCallAppropriatenessScorer,
	completenessScorer,
	translationScorer,
} from "./scorers/weather-scorer";

export const mastra = new Mastra({
	workflows: {
		translatorWorkflow,
		recommendationWorkflow,
	},
	agents: { weatherAgent, getRecommendationsAgent, masterAgent },
	scorers: {
		toolCallAppropriatenessScorer,
		completenessScorer,
		translationScorer,
	},
	storage: new LibSQLStore({
		// stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ":memory:",
	}),
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	telemetry: {
		// Telemetry is deprecated and will be removed in the Nov 4th release
		enabled: false,
	},
	observability: {
		// Enables DefaultExporter and CloudExporter for AI tracing
		default: { enabled: true },
	},
});
