import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/*
  openai-tool: a Mastra tool that proxies prompts to a server-side OpenAI proxy.
  The proxy URL is read from the environment variable OPENAI_PROXY_URL when
  the Mastra app runs. It falls back to http://localhost:5000/api/message.
  This keeps the OpenAI API key on the server and out of the client bundle.
*/

const proxyUrl = process.env.OPENAI_PROXY_URL || 'http://localhost:5000/api/message';

export const openaiTool = createTool({
  id: 'openai-proxy',
  description: 'Send a prompt to the OpenAI proxy and return the assistant response',
  inputSchema: z.object({
    prompt: z.string().describe('Prompt to send to the LLM'),
  }),
  outputSchema: z.object({
    role: z.string().optional(),
    content: z.any(),
  }),
  execute: async ({ context }) => {
    if (!context || typeof context.prompt !== 'string') {
      throw new Error('prompt is required in context');
    }

    const body = { prompt: context.prompt };

    const resp = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Proxy request failed: ${resp.status} ${text}`);
    }

    const data = await resp.json();

    // The server returns an OpenAI message-like object; return as-is.
    return data;
  },
});
