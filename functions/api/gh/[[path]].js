// Password-session protected GitHub Contents API proxy for CraftVeda.
const H = { "content-type": "application/json", "cache-control": "no-store" };
const out = (status, obj) => new Response(JSON.stringify(obj), { status, headers: H });
const dec = value => {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(b64 + "=".repeat((4 - b64.length % 4) % 4)), c => c.charCodeAt(0));
};
async function verifyKey(secret) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
}
async function authenticated(request, env) {
  try {
    const item = (request.headers.get("Cookie") || "").split(";").map(x => x.trim())
      .find(x => x.startsWith("cv_admin_session="));
    if (!item || !env.SESSION_SECRET) return false;
    const token = item.slice("cv_admin_session=".length), dot = token.indexOf(".");
    if (dot < 1) return false;
    const payload = token.slice(0, dot), signature = token.slice(dot + 1);
    const valid = await crypto.subtle.verify("HMAC", await verifyKey(env.SESSION_SECRET),
      dec(signature), new TextEncoder().encode(payload));
    if (!valid) return false;
    const s = JSON.parse(new TextDecoder().decode(dec(payload)));
    return s.v === 1 && s.exp > Date.now();
  } catch { return false; }
}
export async function onRequest({ request, env, params }) {
  if (!env.GH_TOKEN || !env.GH_REPO || !env.SESSION_SECRET || env.SESSION_SECRET.length < 32)
    return out(500, { message: "Set GH_TOKEN, GH_REPO and SESSION_SECRET in Cloudflare Production settings." });
  if (!await authenticated(request, env))
    return out(401, { message: "Please log in first." });

  const url = new URL(request.url);
  if (request.method !== "GET") {
    const origin = request.headers.get("Origin");
    if (!origin || new URL(origin).host !== url.host)
      return out(403, { message: "Request origin not allowed." });
  }
  const path = [].concat(params.path || []).join("/");
  if (path !== "products.json" && !/^images\/[a-z0-9][a-z0-9._-]*\.jpg$/.test(path))
    return out(400, { message: "Path not allowed." });
  const method = request.method;
  if (!["GET", "PUT", "DELETE"].includes(method))
    return out(405, { message: "Method not allowed." });

  const branch = env.GH_BRANCH || "main";
  let body;
  if (method !== "GET") {
    try { body = JSON.parse(await request.text()); }
    catch { return out(400, { message: "Invalid request body." }); }
    body.branch = branch;
  }
  const apiUrl = `https://api.github.com/repos/${env.GH_REPO}/contents/${path}` +
    (method === "GET" ? `?ref=${encodeURIComponent(branch)}` : "");
  try {
    const response = await fetch(apiUrl, {
      method,
      headers: {
        Authorization: `Bearer ${env.GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "craftveda-admin",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { ...H, "content-type": response.headers.get("content-type") || "application/json" }
    });
  } catch {
    return out(502, { message: "GitHub API request failed." });
  }
}
