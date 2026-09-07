#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const IMPORT_ROOT = path.join(ROOT, 'omnisend-upload');
const PREVIEW_ROOT = path.join(ROOT, 'previews');
const REPORT_PATH = path.join(ROOT, 'reports', 'omnisend-import-report.json');

const EMAILS = ['01-pasveikinimas', '02-personalizavimas', '03-dovanos'];
const VIEWPORTS = [
  { name: 'desktop-600', width: 760, height: 1000 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-320', width: 320, height: 750 },
];

function launchOptions() {
  const candidates = [
    process.env.BAKLI_CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ].filter(Boolean);
  const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
  return {
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: ['--allow-file-access-from-files', '--disable-dev-shm-usage'],
  };
}

async function waitForImages(page) {
  await page.waitForFunction(() => [...document.images].every((image) => image.complete), null, { timeout: 30000 });
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((image) => image.decode ? image.decode().catch(() => {}) : undefined));
  });
}

async function renderOne(browser, email, viewport) {
  const sourcePath = path.join(IMPORT_ROOT, `${email}.html`);
  const source = fs.readFileSync(sourcePath, 'utf8');
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    locale: 'lt-LT',
  });
  const page = await context.newPage();
  const failedRequests = [];
  page.on('requestfailed', (request) => {
    failedRequests.push({
      url: request.url(),
      type: request.resourceType(),
      error: request.failure() ? request.failure().errorText : 'unknown',
    });
  });

  try {
    await page.goto(pathToFileURL(sourcePath).href, { waitUntil: 'load' });
    await waitForImages(page);
    const inspection = await page.evaluate(() => {
      const shell = document.querySelector('.email-shell');
      const viewportWidth = document.documentElement.clientWidth;
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const overflow = [...document.querySelectorAll('body *')]
        .filter(visible)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            left: Number(rect.left.toFixed(2)),
            right: Number(rect.right.toFixed(2)),
            width: Number(rect.width.toFixed(2)),
          };
        })
        .filter((item) => item.left < -1 || item.right > viewportWidth + 1)
        .slice(0, 20);
      const criticalText = [...document.querySelectorAll('.headline, .section-title, .body-copy, .eyebrow, .code-text')]
        .map((element) => {
          const style = getComputedStyle(element);
          return {
            className: element.className,
            tag: element.tagName.toLowerCase(),
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            marginTop: style.marginTop,
            marginBottom: style.marginBottom,
          };
        });
      const missingImages = [...document.images]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.src);
      const shellRect = shell ? shell.getBoundingClientRect() : null;
      return {
        shellFound: Boolean(shell),
        shellWidth: shellRect ? Number(shellRect.width.toFixed(2)) : null,
        documentWidth: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
        bodyHeight: document.body.scrollHeight,
        imageCount: document.images.length,
        missingImages,
        overflow,
        criticalText,
        criticalTextPass: criticalText.length > 0 && criticalText.every((item) => (
          item.tag === 'p' || item.tag === 'span'
        ) && item.lineHeight !== 'normal' && item.marginTop === '0px' && item.marginBottom === '0px'),
      };
    });
    const outputPath = path.join(PREVIEW_ROOT, `omnisend-${email}-${viewport.name}.png`);
    fs.mkdirSync(PREVIEW_ROOT, { recursive: true });
    await page.locator('.email-shell').first().screenshot({ path: outputPath, animations: 'disabled' });
    const sourcePass = !/<(?:!doctype|html|head|body|style|div|h[1-6])\b/i.test(source)
      && !/(?:\.\.\/|file:\/\/|raw\.githubusercontent\.com)/i.test(source)
      && [...source.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)]
        .every((match) => match[1].startsWith('https://www.bakli.lt/resized/'));
    const imageFailures = failedRequests.filter((request) => request.type === 'image');
    const pass = sourcePass
      && inspection.shellFound
      && inspection.shellWidth <= viewport.width + 1
      && inspection.documentWidth <= viewport.width + 1
      && inspection.overflow.length === 0
      && inspection.missingImages.length === 0
      && inspection.criticalTextPass
      && imageFailures.length === 0;
    return {
      email,
      viewport: viewport.name,
      source: path.relative(ROOT, sourcePath),
      output: path.relative(ROOT, outputPath),
      sourcePass,
      failedRequests,
      ...inspection,
      pass,
    };
  } finally {
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch(launchOptions());
  const results = [];
  try {
    for (const email of EMAILS) {
      for (const viewport of VIEWPORTS) results.push(await renderOne(browser, email, viewport));
    }
  } finally {
    await browser.close();
  }
  const report = {
    generatedAt: new Date().toISOString(),
    pass: results.every((result) => result.pass),
    summary: {
      passed: results.filter((result) => result.pass).length,
      failed: results.filter((result) => !result.pass).length,
      total: results.length,
    },
    results,
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.pass) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
