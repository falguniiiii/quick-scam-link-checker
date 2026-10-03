const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Suspicious patterns configuration
const suspiciousPatterns = {
    tlds: ['.tk', '.cf', '.gq', '.ml', '.ga', '.xyz', '.top'],

    // More specific phrases reduce false positives from generic words
    keywords: [
        'verify-account',
        'account-suspended',
        'confirm-identity',
        'reset-password',
        'claim-prize',
        'claim-reward',
        'free-money',
        'gift-card',
        'lottery-winner',
        'you-won',
        'urgent-action',
        'security-alert',
        'payment-failed',
        'limited-time',
        'risk-free'
    ]
};

// URL Checker Function
function checkURL(url) {
    const checks = {
        isSafe: true,
        reasons: [],
        score: 100
    };

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        // Check 1: URL Length
        if (url.length > 100) {
            checks.isSafe = false;
            checks.reasons.push('URL is unusually long (>100 characters)');
            checks.score -= 10;
        }

        // Check 2: HTTPS Protocol
        if (urlObj.protocol === 'http:') {
            checks.isSafe = false;
            checks.reasons.push('Not using secure HTTPS protocol');
            checks.score -= 20;
        }

        // Check 3: Suspicious TLDs
        const hasSuspiciousTLD = suspiciousPatterns.tlds.some(tld =>
            hostname.endsWith(tld)
        );

        if (hasSuspiciousTLD) {
            checks.isSafe = false;
            checks.reasons.push('Uses a higher-risk domain extension');
            checks.score -= 20;
        }

        // Check 4: Suspicious Keywords / Phrases
        const lowerUrl = url.toLowerCase();

        const foundKeywords = suspiciousPatterns.keywords.filter(keyword =>
            lowerUrl.includes(keyword)
        );

        if (foundKeywords.length > 0) {
            checks.isSafe = false;
            checks.reasons.push(
                `Contains suspicious terms: ${foundKeywords.slice(0, 3).join(', ')}`
            );

            // Maximum keyword penalty is 30 points
            checks.score -= Math.min(foundKeywords.length * 10, 30);
        }

        // Check 5: IPv4 Address in Hostname
        const ipv4Pattern =
            /^(?:\d{1,3}\.){3}\d{1,3}$/;

        const isIPv4 = ipv4Pattern.test(hostname);

        let validIPv4 = false;

        if (isIPv4) {
            const octets = hostname.split('.').map(Number);

            validIPv4 = octets.every(
                octet => octet >= 0 && octet <= 255
            );

            if (validIPv4) {
                checks.isSafe = false;
                checks.reasons.push(
                    'Uses an IP address instead of a domain name'
                );
                checks.score -= 25;
            }
        }

        // Check 6: @ Symbol
        if (url.includes('@')) {
            checks.isSafe = false;
            checks.reasons.push(
                'Contains @ symbol (potential URL obfuscation technique)'
            );
            checks.score -= 25;
        }

        // Check 7: Multiple Subdomains
        const hostnameParts = hostname.split('.');

        if (!validIPv4 && hostnameParts.length > 3) {
            checks.isSafe = false;
            checks.reasons.push('Multiple subdomains detected');
            checks.score -= 10;
        }

        // Check 8: Double Dots in Hostname
        if (hostname.includes('..')) {
            checks.isSafe = false;
            checks.reasons.push('Contains consecutive dots in hostname');
            checks.score -= 20;
        }

        // Check 9: Very Short Hostname
        if (hostname.length < 5) {
            checks.isSafe = false;
            checks.reasons.push('Domain name is unusually short');
            checks.score -= 10;
        }

        // Ensure score doesn't go below 0
        checks.score = Math.max(0, checks.score);

        // Add positive messages only when no suspicious rule was triggered
        if (checks.isSafe) {
            checks.reasons.push('No obvious suspicious patterns detected');
            checks.reasons.push('URL uses HTTPS protocol');
        }

        return checks;

    } catch (error) {
        return {
            isSafe: false,
            reasons: ['Invalid URL format'],
            score: 0
        };
    }
}

// API Endpoint
app.post('/api/check-url', (req, res) => {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({
            error: 'URL is required',
            isSafe: false,
            reasons: ['No URL provided'],
            score: 0
        });
    }
    
    if (url.length > 2048) {
        return res.status(400).json({
            error: 'URL is too long',
            isSafe: false,
            reasons: ['URL exceeds the maximum allowed length'],
            score: 0
        });
    }

    console.log(`Checking URL: ${url}`);
    
    const result = checkURL(url);

    console.log(`Result: ${result.isSafe ? 'SAFE' : 'SUSPICIOUS'} (Score: ${result.score})`);

    res.json(result);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Quick Scam Link Checker API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send(`
        <h1>Quick Scam Link Checker API</h1>
        <p>Server is running on port ${PORT}</p>
        <h2>Endpoints:</h2>
        <ul>
            <li>POST /api/check-url - Check a URL for suspicious patterns</li>
            <li>GET /api/health - Health check</li>
        </ul>
        <h2>Example Request:</h2>
        <pre>
POST /api/check-url
Content-Type: application/json

{
  "url": "https://example.com"
}
        </pre>
    `);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('=================================');
    console.log('Quick Scam Link Checker - Backend');
    console.log('=================================');
    console.log(`Server running on port ${PORT}`);
    console.log(`Open: http://localhost:${PORT}`);
    console.log(`API endpoint: /api/check-url`);
    console.log(`Health check: /api/health`); 
    console.log('=================================');
});