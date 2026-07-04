const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Suspicious patterns configuration
const suspiciousPatterns = {
    tlds: ['.tk', '.cf', '.gq', '.ml', '.ga', '.xyz', '.top'],
    keywords: [
        'free', 'win', 'bonus', 'lottery', 'prize', 'claim', 
        'winner', 'urgent', 'verify', 'account', 'suspended',
        'congratulations', 'click', 'here', 'now', 'limited',
        'offer', 'act', 'fast', 'guarantee', 'risk-free'
    ],
    suspiciousChars: ['@', '..']
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

        // Check 1: URL Length
        if (url.length > 80) {
            checks.isSafe = false;
            checks.reasons.push('URL is unusually long (>80 characters)');
            checks.score -= 20;
        }

        // Check 2: HTTPS Protocol
        if (urlObj.protocol === 'http:') {
            checks.isSafe = false;
            checks.reasons.push('Not using secure HTTPS protocol');
            checks.score -= 30;
        }

        // Check 3: Suspicious TLDs
        const hasSuspiciousTLD = suspiciousPatterns.tlds.some(tld => 
            urlObj.hostname.toLowerCase().endsWith(tld)
        );
        if (hasSuspiciousTLD) {
            checks.isSafe = false;
            checks.reasons.push('Uses suspicious domain extension');
            checks.score -= 40;
        }

        // Check 4: Phishing Keywords
        const lowerUrl = url.toLowerCase();
        const foundKeywords = suspiciousPatterns.keywords.filter(keyword => 
            lowerUrl.includes(keyword)
        );
        if (foundKeywords.length > 0) {
            checks.isSafe = false;
            checks.reasons.push(`Contains suspicious keywords: ${foundKeywords.slice(0, 3).join(', ')}`);
            checks.score -= (foundKeywords.length * 15);
        }

        // Check 5: IP Address in URL
        const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        if (ipPattern.test(urlObj.hostname)) {
            checks.isSafe = false;
            checks.reasons.push('Uses IP address instead of domain name');
            checks.score -= 25;
        }

        // Check 6: @ Symbol (URL Obfuscation)
        if (url.includes('@')) {
            checks.isSafe = false;
            checks.reasons.push('Contains @ symbol (potential phishing technique)');
            checks.score -= 30;
        }

        // Check 7: Multiple Subdomains
        const subdomains = urlObj.hostname.split('.');
        if (subdomains.length > 3) {
            checks.isSafe = false;
            checks.reasons.push('Multiple subdomains detected');
            checks.score -= 15;
        }

        // Check 8: Suspicious Characters
        if (url.includes('..')) {
            checks.isSafe = false;
            checks.reasons.push('Contains suspicious character patterns');
            checks.score -= 20;
        }

        // Check 9: Short Domain Names (often used in phishing)
        if (urlObj.hostname.length < 5) {
            checks.isSafe = false;
            checks.reasons.push('Domain name is unusually short');
            checks.score -= 15;
        }

        // Ensure score doesn't go below 0
        checks.score = Math.max(0, checks.score);

        // Add positive message if safe
        if (checks.isSafe) {
            checks.reasons.push('No obvious suspicious patterns detected');
            checks.reasons.push('URL uses HTTPS protocol');
            checks.reasons.push('Domain appears legitimate');
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

    if (!url) {
        return res.status(400).json({
            error: 'URL is required',
            isSafe: false,
            reasons: ['No URL provided'],
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
app.listen(PORT, () => {
    console.log('=================================');
    console.log('Quick Scam Link Checker - Backend');
    console.log('=================================');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/check-url`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log('=================================');
});