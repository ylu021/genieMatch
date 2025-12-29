# Mocks Directory

Mock data, test inputs, and examples for Mastra workflows.

## Workflow Flow

**translator-workflow** → **recommendation-workflow**

1. `translator-workflow`: Converts choice items → `{ user_profile, preferences, reporting }`
2. `recommendation-workflow`: Takes translator output → `{ recommendations[], ... }`

## Files

### Test Inputs (`test-inputs/`)

- `translator-workflow-input.json` - JSON input for translator-workflow
- `recommendation-workflow-input.json` - JSON input for recommendation-workflow
- `workflow-test-inputs.ts` - TypeScript constants (`translatorWorkflowInput`, `recommendationWorkflowInput`)

### Data

- `src/mastra/mocks/candidate_pool.json` - Candidate user pool (used by recommendation-scoring-tool)
- `src/mastra/mocks/user_demographics.json` - User demographics mock data (used by recommendation-workflow)

### Examples

- `examples/user-profile-example.json` - Example user profile structure

Changes: Moved candidate pool to mock file, and use demographic also from mock

## Quick Start

```typescript
// Import test inputs
import {
	translatorWorkflowInput,
	recommendationWorkflowInput,
} from "./mocks/test-inputs/workflow-test-inputs";

// Test translator-workflow
const translatorResult = await translatorWorkflow.execute({
	inputData: translatorWorkflowInput,
	runtimeContext: {},
});

// Test recommendation-workflow (use translator output or test input)
const recommendationResult = await recommendationWorkflow.execute({
	inputData: {
		user_profile: translatorResult.user_profile,
		preferences: translatorResult.preferences,
		reporting: translatorResult.reporting,
	},
	runtimeContext: {},
});
```
