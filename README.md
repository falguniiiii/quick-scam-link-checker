# 🛡️ Quick Scam Link Checker

A lightweight full-stack web application that analyzes URLs for suspicious patterns using a rule-based scoring system.

The project is built with Node.js, Express, HTML, CSS, and vanilla JavaScript. It does not use a database or external threat-intelligence service.


## 📌 Overview

Quick Scam Link Checker accepts a URL and evaluates it against a set of predefined rules commonly associated with suspicious or deceptive URL structures.

Each triggered rule reduces an initial score of 100. The application then returns:

- a boolean result indicating whether any configured rule was triggered
- a risk/safety score from 0 to 100
- human-readable reasons explaining the triggered rules

> **Important:** This is a heuristic, rule-based analyzer. A URL that does not trigger a configured rule is **not guaranteed to be safe**, and a flagged URL is not automatically proven to be malicious.

## ✨ Features

- 🔎 Rule-based URL analysis
- 📊 Score from 0 to 100
- ⚠️ Explanation of detected suspicious patterns
- 🔐 HTTPS protocol check
- 🌐 Suspicious TLD detection
- 🖥️ IP-address URL detection
- 🔗 `@` symbol detection
- 🌳 Hostname structure check
- 🔤 Suspicious keyword detection
- 📏 URL length checks
- 📝 Recent check history for the current browser session
- 📱 Responsive frontend
- 🚀 Express backend serving the frontend and API
- ❤️ Health-check endpoint
- 🛡️ Basic request validation and URL length protection

## 🔍 Detection Rules

The current analyzer applies these checks:

| Rule | What it checks | Score penalty |
|---|---|---:|
| URL length | URL longer than 80 characters | -20 |
| HTTP protocol | URL uses `http:` instead of `https:` | -30 |
| Suspicious TLD | Hostname ends with `.tk`, `.cf`, `.gq`, `.ml`, `.ga`, `.xyz`, or `.top` | -40 |
| Suspicious keywords | URL contains configured suspicious terms | -15 per matched keyword |
| IP address | Hostname contains an IPv4-style address | -25 |
| `@` symbol | URL contains `@` | -30 |
| Complex hostname | Hostname contains more than 3 dot-separated labels | -15 |
| Double dots | URL contains `..` | -20 |
| Very short hostname | Hostname is shorter than 5 characters | -15 |

The score starts at **100** and is reduced when rules are triggered. It is capped at a minimum of **0**.

### Current keyword rules

The analyzer currently checks for terms such as:

```text
free, win, bonus, lottery, prize, claim, winner,
urgent, verify, account, suspended, congratulations,
click, here, now, limited, offer, act, fast,
guarantee, risk-free
```

These are heuristic signals only and can produce false positives because individual words are not proof of malicious intent.

## 🧠 How It Works

```text
User enters URL
       │
       ▼
Frontend sends POST /api/check-url
       │
       ▼
Express validates the request
       │
       ▼
URL is parsed and checked against rules
       │
       ├── URL length
       ├── Protocol
       ├── TLD
       ├── Keywords
       ├── IP address
       ├── @ symbol
       ├── Hostname structure
       ├── Double dots
       └── Hostname length
       │
       ▼
Score + reasons returned as JSON
       │
       ▼
Frontend displays the result
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| HTTP communication | Fetch API |
| Development | npm, Nodemon |
| Deployment-ready server | Express with `process.env.PORT` |

No database is required.

## 📁 Project Structure

```text
quick-scam-link-checker/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

`node_modules/` is created locally by npm and is intentionally excluded from Git.

## 🔌 API

### `POST /api/check-url`

Analyzes a submitted URL.

#### Request

```json
{
  "url": "https://example.com"
}
```

#### Example response

```json
{
  "isSafe": true,
  "reasons": [
    "No obvious suspicious patterns detected",
    "URL uses HTTPS protocol"
  ],
  "score": 100
}
```

If one or more rules are triggered, the response includes `isSafe: false`, a lower score, and the corresponding reasons.

### `GET /api/health`

Returns the current API health status.

Example:

```json
{
  "status": "OK",
  "message": "Quick Scam Link Checker API is running",
  "timestamp": "2026-10-03T00:00:00.000Z"
}
```

The timestamp is generated dynamically when the request is made.

## 💻 Local Setup

### Prerequisites

- Node.js 18 or higher
- npm
- A modern web browser

### 1. Clone the repository

```bash
git clone https://github.com/falguniiiii/quick-scam-link-checker.git
```

### 2. Enter the project directory

```bash
cd quick-scam-link-checker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npm start
```

The server uses port `3000` locally by default.

Open:

```text
http://localhost:3000
```

The server also supports a deployment-provided `PORT` environment variable.

### Development mode

For development with automatic server restarts:

```bash
npm run dev
```

## 🧪 Testing

You can test the application directly through the browser.

Try a normal HTTPS URL such as:

```text
https://example.com
```

You can also test URLs containing different patterns to observe how individual rules affect the score.

For API testing, send a JSON `POST` request to:

```text
/api/check-url
```

with:

```json
{
  "url": "https://example.com"
}
```

## ⚠️ Limitations

This project performs **static URL-pattern analysis**. It does not:

- visit or execute the destination website
- scan website content
- inspect downloaded files
- query live threat-intelligence databases
- verify domain ownership or reputation
- guarantee that a URL is safe
- guarantee that a flagged URL is malicious

False positives and false negatives are possible.

The result should therefore be treated as a warning signal rather than a definitive security verdict.

## 🔐 Security and Input Handling

The backend includes basic request protections:

- JSON request parsing through Express
- validation that a URL is provided as a string
- maximum accepted URL length of 2048 characters
- score clamping so the result cannot fall below 0
- frontend HTML escaping when displaying URLs in recent-check history

The project does not require API keys or other secrets in its current implementation.

## 🚀 Deployment

The application is structured so that Express serves both:

1. the static frontend from `public/`
2. the URL-analysis API

For a platform such as Render, the typical configuration is:

**Build command**
```text
npm install
```

**Start command**
```text
npm start
```

The server listens on:

```js
process.env.PORT || 3000
```

and binds to `0.0.0.0`, allowing it to run in a hosted environment.

## 🔮 Future Improvements

Possible improvements include:

- refining keyword rules to reduce false positives
- adding more URL normalization and structural analysis
- detecting additional deceptive URL patterns
- integrating reputable threat-intelligence services
- adding automated tests for detection rules
- improving result explanations
- adding persistent analysis history
- exploring statistical or machine-learning-based classification as a separate enhancement

