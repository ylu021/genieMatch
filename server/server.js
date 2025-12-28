import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import Redis from "ioredis";
import systemPrompt from "./systemPrompt.json" with { type: "json" };

dotenv.config();

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

let redis;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  // minimal no-op redis substitute for local dev when Redis isn't configured
  redis = {
    get: async () => null,
    set: async () => null,
  };
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
// Handle OPTIONS request (preflight)
app.options("*", cors()); // Automatically respond to preflight requests

app.use(express.json()); // Enable JSON parsing


// Test Route
app.get("/", (req, res) => {
  res.send("Node.js Server is Running 🚀");
});

async function getCachedResponse(prompt, skipCache = false) {
  if (skipCache) {
    return null;
  }
  const cacheKey = `openai:${prompt}`;
  const cachedResponse = await redis.get(cacheKey);
  if (cachedResponse) {
    return JSON.parse(cachedResponse);
  }

  return null;
}

async function openAI(prompt) {
  if (!openai) throw new Error('OpenAI client is not configured (OPENAI_API_KEY missing)');
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    store: true,
    messages: [
      systemPrompt,
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_object",
    },
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return completion.choices[0].message;
}

// OpenAI API Route
app.post("/api/message", async (req, res, next) => {
  if (!req.is("application/json")) {
    return res
      .status(400)
      .json({ error: "Content-Type must be application/json" });
  }
  const cacheControl = req.headers["cache-control"];
  const skipCache = cacheControl && cacheControl.includes("no-cache");

  // Support two input shapes for easier testing:
  // 1) { prompt: string } (original)
  // 2) { target_user: {...}, preferences: {...}, candidate_pool: [...] } (structured)
  const { prompt, target_user, preferences, candidate_pool } = req.body;

  try {
    // Structured mode (preferred for local testing)
    if (target_user && Array.isArray(candidate_pool)) {
      // If OPENAI_API_KEY is present, forward to OpenAI using the existing openAI function
      if (process.env.OPENAI_API_KEY) {
        // build a textual prompt similar to what the client does and forward
        const structuredPrompt = `You are an assistant that scores candidate users for a matchmaking app.\nTARGET_USER:\n${JSON.stringify(
          target_user,
        )}\nPREFERENCES:\n${JSON.stringify(preferences || {})}\nCANDIDATES:\n${JSON.stringify(
          candidate_pool,
        )}`;

        const cachedResponse = await getCachedResponse(structuredPrompt, skipCache);
        if (!cachedResponse) {
          const response = await openAI(structuredPrompt);
          const cacheKey = `openai:${structuredPrompt}`;
          if (!skipCache) await redis.set(cacheKey, JSON.stringify(response));
          return res.json(response);
        }
        return res.json(cachedResponse);
      }

      // No OpenAI key: use a local deterministic scorer for development/testing
      const scores = computeLocalScores(target_user, candidate_pool);
      return res.json(scores);
    }

    // Original prompt-based mode
    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }

    const cachedResponse = await getCachedResponse(prompt, skipCache);

    if (!cachedResponse) {
      const response = await openAI(prompt);
      const cacheKey = `openai:${prompt}`;
      if (!skipCache) {
        await redis.set(cacheKey, JSON.stringify(response));
      }
      return res.json(response);
    } else {
      return res.json(cachedResponse);
    }
  } catch (e) {
    next(e); // Pass error to middleware
  }
});

// Local deterministic scorer used when OPENAI_API_KEY is not provided
function computeLocalScores(target, candidates) {
  function clamp(v, a = 0, b = 100) {
    return Math.max(a, Math.min(b, v));
  }

  function traitSimilarity(a = {}, b = {}) {
    // compute 1 - normalized euclidean distance over known trait keys
    const keys = [
      'introversion',
      'abstraction',
      'logic',
      'judging',
      'assertiveness',
      'calm_affinity',
    ];
    let sumSq = 0;
    let count = 0;
    for (const k of keys) {
      if (typeof a[k] === 'number' && typeof b[k] === 'number') {
        const d = a[k] - b[k];
        sumSq += d * d;
        count++;
      }
    }
    if (count === 0) return 0.5;
    const dist = Math.sqrt(sumSq / count); // max possible dist is ~1.0
    return 1 - dist; // higher is more similar
  }

  const results = candidates.map((c) => {
    let score = 0;

    // traits: up to 60
    const tSim = traitSimilarity(target.traits || {}, c.traits || {});
    score += tSim * 60;

    // MBTI: up to 20
    if (target.mbti && c.mbti) {
      if (target.mbti === c.mbti) score += 20;
      else {
        // partial match: count matching letters
        const a = String(target.mbti).toUpperCase();
        const b = String(c.mbti).toUpperCase();
        let match = 0;
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
          if (a[i] === b[i]) match++;
        }
        score += (match / 4) * 20; // scale
      }
    }

    // demographics: age and country up to 20
    const ageT = target.demographics && target.demographics.age;
    const ageC = c.demographics && c.demographics.age;
    if (typeof ageT === 'number' && typeof ageC === 'number') {
      const diff = Math.abs(ageT - ageC);
      if (diff <= 5) score += 10;
      else if (diff <= 10) score += 5;
    }

    const countryT = target.demographics && target.demographics.location && target.demographics.location.country;
    const countryC = c.demographics && c.demographics.location && c.demographics.location.country;
    if (countryT && countryC && countryT === countryC) score += 10;

    // keep within 0-100
    return { user_id: c.user_id, score: Math.round(clamp(score) * 100) / 100 };
  });

  // sort desc
  results.sort((a, b) => b.score - a.score);
  return results;
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
