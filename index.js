export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const REAL_SERVER = "https://novavisionhub-3.onrender.com";

    if (path === "/api/billing/subscription") {
        return new Response(JSON.stringify({
            "currency": "usd", "isPro": true, "status": "active", "plan": "Pro"
        }), { headers: { "Content-Type": "application/json" } });
    }

    if (path === "/api/billing/sync") {
        return new Response(JSON.stringify({ "status": "success" }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    if (path.includes("checkout-session") || path.includes("cakto") || path.includes("paypal")) {
        return new Response(JSON.stringify({ 
            "url": "https://nova-bypass.bhatzubair4054.workers.dev/success" 
        }), { headers: { "Content-Type": "application/json" } });
    }

    const targetUrl = new URL(path + url.search, REAL_SERVER);
    const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method, headers: request.headers, body: request.body
    });

    return fetch(proxyRequest);
  }
};
