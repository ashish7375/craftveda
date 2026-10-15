const H = { "content-type": "application/json", "cache-control": "no-store" };
export async function onRequestPost() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...H, "Set-Cookie": "cv_admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0" }
  });
}
