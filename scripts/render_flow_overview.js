#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'index.html');
const REPORT = path.join(ROOT, 'reports', 'flow-overview-report.json');
const CASES = [
  { name: 'desktop', width: 1200, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--allow-file-access-from-files', '--disable-dev-shm-usage'],
  });
  const results = [];
  try {
    for (const item of CASES) {
      const context = await browser.newContext({
        viewport: { width: item.width, height: item.height },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        locale: 'lt-LT',
      });
      const page = await context.newPage();
      await page.goto(pathToFileURL(SOURCE).href, { waitUntil: 'load' });
      await page.locator('img').first().waitFor({ state: 'visible' });
      const inspection = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const offenders = [...document.querySelectorAll('body *')]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              className: typeof element.className === 'string' ? element.className : '',
              left: Number(rect.left.toFixed(2)),
              right: Number(rect.right.toFixed(2)),
              width: Number(rect.width.toFixed(2)),
              text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
            };
          })
          .filter((element) => element.left < -1 || element.right > width + 1)
          .slice(0, 20);
        return {
          viewportWidth: width,
          documentWidth: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
          bodyHeight: document.body.scrollHeight,
          offenders,
        };
      });
      const output = path.join(ROOT, 'previews', `flow-overview-${item.name}.png`);
      await page.screenshot({ path: output, fullPage: true, animations: 'disabled' });
      results.push({
        viewport: item,
        output: path.relative(ROOT, output),
        ...inspection,
        pass: inspection.documentWidth <= inspection.viewportWidth + 1 && inspection.offenders.length === 0,
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }
  const report = {
    generatedAt: new Date().toISOString(),
    pass: results.every((result) => result.pass),
    results,
  };
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.pass) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
