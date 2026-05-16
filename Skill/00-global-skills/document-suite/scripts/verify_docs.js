#!/usr/bin/env node
/**
 * Smoke test + pre-flight verification for a docs/ folder.
 *
 * Checks performed:
 *   1. Every `<!-- DIAGRAM:file.png -->` marker points to an existing file
 *      (searches {docDir}/diagrams/, {docDir}/, {docDir}/_assets/).
 *   2. Every referenced fact placeholder `{{facts.key}}` resolves to a key in
 *      docs/_research/facts.yml (if present).
 *   3. Bilingual heading consistency: top-level headings should have " / " VI/EN split.
 *   4. Trailing whitespace, tab characters, Windows line endings warnings.
 *   5. Manifest presence per doc folder.
 *
 * Exit 0 = all clean. Exit 1 = warnings. Exit 2 = errors.
 *
 * Usage:
 *   node verify_docs.js <docs-folder>
 */

const fs = require('fs');
const path = require('path');
let yaml;
try { yaml = require('js-yaml'); } catch (_) { yaml = null; }

function walk(dir, ext) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('node_modules') || entry.name.startsWith('.git')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, ext));
    else if (entry.name.endsWith(ext)) files.push(full);
  }
  return files;
}

function findFacts(docsDir) {
  const candidates = [
    path.join(docsDir, '_research', 'facts.yml'),
    path.join(docsDir, '..', 'docs', '_research', 'facts.yml'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      try { return { path: c, data: yaml ? yaml.load(fs.readFileSync(c, 'utf8')) : {} }; }
      catch (_) { return { path: c, data: {} }; }
    }
  }
  return null;
}

function flatten(obj, prefix = '') {
  const out = {};
  for (const k of Object.keys(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (obj[k] !== null && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      Object.assign(out, flatten(obj[k], key));
    } else {
      out[key] = obj[k];
    }
  }
  return out;
}

// Strip fenced code blocks (``` ... ```) and inline code spans (`...`) so
// the verifier does not complain about documentation examples that illustrate
// the DIAGRAM / IMAGE / {{facts.*}} markers as prose.
function stripCode(content) {
  return content
    .replace(/```[\s\S]*?```/g, '')   // fenced blocks
    .replace(/`[^`\n]*`/g, '');       // inline code spans
}

function checkDiagrams(files, errors, warnings) {
  for (const f of files) {
    const rawContent = fs.readFileSync(f, 'utf8');
    const content = stripCode(rawContent);
    const dir = path.dirname(f);
    const re = /<!--\s*(?:DIAGRAM|IMAGE):\s*([^\s]+)(?:\s+(.+?))?\s*-->/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const name = m[1];
      const candidates = [
        path.join(dir, 'diagrams', name),
        path.join(dir, name),
        path.join(dir, '_assets', name),
      ];
      if (!candidates.some((p) => fs.existsSync(p))) {
        errors.push(`${path.relative(process.cwd(), f)}: missing diagram "${name}"`);
      }
    }
  }
}

function checkFactRefs(files, facts, errors) {
  if (!facts) return;
  const flat = flatten(facts.data);
  for (const f of files) {
    const rawContent = fs.readFileSync(f, 'utf8');
    const content = stripCode(rawContent);
    const re = /\{\{\s*facts\.([^}\s]+)\s*\}\}/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      if (!(m[1] in flat)) {
        errors.push(`${path.relative(process.cwd(), f)}: unknown fact ref "{{facts.${m[1]}}}"`);
      }
    }
  }
}

function checkBilingual(files, warnings) {
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const m = line.match(/^#{1,2}\s+(.+)$/);
      if (!m) continue;
      const text = m[1].trim();
      if (text.startsWith('<!--') || text.includes('{{')) continue;
      if (!/[\/\u2014]/.test(text) && !/^[\d.]/.test(text)) {
        // Single-language top heading (warning only)
        warnings.push(`${path.relative(process.cwd(), f)}:${i + 1}: heading "${text}" lacks VI / EN split`);
      }
    }
  }
}

function checkWhitespace(files, warnings) {
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('\r\n')) warnings.push(`${path.relative(process.cwd(), f)}: CRLF line endings`);
    if (/[ \t]+$/m.test(content)) warnings.push(`${path.relative(process.cwd(), f)}: trailing whitespace`);
    if (/\t/.test(content)) warnings.push(`${path.relative(process.cwd(), f)}: contains tab characters`);
  }
}

function checkManifests(docsDir, warnings) {
  // Each leaf folder with .md files should have _manifest.json
  function walkDirs(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const subdirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'diagrams' && e.name !== '_assets');
    const mds = entries.filter((e) => e.isFile() && e.name.endsWith('.md') && !e.name.startsWith('_'));
    if (mds.length > 0 && !fs.existsSync(path.join(dir, '_manifest.json'))) {
      warnings.push(`${path.relative(process.cwd(), dir)}: missing _manifest.json`);
    }
    subdirs.forEach((s) => walkDirs(path.join(dir, s.name)));
  }
  walkDirs(docsDir);
}

function main() {
  const args = process.argv.slice(2);
  const docsDir = path.resolve(args[0] || '.');
  if (!fs.existsSync(docsDir)) { console.error(`\u274c Not found: ${docsDir}`); process.exit(1); }

  const errors = [];
  const warnings = [];
  const files = walk(docsDir, '.md').filter((f) => !path.basename(f).startsWith('_') && !f.includes('/_research/'));

  console.log(`\ud83d\udd0d Checking ${files.length} markdown file(s) in ${docsDir}...`);
  checkDiagrams(files, errors, warnings);
  const facts = findFacts(docsDir);
  if (facts) {
    console.log(`   facts.yml found: ${facts.path}`);
    checkFactRefs(files, facts, errors);
  }
  checkBilingual(files, warnings);
  checkWhitespace(files, warnings);
  checkManifests(docsDir, warnings);

  if (warnings.length) {
    console.warn(`\n\u26a0\ufe0f  ${warnings.length} warning(s):`);
    warnings.slice(0, 30).forEach((w) => console.warn(`   ${w}`));
    if (warnings.length > 30) console.warn(`   ... and ${warnings.length - 30} more`);
  }
  if (errors.length) {
    console.error(`\n\u274c ${errors.length} error(s):`);
    errors.forEach((e) => console.error(`   ${e}`));
    process.exit(2);
  }
  if (!warnings.length && !errors.length) {
    console.log('\u2705 All checks passed.');
  }
  process.exit(warnings.length && !errors.length ? 1 : 0);
}

if (require.main === module) main();

module.exports = { main };
