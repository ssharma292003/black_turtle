// Vercel serverless function: POST /api/signup
// Validates the signup, then forwards it to a Google Sheet (via an Apps Script web app).
// The Apps Script URL and secret live in Vercel environment variables, never in the browser.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort rate limit (per server instance). Stops casual spam, not a determined attacker.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 8;
const hits = new Map();
function isLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_HITS;
}

function cleanPhone(v) {
  let d = String(v == null ? "" : v).replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
}

function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, message: "Method not allowed." });
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (isLimited(ip)) return send(res, 429, { ok: false, message: "Too many attempts. Try again later." });

  // Parse body (Vercel parses JSON automatically, but be defensive)
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== "object") {
    return send(res, 400, { ok: false, errors: { email: "Enter your email address.", phone: "Enter your 10-digit mobile number." } });
  }

  // Server-side validation (never trust the browser)
  const email = String(body.email || "").trim().toLowerCase();
  const phone = cleanPhone(body.phone);
  const errors = {};
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = "That email doesn't look right.";
  if (!phone) errors.phone = "Enter your 10-digit mobile number.";
  else if (!/^\d{10}$/.test(phone)) errors.phone = "Mobile number must be exactly 10 digits.";
  if (Object.keys(errors).length) return send(res, 400, { ok: false, errors });

  const url = process.env.SHEET_WEBAPP_URL;
  const secret = process.env.SHEET_SECRET;
  if (!url || !secret) {
    console.error("Signup is not configured: set SHEET_WEBAPP_URL and SHEET_SECRET in Vercel.");
    return send(res, 500, { ok: false, message: "Signup is temporarily unavailable." });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, email, phone }),
      redirect: "follow",
      signal: ctrl.signal,
    });
    const text = await r.text();
    let out;
    try { out = JSON.parse(text); } catch { throw new Error("Sheet returned a non-JSON response (status " + r.status + ")"); }

    if (out.ok) return send(res, 200, { ok: true });
    if (out.error === "duplicate_email") return send(res, 409, { ok: false, field: "email" });
    if (out.error === "duplicate_phone") return send(res, 409, { ok: false, field: "phone" });
    if (out.error === "invalid_email") return send(res, 400, { ok: false, errors: { email: "That email doesn't look right." } });
    if (out.error === "invalid_phone") return send(res, 400, { ok: false, errors: { phone: "Mobile number must be exactly 10 digits." } });
    console.error("Sheet rejected the signup:", out.error);
    return send(res, 502, { ok: false, message: "Could not save your details." });
  } catch (err) {
    console.error("Signup failed:", err && err.message);
    return send(res, 502, { ok: false, message: "Could not save your details." });
  } finally {
    clearTimeout(timer);
  }
};
