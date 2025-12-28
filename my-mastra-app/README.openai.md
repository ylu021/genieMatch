# OpenAI + Mastra integration (frontend)

This folder contains a small Mastra app and utilities to safely call OpenAI via a server-side proxy. Key points:

- `server/` contains an Express proxy (`/api/message`) that talks to OpenAI using `process.env.OPENAI_API_KEY`.
- `my-mastra-app/src/mastra/tools/openai-tool.ts` is a Mastra tool that forwards prompts to the proxy. Add it to agents that need LLM calls.
- `my-mastra-app/src/client/openaiClient.ts` is a tiny browser helper to call the proxy endpoint from frontend code.

Quick setup

1. Set the OpenAI key for the proxy server (in `server/.env` or your environment):

```
OPENAI_API_KEY=sk-...your-key...
REDIS_URL=redis://localhost:6379
PORT=5000
```

2. Start the proxy server (from project root):

```
cd server
npm install
node server.js
```

3. Run the Mastra app (in `my-mastra-app`):

```
cd my-mastra-app
npm install
npm run dev
```

4. From a browser front-end, use the helper:

```ts
import { sendPrompt } from './client/openaiClient';

const resp = await sendPrompt('Write a friendly weather summary for Paris.');
console.log(resp);
```

Notes
- The proxy ensures your OpenAI API key stays server-side. Do not put your key in frontend code.
- If you host the proxy on another origin, set `OPENAI_PROXY_BASE` at build time for `openaiClient`.
