// Stats tracking
let stats = JSON.parse(localStorage.getItem('familyStats')) || {
    today: 0,
    week: 0,
    total: 0,
    lastDate: new Date().toDateString()
};

function updateStats() {
    const today = new Date().toDateString();
    if (stats.lastDate !== today) {
        stats.today = 0;
        stats.lastDate = today;
    }
    
    document.getElementById('todayCount').textContent = stats.today;
    document.getElementById('weekCount').textContent = stats.week;
    document.getElementById('totalCount').textContent = stats.total;
    
    const todayBar = document.querySelector('.ledger-entry:nth-child(1) .ledger-fill');
    const weekBar = document.querySelector('.ledger-entry:nth-child(2) .ledger-fill');
    if (todayBar) todayBar.style.width = `${Math.min((stats.today / 20) * 100, 100)}%`;
    if (weekBar) weekBar.style.width = `${Math.min((stats.week / 100) * 100, 100)}%`;
}

function incrementStats() {
    stats.today++;
    stats.week++;
    stats.total++;
    localStorage.setItem('familyStats', JSON.stringify(stats));
    updateStats();
}

// Tab navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Proxy loading (basic iframe version)
const urlInput = document.getElementById('urlInput');
const launchBtn = document.getElementById('launchBtn');
const iframePanel = document.getElementById('iframePanel');
const proxyFrame = document.getElementById('proxyFrame');
const currentUrlDisplay = document.getElementById('currentUrl');

function loadProxy(url) {
    if (!url) return;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    proxyFrame.src = url;
    currentUrlDisplay.textContent = url;
    iframePanel.classList.add('active');
    incrementStats();
}

launchBtn.addEventListener('click', () => {
    loadProxy(urlInput.value);
});

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadProxy(urlInput.value);
    }
});

// Quick access cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        if (url) {
            urlInput.value = url;
            loadProxy(url);
        }
    });
});

// IFrame controls
document.getElementById('closeBtn').addEventListener('click', () => {
    iframePanel.classList.remove('active');
    proxyFrame.src = '';
});

document.getElementById('homeBtn').addEventListener('click', () => {
    iframePanel.classList.remove('active');
    proxyFrame.src = '';
});

document.getElementById('reloadBtn').addEventListener('click', () => {
    proxyFrame.src = proxyFrame.src;
});

document.getElementById('backBtn').addEventListener('click', () => {
    try {
        proxyFrame.contentWindow.history.back();
    } catch (e) {
        console.log('Cannot go back');
    }
});

// Initialize
updateStats();
