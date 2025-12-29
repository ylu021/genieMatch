# Test Input Files

This folder contains test input files for Mastra workflows. These files are ready to copy-paste for testing workflows.

## Files

- **`translator-workflow-input.json`** - JSON input for the `translator-workflow`
  - Format: `{ "items": [...] }`
  - Each item has: `id`, `choice`, `phase` (either "self" or "partner")

- **`recommendation-workflow-input.json`** - JSON input for the `recommendation-workflow`
  - Format: `{ "user_profile": {...}, "preferences": {...} }`
  - This matches the output structure from `translator-workflow`

- **`workflow-test-inputs.ts`** - TypeScript constants for programmatic use
  - Exports: `translatorWorkflowInput`, `recommendationWorkflowInput`
  - Use this for importing in test files or TypeScript code

## Usage

### JSON Files
These JSON files can be directly copied and pasted into:
- API testing tools (Postman, Insomnia, etc.)
- Mastra workflow execution
- Test scripts
- Documentation examples

### TypeScript File
For programmatic use in TypeScript/JavaScript:
```typescript
import { translatorWorkflowInput, recommendationWorkflowInput } from './mocks/test-inputs/workflow-test-inputs';
```

