const http = require('http');
const fs = require('fs');

async function getPages() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  const pages = await getPages();
  const superbooksPage = pages.find(p => p.url && p.url.includes('localhost:3000'));
  const ws = new WebSocket(superbooksPage.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000/read/the-souls-of-black-folk/1?mode=scroll' });
  await new Promise(r => setTimeout(r, 1200));

  const screenshot = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/mobile_scroll_cdp.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshots/mobile_scroll_cdp.png');

  await sendCDP(ws, 'Emulation.clearDeviceMetricsOverride', {});
  ws.close();
}

main().catch(console.error);
