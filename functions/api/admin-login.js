const H = {
  "content-type": "application/json",
  "cache-control": "no-store"
};
const out = (status, obj, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { ...H, ...extra } });
const enc = bytes =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
async function signingKey(secret) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}
function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET || env.SESSION_SECRET.length < 32)
    return out(500, { message: "Set ADMIN_PASSWORD and SESSION_SECRET (32+ characters) in Cloudflare Production secrets." });
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== new URL(request.url).host)
    return out(403, { message: "Request origin not allowed." });
  let body;
  try { body = await request.json(); }
  catch { return out(400, { message: "Invalid request." }); }
  if (!constantTimeEqual(body.password, env.ADMIN_PASSWORD))
    return out(401, { message: "Incorrect password." });
  const payload = enc(new TextEncoder().encode(JSON.stringify({
    v: 1, exp: Date.now() + 8 * 60 * 60 * 1000, nonce: crypto.randomUUID()
  })));
  const signature = enc(await crypto.subtle.sign("HMAC", await signingKey(env.SESSION_SECRET),
    new TextEncoder().encode(payload)));
  return out(200, { ok: true }, {
    "Set-Cookie": `cv_admin_session=${payload}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`
  });
}
