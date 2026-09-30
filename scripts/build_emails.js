#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OMNISEND_UPLOAD_ROOT = path.join(ROOT, 'omnisend-upload');

const URLS = {
  home: 'https://www.bakli.lt/lt/',
  popular: 'https://www.bakli.lt/lt/populiariausios-prekes',
  wallets: 'https://www.bakli.lt/lt/pinigines-deklai',
  keychains: 'https://www.bakli.lt/lt/raktu-pakabukai',
  pets: 'https://www.bakli.lt/lt/aksesuarai-augintiniams',
  personalize: 'https://www.bakli.lt/lt/populiariausios-prekes',
  gifts: 'https://www.bakli.lt/lt/dovanu-idejos',
  giftSets: 'https://www.bakli.lt/lt/dovanu-rinkiniai',
  karter: 'https://www.bakli.lt/lt/dirzai/vyriskas-dirzas-karter-su-vyciu-40mm',
  pinkSet: 'https://www.bakli.lt/lt/aksesuarai-augintiniams/antkaklio-rinkinys-sunims-pink-maxi',
  grant: 'https://www.bakli.lt/lt/70-100-eur/odine-pinigine-grant-crazy-horse-3in1',
  jacob: 'https://www.bakli.lt/lt/dovanu-idejos/boso-diena/odine-pinigine-jacob-crazy-horse',
  giftSofia: 'https://www.bakli.lt/lt/70-100-eur/pinigines-sofia-kosmetines-vanessa-mini-ir-telefono-deklo-rinkinys',
  giftEvan: 'https://www.bakli.lt/lt/dovanu-idejos/dovanos-tecio-dienos-proga/pinigines-evan-ir-kosmetines-walter-rinkinys',
  giftJacob: 'https://www.bakli.lt/lt/dovanos-vyrams/pinigines-jacob-crazy-horse-su-spaude-ir-odinio-automobilio-kvapo-rinkinys',
};

const ASSETS = {
  logo: {
    local: '../../assets/brand/bakli-logo.jpg',
    remote: 'https://www.bakli.lt/resized/4065f0e86f548349d849495de0204b08-500x500-max.jpg',
  },
  wallets: {
    local: '../../assets/categories/wallets.jpg',
    remote: 'https://www.bakli.lt/resized/95d9c31f1c22f62c3c2c58c57f782d99-500x500-maxq.jpg',
  },
  welcomeHero: {
    local: '../../assets/categories/wallets.jpg',
    remote: 'https://www.bakli.lt/resized/95d9c31f1c22f62c3c2c58c57f782d99-500x500-maxq.jpg',
  },
  keychains: {
    local: '../../assets/categories/keychains.jpg',
    remote: 'https://www.bakli.lt/resized/a372aa0f952b42d908eb2107dd4519cd-500x500-maxq.jpg',
  },
  personalizationHero: {
    local: '../../assets/categories/keychains.jpg',
    remote: 'https://www.bakli.lt/resized/a372aa0f952b42d908eb2107dd4519cd-500x500-maxq.jpg',
  },
  pets: {
    local: '../../assets/categories/pets.jpg',
    remote: 'https://www.bakli.lt/resized/adf0ff4278de15d5015690019f7f4adc-500x500-maxq.jpg',
  },
  karter: {
    local: '../../assets/products/karter.jpg',
    remote: 'https://www.bakli.lt/resized/a951968027c82fb512d8e928cf225885-500x500-max.jpg',
  },
  pinkSet: {
    local: '../../assets/products/pink-set.jpg',
    remote: 'https://www.bakli.lt/resized/6985991b38c9abec7c9a9da5d3b67741-500x500-max.jpg',
  },
  grant: {
    local: '../../assets/products/grant.jpg',
    remote: 'https://www.bakli.lt/resized/1c8864f1228b3d8407afb8364922c9ce-500x500-max.jpg',
  },
  jacob: {
    local: '../../assets/products/jacob.jpg',
    remote: 'https://www.bakli.lt/resized/ae544acab6ef6416830c7f72a02e282c-500x500-max.jpg',
  },
  step1: {
    local: '../../assets/steps/step-1.jpg',
    remote: 'https://www.bakli.lt/resized/310dbbadf2ce9e37f793ba996b6687f2-500x500-max.jpg',
  },
  step2: {
    local: '../../assets/steps/step-2.jpg',
    remote: 'https://www.bakli.lt/resized/f5e7dd2fac9e36826d7634ff650b67a3-500x500-max.jpg',
  },
  step3: {
    local: '../../assets/steps/step-3.jpg',
    remote: 'https://www.bakli.lt/resized/9908674cede49c05fe9be6a644aad3df-500x500-max.jpg',
  },
  step4: {
    local: '../../assets/steps/step-4.jpg',
    remote: 'https://www.bakli.lt/resized/f1f878cad649a6418c62d66cd89411ae-500x500-max.jpg',
  },
  giftHero: {
    local: '../../assets/gifts/marco-scott-personalized.jpg',
    remote: 'https://www.bakli.lt/resized/3bfa9d3d7d6fb0a325cbb3d88bf2fc59-1000x1000-max/marco-pinigin-s-ir-scott-pakabuko-rinkinys-7.jpg',
  },
  giftingHero: {
    local: '../../assets/gifts/marco-scott-personalized.jpg',
    remote: 'https://www.bakli.lt/resized/3bfa9d3d7d6fb0a325cbb3d88bf2fc59-1000x1000-max/marco-pinigin-s-ir-scott-pakabuko-rinkinys-7.jpg',
  },
  giftSofia: {
    local: '../../assets/gifts/sofia-vanessa-phone.jpg',
    remote: 'https://www.bakli.lt/resized/1acfd4609b53134374f737b4aca158d6-500x500-max.jpg',
  },
  giftEvan: {
    local: '../../assets/gifts/evan-walter.jpg',
    remote: 'https://www.bakli.lt/resized/5d4dd8775ca66cf9a38d0326506545fa-500x500-max.jpg',
  },
  giftJacob: {
    local: '../../assets/gifts/jacob-fragrance.jpg',
    remote: 'https://www.bakli.lt/resized/617b3abb28bc377b899726b78e7cf32c-500x500-max.jpg',
  },
};

const COMMON_STYLES = `
html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
body { background: #eee8e0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
table, td { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
a { color: inherit; text-decoration: none; }
.preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; max-height: 0; max-width: 0; overflow: hidden; mso-hide: all; }
.email-shell { width: 600px; max-width: 600px; }
.fluid { display: block; width: 100%; max-width: 100%; height: auto; }
.headline { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 34px; line-height: 40px; font-weight: 400; letter-spacing: -0.5px; color: #141414; margin: 0; }
.section-title { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 28px; line-height: 34px; font-weight: 400; letter-spacing: -0.35px; color: #141414; margin: 0; }
.body-copy { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 15px; line-height: 24px; color: #45413d; }
.eyebrow { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 2px; color: #9d4d07; }
.code-text { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 22px; line-height: 26px; font-weight: 800; letter-spacing: 3px; color: #141414; }
@media only screen and (max-width: 620px) {
  .outer-pad { padding: 0 !important; }
  .email-shell { width: 100% !important; max-width: 600px !important; }
  .mobile-stack { display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
  .mobile-stack-pad { padding-left: 20px !important; padding-right: 20px !important; }
  .mobile-center { text-align: center !important; }
  .mobile-hide { display: none !important; max-height: 0 !important; overflow: hidden !important; }
  .brand-header td { padding: 13px 20px 11px !important; }
  .brand-logo { width: 124px !important; max-width: 124px !important; height: auto !important; }
  .brand-tagline { font-size: 8.5px !important; line-height: 12px !important; letter-spacing: 1.5px !important; }
  .nav-cell { padding: 11px 2px !important; }
  .nav-link { font-size: 9px !important; line-height: 13px !important; letter-spacing: 1px !important; }
  .hero-pad { padding: 38px 24px 28px !important; }
  .section-pad { padding: 38px 24px !important; }
  .headline { font-size: 27px !important; line-height: 33px !important; }
  .section-title { font-size: 24px !important; line-height: 30px !important; }
  .card-pad { padding: 0 20px 20px !important; }
  .split-copy { padding: 38px 24px 32px !important; }
  .proof-cell { padding: 15px 6px !important; }
  .proof-number { font-size: 16px !important; line-height: 20px !important; }
  .proof-label { font-size: 9px !important; line-height: 13px !important; letter-spacing: 0.7px !important; }
  .offer-pad { padding: 30px 22px !important; }
  .detail-cell { padding: 15px 4px !important; }
  .detail-word { font-size: 12px !important; line-height: 16px !important; }
  .idea-cell { display: block !important; width: 100% !important; box-sizing: border-box !important; border-left: 0 !important; border-top: 1px solid #654a3e !important; padding: 22px 10px !important; }
  .formula-cell { display: block !important; width: 100% !important; box-sizing: border-box !important; border-right: 0 !important; border-bottom: 1px solid #d8c1b0 !important; padding: 20px 14px !important; }
  .formula-action { display: block !important; width: fit-content !important; margin: 8px auto 0 !important; }
  .brand-end-pad { padding: 30px 20px 27px !important; }
  .brand-end-link { font-size: 9px !important; letter-spacing: 0.7px !important; }
}
`;

const INLINE_CLASS_STYLES = {
  'email-shell': 'width: 100%; max-width: 600px; margin: 0 auto; table-layout: fixed;',
  fluid: 'display: block; width: 100%; max-width: 100%; height: auto;',
  headline: "font-family: Georgia, 'Times New Roman', serif; font-size: 34px; line-height: 40px; font-weight: 400; letter-spacing: -0.5px; color: #141414; margin: 0;",
  'section-title': "font-family: Georgia, 'Times New Roman', serif; font-size: 28px; line-height: 34px; font-weight: 400; letter-spacing: -0.35px; color: #141414; margin: 0;",
  'body-copy': "font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 24px; font-weight: 400; color: #45413d; margin: 0;",
  eyebrow: 'font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 2px; color: #9d4d07; margin: 0;',
  'code-text': 'font-family: Arial, Helvetica, sans-serif; font-size: 22px; line-height: 26px; font-weight: 800; letter-spacing: 3px; color: #141414;',
};

const INLINE_TAG_STYLES = {
  table: 'border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt;',
  img: 'border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;',
  a: 'color: #141414; text-decoration: none;',
  p: 'margin: 0;',
};

function mergeInlineStyle(tag, declarations) {
  const stylePattern = /\sstyle\s*=\s*(["'])(.*?)\1/is;
  if (stylePattern.test(tag)) {
    return tag.replace(stylePattern, (match, quote, current) => ` style=${quote}${declarations} ${current.trim()}${quote}`);
  }
  return tag.replace(/>$/, ` style="${declarations}">`);
}

function inlineClassStyles(markup) {
  return markup.replace(/<[a-z][^>]*>/gi, (tag) => {
    const classMatch = tag.match(/\bclass\s*=\s*(["'])(.*?)\1/is);
    if (!classMatch) return tag;
    const classes = classMatch[2].split(/\s+/).filter(Boolean);
    const declarations = classes
      .map((className) => INLINE_CLASS_STYLES[className])
      .filter(Boolean)
      .join(' ');
    return declarations ? mergeInlineStyle(tag, declarations) : tag;
  });
}

function inlineTagStyles(markup) {
  return markup.replace(/<([a-z][a-z0-9]*)\b[^>]*>/gi, (tag, tagName) => {
    const declarations = INLINE_TAG_STYLES[tagName.toLowerCase()];
    return declarations ? mergeInlineStyle(tag, declarations) : tag;
  });
}

function normalizeOmnisendFonts(markup) {
  return markup
    .replace(
      /font-family:\s*'Playfair Display',\s*Georgia,\s*'Times New Roman',\s*serif;/gi,
      "font-family: Georgia, 'Times New Roman', serif;",
    )
    .replace(
      /font-family:\s*Inter,\s*-apple-system,\s*BlinkMacSystemFont,\s*'Segoe UI',\s*Arial,\s*sans-serif;/gi,
      'font-family: Arial, Helvetica, sans-serif;',
    );
}

function buildOmnisendImport(markup) {
  let output = inlineClassStyles(markup)
    .replace(/<!-- AI HERO SLOT:[\s\S]*?-->/gi, '')
    .replace(/<!-- The legal footer is intentionally supplied by the native Omnisend wrapper\. -->/gi, '')
    .replace(/<div\b/gi, '<p')
    .replace(/<\/div>/gi, '</p>')
    .replace(/<h[1-6]\b/gi, '<p')
    .replace(/<\/h[1-6]>/gi, '</p>');
  output = normalizeOmnisendFonts(inlineTagStyles(output));
  output = output.replace(/[ \t]+$/gm, '');
  return `${output.trim()}\n<p style="display: none; margin: 0; font-size: 0; line-height: 0;"></p>\n`;
}

function asset(name, send) {
  return ASSETS[name][send ? 'remote' : 'local'];
}

function button(label, href, color = '#141414') {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td bgcolor="${color}" style="border-radius: 6px;">
          <a href="${href}" target="_blank" style="display: inline-block; padding: 14px 24px; color: #ffffff; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 13px; line-height: 16px; font-weight: 700; letter-spacing: 0.1px; border: 1px solid ${color}; border-radius: 6px;">${label}</a>
        </td>
      </tr>
    </table>`;
}

function offerBlock({
  eyebrow = 'JŪSŲ PASVEIKINIMO KODAS',
  headline = '10 % nuolaida su kodu',
  body = 'Įveskite kodą krepšelyje, kai rasite savąjį Bakli aksesuarą.',
  align = 'center',
  background = '#f2e5da',
  ctaLabel,
  ctaHref = URLS.home,
}) {
  const cta = ctaLabel
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="${align}"><tr><td style="padding-top: 21px;">${button(ctaLabel, ctaHref, '#9d4d07')}</td></tr></table>`
    : '';
  return `
    <tr class="section-offer">
      <td class="offer-pad" align="${align}" bgcolor="${background}" style="padding: 34px 36px;">
        <div class="eyebrow">${eyebrow}</div>
        <div style="padding-top: 9px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 25px; line-height: 31px; color: #141414;">${headline}</div>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="${align}" style="margin-top: 16px;">
          <tr>
            <td bgcolor="#ffffff" style="padding: 12px 18px; border: 1px dashed #9d4d07; border-radius: 5px;">
              <span class="code-text">HELLO10</span>
            </td>
          </tr>
        </table>
        <div class="body-copy" style="padding-top: 13px;">${body}</div>
        ${cta}
      </td>
    </tr>`;
}

function detailStrip(items) {
  return `
    <tr class="section-details">
      <td bgcolor="#efe0d4">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            ${items.map((item, index) => `
            <td class="detail-cell" width="${100 / items.length}%" align="center" style="padding: 18px 5px; border-right: ${index === items.length - 1 ? '0' : '1px solid #d8c1b0'};">
              <div class="detail-word" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; line-height: 16px; font-weight: 700; letter-spacing: 0.5px; color: #2f211b;">${item}</div>
            </td>`).join('')}
          </tr>
        </table>
      </td>
    </tr>`;
}

function imageLink({ src, href, width, height, alt, className = 'fluid' }) {
  return `<a href="${href}" target="_blank"><img class="${className}" src="${src}" width="${width}" height="${height}" alt="${alt}" style="display: block; width: 100%; max-width: ${width}px; height: auto;"></a>`;
}

function productCard({ src, href, alt, name, kicker, width = 250, height = 250 }) {
  return `
    <table role="presentation" class="product-card" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="border: 1px solid #eadfd5;">
      <tr>
        <td style="font-size: 0; line-height: 0;">${imageLink({ src, href, width, height, alt, className: 'fluid product-image' })}</td>
      </tr>
      <tr>
        <td style="padding: 18px 18px 20px;">
          <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 10px; line-height: 14px; font-weight: 700; letter-spacing: 1.25px; color: #9d4d07; text-transform: uppercase;">${kicker}</div>
          <div style="padding-top: 7px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 19px; line-height: 24px; color: #141414;">${name}</div>
          <div style="padding-top: 12px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; line-height: 16px; font-weight: 700; color: #141414;"><a href="${href}" target="_blank" style="border-bottom: 1px solid #9d4d07; padding-bottom: 2px;">Peržiūrėti</a></div>
        </td>
      </tr>
    </table>`;
}

function categoryCard({ src, href, alt, name, copy }) {
  return `
    <table role="presentation" class="category-card" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="border: 1px solid #eadfd5;">
      <tr><td style="font-size: 0; line-height: 0;">${imageLink({ src, href, width: 500, height: 375, alt, className: 'fluid category-image' })}</td></tr>
      <tr>
        <td style="padding: 17px 16px 20px;">
          <div style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 23px; color: #141414;">${name}</div>
          <div style="padding-top: 7px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 13px; line-height: 20px; color: #5a554f;">${copy}</div>
          <div style="padding-top: 12px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; line-height: 16px; font-weight: 700; color: #141414;"><a href="${href}" target="_blank" style="border-bottom: 1px solid #9d4d07; padding-bottom: 2px;">Atrasti</a></div>
        </td>
      </tr>
    </table>`;
}

function proofStrip(items) {
  return `
    <tr class="section-proof">
      <td bgcolor="#141414">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            ${items.map((item) => `
            <td class="proof-cell" width="33.33%" align="center" valign="top" style="padding: 20px 8px; color: #ffffff;">
              <div class="proof-number" style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 19px; line-height: 23px; white-space: nowrap;">${item.value}</div>
              <div class="proof-label" style="padding-top: 4px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; line-height: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #e9d9cc;">${item.label}</div>
            </td>`).join('')}
          </tr>
        </table>
      </td>
    </tr>`;
}

function shellStart(preheader, send) {
  return `
  ${send ? '' : `<div class="preheader" style="display: none; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; max-height: 0; max-width: 0; overflow: hidden; mso-hide: all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#eee8e0" style="width: 100%; table-layout: fixed;">
    <tr>
      <td class="outer-pad" align="center" style="padding: ${send ? '0' : '24px 12px 40px'};">
        <!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
        <table role="presentation" class="email-shell" width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="width: 100%; max-width: 600px; margin: 0 auto; border-top: 4px solid #9d4d07;">
          <tr class="brand-header">
            <td align="center" bgcolor="#ffffff" style="padding: 16px 24px 13px;">
              <a href="${URLS.home}" target="_blank" style="display: inline-block;">
                <img class="brand-logo" src="${asset('logo', send)}" width="140" height="62" alt="Bakli" style="display: block; width: 140px; max-width: 100%; height: auto; margin: 0 auto;">
              </a>
              <div class="brand-tagline" style="padding-top: 6px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; line-height: 13px; font-weight: 700; letter-spacing: 2.1px; color: #9d4d07; text-transform: uppercase;">Personalizuoti aksesuarai su istorija</div>
            </td>
          </tr>
          <tr class="brand-nav">
            <td bgcolor="#2f211b" style="border-bottom: 3px solid #9d4d07;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="nav-cell" width="33.33%" align="center" style="padding: 13px 4px; border-right: 1px solid #5d4439;">
                    <a class="nav-link" href="${URLS.wallets}" target="_blank" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; line-height: 13px; font-weight: 700; letter-spacing: 1.25px; color: #f4e9df; text-transform: uppercase;">Piniginės</a>
                  </td>
                  <td class="nav-cell" width="33.33%" align="center" style="padding: 13px 4px; border-right: 1px solid #5d4439;">
                    <a class="nav-link" href="${URLS.personalize}" target="_blank" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; line-height: 13px; font-weight: 700; letter-spacing: 1.25px; color: #f4e9df; text-transform: uppercase;">Sukurkite</a>
                  </td>
                  <td class="nav-cell" width="33.33%" align="center" style="padding: 13px 4px;">
                    <a class="nav-link" href="${URLS.gifts}" target="_blank" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; line-height: 13px; font-weight: 700; letter-spacing: 1.25px; color: #f4e9df; text-transform: uppercase;">Dovanos</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function brandEnd() {
  return `
          <tr class="section-brand-end">
            <td class="brand-end-pad" align="center" bgcolor="#2f211b" style="padding: 34px 28px 30px; border-top: 3px solid #9d4d07; color: #f7efe8;">
              <div class="eyebrow" style="color: #d6a37c;">LIKIME RYŠYJE</div>
              <div style="padding-top: 9px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 23px; line-height: 29px; color: #ffffff;">Personalizuoti aksesuarai su istorija</div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 23px; border-top: 1px solid #5d4439; border-bottom: 1px solid #5d4439;">
                <tr>
                  <td width="33.33%" align="center" style="padding: 13px 3px; border-right: 1px solid #5d4439;">
                    <a class="brand-end-link" href="${URLS.wallets}" target="_blank" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; line-height: 13px; font-weight: 700; letter-spacing: 1px; color: #f7efe8; text-transform: uppercase;">Piniginės</a>
                  </td>
                  <td width="33.33%" align="center" style="padding: 13px 3px; border-right: 1px solid #5d4439;">
                    <a class="brand-end-link" href="${URLS.personalize}" target="_blank" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; line-height: 13px; font-weight: 700; letter-spacing: 1px; color: #f7efe8; text-transform: uppercase;">Sukurkite</a>
                  </td>
                  <td width="33.33%" align="center" style="padding: 13px 3px;">
                    <a class="brand-end-link" href="${URLS.gifts}" target="_blank" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; line-height: 13px; font-weight: 700; letter-spacing: 1px; color: #f7efe8; text-transform: uppercase;">Dovanos</a>
                  </td>
                </tr>
              </table>
              <div style="padding-top: 19px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; line-height: 19px; color: #cbb9ab;">Turite klausimų? <a href="mailto:info@bakli.lt" style="color: #ffffff; border-bottom: 1px solid #9d4d07;">info@bakli.lt</a></div>
              <div style="padding-top: 12px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 10px; line-height: 17px; font-weight: 700; letter-spacing: 0.6px; color: #d6a37c; text-transform: uppercase;">
                <a href="https://www.instagram.com/thebakli" target="_blank" style="color: #d6a37c;">Instagram</a>&nbsp;&nbsp;·&nbsp;&nbsp;
                <a href="https://www.facebook.com/BakliLT" target="_blank" style="color: #d6a37c;">Facebook</a>&nbsp;&nbsp;·&nbsp;&nbsp;
                <a href="${URLS.home}" target="_blank" style="color: #d6a37c;">bakli.lt</a>
              </div>
            </td>
          </tr>`;
}

function shellEnd() {
  return `
          ${brandEnd()}
          <tr><td bgcolor="#ffffff" style="height: 3px; font-size: 0; line-height: 0; border-bottom: 3px solid #9d4d07;">&nbsp;</td></tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
  <!-- The legal footer is intentionally supplied by the native Omnisend wrapper. -->`;
}

function e1Markup(send, preheader) {
  const products = [
    { src: asset('jacob', send), href: URLS.jacob, alt: 'Žalia rankų darbo odinė piniginė Jacob Crazy Horse', name: 'Odinė piniginė Jacob Crazy Horse', kicker: 'Perkamiausia' },
    { src: asset('grant', send), href: URLS.grant, alt: 'Ruda rankų darbo odinė piniginė Grant Crazy Horse 3in1', name: 'Odinė piniginė Grant Crazy Horse 3in1', kicker: 'Naujiena' },
    { src: asset('karter', send), href: URLS.karter, alt: 'Juodas odinis diržas Karter su graviruojama sagtimi', name: 'Vyriškas diržas Karter su Vyčiu', kicker: 'Graviruojamas' },
    { src: asset('pinkSet', send), href: URLS.pinkSet, alt: 'Spalvingas personalizuojamas antkaklio rinkinys šunims Pink', name: 'Antkaklio rinkinys šunims „Pink“ MAXI', kicker: 'Su vardu' },
  ];

  return `${shellStart(preheader, send)}
          ${send ? '<!-- AI HERO SLOT: upload assets/generated/welcome-wallets-v1.jpg to Omnisend, then replace the fallback image URL below before launch. -->' : ''}
          <tr class="section-e1-hero">
            <td bgcolor="#f3eee8" style="font-size: 0; line-height: 0;">${imageLink({ src: asset('welcomeHero', send), href: URLS.wallets, width: 600, height: 450, alt: 'Dvi Bakli odinės piniginės šviesioje produktų fotosesijoje', className: 'fluid hero-image' })}</td>
          </tr>
          <tr>
            <td class="hero-pad" align="center" bgcolor="#faf7f2" style="padding: 46px 44px 38px;">
              <div class="eyebrow">SVEIKI ATVYKĘ Į BAKLI</div>
              <h1 class="headline" style="padding-top: 12px;">Kasdieniai daiktai, tapę asmeniški</h1>
              <div class="body-copy" style="max-width: 500px; margin: 0 auto; padding-top: 17px;">Kuriame kokybiškus, personalizuojamus aksesuarus sau ir brangiam žmogui. Odos gaminiams renkamės kruopščiai atrinktą natūralią odą, o Jūs pasirenkate spalvą ir asmeninę detalę.</div>
            </td>
          </tr>
          ${offerBlock({
            headline: '10 % nuolaida su kodu',
            ctaLabel: 'Atrasti kolekciją',
            ctaHref: URLS.home,
          })}
          <tr class="section-products">
            <td class="section-pad" bgcolor="#ffffff" style="padding: 46px 34px 18px;">
              <div class="eyebrow">KLIENTŲ PAMĖGTI</div>
              <h2 class="section-title" style="padding-top: 10px;">Daiktai, kuriuos norisi naudoti kasdien</h2>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="padding: 0 24px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr class="product-row">
                  <td class="mobile-stack card-pad product-cell" width="50%" valign="top" style="width: 50%; padding: 0 8px 16px 0;">${productCard(products[0])}</td>
                  <td class="mobile-stack card-pad product-cell" width="50%" valign="top" style="width: 50%; padding: 0 0 16px 8px;">${productCard(products[1])}</td>
                </tr>
                <tr class="product-row">
                  <td class="mobile-stack card-pad product-cell" width="50%" valign="top" style="width: 50%; padding: 0 8px 16px 0;">${productCard(products[2])}</td>
                  <td class="mobile-stack card-pad product-cell" width="50%" valign="top" style="width: 50%; padding: 0 0 16px 8px;">${productCard(products[3])}</td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="padding-top: 4px;">${button('Žiūrėti populiariausius', URLS.popular, '#9d4d07')}</td></tr></table>
            </td>
          </tr>
          ${proofStrip([
            { value: '50&nbsp;000+', label: 'klientų' },
            { value: 'Rankomis', label: 'pagaminta' },
            { value: 'Jums', label: 'Jūsų detalė' },
          ])}
          <tr class="section-final">
            <td class="section-pad" align="center" bgcolor="#faf7f2" style="padding: 42px 34px 46px;">
              <div class="eyebrow">JŪSŲ ISTORIJA</div>
              <h2 class="section-title" style="padding-top: 10px;">Išsirinkite detalę, kuri kalbės už Jus</h2>
              <div class="body-copy" style="max-width: 450px; margin: 0 auto; padding-top: 12px;">Prasmingi žodžiai, inicialai ar data kasdienį aksesuarą paverčia tikrai Jūsų.</div>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center"><tr><td style="padding-top: 23px;">${button('Atraskite Bakli', URLS.home)}</td></tr></table>
            </td>
          </tr>
          ${shellEnd()}`;
}

function e2Markup(send, preheader) {
  const steps = [
    { src: asset('step1', send), alt: 'Gaminio pasirinkimo simbolis', number: '01', title: 'Išsirinkite gaminį' },
    { src: asset('step2', send), alt: 'Spalvų pasirinkimo simbolis', number: '02', title: 'Pasirinkite odos spalvą' },
    { src: asset('step3', send), alt: 'Personalizavimo vietos simbolis', number: '03', title: 'Pridėkite personalizavimą' },
    { src: asset('step4', send), alt: 'Dovanos simbolis', number: '04', title: 'Džiaukitės unikaliu gaminiu' },
  ];
  const products = [
    { src: asset('jacob', send), href: URLS.jacob, alt: 'Žalia odinė piniginė Jacob Crazy Horse', name: 'Odinė piniginė Jacob Crazy Horse', kicker: 'Perkamiausia' },
    { src: asset('grant', send), href: URLS.grant, alt: 'Ruda odinė piniginė Grant Crazy Horse 3in1', name: 'Odinė piniginė Grant Crazy Horse 3in1', kicker: 'Naujiena' },
    { src: asset('karter', send), href: URLS.karter, alt: 'Juodas diržas Karter su Vyčio graviūra', name: 'Vyriškas diržas Karter su Vyčiu', kicker: 'Su Vyčiu' },
    { src: asset('pinkSet', send), href: URLS.pinkSet, alt: 'Personalizuojamas antkaklio rinkinys šunims Pink MAXI', name: 'Antkaklio rinkinys šunims „Pink“ MAXI', kicker: 'Su vardu' },
  ];
  const heroCopy = `
                    <div class="eyebrow" style="color: #d6a37c;">JŪSŲ ISTORIJA</div>
                    <h1 class="headline" style="padding-top: 11px; color: #ffffff;">Maža detalė. Asmeniška prasmė.</h1>
                    <div class="body-copy" style="padding-top: 15px; color: #eadfd6;">Vardas, data ar keli prasmingi žodžiai kasdienį daiktą gali paversti tikrai Jūsų.</div>`;
  const heroImage = imageLink({
    src: asset('personalizationHero', send),
    href: URLS.keychains,
    width: 600,
    height: 450,
    alt: 'Personalizuotas Bakli raktų pakabukas amatininko darbo aplinkoje',
    className: 'fluid hero-image',
  });
  const heroRows = send
    ? `<tr><td width="100%" valign="middle" bgcolor="#2f211b" style="width: 100%; padding: 40px 34px 38px;">${heroCopy}</td></tr>
                <tr><td width="100%" valign="middle" bgcolor="#6f422d" style="width: 100%; font-size: 0; line-height: 0;">${heroImage}</td></tr>`
    : `<tr>
                  <td class="mobile-stack split-copy" width="44%" valign="middle" bgcolor="#2f211b" style="width: 44%; padding: 40px 28px 38px 34px;">${heroCopy}</td>
                  <td class="mobile-stack" width="56%" valign="middle" bgcolor="#6f422d" style="width: 56%; font-size: 0; line-height: 0;">${heroImage}</td>
                </tr>`;
  const specimenMark = `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr><td align="center" style="padding: 20px 24px; border: 1px solid #9d4d07; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 38px; line-height: 42px; color: #2f211b;">A · K</td></tr>
                    </table>
                    <div style="padding-top: 13px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; line-height: 14px; font-weight: 700; letter-spacing: 1.3px; color: #9d4d07;">VARDAS · DATA · ŽINUTĖ</div>`;
  const specimenCopy = `
                    <div class="eyebrow" style="color: #d6a37c;">KĄ UŽRAŠYTUMĖTE JŪS?</div>
                    <h2 class="section-title" style="padding-top: 10px; color: #ffffff;">Maža detalė, kuri kasdien primena</h2>
                    <div class="body-copy" style="padding-top: 13px; color: #eadfd6;">Inicialai, svarbi data ar trumpa žinutė daiktą susieja su žmogumi ir prisiminimu.</div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding-top: 22px;">${button('Sukurti savo aksesuarą', URLS.personalize, '#9d4d07')}</td></tr></table>`;
  const specimenRows = send
    ? `<tr><td width="100%" align="center" valign="middle" bgcolor="#efe0d4" style="width: 100%; padding: 38px 24px;">${specimenMark}</td></tr>
                <tr><td width="100%" valign="middle" bgcolor="#2f211b" style="width: 100%; padding: 43px 38px 42px;">${specimenCopy}</td></tr>`
    : `<tr>
                  <td class="mobile-stack" width="42%" align="center" valign="middle" bgcolor="#efe0d4" style="width: 42%; padding: 38px 24px;">${specimenMark}</td>
                  <td class="mobile-stack split-copy" width="58%" valign="middle" bgcolor="#2f211b" style="width: 58%; padding: 43px 38px 42px;">${specimenCopy}</td>
                </tr>`;

  return `${shellStart(preheader, send)}
          ${send ? '<!-- AI HERO SLOT: upload assets/generated/personalization-keychain-v1.jpg to Omnisend, then replace the fallback image URL below before launch. -->' : ''}
          <tr class="section-e2-hero">
            <td bgcolor="#ffffff">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${heroRows}
              </table>
            </td>
          </tr>
          ${detailStrip(['Vardas', 'Data', 'Žinutė', 'Jūsų idėja'])}
          <tr class="section-steps">
            <td class="section-pad" bgcolor="#faf7f2" style="padding: 44px 28px 24px;">
              <div class="eyebrow" style="text-align: center;">KAIP TAI VEIKIA</div>
              <h2 class="section-title" style="padding-top: 10px; text-align: center;">Nuo pasirinkimo iki daikto su istorija</h2>
            </td>
          </tr>
          <tr>
            <td bgcolor="#faf7f2" style="padding: 0 24px 34px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${[steps.slice(0, 2), steps.slice(2, 4)].map((row) => `<tr class="step-row">${row.map((step) => `
                  <td class="step-cell" width="50%" align="center" valign="top" style="width: 50%; padding: 12px 8px 18px;">
                    <img src="${step.src}" width="92" height="${step.number === '01' ? '84' : '92'}" alt="${step.alt}" style="display: block; width: 92px; height: ${step.number === '01' ? '84px' : '92px'}; margin: 0 auto;">
                    <div style="padding-top: 10px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 10px; line-height: 14px; font-weight: 700; letter-spacing: 1.5px; color: #9d4d07;">${step.number}</div>
                    <div style="padding-top: 4px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 22px; color: #141414;">${step.title}</div>
                  </td>`).join('')}</tr>`).join('')}
              </table>
            </td>
          </tr>
          <tr class="section-products">
            <td class="section-pad" bgcolor="#ffffff" style="padding: 46px 28px 18px;">
              <div class="eyebrow">MŪSŲ KLIENTŲ MĖGSTAMIAUSI</div>
              <h2 class="section-title" style="padding-top: 10px;">Keturi daiktai Jūsų idėjai</h2>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="padding: 0 24px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr class="product-row">
                  <td class="mobile-stack card-pad product-cell" width="50%" valign="top" style="width: 50%; padding: 0 8px 16px 0;">${productCard(products[0])}</td>
                  <td class="mobile-stack card-pad product-cell" width="50%" valign="top" style="width: 50%; padding: 0 0 16px 8px;">${productCard(products[1])}</td>
                </tr>
                <tr class="product-row">
                  <td class="mobile-stack card-pad product-cell" width="50%" valign="top" style="width: 50%; padding: 0 8px 16px 0;">${productCard(products[2])}</td>
                  <td class="mobile-stack card-pad product-cell" width="50%" valign="top" style="width: 50%; padding: 0 0 16px 8px;">${productCard(products[3])}</td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center"><tr><td style="padding-top: 4px;">${button('Žiūrėti klientų mėgstamiausius', URLS.popular, '#9d4d07')}</td></tr></table>
            </td>
          </tr>
          <tr class="section-category-links">
            <td bgcolor="#faf7f2" style="padding: 25px 22px;">
              <div class="eyebrow" style="text-align: center;">RINKITĖS PAGAL GAMINĮ</div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 15px;">
                <tr>
                  <td width="33.33%" align="center" style="padding: 10px 5px; border-right: 1px solid #e1d4c9;"><a href="${URLS.wallets}" target="_blank" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; border-bottom: 1px solid #9d4d07;">Piniginės</a></td>
                  <td width="33.33%" align="center" style="padding: 10px 5px; border-right: 1px solid #e1d4c9;"><a href="${URLS.keychains}" target="_blank" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; border-bottom: 1px solid #9d4d07;">Pakabukai</a></td>
                  <td width="33.33%" align="center" style="padding: 10px 5px;"><a href="${URLS.pets}" target="_blank" style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; border-bottom: 1px solid #9d4d07;">Augintiniams</a></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="section-personalization-specimen">
            <td bgcolor="#efe0d4">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${specimenRows}
              </table>
            </td>
          </tr>
          ${offerBlock({
            headline: '10 % nuolaida Jūsų pasirinkimui',
            body: 'Įveskite kodą krepšelyje.',
            background: '#efe0d4',
          })}
          ${shellEnd()}`;
}

function e3Markup(send, preheader) {
  const gifts = [
    { src: asset('giftSofia', send), href: URLS.giftSofia, alt: 'Sofia piniginės, Vanessa Mini kosmetinės ir telefono dėklo rinkinys', name: 'Sofia ir Vanessa dovanų rinkinys', kicker: 'Rinkinys jai' },
    { src: asset('giftEvan', send), href: URLS.giftEvan, alt: 'Evan piniginės ir Walter kosmetinės rinkinys', name: 'Evan ir Walter dovanų rinkinys', kicker: 'Rinkinys jam' },
    { src: asset('giftJacob', send), href: URLS.giftJacob, alt: 'Jacob Crazy Horse piniginės ir odinio automobilio kvapo rinkinys', name: 'Jacob ir automobilio kvapo rinkinys', kicker: 'Kasdienai' },
    { src: asset('pinkSet', send), href: URLS.pinkSet, alt: 'Personalizuojamas antkaklio rinkinys šunims Pink MAXI', name: 'Antkaklio rinkinys šunims „Pink“ MAXI', kicker: 'Dovana augintiniui' },
  ];

  return `${shellStart(preheader, send)}
          ${send ? '<!-- AI HERO SLOT: upload assets/generated/gifting-set-v1.jpg to Omnisend, then replace the fallback image URL below before launch. -->' : ''}
          <tr class="section-e3-hero">
            <td bgcolor="#4a3028" style="font-size: 0; line-height: 0;">${imageLink({ src: asset('giftingHero', send), href: URLS.giftSets, width: 600, height: 600, alt: 'Bakli piniginė ir Scott pakabukas su išgraviruota asmenine žinute', className: 'fluid hero-image' })}</td>
          </tr>
          <tr>
            <td class="hero-pad" align="center" bgcolor="#2f211b" style="padding: 44px 42px 40px; color: #ffffff;">
              <div class="eyebrow" style="color: #d6a37c;">PRASMINGA DOVANA</div>
              <h1 class="headline" style="padding-top: 11px; color: #ffffff;">Jūsų žinutė tampa dovanos dalimi</h1>
              <div class="body-copy" style="max-width: 480px; margin: 0 auto; padding-top: 15px; color: #eadfd6;">Vardas, svarbi data ar keli žodžiai dovanai suteikia visai kitą prasmę. Išsirinkite personalizuojamą aksesuarą ar derantį rinkinį.</div>
            </td>
          </tr>
          <tr class="section-gift-paths">
            <td bgcolor="#efe0d4" style="padding: 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="mobile-stack" width="33.33%" align="center" valign="top" style="width: 33.33%; padding: 25px 14px; border-right: 1px solid #d8c1b0;">
                    <div class="eyebrow" style="font-size: 9px; letter-spacing: 1.3px;">PAGAL ŽMOGŲ</div>
                    <div style="padding-top: 8px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 23px;"><a href="${URLS.gifts}" target="_blank">Rasti artimiausią</a></div>
                  </td>
                  <td class="mobile-stack" width="33.33%" align="center" valign="top" style="width: 33.33%; padding: 25px 14px; border-right: 1px solid #d8c1b0;">
                    <div class="eyebrow" style="font-size: 9px; letter-spacing: 1.3px;">PAGAL PROGĄ</div>
                    <div style="padding-top: 8px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 23px;"><a href="${URLS.gifts}" target="_blank">Atrasti idėjas</a></div>
                  </td>
                  <td class="mobile-stack" width="33.33%" align="center" valign="top" style="width: 33.33%; padding: 25px 14px;">
                    <div class="eyebrow" style="font-size: 9px; letter-spacing: 1.3px;">PAGAL RINKINĮ</div>
                    <div style="padding-top: 8px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 23px;"><a href="${URLS.giftSets}" target="_blank">Derinti lengviau</a></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="section-gifts">
            <td class="section-pad" bgcolor="#ffffff" style="padding: 46px 28px 18px;">
              <div class="eyebrow">IŠRINKITE LENGVIAU</div>
              <h2 class="section-title" style="padding-top: 10px;">Daugiau asmeniškų dovanų idėjų</h2>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="padding: 0 20px 34px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${[gifts.slice(0, 2), gifts.slice(2, 4)].map((row) => `<tr class="gift-row">
                  <td class="mobile-stack card-pad gift-cell" width="50%" valign="top" style="width: 50%; padding: 0 8px 16px 0;">${productCard({ ...row[0], width: 272, height: 272 })}</td>
                  <td class="mobile-stack card-pad gift-cell" width="50%" valign="top" style="width: 50%; padding: 0 0 16px 8px;">${productCard({ ...row[1], width: 272, height: 272 })}</td>
                </tr>`).join('')}
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center"><tr><td style="padding-top: 4px;">${button('Peržiūrėti rinkinius', URLS.giftSets, '#9d4d07')}</td></tr></table>
            </td>
          </tr>
          <tr class="section-gift-formula">
            <td bgcolor="#faf7f2" style="padding: 42px 24px 34px;">
              <div class="eyebrow" style="text-align: center;">DOVANOS FORMULĖ</div>
              <h2 class="section-title" style="padding-top: 10px; text-align: center;">Trys žingsniai iki dovanos su istorija</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#efe0d4" style="margin-top: 25px; border: 1px solid #d8c1b0;">
                <tr>
                  <td class="formula-cell" width="33.33%" align="center" valign="top" style="width: 33.33%; padding: 24px 12px; border-right: 1px solid #d8c1b0;">
                    <div style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 25px; line-height: 29px; color: #9d4d07;">01</div>
                    <div style="padding-top: 8px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; line-height: 18px; font-weight: 700; color: #2f211b;">Išrinkite aksesuarą</div>
                  </td>
                  <td class="formula-cell" width="33.33%" align="center" valign="top" style="width: 33.33%; padding: 24px 12px; border-right: 1px solid #d8c1b0;">
                    <div style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 25px; line-height: 29px; color: #9d4d07;">02</div>
                    <div style="padding-top: 8px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; line-height: 18px; font-weight: 700; color: #2f211b;">Pridėkite vardą, datą ar žinutę</div>
                  </td>
                  <td class="formula-cell" width="33.33%" align="center" valign="top" style="width: 33.33%; padding: 24px 12px;">
                    <div style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 25px; line-height: 29px; color: #9d4d07;">03</div>
                    <div style="padding-top: 8px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; line-height: 18px; font-weight: 700; color: #2f211b;">Pasirinkite dovanų pakavimą</div>
                  </td>
                </tr>
              </table>
              <div align="center" style="padding-top: 22px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 13px; line-height: 22px; font-weight: 700;">
                <a class="formula-action" href="${URLS.gifts}" target="_blank" style="display: inline-block; border-bottom: 1px solid #9d4d07;">Dovanos pagal progą</a>&nbsp;&nbsp;&nbsp;
                <a class="formula-action" href="${URLS.personalize}" target="_blank" style="display: inline-block; border-bottom: 1px solid #9d4d07;">Personalizuotos dovanos</a>
              </div>
            </td>
          </tr>
          ${proofStrip([
            { value: 'Nuo 60 €', label: 'nemokamas pristatymas' },
            { value: '6,95 €', label: 'dovanų pakavimas' },
            { value: '50&nbsp;000+', label: 'klientų' },
          ])}
          ${offerBlock({
            eyebrow: 'KODAS JŪSŲ DOVANAI',
            headline: '10 % nuolaida su kodu',
            body: 'Išsirinkite personalizuojamą aksesuarą ar dovanų rinkinį ir įveskite kodą krepšelyje.',
            background: '#f2e5da',
            ctaLabel: 'Rasti dovaną',
            ctaHref: URLS.gifts,
          })}
          ${shellEnd()}`;
}

const EMAILS = [
  {
    dir: '01-pasveikinimas',
    label: 'E1 - Pasveikinimas',
    timing: 'Iškart po prenumeratos',
    subjectA: 'Sveiki atvykę į Bakli: 10 % nuolaida Jums',
    subjectB: 'Jūsų Bakli istorijai: 10 % su HELLO10',
    preheader: 'Pritaikykite kodą HELLO10 ir atraskite personalizuojamus aksesuarus.',
    markup: e1Markup,
    plain: `SUKURTA JUMS\n\nKasdieniai daiktai, tapę asmeniški\n\nSveiki atvykę į Bakli.\n\nKuriame kokybiškus, personalizuojamus aksesuarus sau ir brangiam žmogui. Odos gaminiams renkamės kruopščiai atrinktą natūralią odą, o Jūs pasirenkate gaminį, spalvą ir asmeninę detalę.\n\nAtraskite kolekciją:\n${URLS.home}\n\nKLIENTŲ PAMĖGTI\n\nOdinė piniginė Jacob Crazy Horse\n${URLS.jacob}\n\nOdinė piniginė Grant Crazy Horse 3in1\n${URLS.grant}\n\nVyriškas diržas Karter su Vyčiu\n${URLS.karter}\n\nAntkaklio rinkinys šunims „Pink“ MAXI\n${URLS.pinkSet}\n\nŽiūrėti populiariausius:\n${URLS.popular}\n\n50 000+ klientų | Pagaminta rankomis | Personalizuojama Jums\n\nAtraskite Bakli:\n${URLS.home}`,
  },
  {
    dir: '02-personalizavimas',
    label: 'E2 - Personalizavimo galia',
    timing: '+2 dienos, jei nepirko',
    subjectA: 'Sukurta Jums, iki mažiausios detalės',
    subjectB: 'Kaip Bakli aksesuaras tampa asmeniškas',
    preheader: 'Išsirinkite asmeninę detalę, o su kodu HELLO10 pritaikykite 10 % nuolaidą.',
    markup: e2Markup,
    plain: `JŪSŲ ISTORIJA\n\nMaža detalė. Asmeniška prasmė.\n\nVardas, inicialai, svarbi data ar keli prasmingi žodžiai kasdienį daiktą gali paversti tikrai Jūsų. O jei turite savitą graviravimo idėją, ją galite aprašyti ir pridėti pavyzdį.\n\nKAIP TAI VEIKIA\n\n1. Išsirinkite gaminį\n2. Pasirinkite odos spalvą\n3. Pridėkite personalizavimą\n4. Džiaukitės unikaliu gaminiu\n\nKĄ GALITE PERSONALIZUOTI\n\nPiniginės ir dėklai:\n${URLS.wallets}\n\nRaktų pakabukai:\n${URLS.keychains}\n\nAksesuarai augintiniams:\n${URLS.pets}\n\nPrasminga sau. Įsimintina dovanoti.\n\nPersonalizavimas susieja daiktą su žmogumi, proga ar prisiminimu. Todėl jis tampa daugiau nei praktišku aksesuaru.\n\nSukurkite savo aksesuarą:\n${URLS.personalize}\n\nVardas ar inicialai | Data ar žinutė | Jūsų graviravimo idėja`,
  },
  {
    dir: '03-dovanos',
    label: 'E3 - Dovanos kampas',
    timing: '+3-4 dienos, jei nepirko',
    subjectA: 'Dovana, kuri pasako daugiau',
    subjectB: 'Asmeniškai dovanai: 10 % su HELLO10',
    preheader: 'Personalizuotos dovanų idėjos ir 10 % nuolaida su kodu HELLO10.',
    markup: e3Markup,
    plain: `PRASMINGA DOVANA\n\nJūsų žinutė tampa dovanos dalimi\n\nVardas, svarbi data ar keli žodžiai gali dovanai suteikti visai kitą prasmę. Išsirinkite personalizuojamą aksesuarą ar dovanų rinkinį.\n\nRaskite dovaną:\n${URLS.gifts}\n\nIŠRINKITE LENGVIAU\n\nPiniginės Sofia, kosmetinės Vanessa Mini ir telefono dėklo rinkinys\n${URLS.giftSofia}\n\nPiniginės Evan ir kosmetinės Walter rinkinys\n${URLS.giftEvan}\n\nPiniginės Jacob Crazy Horse ir odinio automobilio kvapo rinkinys\n${URLS.giftJacob}\n\nPeržiūrėti visus rinkinius:\n${URLS.giftSets}\n\nDovanos pagal progą:\n${URLS.gifts}\n\nPersonalizuotos dovanos:\n${URLS.personalize}\n\nNemokamas pristatymas nuo 60 € | Dovanų pakavimas 6,95 € | 50 000+ klientų\n\nAtraskite dovanų idėjas:\n${URLS.gifts}`,
  },
];

function fullDocument(email) {
  return `<!doctype html>
<html lang="lt" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
  <title>${email.subjectA} | Bakli</title>
  <!-- Tema A: ${email.subjectA} -->
  <!-- Tema B: ${email.subjectB} -->
  <!-- Preheader: ${email.preheader} -->
  <style>${COMMON_STYLES}</style>
  <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, sans-serif !important; } .email-shell { width: 600px !important; }</style><![endif]-->
</head>
<body>
${email.markup(false, email.preheader)}
</body>
</html>
`;
}

function plainDocument(email) {
  const copy = email.dir === '01-pasveikinimas'
    ? email.plain.replace(/^SUKURTA JUMS/, 'SVEIKI ATVYKĘ Į BAKLI')
    : email.plain;
  const offerCopy = {
    '01-pasveikinimas': 'JŪSŲ PASVEIKINIMO KODAS\n\n10 % nuolaida su kodu HELLO10\nĮveskite kodą krepšelyje, kai rasite savąjį Bakli aksesuarą.',
    '02-personalizavimas': 'JŪSŲ PASVEIKINIMO KODAS\n\nHELLO10 · 10 % nuolaida\nĮveskite kodą krepšelyje.',
    '03-dovanos': 'KODAS JŪSŲ DOVANAI\n\n10 % nuolaida su kodu HELLO10\nIšsirinkite personalizuojamą aksesuarą ar dovanų rinkinį ir įveskite kodą krepšelyje.',
  }[email.dir];
  const supplementalCopy = {
    '01-pasveikinimas': '',
    '02-personalizavimas': `MŪSŲ KLIENTŲ MĖGSTAMIAUSI

Odinė piniginė Jacob Crazy Horse
${URLS.jacob}

Odinė piniginė Grant Crazy Horse 3in1
${URLS.grant}

Vyriškas diržas Karter su Vyčiu
${URLS.karter}

Antkaklio rinkinys šunims „Pink“ MAXI
${URLS.pinkSet}

KĄ UŽRAŠYTUMĖTE JŪS?

A · K | Vardas · Data · Žinutė
Maža detalė, kuri kasdien primena.`,
    '03-dovanos': `DAUGIAU ASMENIŠKŲ DOVANŲ IDĖJŲ

Antkaklio rinkinys šunims „Pink“ MAXI
${URLS.pinkSet}

DOVANOS FORMULĖ

1. Išrinkite aksesuarą
2. Pridėkite vardą, datą ar žinutę
3. Pasirinkite dovanų pakavimą`,
  }[email.dir];
  const brandEndCopy = `LIKIME RYŠYJE

Personalizuoti aksesuarai su istorija

Piniginės: ${URLS.wallets}
Sukurkite: ${URLS.personalize}
Dovanos: ${URLS.gifts}
Instagram: https://www.instagram.com/thebakli
Facebook: https://www.facebook.com/BakliLT
Klausimai: info@bakli.lt
Bakli: ${URLS.home}`;
  return `BAKLI WELCOME FLOW\n${email.label}\nSiuntimas: ${email.timing}\n\nTema A: ${email.subjectA}\nTema B: ${email.subjectB}\nPreheader: ${email.preheader}\n\n${copy}${supplementalCopy ? `\n\n${supplementalCopy}` : ''}\n\n${offerCopy}\n\n${brandEndCopy}\n`;
}

function build() {
  fs.mkdirSync(OMNISEND_UPLOAD_ROOT, { recursive: true });
  for (const email of EMAILS) {
    const dir = path.join(ROOT, 'emails', email.dir);
    fs.mkdirSync(dir, { recursive: true });
    const previewHtml = fullDocument(email).replace(/[ \t]+$/gm, '');
    const omnisendHtml = buildOmnisendImport(email.markup(true, email.preheader));
    fs.writeFileSync(path.join(dir, 'preview-local.html'), previewHtml, 'utf8');
    fs.writeFileSync(path.join(dir, 'newsletter.html'), omnisendHtml, 'utf8');
    fs.writeFileSync(path.join(dir, 'newsletter.txt'), plainDocument(email), 'utf8');
    fs.writeFileSync(path.join(dir, 'omnisend-body.html'), omnisendHtml, 'utf8');
    fs.writeFileSync(path.join(dir, 'OMNISEND-IKELTI.html'), omnisendHtml, 'utf8');
    fs.writeFileSync(path.join(OMNISEND_UPLOAD_ROOT, `${email.dir}.html`), omnisendHtml, 'utf8');
    const legacyStyles = path.join(dir, 'omnisend-styles.css');
    if (fs.existsSync(legacyStyles)) fs.unlinkSync(legacyStyles);
  }
  process.stdout.write(`Built ${EMAILS.length} Bakli welcome emails and single-file Omnisend imports.\n`);
}

build();
