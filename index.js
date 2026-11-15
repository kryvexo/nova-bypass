const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const REAL_SERVER = 'https://novavisionhub-3.onrender.com';

// Fake Pro Billing Response
app.get('/api/billing/subscription', (req, res) => {
    console.log("Billing Check Intercepted! Sending Fake Pro...");
    res.json({
        "currency": "usd",
        "isPro": true,
        "status": "active",
        "plan": "Pro",
        "expiry": "2099-12-31"
    });
});

// Fake Billing Sync
app.post('/api/billing/sync', (req, res) => {
    res.json({ "status": "success", "message": "Sync complete" });
});

// Baaki saari requests asli server par bhej do (Proxy)
app.use('/', createProxyMiddleware({ 
    target: REAL_SERVER, 
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log("Forwarding to Real Server:", req.method, req.url);
    }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Fake Nova Server running on port ${PORT}`);
});
