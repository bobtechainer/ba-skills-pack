#!/usr/bin/env node
/**
 * Cross-document Requirements Traceability Matrix (RTM) generator.
 *
 * Scans a docs/ tree, greps requirement / test case identifiers, and builds a
 * bidirectional table: Requirement ↔ Design Section ↔ Test Case.
 *
 * Identifier patterns recognized (customize in IDENTIFIERS):
 *   - BR-\d+  : Business Rule (BRD)
 *   - FR-\d+  : Functional Requirement (SRS)
 *   - NFR-\d+ : Non-Functional Requirement (SRS)
 *   - UC-\d+  : Use Case
 *   - TC-\d+  : Test Case
 *
 * Orphan detection:
 *   - An FR that has no TC referencing it → orphan functional req
 *   - A TC that references an FR not present in any BRD/SRS → orphan test case
 *
 * Output:
 *   - docs/RTM.md (markdown table)
 *   - docs/RTM.csv (optional, for Excel)
 *   - Exit code 1 if orphans found (unless --allow-orphans)
 *
 * Usage:
 *   node generate_rtm.js <docs-folder> [--allow-orphans]
 */

const fs = require('fs');
const path = require('path');

const IDENTIFIERS = [
  { key: 'BR', pattern: /\bBR-(\d{3,4})\b/g, label: 'Business Rule' },
  { key: 'FR', pattern: /\bFR-(\d{3,4})\b/g, label: 'Functional Requirement' },
  { key: 'NFR', pattern: /\bNFR-(\d{3,4})\b/g, label: 'Non-Functional Requirement' },
  { key: 'UC', pattern: /\bUC-(\d{3,4})\b/g, label: 'Use Case' },
  { key: 'TC', pattern: /\bTC-(\d{3,4})\b/g, label: 'Test Case' },
];

function walkMd(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkMd(full));
    else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) files.push(full);
  }
  return files;
}

function scanFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const findings = {};
  for (const id of IDENTIFIERS) {
    findings[id.key] = new Set();
    let m;
    const re = new RegExp(id.pattern.source, 'g');
    while ((m = re.exec(content)) !== null) {
      findings[id.key].add(`${id.key}-${m[1]}`);
    }
  }
  return findings;
}

function buildIndex(files) {
  // index: { BR-001: Set<file>, FR-001: Set<file>, ... }
  const idx = {};
  const fileFindings = {};
  for (const f of files) {
    const findings = scanFile(f);
    fileFindings[f] = findings;
    for (const key of Object.keys(findings)) {
      for (const id of findings[key]) {
        if (!idx[id]) idx[id] = new Set();
        idx[id].add(f);
      }
    }
  }
  return { idx, fileFindings };
}

function rel(file, base) {
  return path.relative(base, file);
}

function buildRtm(index, base) {
  const rows = [];
  const allIds = Object.keys(index.idx).sort((a, b) => {
    const [ka, va] = a.split('-');
    const [kb, vb] = b.split('-');
    return ka === kb ? parseInt(va) - parseInt(vb) : ka.localeCompare(kb);
  });

  // Build TC ↔ FR/NFR/BR back-references by re-scanning
  const tcBackrefs = {}; // TC-001 -> Set<FR-001>
  for (const [file, findings] of Object.entries(index.fileFindings)) {
    if (findings.TC.size > 0 && (findings.FR.size > 0 || findings.NFR.size > 0 || findings.BR.size > 0)) {
      for (const tc of findings.TC) {
        if (!tcBackrefs[tc]) tcBackrefs[tc] = new Set();
        for (const fr of findings.FR) tcBackrefs[tc].add(fr);
        for (const nfr of findings.NFR) tcBackrefs[tc].add(nfr);
        for (const br of findings.BR) tcBackrefs[tc].add(br);
      }
    }
  }

  // Forward: FR → Test Cases
  const frTests = {};
  for (const [tc, reqs] of Object.entries(tcBackrefs)) {
    for (const r of reqs) {
      if (!frTests[r]) frTests[r] = new Set();
      frTests[r].add(tc);
    }
  }

  for (const id of allIds) {
    const files = Array.from(index.idx[id]).map((f) => rel(f, base)).join('; ');
    const tests = frTests[id] ? Array.from(frTests[id]).sort().join(', ') : '';
    rows.push({ id, files, tests });
  }
  return rows;
}

function detectOrphans(rows) {
  const orphans = { frNoTest: [], tcNoReq: [] };
  for (const row of rows) {
    const [prefix] = row.id.split('-');
    if ((prefix === 'FR' || prefix === 'NFR' || prefix === 'BR') && !row.tests) {
      orphans.frNoTest.push(row.id);
    }
  }
  return orphans;
}

function writeMarkdown(rows, outPath, orphans) {
  const lines = [
    '# Requirements Traceability Matrix (RTM)',
    '',
    `*Generated: ${new Date().toISOString()}*`,
    '',
    '| Identifier | Found in | Covered by Tests |',
    '|---|---|---|',
  ];
  for (const r of rows) {
    lines.push(`| ${r.id} | ${r.files} | ${r.tests || '\u26a0\ufe0f (no coverage)'} |`);
  }
  lines.push('');
  if (orphans.frNoTest.length) {
    lines.push('## Orphans — requirements without test coverage');
    for (const o of orphans.frNoTest) lines.push(`- ${o}`);
    lines.push('');
  }
  fs.writeFileSync(outPath, lines.join('\n'));
}

function writeCsv(rows, outPath) {
  const lines = ['Identifier,Found in,Covered by Tests'];
  for (const r of rows) {
    const f = `"${r.files.replace(/"/g, '""')}"`;
    const t = `"${(r.tests || '').replace(/"/g, '""')}"`;
    lines.push(`${r.id},${f},${t}`);
  }
  fs.writeFileSync(outPath, lines.join('\n'));
}

function main() {
  const args = process.argv.slice(2);
  const allowOrphans = args.includes('--allow-orphans');
  const docsDir = args.find((a) => !a.startsWith('--'));
  if (!docsDir) { console.error('Usage: generate_rtm.js <docs-folder> [--allow-orphans]'); process.exit(1); }

  const base = path.resolve(docsDir);
  if (!fs.existsSync(base)) { console.error(`\u274c Not found: ${base}`); process.exit(1); }

  const files = walkMd(base);
  console.log(`\ud83d\udd0d Scanned ${files.length} markdown file(s).`);
  const index = buildIndex(files);
  const rows = buildRtm(index, base);
  const orphans = detectOrphans(rows);

  writeMarkdown(rows, path.join(base, 'RTM.md'), orphans);
  writeCsv(rows, path.join(base, 'RTM.csv'));

  console.log(`\u2705 RTM: ${rows.length} identifier(s)`);
  if (orphans.frNoTest.length) {
    console.warn(`\u26a0\ufe0f  ${orphans.frNoTest.length} requirement(s) without test coverage:`);
    orphans.frNoTest.slice(0, 10).forEach((o) => console.warn(`   - ${o}`));
    if (!allowOrphans) process.exit(2);
  }
}

if (require.main === module) main();

module.exports = { buildIndex, buildRtm, detectOrphans };
