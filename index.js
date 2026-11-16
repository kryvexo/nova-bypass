export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Asli server ka URL
    const REAL_SERVER = "https://novavisionhub-3.onrender.com";

    // 1. Billing / Subscription Check (Fake Pro)
    if (path.includes("/api/billing/subscription")) {
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

    // 2. Billing Sync (Fake Success)
    if (path.includes("/api/billing/sync")) {
        return new Response(JSON.stringify({ 
            "status": "success", 
            "message": "Sync complete" 
        }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // 3. Checkout Session (Fake Success)
    if (path.includes("checkout-session") || path.includes("cakto") || path.includes("paypal")) {
        return new Response(JSON.stringify({ 
            "url": "https://nova-bypass.bhatzubair4054.workers.dev/success" 
        }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // 4. Baaki saari requests asli server par bhej do (Proxy)
    const targetUrl = new URL(path + url.search, REAL_SERVER);
    
    // Headers copy karo
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", "novavisionhub-3.onrender.com");

    const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: newHeaders,
        body: request.body
    });

    return fetch(proxyRequest);
  }
};
