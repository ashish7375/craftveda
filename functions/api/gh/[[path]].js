// CraftVeda admin proxy (Cloudflare Pages Function).
// Only a signed-in Cloudflare Access user whose email is in ADMIN_EMAILS can read/write products.json and images.
// The GitHub token stays here as a secret and never reaches the browser.
const H = { "x-cv-proxy": "1", "content-type": "application/json", "cache-control": "no-store" };
const out = (status, obj) => new Response(typeof obj === "string" ? obj : JSON.stringify(obj), { status, headers: H });
const u8 = (s) => { s = s.replace(/-/g, "+").replace(/_/g, "/"); s += "=".repeat((4 - (s.length % 4)) % 4); return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); };

export async function verifyAccess(jwt, env) {
  try {
    const [h, p, s] = jwt.split(".");
    const head = JSON.parse(new TextDecoder().decode(u8(h)));
    const pl = JSON.parse(new TextDecoder().decode(u8(p)));
    const team = `https://${env.CF_ACCESS_TEAM}.cloudflareaccess.com`;
    if (head.alg !== "RS256" || pl.iss !== team || !(pl.exp * 1000 > Date.now())) return null;
    if (!env.CF_ACCESS_AUD || ![].concat(pl.aud).includes(env.CF_ACCESS_AUD)) return null;
    const keys = (await (await fetch(`${team}/cdn-cgi/access/certs`)).json()).keys || [];
    const jwk = keys.find((k) => k.kid === head.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, u8(s), new TextEncoder().encode(h + "." + p));
    return ok ? pl : null;
  } catch (e) { return null; }
}

export async function onRequest({ request, env, params }) {
  if (!env.GH_TOKEN || !env.GH_REPO || !env.ADMIN_EMAILS || !env.CF_ACCESS_TEAM || !env.CF_ACCESS_AUD)
    return out(500, { message: "Admin is not configured yet (missing environment variables)." });
  const jwt = request.headers.get("cf-access-jwt-assertion");
  const who = jwt && (await verifyAccess(jwt, env));
  if (!who) return out(401, { message: "Not signed in." });
  const allowed = env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase());
  if (!allowed.includes(String(who.email || "").toLowerCase())) return out(403, { message: "This email is not allowed." });

  const path = [].concat(params.path || []).join("/");
  if (!(path === "products.json" || /^images\/[a-z0-9][a-z0-9._-]*\.jpg$/.test(path))) return out(400, { message: "Path not allowed." });
  const method = request.method;
  if (!["GET", "PUT", "DELETE"].includes(method)) return out(405, { message: "Method not allowed." });

  const branch = env.GH_BRANCH || "main";
  let body;
  if (method !== "GET") {
    try { body = JSON.parse(await request.text()); } catch (e) { return out(400, { message: "Bad body." }); }
    body.branch = branch;
    body.committer = body.committer || undefined;
  }
  const url = `https://api.github.com/repos/${env.GH_REPO}/contents/${path}` + (method === "GET" ? `?ref=${encodeURIComponent(branch)}` : "");
  const r = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${env.GH_TOKEN}`, Accept: "application/vnd.github+json", "User-Agent": "craftveda-admin", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return new Response(await r.text(), { status: r.status, headers: H });
}
