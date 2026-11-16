export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Fake Pro Billing Response
    if (path.includes("/api/billing/subscription")) {
        return new Response(JSON.stringify({
            "currency": "usd",
            "isPro": true,
            "status": "active",
            "plan": "Pro",
            "expiry": "2099-12-31"
        }), { headers: { "Content-Type": "application/json" } });
    }

    // 2. Fake Billing Sync
    if (path.includes("/api/billing/sync")) {
        return new Response(JSON.stringify({ "status": "success" }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // 3. Fake Checkout
    if (path.includes("checkout-session") || path.includes("cakto") || path.includes("paypal")) {
        return new Response(JSON.stringify({ 
            "url": "https://nova-bypass.bhatzubair4054.workers.dev/success" 
        }), { headers: { "Content-Type": "application/json" } });
    }

    // 4. Fake Login / User
    if (path.includes("/api/user") || path.includes("/api/auth") || path.includes("/api/account")) {
        return new Response(JSON.stringify({
            "id": "12345",
            "email": "admin@nova.com",
            "name": "nova",
            "isPro": true,
            "credits": 999999,
            "plan": "Pro"
        }), { headers: { "Content-Type": "application/json" } });
    }

    // 5. Fake Library / Assets
    if (path.includes("/api/v1/library") || path.includes("/api/v1/presets") || path.includes("/api/v1/extensions") || path.includes("/api/ai")) {
        return new Response(JSON.stringify({
            "status": "success",
            "data": [],
            "items": [],
            "allowed": true,
            "remaining": 999999,
            "limit": 999999
        }), { headers: { "Content-Type": "application/json" } });
    }

    // 6. Sab kuch fake success (Default response)
    return new Response(JSON.stringify({
        "status": "success",
        "message": "Bypassed",
        "isPro": true,
        "allowed": true
    }), { headers: { "Content-Type": "application/json" } });
  }
};
