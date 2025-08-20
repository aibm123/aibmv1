import fetch from "node-fetch";
export default async function handler(req, res) {
  const target = process.env.ADS_WRITE_WEBHOOK_URL;
  if (!target) return res.status(500).json({ error: "Missing env ADS_WRITE_WEBHOOK_URL" });
  try {
    const opts = {
      method: req.method,
      headers: Object.assign({}, req.headers || {}),
    };
    delete opts.headers.host;
    if (req.method !== "GET" && req.method !== "HEAD") {
      opts.body = JSON.stringify(req.body || {});
      opts.headers["content-type"] = "application/json";
    }
    const r = await fetch(target, opts);
    const text = await r.text();
    res.status(r.status);
    try {
      res.setHeader("content-type","application/json");
      res.send(JSON.parse(text));
    } catch(e) {
      res.send(text);
    }
  } catch(err) {
    res.status(500).json({ error: "Proxy error", details: String(err) });
  }
}
