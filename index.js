const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config file path
const CONFIG_FILE = './config.json';

// Default config
let config = {
    fbToken: '',
    fbAppId: '1525523458793649',
    ludoServerUrl: '',
    ludoServerPort: '',
    botStatus: 'stopped',
    autoReconnect: true,
    lastUpdated: null
};

// Load config on startup
if (fs.existsSync(CONFIG_FILE)) {
    config = { ...config, ...JSON.parse(fs.readFileSync(CONFIG_FILE)) };
}

// Save config function
function saveConfig() {
    config.lastUpdated = new Date().toISOString();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// ===== ADMIN PANEL ROUTE =====
app.get('/admin', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>FK AI Bot Admin Panel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, sans-serif; }
        body { background: #1a1a2e; color: #eee; padding: 20px; min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #00d4ff; margin-bottom: 20px; text-align: center; }
        .card { background: #16213e; border-radius: 10px; padding: 20px; margin-bottom: 15px; border: 1px solid #0f3460; }
        .card h2 { color: #00d4ff; margin-bottom: 15px; font-size: 18px; }
        .status { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
        .status.running { background: #00c853; color: white; }
        .status.stopped { background: #d32f2f; color: white; }
        label { display: block; margin: 10px 0 5px; color: #b0b0b0; font-size: 14px; }
        input, textarea { width: 100%; padding: 10px; background: #0f3460; border: 1px solid #1a4d7a; color: white; border-radius: 5px; font-size: 14px; }
        button { background: #00d4ff; color: #1a1a2e; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; margin: 5px 5px 5px 0; font-size: 14px; }
        button:hover { background: #00b8e6; }
        button.danger { background: #d32f2f; color: white; }
        button.success { background: #00c853; color: white; }
        .row { display: flex; gap: 10px; flex-wrap: wrap; }
        .info { background: #0f3460; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 13px; word-break: break-all; }
        .toggle { display: flex; align-items: center; gap: 10px; }
        #logs { background: #000; color: #0f0; padding: 10px; border-radius: 5px; height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 FK AI Bot Admin Panel</h1>
        
        <div class="card">
            <h2>📊 Bot Status</h2>
            <p>Status: <span class="status ${config.botStatus}" id="botStatus">${config.botStatus.toUpperCase()}</span></p>
            <p style="margin-top: 10px;">Last Updated: ${config.lastUpdated || 'Never'}</p>
            <div class="row" style="margin-top: 15px;">
                <button class="success" onclick="startBot()">▶ Start Bot</button>
                <button class="danger" onclick="stopBot()">■ Stop Bot</button>
                <button onclick="restartBot()">↻ Restart</button>
            </div>
        </div>

        <div class="card">
            <h2>🔑 Facebook Settings</h2>
            <label>App ID</label>
            <input type="text" id="fbAppId" value="${config.fbAppId}" />
            
            <label>Access Token</label>
            <textarea id="fbToken" rows="4">${config.fbToken}</textarea>
            
            <div class="row" style="margin-top: 10px;">
                <button onclick="saveFacebook()">💾 Save Token</button>
                <button onclick="testToken()">🧪 Test Token</button>
            </div>
            <div class="info" id="fbResult"></div>
        </div>

        <div class="card">
            <h2>🎮 Ludo Server Settings</h2>
            <label>Server URL / IP</label>
            <input type="text" id="ludoUrl" value="${config.ludoServerUrl}" placeholder="e.g., ludo.example.com" />
            
            <label>Port</label>
            <input type="text" id="ludoPort" value="${config.ludoServerPort}" placeholder="e.g., 8080" />
            
            <div class="row" style="margin-top: 10px;">
                <button onclick="saveLudo()">💾 Save Ludo Config</button>
                <button onclick="testLudo()">🔌 Test Connection</button>
            </div>
            <div class="info" id="ludoResult"></div>
        </div>

        <div class="card">
            <h2>⚙️ General Settings</h2>
            <div class="toggle">
                <input type="checkbox" id="autoReconnect" ${config.autoReconnect ? 'checked' : ''} style="width: auto;" />
                <label style="margin: 0;">Auto Reconnect on Disconnect</label>
            </div>
            <button onclick="saveSettings()" style="margin-top: 15px;">💾 Save Settings</button>
        </div>

        <div class="card">
            <h2>📜 Live Logs</h2>
            <div id="logs">Waiting for logs...</div>
            <button onclick="clearLogs()" style="margin-top: 10px;">🗑 Clear Logs</button>
        </div>
    </div>

    <script>
        async function apiCall(endpoint, data = null) {
            const opts = { method: data ? 'POST' : 'GET' };
            if (data) {
                opts.headers = { 'Content-Type': 'application/json' };
                opts.body = JSON.stringify(data);
            }
            const res = await fetch(endpoint, opts);
            return await res.json();
        }

        async function saveFacebook() {
            const result = await apiCall('/admin/save-facebook', {
                fbAppId: document.getElementById('fbAppId').value,
                fbToken: document.getElementById('fbToken').value
            });
            document.getElementById('fbResult').innerText = result.message;
        }

        async function testToken() {
            document.getElementById('fbResult').innerText = 'Testing...';
            const token = document.getElementById('fbToken').value;
            const result = await apiCall('/test-ludo-token?token=' + encodeURIComponent(token));
            document.getElementById('fbResult').innerText = JSON.stringify(result, null, 2);
        }

        async function saveLudo() {
            const result = await apiCall('/admin/save-ludo', {
                ludoServerUrl: document.getElementById('ludoUrl').value,
                ludoServerPort: document.getElementById('ludoPort').value
            });
            document.getElementById('ludoResult').innerText = result.message;
        }

        async function testLudo() {
            document.getElementById('ludoResult').innerText = 'Connecting...';
            const result = await apiCall('/admin/test-ludo');
            document.getElementById('ludoResult').innerText = result.message;
        }

        async function saveSettings() {
            const result = await apiCall('/admin/save-settings', {
                autoReconnect: document.getElementById('autoReconnect').checked
            });
            alert(result.message);
        }

        async function startBot() {
            const result = await apiCall('/admin/start-bot', {});
            document.getElementById('botStatus').innerText = 'RUNNING';
            document.getElementById('botStatus').className = 'status running';
            addLog('Bot started');
        }

        async function stopBot() {
            const result = await apiCall('/admin/stop-bot', {});
            document.getElementById('botStatus').innerText = 'STOPPED';
            document.getElementById('botStatus').className = 'status stopped';
            addLog('Bot stopped');
        }

        async function restartBot() {
            await stopBot();
            setTimeout(startBot, 1000);
        }

        function addLog(msg) {
            const logs = document.getElementById('logs');
            const time = new Date().toLocaleTimeString();
            logs.innerHTML += '[' + time + '] ' + msg + '\\n';
            logs.scrollTop = logs.scrollHeight;
        }

        function clearLogs() {
            document.getElementById('logs').innerHTML = '';
        }

        // Fetch logs every 3 seconds
        setInterval(async () => {
            try {
                const result = await apiCall('/admin/logs');
                if (result.logs && result.logs.length) {
                    result.logs.forEach(log => addLog(log));
                }
            } catch(e) {}
        }, 3000);
    </script>
</body>
</html>
    `);
});

// ===== ADMIN API ROUTES =====

app.post('/admin/save-facebook', (req, res) => {
    config.fbAppId = req.body.fbAppId;
    config.fbToken = req.body.fbToken;
    saveConfig();
    res.json({ status: 'ok', message: '✅ Facebook settings saved!' });
});

app.post('/admin/save-ludo', (req, res) => {
    config.ludoServerUrl = req.body.ludoServerUrl;
    config.ludoServerPort = req.body.ludoServerPort;
    saveConfig();
    res.json({ status: 'ok', message: '✅ Ludo server settings saved!' });
});

app.post('/admin/save-settings', (req, res) => {
    config.autoReconnect = req.body.autoReconnect;
    saveConfig();
    res.json({ status: 'ok', message: '✅ Settings saved!' });
});

app.post('/admin/start-bot', (req, res) => {
    config.botStatus = 'running';
    saveConfig();
    // TODO: Yahan actual bot start logic aayega
    res.json({ status: 'ok', message: 'Bot started' });
});

app.post('/admin/stop-bot', (req, res) => {
    config.botStatus = 'stopped';
    saveConfig();
    // TODO: Yahan actual bot stop logic aayega
    res.json({ status: 'ok', message: 'Bot stopped' });
});

app.get('/admin/test-ludo', async (req, res) => {
    if (!config.ludoServerUrl) {
        return res.json({ message: '❌ Ludo server URL not set' });
    }
    try {
        const url = `http://${config.ludoServerUrl}:${config.ludoServerPort || 80}`;
        const response = await fetch(url, { method: 'GET' });
        res.json({ message: `✅ Connected! Status: ${response.status}` });
    } catch (err) {
        res.json({ message: `❌ Connection failed: ${err.message}` });
    }
});

app.get('/admin/logs', (req, res) => {
    // Simple in-memory logs (production me proper logging use karo)
    res.json({ logs: [] });
});

// Test Ludo Star token endpoint
app.get('/test-ludo-token', async (req, res) => {
    const token = req.query.token || process.env.FB_ACCESS_TOKEN;
    
    if (!token) {
        return res.status(400).json({ 
            error: 'Token missing',
            usage: '/test-ludo-token?token=YOUR_FB_TOKEN'
        });
    }
    
    try {
        // Step 1: Facebook token verify karo
        const fbResponse = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name`);
        const fbData = await fbResponse.json();
        
        if (fbData.error) {
            return res.status(401).json({ 
                stage: 'Facebook validation failed',
                error: fbData.error 
            });
        }
        
        // Step 2: Ludo Star API test
        const ludoResponse = await fetch('https://api.ludostar.com/api/v1/auth/facebook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_token: token,
                fb_id: fbData.id,
                platform: 'android',
                app_version: '1.0.0'
            })
        });
        
        const ludoData = await ludoResponse.json();
        
        res.json({
            success: true,
            facebook: {
                id: fbData.id,
                name: fbData.name
            },
            ludo_response: ludoData
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
