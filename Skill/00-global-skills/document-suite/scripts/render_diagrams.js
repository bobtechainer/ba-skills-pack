#!/usr/bin/env node
/**
 * Render all Mermaid .mmd source files to .png in a docs/ tree.
 *
 * Walks the folder, finds every *.mmd, and runs mermaid-cli (mmdc) to produce
 * a sibling *.png. Skips if .png is newer than .mmd (caching).
 *
 * Usage:
 *   node render_diagrams.js <docs-folder>
 *   node render_diagrams.js <docs-folder> --force
 *
 * Requires @mermaid-js/mermaid-cli installed (devDependency of this skill).
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SKILL_ROOT = path.resolve(__dirname, '..');
const MMDC_BIN = path.join(SKILL_ROOT, 'node_modules', '.bin', 'mmdc');

function walkMmd(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMmd(full));
    else if (entry.name.endsWith('.mmd')) out.push(full);
  }
  return out;
}

function renderOne(mmd, force) {
  const png = mmd.replace(/\.mmd$/, '.png');
  if (!force && fs.existsSync(png)) {
    const mmdTime = fs.statSync(mmd).mtimeMs;
    const pngTime = fs.statSync(png).mtimeMs;
    if (pngTime > mmdTime) {
      console.log(`\u23e9 Skip (up-to-date): ${path.basename(png)}`);
      return png;
    }
  }
  try {
    execFileSync(MMDC_BIN, [
      '-i', mmd,
      '-o', png,
      '-b', 'white',
      '-w', '1600',
      '-t', 'default',
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    const size = (fs.statSync(png).size / 1024).toFixed(1);
    console.log(`\u2705 ${path.basename(png)} (${size} KB)`);
    return png;
  } catch (err) {
    console.error(`\u274c Failed ${path.basename(mmd)}: ${err.message}`);
    return null;
  }
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const target = args.find((a) => !a.startsWith('--')) || '.';
  const abs = path.resolve(target);
  if (!fs.existsSync(abs)) { console.error(`\u274c Not found: ${abs}`); process.exit(1); }

  if (!fs.existsSync(MMDC_BIN)) {
    console.error(`\u274c mmdc not found at ${MMDC_BIN}. Run: npm install`);
    process.exit(1);
  }

  const files = walkMmd(abs);
  console.log(`\ud83c\udfa8 Found ${files.length} Mermaid source file(s) in ${target}`);
  let ok = 0, fail = 0;
  for (const f of files) {
    const result = renderOne(f, force);
    if (result) ok++; else fail++;
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

if (require.main === module) main();
