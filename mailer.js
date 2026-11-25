// Sends the quotation email from abhinavcaterers2002@gmail.com using the Gmail API (HTTPS).
// Normal SMTP ports are blocked on Render's free plan, so we do not use SMTP.
// Needs these in .env (and in the Render dashboard): GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
const fs = require('fs');
const path = require('path');
const FROM_EMAIL = process.env.GMAIL_USER || 'abhinavcaterers2002@gmail.com';
const FROM_NAME = 'Abhinav Caterers';
// small round logo shown at the top of the email (put the file in public/assets/)
const LOGO_FILE = path.join(__dirname, 'public', 'assets', 'abhinav-logo-email.png');
function readLogo() { try { return fs.readFileSync(LOGO_FILE); } catch (e) { console.log('Email logo missing:', LOGO_FILE); return null; } }

const esc = function (s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
};
const oneLine = function (s) { return String(s || '').replace(/[\r\n]+/g, ' ').trim(); };   // stops header tricks
const validEmail = function (s) { return /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(s || ''); };
const b64 = function (buf) { return Buffer.from(buf).toString('base64'); };
const wrap76 = function (s) { return s.replace(/.{1,76}/g, '$&\r\n').trim(); };
const subjectEnc = function (s) { return /^[\x20-\x7e]*$/.test(s) ? s : '=?UTF-8?B?' + b64(s) + '?='; };

let token = { value: '', exp: 0 };
async function accessToken() {
  if (token.value && Date.now() < token.exp) return token.value;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID, client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN, grant_type: 'refresh_token'
    }),
    signal: AbortSignal.timeout(20000)
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) throw new Error('Google login failed: ' + (j.error_description || j.error || r.status));
  token = { value: j.access_token, exp: Date.now() + (j.expires_in - 120) * 1000 };
  return token.value;
}

function buildMime(o) {
  const boundary = 'abhinav_' + Date.now().toString(36), rel = boundary + '_rel';
  const head = [
    'From: ' + FROM_NAME + ' <' + FROM_EMAIL + '>',
    'To: ' + o.to,
    o.bcc ? 'Bcc: ' + o.bcc : null,
    'Subject: ' + subjectEnc(oneLine(o.subject)),
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' + boundary + '"'
  ].filter(Boolean).join('\r\n');
  // the page + the logo picture inside it (cid:abhinav-logo), then the PDF as an attachment
  const page = '--' + rel + '\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n' + wrap76(b64(o.html)) + '\r\n' +
    (o.logo ? '--' + rel + '\r\nContent-Type: image/png; name="logo.png"\r\nContent-Transfer-Encoding: base64\r\nContent-ID: <abhinav-logo>\r\n' +
      'Content-Disposition: inline; filename="logo.png"\r\n\r\n' + wrap76(b64(o.logo)) + '\r\n' : '') +
    '--' + rel + '--';
  return head + '\r\n\r\n' +
    '--' + boundary + '\r\nContent-Type: multipart/related; boundary="' + rel + '"\r\n\r\n' + page + '\r\n' +
    '--' + boundary + '\r\nContent-Type: application/pdf; name="' + o.filename + '"\r\nContent-Transfer-Encoding: base64\r\n' +
    'Content-Disposition: attachment; filename="' + o.filename + '"\r\n\r\n' + wrap76(b64(o.pdf)) + '\r\n' +
    '--' + boundary + '--';
}

function emailHtml(q, hasLogo) {
  const detail = function (label, value) {
    return value ? '<tr><td style="padding:5px 14px 5px 0;color:#8a7a5a;font-size:12px;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;vertical-align:top">' + esc(label) +
      '</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a">' + esc(value) + '</td></tr>' : '';
  };
  const section = function (title, rows) {
    return '<div style="margin:22px 0 4px;font-size:12px;font-weight:bold;letter-spacing:1.5px;color:#8a6d2f;border-bottom:1px solid #eadfc8;padding-bottom:4px">' + esc(title) + '</div>' +
      '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0">' + rows + '</table>';
  };
  const extras = (q.extras || []).map(function (e) { return e === 'Live counter' && (q.live || []).length ? 'Live counter (' + q.live.join(', ') + ')' : e; }).join(', ');
  const meals = (q.meals || []).map(function (m) {
    const groups = {}, order = [];
    (m.dishes || []).forEach(function (d) { const c = d.cat || 'Dishes'; if (!groups[c]) { groups[c] = []; order.push(c); } groups[c].push(d.en); });
    return '<div style="margin:22px 0 4px;font-weight:bold;color:#112a21;border-bottom:1px solid #eadfc8;padding-bottom:4px">' +
      esc((m.label || m.meal) + (m.time ? ' · ' + m.time : '') + (m.guests ? ' · ' + m.guests + ' guests' : '')) + '</div>' +
      order.map(function (c) { return '<div style="font-size:13px;margin:3px 0"><b style="color:#8a6d2f">' + esc(c) + ':</b> ' + esc(groups[c].join(', ')) + '</div>'; }).join('');
  }).join('');
  const logo = hasLogo ? '<td width="84" style="padding:16px 0 16px 20px"><img src="cid:abhinav-logo" width="64" height="64" alt="Abhinav Caterers" style="display:block;border-radius:50%;border:0"></td>' : '<td width="20"></td>';
  return '<div style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f261f;border-bottom:3px solid #cda86a"><tr>' + logo +
    '<td style="padding:16px 20px 16px 14px"><div style="font-family:Georgia,\'Times New Roman\',serif;font-size:24px;letter-spacing:4px;color:#e8c27a">ABHINAV CATERERS</div>' +
    '<div style="font-family:Georgia,serif;font-style:italic;font-size:12px;letter-spacing:2px;color:#e8c27a;margin-top:4px">PURE VEG &amp; OUTDOOR CATERING</div></td></tr></table>' +
    '<div style="padding:22px;border:1px solid #eadfc8;border-top:0">' +
    '<p style="margin-top:0">Dear ' + esc(q.name) + ',</p>' +
    '<p>Thank you for choosing Abhinav Caterers! We have received your quotation request for your <b>' + esc(q.eventType || 'event') + '</b>' + (q.date ? ' on <b>' + esc(q.date) + '</b>' : '') + '.</p>' +
    section('CUSTOMER', detail('Customer name', q.name) + detail('Phone', q.phone) + detail('Email', q.email) + detail('Address', q.address)) +
    section('EVENT', detail('Event type', q.eventType) + detail('Event date', q.date)) +
    meals +
    section('SERVICE DETAILS', detail('Service boys', +q.staff > 0 ? String(+q.staff) : 'Please suggest') + detail('Spice level', q.spice) + detail('Pickup / delivery', q.fulfil) +
      detail('Serving style', q.style) + detail('Extras', extras) + detail('Special requests', q.notes)) +
    '<p style="margin-top:24px">Your quotation is attached as a PDF.</p>' +
    '<p>Jagadeeswari will call you shortly to talk through the details and confirm the price.</p>' +
    '<p style="margin-top:22px">Warm regards,<br><b>Abhinav Caterers</b><br>Pure Veg &amp; Outdoor Catering, Hyderabad<br>+91 77940 93779 · +91 93466 64914</p>' +
    '</div></div>';
}
// Sends to the customer (if they gave an email) and always copies abhinavcaterers2002@gmail.com.
async function sendQuoteEmail(q, pdfBuffer, filename) {
  if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
    console.log('Email NOT sent: GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET / GMAIL_REFRESH_TOKEN missing in .env');
    return false;
  }
  const customer = oneLine(q.email);
  const to = validEmail(customer) ? customer : FROM_EMAIL;
  const bcc = to === FROM_EMAIL ? '' : FROM_EMAIL;      // the owner gets a copy too
  const logo = readLogo();
  const raw = buildMime({
    to: to, bcc: bcc, filename: filename, pdf: pdfBuffer, logo: logo, html: emailHtml(q, !!logo),
    subject: 'Your quotation from Abhinav Caterers' + (to === FROM_EMAIL ? ' (' + oneLine(q.name) + ')' : '')
  });
  const r = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + (await accessToken()), 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: Buffer.from(raw).toString('base64url') }),
    signal: AbortSignal.timeout(30000)
  });
  if (!r.ok) throw new Error('Gmail said ' + r.status + ' ' + (await r.text()).slice(0, 300));
  console.log('Quotation email sent to ' + to + (bcc ? ' (copy to ' + bcc + ')' : ''));
  return true;
}

module.exports = { sendQuoteEmail, validEmail, buildMime, emailHtml };