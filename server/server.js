import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import Redis from "ioredis";
import systemPrompt from "./systemPrompt.json" with { type: "json" };

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis(process.env.REDIS_URL);

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

async function getCachedResponse(prompt, skipCache=false) {
  if(skipCache) {
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
  const { prompt } = req.body; // how do i ensure the prompt is json
  const cacheControl = req.headers['cache-control']

  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }

  const skipCache = cacheControl && cacheControl.includes('no-cache');

  try {
    const cachedResponse = await getCachedResponse(prompt, skipCache);
    
    if (!cachedResponse) {
      const response = await openAI(prompt);
      const cacheKey = `openai:${prompt}`;
      if(!skipCache) {
        await redis.set(cacheKey, JSON.stringify(response));
      }
      return res.json(response);
    }else {
      return res.json(cachedResponse)
    }
  } catch (e) {
    next(e); // Pass error to middleware
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
