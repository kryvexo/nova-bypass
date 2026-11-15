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
        }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // Fake Billing Sync
    if (path === "/api/billing/sync") {
        return new Response(JSON.stringify({ "status": "success", "message": "Sync complete" }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // Baaki saari requests asli server par proxy kar do
    const targetUrl = new URL(path + url.search, REAL_SERVER);
    
    const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body
    });

    return fetch(proxyRequest);
  }
};
