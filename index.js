export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const REAL_SERVER = "https://novavisionhub-3.onrender.com";

    // Fake Pro Billing Response
    if (path === "/api/billing/subscription") {
        return new Response(JSON.stringify({
            "currency": "usd",
            "isPro": true,
            "status": "active",
            "plan": "Pro",
            "expiry": "2099-12-31"
        }), { headers: { "Content-Type": "application/json" } });
    }

    // Fake Sync
    if (path === "/api/billing/sync") {
        return new Response(JSON.stringify({ "status": "success" }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // Fake Checkout
    if (path.includes("checkout-session") || path.includes("cakto") || path.includes("paypal")) {
        return new Response(JSON.stringify({ 
            "url": "https://nova-bypass.bhatzubair4054.workers.dev/success" 
        }), { headers: { "Content-Type": "application/json" } });
    }

    // Proxy baaki requests
    const targetUrl = new URL(path + url.search, REAL_SERVER);
    const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body
    });

    return fetch(proxyRequest);
  }
};
