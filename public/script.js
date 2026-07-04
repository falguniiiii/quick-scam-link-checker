// API Configuration
const API_URL = 'http://localhost:3000/api/check-url';

// DOM Elements
const urlInput = document.getElementById('urlInput');
const checkBtn = document.getElementById('checkBtn');
const btnText = document.getElementById('btnText');
const resultSection = document.getElementById('resultSection');
const resultCard = document.getElementById('resultCard');
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const scoreBadge = document.getElementById('scoreBadge');
const reasonsList = document.getElementById('reasonsList');
const warningBox = document.getElementById('warningBox');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

// State
let checkHistory = [];

// Event Listeners
checkBtn.addEventListener('click', handleCheck);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCheck();
    }
});

// Main Check Function
async function handleCheck() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a URL');
        return;
    }
    
    setLoadingState(true);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        displayResult(data, url);
        addToHistory(url, data);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to check URL. Please make sure the backend server is running.');
    } finally {
        setLoadingState(false);
    }
}

// Display Result
function displayResult(data, url) {
    // Show result section
    resultSection.classList.remove('hidden');
    
    // Set card style
    resultCard.className = 'result-card ' + (data.isSafe ? 'safe' : 'suspicious');
    
    // Set icon
    const iconHTML = data.isSafe 
        ? `<svg class="result-icon safe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
             <polyline points="22 4 12 14.01 9 11.01"></polyline>
           </svg>`
        : `<svg class="result-icon suspicious" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
             <line x1="12" y1="9" x2="12" y2="13"></line>
             <line x1="12" y1="17" x2="12.01" y2="17"></line>
           </svg>`;
    
    resultIcon.className = 'result-icon-wrapper ' + (data.isSafe ? 'safe' : 'suspicious');
    resultIcon.innerHTML = iconHTML;
    
    // Set title
    resultTitle.textContent = data.isSafe 
        ? '✓ Link Appears Safe' 
        : '⚠ Suspicious Link Detected';
    resultTitle.className = data.isSafe ? 'safe' : 'suspicious';
    
    // Set score badge
    const scoreClass = data.score >= 80 ? 'high' : data.score >= 50 ? 'medium' : 'low';
    scoreBadge.className = 'score-badge ' + scoreClass;
    scoreBadge.textContent = `Safety Score: ${data.score}/100`;
    
    // Set reasons
    reasonsList.innerHTML = '';
    data.reasons.forEach(reason => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="reason-dot ${data.isSafe ? 'safe' : 'suspicious'}"></span>
            <span>${reason}</span>
        `;
        reasonsList.appendChild(li);
    });
    
    // Show/hide warning
    if (data.isSafe) {
        warningBox.classList.add('hidden');
    } else {
        warningBox.classList.remove('hidden');
    }
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add to History
function addToHistory(url, data) {
    const timestamp = new Date().toLocaleTimeString();
    
    checkHistory.unshift({
        url,
        result: data,
        timestamp
    });
    
    // Keep only last 5 items
    if (checkHistory.length > 5) {
        checkHistory = checkHistory.slice(0, 5);
    }
    
    updateHistoryDisplay();
}

// Update History Display
function updateHistoryDisplay() {
    if (checkHistory.length === 0) {
        historySection.classList.add('hidden');
        return;
    }
    
    historySection.classList.remove('hidden');
    historyList.innerHTML = '';
    
    checkHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const iconSVG = item.result.isSafe
            ? `<svg class="history-icon safe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                 <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
               </svg>`
            : `<svg class="history-icon suspicious" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                 <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
               </svg>`;
        
        historyItem.innerHTML = `
            <div class="history-item-content">
                ${iconSVG}
                <div class="history-info">
                    <p class="history-url">${escapeHTML(item.url)}</p>
                    <p class="history-time">${item.timestamp}</p>
                </div>
            </div>
            <span class="history-badge ${item.result.isSafe ? 'safe' : 'suspicious'}">
                ${item.result.isSafe ? 'Safe' : 'Suspicious'}
            </span>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Show Error
function showError(message) {
    resultSection.classList.remove('hidden');
    resultCard.className = 'result-card suspicious';
    
    resultIcon.className = 'result-icon-wrapper suspicious';
    resultIcon.innerHTML = `
        <svg class="result-icon suspicious" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    `;
    
    resultTitle.textContent = '⚠ Error';
    resultTitle.className = 'suspicious';
    
    scoreBadge.className = 'score-badge low';
    scoreBadge.textContent = 'Error';
    
    reasonsList.innerHTML = `
        <li>
            <span class="reason-dot suspicious"></span>
            <span>${message}</span>
        </li>
    `;
    
    warningBox.classList.add('hidden');
}

// Set Loading State
function setLoadingState(isLoading) {
    if (isLoading) {
        checkBtn.disabled = true;
        btnText.textContent = 'Checking...';
        checkBtn.querySelector('.btn-icon').outerHTML = '<div class="spinner"></div>';
    } else {
        checkBtn.disabled = false;
        btnText.textContent = 'Check Link';
        checkBtn.querySelector('.spinner').outerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
        `;
    }
}

// Utility: Escape HTML
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Initialize
console.log('Quick Scam Link Checker initialized');
console.log('Make sure the backend server is running on http://localhost:3000');