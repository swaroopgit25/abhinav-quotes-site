require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { buildQuotePdf } = require('./quote-pdf');
const { sendQuoteEmail, mailStatus } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: false, limit: '12mb' }));
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
const MGMT_URL = (process.env.MGMT_URL || '').trim().replace(/\/+$/, '');
const MGMT_KEY = (process.env.MGMT_KEY || '').trim();

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
// Build each quotation PDF only once: the email and the download share the result (kept 2 minutes).
const pdfCache = new Map();
function pdfFor(q) {
  const key = JSON.stringify(FIELDS.map(function (f) { return q[f] === undefined ? null : q[f]; }));
  let hit = pdfCache.get(key);
  if (!hit) {
    hit = buildQuotePdf(q);
    pdfCache.set(key, hit);
    hit.catch(function () { pdfCache.delete(key); });
    setTimeout(function () { pdfCache.delete(key); }, 120000).unref();
  }
  return hit;
}

// Send the quotation email, trying up to 3 times (Render can be slow to wake, Gmail can hiccup).
async function emailWithRetry(doc) {
  for (let i = 1; i <= 3; i++) {
    try {
      const pdf = await pdfFor(doc);
      return await sendQuoteEmail(doc, pdf, 'Abhinav-Caterers-Quotation.pdf');   // false = settings missing, no point retrying
    } catch (e) {
      console.log('Quotation email attempt ' + i + ' of 3 failed:', e.message);
      if (i < 3) await new Promise(function (ok) { setTimeout(ok, 3000 * i); });
    }
  }
  return false;
}

// Open /api/mail-status on the live site to see why email is not arriving (sends nothing).
app.get('/api/mail-status', async (req, res) => { res.json(await mailStatus()); });

app.post('/api/quote', async (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.phone) return res.status(400).json({ ok: false });
  const doc = { createdAt: new Date(), pushed: false };
  FIELDS.forEach(function (f) { if (b[f] !== undefined) doc[f] = b[f]; });
    const pdfDoc = Object.assign({}, doc);
  if (Array.isArray(doc.meals)) doc.meals = doc.meals.map(function (m) { const c = Object.assign({}, m); delete c.plate; return c; });
  try {
    if (quotes) await quotes.insertOne(doc);            // adds doc._id
    res.json({ ok: true, saved: !!quotes });            // the customer is not kept waiting
  } catch (e) { return res.status(500).json({ ok: false }); }

    // email the PDF quotation (never breaks the customer's response)
 const emailed = await emailWithRetry(pdfDoc);
if (quotes && doc._id) quotes.updateOne({ _id: doc._id }, { $set: { emailed: emailed } }).catch(function () {});

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

app.get('/api/mail-check', async (req, res) => {
  try {
    const pdf = await buildQuotePdf({ name: 'Test', phone: '0000000000', meals: [] });
    await sendQuoteEmail({ name: 'Test', email: '' }, pdf, 'test.pdf');
    res.send('OK: email sent to abhinavcaterers2002@gmail.com, check the inbox and spam');
  } catch (e) { res.status(500).send('FAILED: ' + e.message); }
});

app.get('/api/pdf-test', async (req, res) => {
  const t = Date.now();
  try {
    const pdf = await buildQuotePdf({ name: 'Test', phone: '0000000000', meals: [] });
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="test.pdf"', 'X-Build-Ms': String(Date.now() - t) });
    res.send(pdf);
  } catch (e) { res.status(500).send('PDF FAILED: ' + e.message); }
});

app.post('/api/quote-pdf', async (req, res) => {
  try {
    let q = {};
    try { q = JSON.parse((req.body || {}).data || '{}'); } catch (e) {}
    const pdf = await pdfFor(q);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="Abhinav-Caterers-Quotation.pdf"', 'Cache-Control': 'no-store' });
    res.send(pdf);
  } catch (e) { console.log('PDF failed:', e.message); res.status(500).send('Sorry, the PDF could not be made. Please check your email or call us on 77940 93779.'); }
});

// Send the home page explicitly, as a safety net.
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  buildQuotePdf({ name: 'warm-up', phone: '0', meals: [] }).catch(function () {});
  console.log('Running on http://localhost:' + PORT);
  console.log('Serving files from: ' + PUBLIC_DIR);
  console.log('index.html found: ' + fs.existsSync(path.join(PUBLIC_DIR, 'index.html')));
});