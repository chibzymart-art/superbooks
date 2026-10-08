const http = require('http');

async function getPages() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const pages = await getPages();
    console.log('Open CDP pages:', pages.map(p => ({ title: p.title, url: p.url, ws: p.webSocketDebuggerUrl })));
  } catch (e) {
    console.error('CDP error:', e.message);
  }
}

run();
