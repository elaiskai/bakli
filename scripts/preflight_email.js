#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { TextDecoder } = require('util');

const ROOT = path.resolve(__dirname, '..');
const EMAIL_ROOT = path.join(ROOT, 'emails');
const REPORT_PATH = path.join(ROOT, 'reports', 'preflight-report.json');
const GMAIL_CLIP_BYTES = 102400;
const OFFICIAL_LOGO_URL = 'https://www.bakli.lt/resized/4065f0e86f548349d849495de0204b08-500x500-max.jpg';

const EMAILS = [
  {
    id: '01-pasveikinimas',
    requiredUrls: [
      'https://www.bakli.lt/lt/',
      'https://www.bakli.lt/lt/populiariausios-prekes',
    ],
    requiresGiftWrapPrice: false,
  },
  {
    id: '02-personalizavimas',
    requiredUrls: [
      'https://www.bakli.lt/lt/pinigines-deklai',
      'https://www.bakli.lt/lt/raktu-pakabukai',
      'https://www.bakli.lt/lt/aksesuarai-augintiniams',
      'https://www.bakli.lt/lt/personalizuotos-dovanos',
    ],
    requiresGiftWrapPrice: false,
  },
  {
    id: '03-dovanos',
    requiredUrls: [
      'https://www.bakli.lt/lt/dovanu-idejos',
      'https://www.bakli.lt/lt/dovanu-rinkiniai',
      'https://www.bakli.lt/lt/personalizuotos-dovanos',
    ],
    requiresGiftWrapPrice: true,
  },
];

const FILE_NAMES = {
  newsletterHtml: 'newsletter.html',
  plainText: 'newsletter.txt',
  omnisendBody: 'omnisend-body.html',
  omnisendStyles: 'omnisend-styles.css',
};

const APPROVED_SOCIAL_URLS = new Set([
  'https://www.facebook.com/BakliLT',
  'https://www.instagram.com/thebakli',
  'https://www.youtube.com/@BakliLeatherCrafts',
  'https://www.tiktok.com/@thebakli',
]);

function readUtf8(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return { exists: false, validUtf8: false, text: '', bytes: 0 };
  }
  const data = fs.readFileSync(filePath);
  try {
    return {
      exists: true,
      validUtf8: true,
      text: new TextDecoder('utf-8', { fatal: true }).decode(data),
      bytes: data.byteLength,
    };
  } catch {
    return { exists: true, validUtf8: false, text: data.toString('utf8'), bytes: data.byteLength };
  }
}

function tagAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(["'])(.*?)\2/gs)) {
    attributes[match[1].toLowerCase()] = match[3];
  }
  return attributes;
}

function tags(source, tagName) {
  return [...source.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function images(source) {
  return tags(source, 'img').map((tag, index) => ({ index, tag, ...tagAttributes(tag) }));
}

function hrefs(source) {
  return tags(source, 'a')
    .map(tagAttributes)
    .map((attributes) => attributes.href)
    .filter((href) => typeof href === 'string' && href.trim())
    .map((href) => href.trim());
}

function stripQueryAndHash(value) {
  return value.split(/[?#]/, 1)[0];
}

function pathInsideRoot(candidate) {
  return candidate === ROOT || candidate.startsWith(`${ROOT}${path.sep}`);
}

function normalizeUrlForExactMatch(value) {
  try {
    const parsed = new URL(value);
    parsed.hash = '';
    parsed.search = '';
    parsed.pathname = parsed.pathname.length > 1 ? parsed.pathname.replace(/\/+$/, '') : parsed.pathname;
    return parsed.toString().replace(/\/$/, parsed.pathname === '/' ? '/' : '');
  } catch {
    return value;
  }
}

function isApprovedBakliDestination(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return parsed.protocol === 'https:'
    && parsed.username === ''
    && parsed.password === ''
    && parsed.port === ''
    && parsed.hostname === 'www.bakli.lt'
    && (parsed.pathname === '/lt' || parsed.pathname.startsWith('/lt/'));
}

function isApprovedSocialDestination(value) {
  return APPROVED_SOCIAL_URLS.has(normalizeUrlForExactMatch(value));
}

function isApprovedNewsletterHref(value) {
  if (value === '[[unsubscribe_link]]') return true;
  if (/^mailto:info@bakli\.lt$/i.test(value)) return true;
  if (/^tel:\+37068182002$/.test(value.replace(/[\s()-]/g, ''))) return true;
  return isApprovedBakliDestination(value) || isApprovedSocialDestination(value);
}

function isApprovedOmnisendHref(value) {
  return isApprovedBakliDestination(value);
}

function isApprovedRemoteImage(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return parsed.protocol === 'https:'
    && parsed.username === ''
    && parsed.password === ''
    && parsed.port === ''
    && parsed.hostname === 'www.bakli.lt'
    && parsed.pathname.startsWith('/resized/');
}

function validateImageMarkup(items) {
  const missingAlt = items.filter((item) => !Object.hasOwn(item, 'alt') || !item.alt.trim());
  const missingDimensions = items.filter((item) => (
    !/^\d+$/.test(item.width || '') || !/^\d+$/.test(item.height || '')
  ));
  return { missingAlt, missingDimensions };
}

function validateNewsletterImages(items, emailDir) {
  const results = items.map((item) => {
    const src = (item.src || '').trim();
    if (isApprovedRemoteImage(src)) return { src, type: 'remote-bakli', approved: true, exists: true };
    if (!src || /^(?:https?:|\/\/|file:|data:|cid:)/i.test(src)) {
      return { src, type: 'disallowed', approved: false, exists: false };
    }
    let decoded;
    try {
      decoded = decodeURIComponent(stripQueryAndHash(src));
    } catch {
      return { src, type: 'invalid-local', approved: false, exists: false };
    }
    if (path.isAbsolute(decoded) || /^[A-Za-z]:[\\/]/.test(decoded)) {
      return { src, type: 'absolute-local', approved: false, exists: false };
    }
    const resolved = path.resolve(emailDir, decoded);
    const approved = pathInsideRoot(resolved);
    const exists = approved && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
    return {
      src,
      type: 'local-relative',
      approved,
      exists,
      resolved: approved ? path.relative(ROOT, resolved) : undefined,
    };
  });
  return results;
}

function normalizeVisibleCopy(value) {
  return value
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&euro;/gi, '€')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function main() {
  const emailReports = [];

  for (const config of EMAILS) {
    const emailDir = path.join(EMAIL_ROOT, config.id);
    const filePaths = Object.fromEntries(
      Object.entries(FILE_NAMES).map(([key, filename]) => [key, path.join(emailDir, filename)]),
    );
    const files = Object.fromEntries(
      Object.entries(filePaths).map(([key, filePath]) => [key, readUtf8(filePath)]),
    );
    const html = files.newsletterHtml.text;
    const plain = files.plainText.text;
    const omnisendBody = files.omnisendBody.text;
    const omnisendStyles = files.omnisendStyles.text;
    const combined = [html, plain, omnisendBody, omnisendStyles].join('\n');
    const visibleCombined = normalizeVisibleCopy([html, plain, omnisendBody].join('\n'));
    const checks = [];
    const check = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });

    for (const [key, file] of Object.entries(files)) {
      check(`${FILE_NAMES[key]} exists`, file.exists, path.relative(ROOT, filePaths[key]));
      check(`${FILE_NAMES[key]} is valid UTF-8`, file.validUtf8, `${file.bytes} byte(s).`);
    }

    check('Lithuanian language declaration', /<html\b[^>]*\blang=["']lt(?:-LT)?["']/i.test(html), 'Expected lang="lt" on the local newsletter document.');
    check('UTF-8 meta declaration', /<meta\b[^>]*charset=["']?utf-8/i.test(html), 'Expected UTF-8 charset meta.');
    check('Responsive viewport meta', /<meta\b[^>]*name=["']viewport["']/i.test(html), 'Expected viewport meta.');
    check('Apple reformatting protection', /x-apple-disable-message-reformatting/i.test(html), 'Expected x-apple-disable-message-reformatting.');
    check('Format-detection control', /<meta\b[^>]*name=["']format-detection["']/i.test(html), 'Expected format-detection meta.');

    const preheaderPresent = /<[^>]+class=["'][^"']*\bpreheader\b[^"']*["'][^>]*>/i.test(html);
    const preheaderHidden = /\.preheader\s*\{[^}]*?(?:display\s*:\s*none|max-height\s*:\s*0|mso-hide\s*:\s*all)/is.test(html)
      || /<[^>]+class=["'][^"']*\bpreheader\b[^"']*["'][^>]*style=["'][^"']*(?:display\s*:\s*none|max-height\s*:\s*0|mso-hide\s*:\s*all)[^"']*["'][^>]*>/is.test(html);
    check('Hidden preheader', preheaderPresent && preheaderHidden, 'Expected an email-safe hidden preheader in newsletter.html.');

    const newsletterTables = tags(html, 'table');
    const omnisendTables = tags(omnisendBody, 'table');
    const newsletterPresentationTables = newsletterTables.filter((tag) => /\brole=["']presentation["']/i.test(tag));
    const omnisendPresentationTables = omnisendTables.filter((tag) => /\brole=["']presentation["']/i.test(tag));
    check('Newsletter presentation-table semantics', newsletterTables.length > 0 && newsletterTables.length === newsletterPresentationTables.length, `${newsletterPresentationTables.length}/${newsletterTables.length} table(s).`);
    check('Omnisend presentation-table semantics', omnisendTables.length > 0 && omnisendTables.length === omnisendPresentationTables.length, `${omnisendPresentationTables.length}/${omnisendTables.length} table(s).`);

    check('No JavaScript, forms, video, or embedded frames', !/<(?:script|form|video|audio|iframe|object|embed)\b/i.test(`${html}\n${omnisendBody}`), 'Email markup must not contain executable or webpage-only elements.');
    check('No em dash', !/[\u2014\u2015]|&mdash;|&#0*8212;/i.test(combined), 'Use a short hyphen or Lithuanian punctuation instead of an em dash.');
    check('No hexadecimal HTML entities', !/&#x/i.test(combined), 'Hexadecimal HTML entities are not allowed.');

    const unfinished = combined.match(/\b(?:TODO|TBD|FIXME|LOREM|PLACEHOLDER)\b|\{\{|\}\}/gi) || [];
    check('No unfinished or legacy placeholders', unfinished.length === 0, unfinished.join(', ') || 'No unfinished placeholders.');
    const dummyOrWorkstation = combined.match(/(?:example\.(?:com|org)|your[-_ ]?(?:domain|cdn|url)|localhost|127\.0\.0\.1|file:\/\/|\/Users\/|\/private\/var\/folders\/|[A-Za-z]:\\|href\s*=\s*["']#["'])/gi) || [];
    check('No dummy URLs or workstation paths', dummyOrWorkstation.length === 0, dummyOrWorkstation.join(', ') || 'No dummy or workstation paths.');

    const newsletterImages = images(html);
    const omnisendImages = images(omnisendBody);
    const newsletterImageMarkup = validateImageMarkup(newsletterImages);
    const omnisendImageMarkup = validateImageMarkup(omnisendImages);
    check('Newsletter images have non-empty alt text', newsletterImages.length > 0 && newsletterImageMarkup.missingAlt.length === 0, `${newsletterImages.length - newsletterImageMarkup.missingAlt.length}/${newsletterImages.length} image(s).`);
    check('Newsletter images declare numeric dimensions', newsletterImages.length > 0 && newsletterImageMarkup.missingDimensions.length === 0, `${newsletterImages.length - newsletterImageMarkup.missingDimensions.length}/${newsletterImages.length} image(s).`);
    check('Omnisend images have non-empty alt text', omnisendImages.length > 0 && omnisendImageMarkup.missingAlt.length === 0, `${omnisendImages.length - omnisendImageMarkup.missingAlt.length}/${omnisendImages.length} image(s).`);
    check('Omnisend images declare numeric dimensions', omnisendImages.length > 0 && omnisendImageMarkup.missingDimensions.length === 0, `${omnisendImages.length - omnisendImageMarkup.missingDimensions.length}/${omnisendImages.length} image(s).`);

    const newsletterImageResults = validateNewsletterImages(newsletterImages, emailDir);
    const badNewsletterImages = newsletterImageResults.filter((item) => !item.approved || !item.exists);
    check('Newsletter image sources resolve safely', badNewsletterImages.length === 0, badNewsletterImages.map((item) => item.src || '(empty src)').join(', ') || `${newsletterImageResults.length} image(s) resolve.`);
    const badOmnisendImages = omnisendImages.filter((item) => !isApprovedRemoteImage((item.src || '').trim()));
    check('Omnisend images use exact BAKLI HTTPS image paths', omnisendImages.length > 0 && badOmnisendImages.length === 0, badOmnisendImages.map((item) => item.src || '(empty src)').join(', ') || `${omnisendImages.length} image(s) use https://www.bakli.lt/resized/.`);

    check('Omnisend body is a body-only fragment', !/<(?:!doctype|html|head|body|style)\b/i.test(omnisendBody), 'DOCTYPE, html, head, body, and style tags belong outside the Omnisend body fragment.');
    const omnisendHasFooter = /<footer\b|\b(?:class|id)=["'][^"']*\b(?:footer|legal-section)\b[^"']*["']/i.test(omnisendBody);
    const omnisendHasUnsubscribe = /unsubscribe|preference_link|atsisakyti\s+(?:prenumeratos|naujien)/i.test(omnisendBody);
    const officialLogoCount = omnisendImages.filter((item) => (item.src || '').trim() === OFFICIAL_LOGO_URL).length;
    check('Omnisend body includes the exact official BAKLI logo', officialLogoCount === 1, `${officialLogoCount} exact official logo image(s).`);
    check('Omnisend body omits native-wrapper footer', !omnisendHasFooter, 'The Omnisend native wrapper supplies the footer.');
    check('Omnisend body omits unsubscribe and preference links', !omnisendHasUnsubscribe, 'The Omnisend native wrapper supplies compliance links.');

    const responsiveStyles = /@media\b[\s\S]*?\(\s*max-width\s*:/i.test(omnisendStyles);
    check('Omnisend styles include a responsive media rule', responsiveStyles, 'Expected an @media (max-width: ...) rule.');
    check('Omnisend styles define mobile stacking', /\.mobile-stack\b[\s\S]*?display\s*:\s*block/i.test(omnisendStyles), 'Expected .mobile-stack display:block in the responsive CSS.');

    const newsletterLinks = hrefs(html);
    const omnisendLinks = hrefs(omnisendBody);
    const invalidNewsletterLinks = newsletterLinks.filter((href) => !isApprovedNewsletterHref(href));
    const invalidOmnisendLinks = omnisendLinks.filter((href) => !isApprovedOmnisendHref(href));
    check('Newsletter links use approved current BAKLI destinations', newsletterLinks.length > 0 && invalidNewsletterLinks.length === 0, invalidNewsletterLinks.join(', ') || `${newsletterLinks.length} approved link(s).`);
    check('Omnisend body links use only current BAKLI destinations', omnisendLinks.length > 0 && invalidOmnisendLinks.length === 0, invalidOmnisendLinks.join(', ') || `${omnisendLinks.length} approved link(s).`);

    const offerVersions = {
      newsletterHtml: normalizeVisibleCopy(html),
      plainText: normalizeVisibleCopy(plain),
      omnisendBody: normalizeVisibleCopy(omnisendBody),
    };
    const offerPresence = Object.fromEntries(
      Object.entries(offerVersions).map(([name, copy]) => [name, {
        code: /\bHELLO10\b/.test(copy),
        percent: /\b10\s*%/.test(copy),
      }]),
    );
    check(
      'Approved 10 % HELLO10 offer in all content versions',
      Object.values(offerPresence).every((item) => item.code && item.percent),
      JSON.stringify(offerPresence),
    );
    const percentages = [...visibleCombined.matchAll(/\b(\d{1,3})\s*%/g)]
      .map((match) => Number(match[1]));
    check(
      'No conflicting discount percentage',
      percentages.length > 0 && percentages.every((value) => value === 10),
      percentages.join(', '),
    );
    check(
      'No unapproved legacy promo code',
      !/\bBLITZ\b/i.test(visibleCombined),
      /\bBLITZ\b/i.test(visibleCombined) ? 'Found BLITZ.' : 'Only HELLO10 is approved.',
    );
    const inventedUrgency = visibleCombined.match(/\b(?:galioja\s+iki|tik\s+šiandien|paskutinė\s+diena)\b/giu) || [];
    check(
      'No invented discount deadline',
      inventedUrgency.length === 0,
      inventedUrgency.join(', ') || 'No unapproved deadline.',
    );
    const staleRating = visibleCombined.match(/(?:^|\D)4[,.]9(?:\D|$)/g) || [];
    const staleReviewCount = visibleCombined.match(/(?:^|\D)2(?:[\s.\u00a0])?370(?:\D|$)/g) || [];
    check('No 4.9 rating claim', staleRating.length === 0, staleRating.join(', ') || 'No 4.9 claim.');
    check('No 2,370 review-count claim', staleReviewCount.length === 0, staleReviewCount.join(', ') || 'No 2,370 claim.');

    const wrongGiftWrapPrice = /5,95\s*€/i.test(visibleCombined);
    check('No outdated 5,95 € gift-wrap price', !wrongGiftWrapPrice, wrongGiftWrapPrice ? 'Found 5,95 €.' : 'Outdated gift-wrap price absent.');
    if (config.requiresGiftWrapPrice) {
      const giftWrapPriceInHtml = /6,95\s*€/i.test(normalizeVisibleCopy(html));
      const giftWrapPriceInPlain = /6,95\s*€/i.test(normalizeVisibleCopy(plain));
      const giftWrapPriceInOmnisend = /6,95\s*€/i.test(normalizeVisibleCopy(omnisendBody));
      check('Current 6,95 € gift-wrap price in all content versions', giftWrapPriceInHtml && giftWrapPriceInPlain && giftWrapPriceInOmnisend, `newsletter.html: ${giftWrapPriceInHtml}; newsletter.txt: ${giftWrapPriceInPlain}; omnisend-body.html: ${giftWrapPriceInOmnisend}.`);
    }

    check('Newsletter HTML stays below Gmail clipping threshold', files.newsletterHtml.bytes < GMAIL_CLIP_BYTES, `${files.newsletterHtml.bytes}/${GMAIL_CLIP_BYTES} UTF-8 byte(s).`);
    const omnisendDeliveredBytes = files.omnisendBody.bytes + files.omnisendStyles.bytes;
    check('Omnisend body and styles stay below Gmail clipping threshold', omnisendDeliveredBytes < GMAIL_CLIP_BYTES, `${omnisendDeliveredBytes}/${GMAIL_CLIP_BYTES} UTF-8 byte(s).`);

    const missingPlainUrls = config.requiredUrls.filter((url) => !plain.includes(url));
    check('Plain text includes all relevant destinations', missingPlainUrls.length === 0, missingPlainUrls.join(', ') || `${config.requiredUrls.length} required URL(s).`);
    const missingNewsletterUrls = config.requiredUrls.filter((url) => !html.includes(url));
    const missingOmnisendUrls = config.requiredUrls.filter((url) => !omnisendBody.includes(url));
    check('HTML content versions include all relevant destinations', missingNewsletterUrls.length === 0 && missingOmnisendUrls.length === 0, [
      ...missingNewsletterUrls.map((url) => `newsletter: ${url}`),
      ...missingOmnisendUrls.map((url) => `omnisend: ${url}`),
    ].join(', ') || `${config.requiredUrls.length} required URL(s) in both HTML versions.`);

    emailReports.push({
      id: config.id,
      directory: path.relative(ROOT, emailDir),
      pass: checks.every((item) => item.pass),
      summary: {
        passed: checks.filter((item) => item.pass).length,
        failed: checks.filter((item) => !item.pass).length,
        total: checks.length,
      },
      files: Object.fromEntries(Object.entries(files).map(([key, file]) => [key, {
        path: path.relative(ROOT, filePaths[key]),
        exists: file.exists,
        validUtf8: file.validUtf8,
        bytes: file.bytes,
      }])),
      requiredUrls: config.requiredUrls,
      newsletterImages: newsletterImageResults,
      omnisendImages: omnisendImages.map((item) => item.src || ''),
      checks,
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    gmailClipThresholdBytes: GMAIL_CLIP_BYTES,
    approvedRemoteImagePattern: 'https://www.bakli.lt/resized/...',
    pass: emailReports.every((email) => email.pass),
    summary: {
      emailsPassed: emailReports.filter((email) => email.pass).length,
      emailsFailed: emailReports.filter((email) => !email.pass).length,
      totalEmails: emailReports.length,
      checksPassed: emailReports.reduce((sum, email) => sum + email.summary.passed, 0),
      checksFailed: emailReports.reduce((sum, email) => sum + email.summary.failed, 0),
    },
    emails: emailReports,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.pass) process.exitCode = 1;
}

main();
