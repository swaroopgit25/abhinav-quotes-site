require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

app.get('/api/ping', (req, res) => res.json({ ok: true }));
const { MongoClient } = require('mongodb');
let quotes = null;
if (process.env.MONGODB_URI) {
  new MongoClient(process.env.MONGODB_URI).connect()
    .then(function (c) { quotes = c.db().collection('quotes'); console.log('MongoDB connected'); })
    .catch(function (e) { console.log('MongoDB not connected:', e.message); });
}
app.post('/api/quote', async (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.phone) return res.status(400).json({ ok: false });
  try {
    if (quotes) await quotes.insertOne(Object.assign({}, b, { createdAt: new Date() }));
    res.json({ ok: true, saved: !!quotes });
  } catch (e) { res.status(500).json({ ok: false }); }
});

// Send the home page explicitly, as a safety net.
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log('Running on http://localhost:' + PORT);
  console.log('Serving files from: ' + PUBLIC_DIR);
  console.log('index.html found: ' + fs.existsSync(path.join(PUBLIC_DIR, 'index.html')));
});