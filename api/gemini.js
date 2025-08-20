import fetch from "node-fetch";
export default async function handler(req, res) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiEndpoint = process.env.GEMINI_ENDPOINT; // e.g. https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent
  if (!geminiKey || !geminiEndpoint) {
    return res.status(500).json({ error: "Gemini not configured" });
  }
  try {
    const url = `${geminiEndpoint}?key=${encodeURIComponent(geminiKey)}`;
    const opts = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body || {})
    };
    const r = await fetch(url, opts);
    const text = await r.text();
    res.status(r.status);
    try { res.setHeader("content-type","application/json"); res.send(JSON.parse(text)); }
    catch(e){ res.send(text); }
  } catch(err){
    res.status(500).json({ error: "Gemini proxy error", details: String(err) });
  }
}
