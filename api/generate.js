// api/generate.js
// Deploy this file at that exact path in your Vercel project (repo-root/api/generate.js).
// Vercel automatically turns it into a serverless endpoint at /api/generate.
//
// Setup:
// 1. In your Vercel project settings → Environment Variables, add:
//      ANTHROPIC_API_KEY = sk-ant-xxxxxxxx   (your real key from console.anthropic.com)
// 2. Redeploy. Your key never reaches the browser — only this function sees it.
// 3. In reelcraft-ai.html, point the fetch at "/api/generate" instead of api.anthropic.com directly.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' in request body" });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Server error calling Anthropic API", detail: String(err) });
  }
}
