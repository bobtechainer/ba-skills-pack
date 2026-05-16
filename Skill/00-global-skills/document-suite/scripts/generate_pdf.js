#!/usr/bin/env node

/**
 * generate_pdf.js — Convert markdown to PDF via Playwright
 *
 * Usage: node generate_pdf.js input.md output.pdf
 *
 * Dependencies: npm install playwright
 */

const fs = require('fs');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node generate_pdf.js input.md output.pdf');
    process.exit(1);
  }

  const inputPath = path.resolve(args[0]);
  const outputPath = path.resolve(args[1]);

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  let browser;
  try {
    const { chromium } = require('playwright');
    browser = await chromium.launch();
    const page = await browser.newPage();

    const md = fs.readFileSync(inputPath, 'utf-8');
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 40px; color: #1a1a1a; line-height: 1.6; }
    h1 { color: #1A1A2E; border-bottom: 2px solid #1A1A2E; padding-bottom: 8px; }
    h2 { color: #16213E; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
    h3 { color: #16213E; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th { background: #1A1A2E; color: white; padding: 8px 12px; text-align: left; }
    td { border: 1px solid #ddd; padding: 8px 12px; }
    tr:nth-child(even) { background: #f9f9f9; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 10pt; }
    pre { background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto; }
    hr { border: none; border-top: 2px solid #1A1A2E; margin: 24px 0; }
    blockquote { border-left: 3px solid #E94560; padding-left: 16px; color: #555; }
  </style>
</head>
<body>
  <pre>${escapeHtml(md)}</pre>
</body>
</html>`;

    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.pdf({ path: outputPath, format: 'Letter', margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' } });
    console.log(`Generated: ${outputPath}`);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.error('Playwright not installed. Run: npm install playwright');
      process.exit(1);
    }
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

main().catch(err => { console.error(err); process.exit(1); });
