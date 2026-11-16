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

    // 4. Free Quota Bypass (Library / AI Limits)
    if (path.includes("/api/v1/library") || path.includes("/api/ai")) {
        // Agar app koi limit check kare, toh hum usko fake response bhejenge
        if (path.includes("/limits") || path.includes("/quota")) {
            return new Response(JSON.stringify({ 
                "allowed": true, 
                "remaining": 999999,
                "limit": 999999
            }), {
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    // 5. Baaki saari requests asli server par bhej do (Proxy + Headers Spoofing)
    const targetUrl = new URL(path + url.search, REAL_SERVER);
    
    // Asli server ko dhoka dene ke liye headers modify karo
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", "novavisionhub-3.onrender.com");
    newHeaders.set("Origin", "https://novavisionhub-3.onrender.com");
    newHeaders.set("Referer", "https://novavisionhub-3.onrender.com/");
    
    // User-Agent set karo (Flutter app jaisa)
    if (!newHeaders.has("User-Agent")) {
        newHeaders.set("User-Agent", "Dart/3.0 (dart:io)");
    }

    const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: newHeaders,
        body: request.body
    });

    return fetch(proxyRequest);
  }
};
