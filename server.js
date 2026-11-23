require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json({ limit: '200kb' }));
app.use(express.static(PUBLIC_DIR));

app.get('/api/ping', (req, res) => res.json({ ok: true }));
const { MongoClient } = require('mongodb');
let quotes = null;
if (process.env.MONGODB_URI) {
  new MongoClient(process.env.MONGODB_URI).connect()
    .then(function (c) { quotes = c.db().collection('quotes'); console.log('MongoDB connected'); resendUnpushed().catch(function () {}); })
    .catch(function (e) { console.log('MongoDB not connected:', e.message); });
}
// ---- send each website quote to the management system ----
// Set these two in .env (and in the Render dashboard). The key must be the same on both sites.
const MGMT_URL = (process.env.MGMT_URL || '').replace(/\/+$/, '');   // e.g. https://abhinav-caterers.onrender.com
const MGMT_KEY = process.env.MGMT_KEY || '';

console.log('Management site: ' + (MGMT_URL || 'NOT SET') + '  |  key: ' + (MGMT_KEY ? 'set' : 'NOT SET'));

async function pushToManagement(quote) {
  if (!MGMT_URL || !MGMT_KEY) { console.log('NOT sent to management site: MGMT_URL or MGMT_KEY is missing in .env'); return false; }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(MGMT_URL + '/api/website-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': MGMT_KEY },
        body: JSON.stringify(quote),
        signal: AbortSignal.timeout(30000)   // a sleeping Render site can take ~30s to wake up
      });
      if (r.ok) { console.log('Quotation sent to management site OK'); return true; }
      console.log('Management site said ' + r.status + ' (try ' + attempt + ')');
    } catch (e) { console.log('Could not reach management site (try ' + attempt + '): ' + e.message); }
    await new Promise(function (ok) { setTimeout(ok, 3000 * attempt); });
  }
  return false;
}

// anything not pushed yet (management site was down) is sent again later
async function resendUnpushed() {
  if (!quotes || !MGMT_URL || !MGMT_KEY) return;
  const waiting = await quotes.find({ pushed: false }).limit(20).toArray();
  for (const q of waiting) {
    const ok = await pushToManagement(toPayload(q));
    if (ok) await quotes.updateOne({ _id: q._id }, { $set: { pushed: true } });
  }
}
setInterval(function () { resendUnpushed().catch(function () {}); }, 15 * 60 * 1000);

const FIELDS = ['name', 'phone', 'email', 'address', 'eventType', 'date', 'meal', 'time', 'guests',
  'spice', 'staff', 'fulfil', 'notes', 'style', 'extras', 'live', 'meals'];
function toPayload(q) {
  const out = { source: 'website', websiteQuoteId: String(q._id || ''), createdAt: q.createdAt };
  FIELDS.forEach(function (f) { if (q[f] !== undefined) out[f] = q[f]; });
  return out;
}

app.post('/api/quote', async (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.phone) return res.status(400).json({ ok: false });
  const doc = { createdAt: new Date(), pushed: false };
  FIELDS.forEach(function (f) { if (b[f] !== undefined) doc[f] = b[f]; });
  try {
    if (quotes) await quotes.insertOne(doc);            // adds doc._id
    res.json({ ok: true, saved: !!quotes });            // the customer is not kept waiting
  } catch (e) { return res.status(500).json({ ok: false }); }

  const ok = await pushToManagement(toPayload(doc));
  if (ok && quotes && doc._id) quotes.updateOne({ _id: doc._id }, { $set: { pushed: true } }).catch(function () {});
});

// Open http://localhost:4000/api/mgmt-check in the browser to see if the management site is connected.
// It sends an empty test (no real quotation is created).
app.get('/api/mgmt-check', async (req, res) => {
  const out = { managementUrl: MGMT_URL || 'NOT SET', keyInEnv: MGMT_KEY ? 'set' : 'NOT SET' };
  if (!MGMT_URL || !MGMT_KEY) { out.result = 'PROBLEM: MGMT_URL or MGMT_KEY is missing in the .env of this site. Add both, then restart.'; return res.json(out); }
  try {
    const r = await fetch(MGMT_URL + '/api/website-quotes', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': MGMT_KEY },
      body: '{}', signal: AbortSignal.timeout(30000)
    });
    out.managementReplied = r.status;
    if (r.status === 400) out.result = 'CONNECTED: the management site is reachable and the key is correct.';
    else if (r.status === 401) out.result = 'PROBLEM: the keys do not match. Make MGMT_KEY identical in both .env files, then restart BOTH sites.';
    else if (r.status === 404) out.result = 'PROBLEM: that address is a site without quotation support (old version or wrong site/port).';
    else out.result = 'UNEXPECTED reply from the management site: ' + r.status;
  } catch (e) { out.result = 'PROBLEM: cannot reach the management site at that address. Is it running? (' + e.message + ')'; }
  res.json(out);
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