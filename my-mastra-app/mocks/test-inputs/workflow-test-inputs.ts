// Sample test inputs for Mastra workflows - Engineer Reference
// Use these constants when testing workflows in Mastra

// Input for translator-workflow: array of choice items with id, choice, and phase
const translatorWorkflowInput = {
	items: [
		{ id: "mind_energy", choice: "introvert", phase: "self" },
		{ id: "perception_style", choice: "sensing", phase: "self" },
		{ id: "decision_style", choice: "thinking", phase: "self" },
		{ id: "pet_energy", choice: "cat_person", phase: "self" },
		{ id: "identity_assertiveness", choice: "assertive", phase: "self" },
		{ id: "mind_energy", choice: "introvert", phase: "partner" },
		{ id: "perception_style", choice: "intuition", phase: "partner" },
		{ id: "decision_style", choice: "thinking", phase: "partner" },
		{ id: "pet_energy", choice: "cat_person", phase: "partner" },
		{ id: "identity_assertiveness", choice: "assertive", phase: "partner" },
	],
};

// Input for recommendation-workflow: expects output from translator-workflow
// This is the structure that translator-workflow produces (user_profile, preferences, reporting)
const recommendationWorkflowInput = {
	user_profile: {
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

export { translatorWorkflowInput, recommendationWorkflowInput };
