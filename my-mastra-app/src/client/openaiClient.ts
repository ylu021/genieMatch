/**
 * Simple browser client helper to call the OpenAI proxy endpoint provided by the
 * separate server (`server/server.js`). This keeps the OpenAI API key on the
 * server. From the browser call `sendPrompt("...")` and await the JSON response.
 *
 * Configure `OPENAI_PROXY_BASE` at build time if the proxy is hosted elsewhere.
 */

const BASE = (process.env.OPENAI_PROXY_BASE as string) || '';

export async function sendPrompt(prompt: string, options?: { noCache?: boolean }) {
  const url = `${BASE}/api/message`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ prompt }),
  };

  if (options?.noCache) {
    headers['Cache-Control'] = 'no-cache';
  }

  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI proxy error: ${res.status} ${t}`);
  }

  return res.json();
}
