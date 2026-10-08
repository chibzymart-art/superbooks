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
  if (!superbooksPage) {
    console.log('No SuperBooks page found');
    return;
  }

  const ws = new WebSocket(superbooksPage.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  console.log('Connected to CDP on SuperBooks tab.');

  // Set mobile device emulation (390 x 844)
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Navigate to reader
  console.log('Navigating to reader...');
  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000/read/the-souls-of-black-folk/1' });
  await new Promise(r => setTimeout(r, 1500));

  // Check overflow
  const evalResult = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const overflowing = elements.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.right > window.innerWidth || el.scrollWidth > el.clientWidth + 1;
      }).map(el => ({
        tag: el.tagName,
        id: el.id,
        className: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
        rectRight: Math.round(el.getBoundingClientRect().right),
        rectWidth: Math.round(el.getBoundingClientRect().width),
        windowWidth: window.innerWidth,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth
      }));
      return {
        windowWidth: window.innerWidth,
        docWidth: document.documentElement.offsetWidth,
        docScrollWidth: document.documentElement.scrollWidth,
        overflowCount: overflowing.length,
        overflowing: overflowing.slice(0, 10)
      };
    })()`,
    returnByValue: true
  });

  console.log('Mobile Reader Layout Check:', JSON.stringify(evalResult.result.value, null, 2));

  // Capture screenshot
  const screenshot = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/mobile_reader_cdp.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Captured screenshots/mobile_reader_cdp.png');

  // Reset emulation
  await sendCDP(ws, 'Emulation.clearDeviceMetricsOverride', {});
  ws.close();
}

main().catch(console.error);
