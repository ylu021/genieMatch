/**
 * Simple browser client helper to call the OpenAI proxy endpoint provided by the
 * separate server (`server/server.js`). This keeps the OpenAI API key on the
 * server. From the browser call `sendPrompt("...")` and await the JSON response.
 *
 * Configure `OPENAI_PROXY_BASE` at build time if the proxy is hosted elsewhere.
 */

const BASE = (process.env.OPENAI_PROXY_BASE as string) || '';

export type InputExample = {
  user_profile: any;
  preferences?: any;
};

/**
 * sendPrompt supports two modes:
 * - old mode: pass a string prompt (keeps backward compatibility)
 * - new mode: pass structured input `{ user_profile, preferences }` (as in input_example.json)
 *
 * For structured input, the function will:
 * 1) fetch `mocks/mock_user.json` (candidate pool) from the same origin
 * 2) build a strict prompt (prompt engineering) asking the LLM to compute a
 *    numeric match score (0-100) for each candidate and return ONLY a JSON
 *    array of objects { user_id, score } sorted descending by score.
 */
export async function sendPrompt(
  promptOrInput: string | InputExample,
  options?: { noCache?: boolean },
) {
  const url = `${BASE}/api/message`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // If caller passed a simple string, keep old behaviour
  if (typeof promptOrInput === 'string') {
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt: promptOrInput }),
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

  // Structured input mode
  const input = promptOrInput as InputExample;

  // Load candidate pool from mocks. This expects the file to be served at /mocks/mock_user.json
  // Adjust path if your build serves static assets elsewhere.
  let candidates: any[] = [];
  try {
    const poolResp = await fetch('/mocks/mock_user.json');
    if (!poolResp.ok) {
      throw new Error(`Failed to load mock_user.json: ${poolResp.status}`);
    }
    const poolJson = await poolResp.json();
    // support two shapes: { users: [...] } or an array
    candidates = Array.isArray(poolJson) ? poolJson : poolJson.users || [];
  } catch (e) {
    throw new Error(`Unable to load candidate pool: ${(e as Error).message}`);
  }

  // Build the prompt with clear instructions for the assistant
  const systemInstructions = `You are an assistant that scores candidate users for a matchmaking app.
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

Now evaluate the following data and return the JSON array as specified.`;

  const userPart = `TARGET_USER:\n${JSON.stringify(input.user_profile, null, 2)}\nPREFERENCES:\n${JSON.stringify(
    input.preferences || {},
    null,
    2,
  )}`;

  const candidatesPart = `CANDIDATE_POOL (array length ${candidates.length}):\n${JSON.stringify(
    candidates,
    null,
    2,
  )}`;

  const fullPrompt = `${systemInstructions}\n\n${userPart}\n\n${candidatesPart}`;

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ prompt: fullPrompt }),
  };

  if (options?.noCache) {
    headers['Cache-Control'] = 'no-cache';
  }

  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI proxy error: ${res.status} ${t}`);
  }

  const data = await res.json();

  // The proxy may return the assistant message as { role, content } or the content directly.
  let rawContent: any = data;
  if (data && typeof data === 'object' && 'content' in data) {
    rawContent = (data as any).content;
  }

  // If content is an object/array, assume it's already parsed JSON
  if (typeof rawContent === 'object') {
    if (Array.isArray(rawContent)) {
      return rawContent as { user_id: string; score: number }[];
    }
    // maybe { result: [...] }
    if (Array.isArray(rawContent.result)) return rawContent.result;
  }

  // Otherwise it's likely a JSON string. Try to parse
  const text = String(rawContent);
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed as { user_id: string; score: number }[];
    // if parsed is object with result field
    if (parsed && Array.isArray(parsed.result)) return parsed.result;
  } catch (e) {
    // try to extract JSON substring
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/m);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) return parsed as { user_id: string; score: number }[];
      } catch (_) {
        // fall through
      }
    }
  }

  throw new Error('Unable to parse assistant response into JSON array of {user_id, score}');
}
