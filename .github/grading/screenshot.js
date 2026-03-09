const puppeteer = require('puppeteer');
const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs');

const repoRoot = path.resolve(__dirname, '../..');

(async function() {
  // Don't crash if index.html doesn't exist yet
  if (!fs.existsSync(path.join(repoRoot, 'index.html'))) {
    console.log('index.html not found, skipping screenshot');
    // Create a placeholder image
    fs.writeFileSync('screenshot.png', Buffer.alloc(0));
    return;
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 30000
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.setViewport({ width: 1280, height: 800 });

    const filePath = path.join(repoRoot, 'index.html');
    await page.goto(pathToFileURL(filePath).href, { waitUntil: 'networkidle0', timeout: 15000 });

    // For steps that have JS functionality, simulate some interactions
    // so the screenshot shows the app in use
    try {
      const input = await page.$('#task-input');
      const btn = await page.$('#add-btn');
      if (input && btn) {
        await input.type('Eksempeloppgave 1');
        await page.click('#add-btn');
        await new Promise(function(r) { setTimeout(r, 300); });

        await input.type('Eksempeloppgave 2');
        await page.click('#add-btn');
        await new Promise(function(r) { setTimeout(r, 300); });

        await input.type('Eksempeloppgave 3 (ferdig!)');
        await page.click('#add-btn');
        await new Promise(function(r) { setTimeout(r, 300); });

        // Try to mark the last one as completed
        const items = await page.$$('#task-list li');
        if (items.length > 0) {
          const lastItem = items[items.length - 1];
          const span = await lastItem.$('span');
          if (span) await span.click();
          else await lastItem.click();
        }
      }
    } catch (e) {
      // Interactions are best-effort — don't fail the screenshot
    }

    await new Promise(function(r) { setTimeout(r, 500); });

    await page.screenshot({
      path: 'screenshot.png',
      fullPage: true,
      type: 'png'
    });

    console.log('Screenshot saved to screenshot.png');
  } catch (err) {
    console.error('Screenshot error:', err.message);
  } finally {
    if (browser) await browser.close();
  }
})();
