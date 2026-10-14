// CraftVeda GitHub proxy protected by a signed, HttpOnly password session.
const H = { "content-type": "application/json", "cache-control": "no-store" };
const out = (status, obj) => new Response(JSON.stringify(obj), { status, headers: H });
const enc = (b) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
const dec = (s) => Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-s.length%4)%4)), c=>c.charCodeAt(0));
async function key(secret){return crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"])}
async function session(request, env){
 try { const token=(request.headers.get("Cookie")||"").split(";").map(x=>x.trim()).find(x=>x.startsWith("cv_admin_session="))?.slice("cv_admin_session=".length); if(!token)return false;
  const [payload,sig]=token.split("."); if(!payload||!sig)return false;
  const k=await key(env.SESSION_SECRET); if(!await crypto.subtle.verify("HMAC",k,dec(sig),new TextEncoder().encode(payload)))return false;
  const p=JSON.parse(new TextDecoder().decode(dec(payload))); return p.exp>Date.now() && p.v===1;
 } catch { return false; }
}
export async function onRequest({request,env,params}){
 if(!env.GH_TOKEN||!env.GH_REPO||!env.ADMIN_PASSWORD||!env.SESSION_SECRET||env.SESSION_SECRET.length<32) return out(500,{message:"Admin is not configured yet. Check GH_TOKEN, GH_REPO, ADMIN_PASSWORD and SESSION_SECRET."});
 if(!await session(request,env)) return out(401,{message:"Please log in first."});
 if(request.method!=="GET"){
  const origin=request.headers.get("Origin"); const url=new URL(request.url);
  if(!origin||new URL(origin).host!==url.host) return out(403,{message:"Request origin not allowed."});
 }
 const path=[].concat(params.path||[]).join("/");
 if(!(path==="products.json"||/^images\/[a-z0-9][a-z0-9._-]*\.jpg$/.test(path))) return out(400,{message:"Path not allowed."});
 const method=request.method; if(!["GET","PUT","DELETE"].includes(method))return out(405,{message:"Method not allowed."});
 const branch=env.GH_BRANCH||"main"; let body;
 if(method!=="GET"){try{body=JSON.parse(await request.text())}catch{return out(400,{message:"Bad body."})} body.branch=branch;}
 const url=`https://api.github.com/repos/${env.GH_REPO}/contents/${path}`+(method==="GET"?`?ref=${encodeURIComponent(branch)}`:"");
 const r=await fetch(url,{method,headers:{Authorization:`Bearer ${env.GH_TOKEN}`,Accept:"application/vnd.github+json","User-Agent":"craftveda-admin","X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});
 return new Response(await r.text(),{status:r.status,headers:{...H,"content-type":r.headers.get("content-type")||"application/json"}});
}
