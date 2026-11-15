export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const REAL_SERVER = "https://novavisionhub-3.onrender.com";

    // 1. Fake Pro Billing Response (Plan Check)
    if (path === "/api/billing/subscription") {
        return new Response(JSON.stringify({
            "currency": "usd",
            "isPro": true,
            "status": "active",
            "plan": "Pro",
            "expiry": "2099-12-31"
        }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // 2. Fake Billing Sync
    if (path === "/api/billing/sync") {
        return new Response(JSON.stringify({ 
            "status": "success", 
            "message": "Sync complete" 
        }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // 3. Fake Checkout Session (Payment Error Fix)
    if (path.includes("checkout-session") || path.includes("cakto") || path.includes("paypal")) {
        return new Response(JSON.stringify({ 
            "url": "https://nova-bypass.bhatzubair4054.workers.dev/fake-success" 
        }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // 4. Baaki requests asli server par bhej do
    const targetUrl = new URL(path + url.search, REAL_SERVER);
    const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body
    });

    return fetch(proxyRequest);
  }
};
