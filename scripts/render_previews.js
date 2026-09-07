#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const EMAIL_ROOT = path.join(ROOT, 'emails');
const PREVIEW_ROOT = path.join(ROOT, 'previews');
const REPORT_PATH = path.join(ROOT, 'reports', 'render-report.json');
const DESKTOP_SHELL_WIDTH = 600;
const PIXEL_TOLERANCE = 1;

const EMAILS = [
  { id: '01-pasveikinimas', source: path.join(EMAIL_ROOT, '01-pasveikinimas', 'preview-local.html') },
  { id: '02-personalizavimas', source: path.join(EMAIL_ROOT, '02-personalizavimas', 'preview-local.html') },
  { id: '03-dovanos', source: path.join(EMAIL_ROOT, '03-dovanos', 'preview-local.html') },
];

const VIEWPORTS = [
  { label: 'desktop-600', slug: 'desktop-600', width: 760, height: 1100, mobile: false },
  { label: 'mobile-390', slug: 'mobile-390', width: 390, height: 844, mobile: true },
  { label: 'mobile-375', slug: 'mobile-375', width: 375, height: 812, mobile: true },
  { label: 'mobile-320', slug: 'mobile-320', width: 320, height: 750, mobile: true },
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

async function waitForAssets(page) {
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all([...document.images].map(async (image) => {
      if (!image.complete) {
        await new Promise((resolve) => {
          const done = () => resolve();
          image.addEventListener('load', done, { once: true });
          image.addEventListener('error', done, { once: true });
        });
      }
      if (image.decode) await image.decode().catch(() => {});
    }));
  });
}

async function inspectPage(page, viewport) {
  return page.evaluate(({ isMobile, desktopWidth, tolerance }) => {
    const shell = document.querySelector('.email-shell');
    const shellRect = shell ? shell.getBoundingClientRect() : null;
    const viewportWidth = document.documentElement.clientWidth;

    const isVisible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') !== 0
        && rect.width > 0
        && rect.height > 0;
    };

    const describe = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        className: typeof element.className === 'string' ? element.className : '',
        left: Number(rect.left.toFixed(2)),
        right: Number(rect.right.toFixed(2)),
        top: Number(rect.top.toFixed(2)),
        bottom: Number(rect.bottom.toFixed(2)),
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2)),
        text: (element.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 100),
      };
    };

    const visibleElements = [...document.querySelectorAll('body *')].filter(isVisible);
    const overflowElements = visibleElements
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -tolerance || rect.right > viewportWidth + tolerance;
      })
      .slice(0, 30)
      .map(describe);

    const shellOverflowElements = shellRect
      ? [...shell.querySelectorAll('*')]
        .filter(isVisible)
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left < shellRect.left - tolerance || rect.right > shellRect.right + tolerance;
        })
        .slice(0, 30)
        .map(describe)
      : [];

    const images = [...document.images];
    const missingImages = images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute('src') || '(empty src)');

    const stackElements = shell
      ? [...shell.querySelectorAll('.mobile-stack')].filter(isVisible)
      : [];
    const stackRects = stackElements.map((element) => ({
      ...describe(element),
      display: getComputedStyle(element).display,
    }));
    const stackGroups = [];
    const groupedByParent = new Map();
    for (const element of stackElements) {
      const siblings = groupedByParent.get(element.parentElement) || [];
      siblings.push(element);
      groupedByParent.set(element.parentElement, siblings);
    }
    for (const siblings of groupedByParent.values()) {
      if (siblings.length < 2) continue;
      const rects = siblings.map(describe).sort((a, b) => a.top - b.top || a.left - b.left);
      const nonOverlapping = rects.every((rect, index) => (
        index === 0 || rect.top >= rects[index - 1].bottom - tolerance
      ));
      stackGroups.push({ count: rects.length, nonOverlapping, rects });
    }

    const stackWithinShell = !shellRect || stackRects.every((rect) => (
      rect.left >= shellRect.left - tolerance && rect.right <= shellRect.right + tolerance
    ));
    const allStacksDisplayBlock = stackRects.every((rect) => rect.display === 'block');
    const siblingGroupsDoNotOverlap = stackGroups.every((group) => group.nonOverlapping);
    const mobileStackPass = !isMobile || (
      stackRects.length > 0
      && allStacksDisplayBlock
      && siblingGroupsDoNotOverlap
      && stackWithinShell
    );

    const shellWidth = shellRect ? Number(shellRect.width.toFixed(2)) : null;
    const shellWidthPass = Boolean(shellRect) && (
      isMobile
        ? shellWidth <= viewportWidth + tolerance
        : Math.abs(shellWidth - desktopWidth) <= tolerance
    );
    const documentWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    const horizontalOverflow = documentWidth > viewportWidth + tolerance;
    const pass = Boolean(shell)
      && shellWidthPass
      && !horizontalOverflow
      && overflowElements.length === 0
      && shellOverflowElements.length === 0
      && missingImages.length === 0
      && mobileStackPass;

    return {
      title: document.title,
      viewportWidth,
      documentWidth,
      bodyHeight: document.body.scrollHeight,
      shellFound: Boolean(shell),
      shellWidth,
      shellWidthPass,
      imageCount: images.length,
      missingImages,
      linkCount: document.links.length,
      horizontalOverflow,
      overflowElements,
      shellOverflowElements,
      mobileStack: {
        inspected: isMobile,
        count: stackRects.length,
        allDisplayBlock: allStacksDisplayBlock,
        siblingGroupsDoNotOverlap,
        withinShell: stackWithinShell,
        groups: stackGroups,
        pass: mobileStackPass,
      },
      pass,
    };
  }, {
    isMobile: viewport.mobile,
    desktopWidth: DESKTOP_SHELL_WIDTH,
    tolerance: PIXEL_TOLERANCE,
  });
}

async function renderOne(browser, email, viewport) {
  const output = path.join(PREVIEW_ROOT, `${email.id}-${viewport.slug}.png`);
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: viewport.mobile,
    colorScheme: 'light',
    locale: 'lt-LT',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const requestFailures = [];
  page.on('requestfailed', (request) => {
    requestFailures.push({
      url: request.url(),
      resourceType: request.resourceType(),
      error: request.failure() ? request.failure().errorText : 'unknown request failure',
    });
  });

  try {
    await page.goto(pathToFileURL(email.source).href, { waitUntil: 'load' });
    await waitForAssets(page);
    const result = await inspectPage(page, viewport);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    if (result.shellFound) {
      await page.locator('.email-shell').first().screenshot({
        path: output,
        animations: 'disabled',
      });
    } else {
      await page.screenshot({ path: output, fullPage: true, animations: 'disabled' });
    }
    const failedImageRequests = requestFailures.filter((failure) => failure.resourceType === 'image');
    return {
      email: email.id,
      source: path.relative(ROOT, email.source),
      viewport: viewport.label,
      output: path.relative(ROOT, output),
      ...result,
      requestFailures,
      failedImageRequests,
      pass: result.pass && failedImageRequests.length === 0,
    };
  } finally {
    await context.close();
  }
}

async function main() {
  const missingSources = EMAILS.filter((email) => !fs.existsSync(email.source));
  if (missingSources.length > 0) {
    throw new Error(`Missing newsletter source(s): ${missingSources.map((email) => path.relative(ROOT, email.source)).join(', ')}`);
  }

  fs.mkdirSync(PREVIEW_ROOT, { recursive: true });
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  const browser = await chromium.launch(launchOptions());
  const pages = [];
  try {
    for (const email of EMAILS) {
      for (const viewport of VIEWPORTS) pages.push(await renderOne(browser, email, viewport));
    }
  } finally {
    await browser.close();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    desktopShellWidth: DESKTOP_SHELL_WIDTH,
    summary: {
      passed: pages.filter((page) => page.pass).length,
      failed: pages.filter((page) => !page.pass).length,
      total: pages.length,
    },
    pass: pages.every((page) => page.pass),
    pages,
  };
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.pass) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
