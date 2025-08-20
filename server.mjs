import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import getAds from './api/get-ads.js';
import manipulateAds from './api/manipulate-ads.js';
import users from './api/users.js';
import chatLogs from './api/chat-logs.js';
import chat from './api/chat.js';
// gemini endpoint is optional; only enable if configured
// import gemini from './api/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Proxy API routes to existing handlers
app.all('/api/get-ads', (req, res) => getAds(req, res));
app.all('/api/manipulate-ads', (req, res) => manipulateAds(req, res));
app.all('/api/users', (req, res) => users(req, res));
app.all('/api/chat-logs', (req, res) => chatLogs(req, res));
app.all('/api/chat', (req, res) => chat(req, res));
// Only enable if gemini.js is fully configured
// app.all('/api/gemini', (req, res) => gemini(req, res));

// Static files
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// SPA fallback (compatible with newer path-to-regexp)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(publicDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AIBM preview running at http://localhost:${PORT}`);
});


