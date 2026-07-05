# 🛡️ Quick Scam Link Checker

A web application to detect suspicious and phishing links using rule-based detection with Node.js backend and vanilla JavaScript frontend.

![Project Banner](https://img.shields.io/badge/Security-Link%20Checker-blue)
![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)
![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)

---

## 📋 Table of Contents

- [Features](#-features)
- [Detection Rules](#-detection-rules)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Testing](#-testing-the-application)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

- **🔍 Rule-Based Detection**: Analyzes URLs based on multiple security patterns
- **📊 Safety Score System**: Rates links from 0-100 with color-coded indicators
- **⚡ Real-time Analysis**: Instant feedback on URL safety
- **📜 Check History**: Tracks your last 5 URL checks
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🔌 RESTful API**: Backend API for URL checking with JSON responses
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations
- **🚀 Fast & Lightweight**: No database required, instant results

---

## 🔐 Detection Rules

The system checks for the following suspicious patterns:

### 1. **URL Length Check**
- Flags URLs longer than 80 characters
- **Penalty**: -20 points

### 2. **Protocol Security**
- Checks if URL uses HTTPS instead of HTTP
- **Penalty**: -30 points for HTTP

### 3. **Suspicious Domain Extensions**
- Detects risky TLDs: `.tk`, `.cf`, `.gq`, `.ml`, `.ga`, `.xyz`, `.top`
- **Penalty**: -40 points

### 4. **Phishing Keywords**
- Scans for common phishing terms: free, win, bonus, lottery, prize, claim, winner, urgent, verify, account, suspended, congratulations, click, limited, offer, guarantee, risk-free
- **Penalty**: -15 points per keyword

### 5. **IP Address Detection**
- Flags URLs using IP addresses instead of domain names
- **Penalty**: -25 points

### 6. **URL Obfuscation (@)**
- Detects the @ symbol used in phishing attacks
- **Penalty**: -30 points

### 7. **Multiple Subdomains**
- Identifies URLs with more than 3 subdomains
- **Penalty**: -15 points

### 8. **Suspicious Characters**
- Checks for double dots (..) and other patterns
- **Penalty**: -20 points

### 9. **Short Domain Names**
- Flags domains shorter than 5 characters
- **Penalty**: -15 points

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | UI & User Interactions |
| **Backend** | Node.js, Express.js | Server & API Logic |
| **HTTP Client** | Fetch API | AJAX Requests |
| **Styling** | Custom CSS (No Framework) | Responsive Design |
| **Optional** | Google Safe Browsing API, PhishTank | Enhanced Threat Detection |

---

## 📁 Project Structure

```
quick-scam-link-checker/
│
├── public/                    # Frontend files
│   ├── index.html            # Main HTML page
│   ├── style.css             # CSS styling
│   └── script.js             # Frontend JavaScript
│
├── server.js                 # Express backend server
├── package.json              # Node dependencies
├── package-lock.json         # Lock file (auto-generated)
├── node_modules/             # Dependencies (auto-generated)
└── README.md                 # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor (VS Code, Sublime, etc.)
- A web browser (Chrome, Firefox, Edge)

### Step 1: Clone or Download the Project

```bash
# Create project directory
mkdir quick-scam-link-checker
cd quick-scam-link-checker
```

### Step 2: Create Project Files

Create the following folder structure and files:

```
quick-scam-link-checker/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
└── package.json
```

Copy the respective code into each file.

### Step 3: Install Dependencies

Open terminal in the project root and run:

```bash
npm install
```

This will install:
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `body-parser` - Request body parsing

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
=================================
Quick Scam Link Checker - Backend
=================================
Server running on http://localhost:3000
API endpoint: http://localhost:3000/api/check-url
Health check: http://localhost:3000/api/health
=================================
```

### Step 5: Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 💻 Usage

### Basic Usage

1. **Enter a URL** in the input field
2. **Click "Check Link"** button or press Enter
3. **View the results**:
   - Green = Safe ✅
   - Red = Suspicious ⚠️
4. **Check the safety score** (0-100)
5. **Read detailed analysis** of why the link is flagged
6. **Review recent checks** in the history section

### Example URLs to Test

#### ✅ Safe URLs
```
https://google.com
https://wikipedia.org
https://github.com
https://stackoverflow.com
```

#### ⚠️ Suspicious URLs
```
http://freebonus.tk/win
http://192.168.1.1/phishing
https://verify-account-now.cf
http://example.com@malicious.com
http://urgent-prize-claim.gq/winner
```

---

## 🔌 API Documentation

### Endpoint: Check URL

**POST** `/api/check-url`

Check a URL for suspicious patterns.

#### Request

```http
POST /api/check-url HTTP/1.1
Content-Type: application/json

{
  "url": "https://example.com"
}
```

#### Response (Safe URL)

```json
{
  "isSafe": true,
  "reasons": [
    "No obvious suspicious patterns detected",
    "URL uses HTTPS protocol",
    "Domain appears legitimate"
  ],
  "score": 100
}
```

#### Response (Suspicious URL)

```json
{
  "isSafe": false,
  "reasons": [
    "Not using secure HTTPS protocol",
    "Uses suspicious domain extension",
    "Contains suspicious keywords: free, win"
  ],
  "score": 25
}
```

#### Error Response

```json
{
  "error": "URL is required",
  "isSafe": false,
  "reasons": ["No URL provided"],
  "score": 0
}
```

### Endpoint: Health Check

**GET** `/api/health`

Check if the API is running.

#### Response

```json
{
  "status": "OK",
  "message": "Quick Scam Link Checker API is running",
  "timestamp": "2025-10-05T10:30:00.000Z"
}
```

---

## 🧪 Testing the Application

### Manual Testing

1. **Test Safe URLs**: Verify that legitimate websites get high scores
2. **Test Suspicious URLs**: Confirm phishing patterns are detected
3. **Test Invalid URLs**: Enter gibberish to test error handling
4. **Test History**: Check multiple URLs and verify history updates
5. **Test Responsiveness**: Open on mobile devices

### Using cURL

```bash
# Test safe URL
curl -X POST http://localhost:3000/api/check-url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'

# Test suspicious URL
curl -X POST http://localhost:3000/api/check-url \
  -H "Content-Type: application/json" \
  -d '{"url":"http://freebonus.tk/win"}'

# Health check
curl http://localhost:3000/api/health
```

### Using Postman

1. Create a new POST request to `http://localhost:3000/api/check-url`
2. Set header: `Content-Type: application/json`
3. Set body (raw JSON):
```json
{
  "url": "http://example.tk/free"
}
```
4. Send and view response

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **API Integration**
  - Google Safe Browsing API
  - VirusTotal API
  - PhishTank Database

- [ ] **Database Integration**
  - MongoDB for storing check history
  - User accounts and saved checks
  - Threat pattern analytics

- [ ] **Machine Learning**
  - Train ML model on phishing datasets
  - Improve detection accuracy
  - Adaptive learning from new threats

- [ ] **Browser Extension**
  - Chrome/Firefox extension
  - Real-time URL checking while browsing
  - Automatic warnings on suspicious links

- [ ] **Mobile App**
  - React Native mobile version
  - Push notifications for threats
  - QR code scanning

- [ ] **Advanced Features**
  - Bulk URL checking
  - URL shortener detection
  - Screenshot preview
  - Domain WHOIS lookup
  - SSL certificate validation

---

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: "Failed to check URL" Error

**Problem**: Frontend can't connect to backend

**Solutions**:
- Make sure the server is running (`npm start`)
- Check if port 3000 is available
- Verify `API_URL` in `script.js` matches your server address
- Check for CORS issues (should be handled by backend)

```bash
# Check if server is running
curl http://localhost:3000/api/health
```

#### Issue 2: "npm install" Fails

**Problem**: Package installation errors

**Solutions**:
- Delete `node_modules` folder and `package-lock.json`
- Run `npm cache clean --force`
- Run `npm install` again
- Check your Node.js version (`node --version`)

#### Issue 3: JSON Parse Error in package.json

**Problem**: Invalid JSON format

**Solutions**:
- Validate JSON at [jsonlint.com](https://jsonlint.com/)
- Remove any comments or trailing commas
- Use proper double quotes
- Ensure file is saved in UTF-8 encoding

#### Issue 4: Port 3000 Already in Use

**Problem**: Another application is using port 3000

**Solutions**:
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or change port in server.js
const PORT = 3001; // Use different port
```

#### Issue 5: Module Not Found Error

**Problem**: Missing dependencies

**Solutions**:
```bash
npm install express cors body-parser
```

---

## 🤝 Contributing

This is a student project, but contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Ideas

- Add new detection rules
- Improve UI/UX design
- Integrate external APIs
- Write unit tests
- Improve documentation
- Add internationalization (i18n)

---

## 👨‍💻 Developer Information

**Project**: Quick Scam Link Checker  
**Version**: 1.0.0  
**Course**: Web Development / Cybersecurity  
**Technology**: Node.js + Express + Vanilla JavaScript  
**Development Time**: Educational Project  

---

## 🌐 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [OWASP Phishing Guide](https://owasp.org/)
- [Google Safe Browsing](https://safebrowsing.google.com/)

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the code comments in each file
3. Contact your course instructor
4. Search for similar issues online

---

## ⚠️ Disclaimer

**Important Security Notice:**

This tool provides basic URL analysis for educational purposes and should NOT be the only security measure you rely on. 

- Always exercise caution when clicking unknown links
- Use multiple security tools and common sense
- This is a learning project, not a production-ready security solution
- For critical security needs, use professional security services
- The detection rules are basic and may not catch all threats
- False positives and false negatives can occur

**Stay Safe Online! 🛡️**

---

## 🎓 Educational Value

This project demonstrates:

- **Backend Development**: Express.js server creation
- **Frontend Development**: DOM manipulation, Fetch API
- **API Design**: RESTful endpoint implementation
- **Security Concepts**: URL analysis, phishing detection
- **Full-Stack Integration**: Frontend-backend communication
- **Error Handling**: Graceful error management
- **UI/UX Design**: Responsive, user-friendly interface
- **Code Organization**: Separation of concerns

---

## 🏆 Achievements

- ✅ Working prototype with backend
- ✅ Rule-based detection system
- ✅ Modern, responsive UI
- ✅ API documentation
- ✅ Real-world application
- ✅ Scalable architecture

---

**Made with ❤️ for Cybersecurity and Web Development**

**Star ⭐ this project if you found it helpful!**

---

*Last Updated: July 2026*
