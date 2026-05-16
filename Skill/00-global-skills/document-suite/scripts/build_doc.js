#!/usr/bin/env node
/**
 * Multi-file document orchestrator.
 *
 * Reads a document folder (e.g. docs/02_analysis/01_brd/), concatenates all .md
 * files in filename-prefix order (00_cover.md, 01_*.md, ...), skipping hidden
 * files (prefix `_`), and generates a single DOCX through generate_docx.js.
 *
 * A `_manifest.json` file may override metadata and provide the output filename:
 *   {
 *     "doc_code": "BRD-v1.0",
 *     "doc_title_vi": "Tài liệu Yêu cầu Nghiệp vụ",
 *     "doc_title_en": "Business Requirements Document",
 *     "project_code": "ACME-PORTAL-2026",
 *     "project_name": "Acme Portal 2026",
 *     "version": "1.0",
 *     "date": "2026-04-15",
 *     "vendor": "Your Company Name",
 *     "client": "Client Organization",
 *     "classification": "CONFIDENTIAL — Restricted",
 *     "classification_short": "CONFIDENTIAL",
 *     "output": "BRD_ACME-PORTAL_v1.0_20260415.docx",
 *     "files": ["00_cover.md", "01_chapter.md", ...],   // optional explicit order
 *     "approvals": [ ... ]                                // optional override
 *   }
 *
 * Usage:
 *   node build_doc.js <doc-folder>
 *   node build_doc.js <doc-folder> --watch
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

function hashFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').trim();
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
}

function computeDiff(files, prevHashes) {
  const current = {};
  const added = [], modified = [], unchanged = [];
  files.forEach((f) => {
    const name = path.basename(f);
    current[name] = hashFile(f);
    if (!prevHashes[name]) added.push(name);
    else if (prevHashes[name] !== current[name]) modified.push(name);
    else unchanged.push(name);
  });
  const removed = Object.keys(prevHashes).filter((n) => !current[n]);
  return { current, added, modified, unchanged, removed };
}

function writeChangeLog(docDir, prevVersion, newVersion, diff, isFirst) {
  const lines = [];
  lines.push(`# Change Log — v${newVersion}`);
  lines.push('');
  lines.push(`**Date:** ${new Date().toISOString().slice(0, 10)}`);
  if (isFirst) {
    lines.push(`**Type:** Initial build`);
    lines.push('');
    lines.push(`Files included (${diff.added.length}):`);
    diff.added.forEach((f) => lines.push(`- ${f}`));
  } else {
    lines.push(`**Previous:** v${prevVersion}  →  **Current:** v${newVersion}`);
    lines.push('');
    if (diff.modified.length) {
      lines.push(`### Modified (${diff.modified.length})`);
      diff.modified.forEach((f) => lines.push(`- ${f}`));
      lines.push('');
    }
    if (diff.added.length) {
      lines.push(`### Added (${diff.added.length})`);
      diff.added.forEach((f) => lines.push(`- ${f}`));
      lines.push('');
    }
    if (diff.removed.length) {
      lines.push(`### Removed (${diff.removed.length})`);
      diff.removed.forEach((f) => lines.push(`- ${f}`));
      lines.push('');
    }
    if (diff.unchanged.length) {
      lines.push(`### Unchanged (${diff.unchanged.length})`);
      lines.push(`<details><summary>Show</summary>\n`);
      diff.unchanged.forEach((f) => lines.push(`- ${f}`));
      lines.push(`\n</details>`);
    }
    if (!diff.modified.length && !diff.added.length && !diff.removed.length) {
      lines.push('_No content changes — version bumped only._');
    }
  }
  lines.push('');
  fs.writeFileSync(path.join(docDir, '_changes.md'), lines.join('\n'), 'utf8');
}

// renderToBuffer and META are loaded LAZILY inside buildOne() so we can set
// BANKING_DOCS_BRAND env var from CLI flag before brand.js initializes.
let _renderToBuffer = null;
function getRenderToBuffer() {
  if (!_renderToBuffer) {
    _renderToBuffer = require('./generate_docx').renderToBuffer;
  }
  return _renderToBuffer;
}

let _META = null;
function getMETA() {
  if (!_META) {
    _META = require('./lib/brand').META;
  }
  return _META;
}

function loadManifest(docDir) {
  const manifestPath = path.join(docDir, '_manifest.json');
  if (!fs.existsSync(manifestPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    console.error(`\u26a0\ufe0f  Invalid _manifest.json in ${docDir}: ${err.message}`);
    return {};
  }
}

function saveManifest(docDir, manifest) {
  const manifestPath = path.join(docDir, '_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

/**
 * Auto-increment version: "1.0" → "1.1", "2.3" → "2.4".
 * With --major flag: "1.3" → "2.0".
 */
function incrementVersion(currentVersion, major) {
  const parts = (currentVersion || '1.0').split('.').map(Number);
  if (major) {
    return `${(parts[0] || 1) + 1}.0`;
  }
  return `${parts[0] || 1}.${(parts[1] || 0) + 1}`;
}

function discoverMarkdownFiles(docDir, manifest) {
  if (manifest.files && Array.isArray(manifest.files)) {
    return manifest.files.map((f) => path.join(docDir, f));
  }
  return fs.readdirSync(docDir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .map((f) => path.join(docDir, f));
}

function concatMarkdown(files) {
  const parts = [];
  files.forEach((file, idx) => {
    if (!fs.existsSync(file)) {
      console.warn(`\u26a0\ufe0f  Missing file: ${file}`);
      return;
    }
    const content = fs.readFileSync(file, 'utf8');
    // Strip leading YAML frontmatter block if present
    let stripped = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    // Strip trailing PAGE_BREAK from individual files to prevent double page breaks
    // (build_doc inserts its own between files)
    stripped = stripped.replace(/\s*<!--\s*PAGE_BREAK\s*-->\s*$/g, '');
    parts.push(stripped.trim());
    // Insert explicit page break between files (except last)
    if (idx < files.length - 1) {
      parts.push('\n\n<!-- PAGE_BREAK -->\n\n');
    }
  });
  return parts.join('\n\n');
}

function deriveOutputFilename(manifest, docDir) {
  if (manifest.output) return manifest.output;
  const folderName = path.basename(docDir);
  const docCode = (manifest.doc_code || folderName.replace(/^\d+_/, '')).toUpperCase();
  const projectShort = (manifest.project_code || 'DOC');
  const version = manifest.version || 'v1.0';
  const datePart = (manifest.date || new Date().toISOString().slice(0, 10)).replace(/-/g, '');
  return `${docCode}_${projectShort}_${version}_${datePart}.docx`;
}

async function buildOne(docDir, opts = {}) {
  const abs = path.resolve(docDir);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) {
    console.error(`\u274c Not a directory: ${docDir}`);
    process.exit(1);
  }
  const manifest = loadManifest(abs);
  const files = discoverMarkdownFiles(abs, manifest);
  if (files.length === 0) {
    console.error(`\u274c No markdown files found in ${docDir}`);
    process.exit(1);
  }

  // ── Auto-increment version ──────────────────────────────
  // Detect existing DOCX files to determine if this is a rebuild.
  // If --no-bump is passed, keep current version. Otherwise increment.
  const existingDocx = fs.readdirSync(abs).filter((f) => f.endsWith('.docx'));
  const prevVersion = manifest.version || '1.0';
  let newVersion = prevVersion;
  const today = new Date().toISOString().slice(0, 10);

  // ── Diff vs previous build (track changes) ──────────────
  const prevHashes = (manifest.file_hashes) || {};
  const isFirstBuild = existingDocx.length === 0;
  const diff = computeDiff(files, prevHashes);

  if (existingDocx.length > 0 && !opts.noBump) {
    newVersion = incrementVersion(prevVersion, opts.major);
    console.log(`\ud83d\udd04 Version bump: ${prevVersion} \u2192 ${newVersion}`);
    if (diff.modified.length || diff.added.length || diff.removed.length) {
      console.log(`\ud83d\udcdd Changes: ${diff.modified.length} modified, ${diff.added.length} added, ${diff.removed.length} removed`);
    }

    // Update manifest with new version + date + hashes + history
    manifest.version = newVersion;
    manifest.date = today;
    manifest.file_hashes = diff.current;
    manifest.history = manifest.history || [];
    manifest.history.push({
      version: newVersion,
      date: today,
      modified: diff.modified,
      added: diff.added,
      removed: diff.removed,
    });
    // Update output filename to reflect new version
    delete manifest.output; // force re-derive with new version
    saveManifest(abs, manifest);
    writeChangeLog(abs, prevVersion, newVersion, diff, false);
  } else if (isFirstBuild) {
    // First build — keep version as-is, update date + record initial hashes
    manifest.date = today;
    manifest.file_hashes = diff.current;
    manifest.history = [{ version: newVersion, date: today, initial: true, files: diff.added }];
    saveManifest(abs, manifest);
    writeChangeLog(abs, null, newVersion, diff, true);
  }

  console.log(`\ud83d\udcc4  Building ${path.basename(abs)} from ${files.length} file(s) [v${newVersion}]:`);
  files.forEach((f) => console.log(`   - ${path.basename(f)}`));

  const markdown = concatMarkdown(files);

  // ── Track-changes: retrieve previous markdown snapshot ──
  // prev_markdown is stored in manifest after each successful build.
  // Re-read the manifest from disk here (it may have been updated above).
  const freshManifest = loadManifest(abs);
  let prevMarkdown = null;
  if (opts.trackChanges && freshManifest.prev_markdown && typeof freshManifest.prev_markdown === 'string') {
    prevMarkdown = freshManifest.prev_markdown;
    console.log(`\ud83d\udcdd Track changes: ON (diffing against v${prevVersion})`);
  } else if (opts.trackChanges) {
    console.log('\ud83d\udcdd Track changes: ON (no previous snapshot — first build, emitting normally)');
  }

  const brandMeta = getMETA();
  const meta = {
    doc_code: manifest.doc_code || 'DOC-v1.0',
    doc_title_vi: manifest.doc_title_vi || 'T\u00e0i li\u1ec7u D\u1ef1 \u00e1n',
    doc_title_en: manifest.doc_title_en || 'Project Document',
    project_code: manifest.project_code || (brandMeta.slug ? brandMeta.slug.toUpperCase() : ''),
    project_name: manifest.project_name || brandMeta.name || '',
    version: newVersion,
    date: manifest.date || today,
    vendor: manifest.vendor || brandMeta.name || '',
    client: manifest.client || '',
    classification: manifest.classification || 'CONFIDENTIAL \u2014 Restricted',
    classification_short: manifest.classification_short || 'CONFIDENTIAL',
    approvals: manifest.approvals,
  };

  const buffer = await getRenderToBuffer()({ markdown, meta, docDir: abs, prevMarkdown });

  // ── Persist current markdown snapshot for next --track-changes run ──
  // Update manifest.prev_markdown AFTER successful renderToBuffer so that a crash
  // mid-render doesn't corrupt the snapshot.  We read+patch+write rather than
  // overwriting the whole manifest, to avoid clobbering any fields saved above.
  try {
    const snapManifest = loadManifest(abs);
    snapManifest.prev_markdown = markdown;
    saveManifest(abs, snapManifest);
  } catch (snapErr) {
    console.warn('\u26a0\ufe0f  Could not save prev_markdown snapshot:', snapErr.message);
  }
  const outName = deriveOutputFilename(manifest, abs);
  const outPath = path.join(abs, outName);
  fs.writeFileSync(outPath, buffer);
  console.log(`\u2705 Generated: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);

  // ── Phase 5: VERIFY — Run quality validators ──────────────
  if (!opts.skipVerify) {
    const validatorRunner = path.resolve(__dirname, '..', '..', '_shared', 'validators', 'index.js');
    if (fs.existsSync(validatorRunner)) {
      console.log('');
      try {
        execFileSync(process.execPath, [validatorRunner, outPath, abs], { stdio: 'inherit', timeout: 60000 });
      } catch (err) {
        if (err.status === 2) {
          // Quality gate failed — exit code 2 signals "re-engage agent to fix"
          console.error('');
          console.error('\u26a0\ufe0f  Quality gate failed. Fix the issues above and rebuild with --no-bump.');
          process.exit(2);
        }
        // Other errors (exit 1 = validator error, not quality failure) — warn but don't block
        console.warn('\u26a0\ufe0f  Validator error (non-blocking):', err.message);
      }
    }
  }

  return outPath;
}

// Resolve sibling skill path. Supports BOTH legacy directory names via
// symlink AND new generic names (brand-context, compliance-engine).
function resolveSiblingScript(preferredName, legacyName, scriptRelPath) {
  const candidates = [preferredName, legacyName];
  for (const name of candidates) {
    const p = path.resolve(__dirname, '..', '..', name, scriptRelPath);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.length === 0) {
    console.error('Usage: build_doc.js <doc-folder> [options]');
    console.error('  --brand <slug>     Vendor brand (from _shared/brands/<slug>.json)');
    console.error('  --client <slug>    Client branding (from brand-context/clients/<slug>/)');
    console.error('  --compliance       Append compliance matrix');
    console.error('  --no-bump          Keep current version (do not auto-increment)');
    console.error('  --major            Major version bump (1.3 -> 2.0) instead of minor (1.3 -> 1.4)');
    console.error('  --track-changes    Embed Word-visible track-changes (ins/del marks) vs previous build');
    process.exit(1);
  }

  // Parse flags
  let complianceFlag = false;
  let clientName = null;
  let brandSlug = null;
  let noBump = false;
  let majorBump = false;
  let skipVerify = false;
  let trackChanges = false;
  const dirs = [];
  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] === '--compliance') {
      complianceFlag = true;
    } else if (rawArgs[i] === '--no-bump') {
      noBump = true;
    } else if (rawArgs[i] === '--major') {
      majorBump = true;
    } else if (rawArgs[i] === '--skip-verify') {
      skipVerify = true;
    } else if (rawArgs[i] === '--track-changes') {
      trackChanges = true;
    } else if (rawArgs[i] === '--client') {
      clientName = rawArgs[++i];
      if (!clientName) {
        console.error('\u274c --client requires a name argument');
        process.exit(1);
      }
    } else if (rawArgs[i] === '--brand') {
      brandSlug = rawArgs[++i];
      if (!brandSlug) {
        console.error('\u274c --brand requires a slug argument (e.g., techainer)');
        process.exit(1);
      }
    } else {
      dirs.push(rawArgs[i]);
    }
  }

  if (dirs.length === 0) {
    console.error('Usage: build_doc.js <doc-folder> [<doc-folder> ...] [--brand <slug>] [--client <name>] [--compliance]');
    process.exit(1);
  }

  // Set BANKING_DOCS_BRAND env var BEFORE any downstream require() loads brand.js.
  // (build_doc.js now lazy-loads generate_docx via getRenderToBuffer() for this reason.)
  if (brandSlug) {
    process.env.BANKING_DOCS_BRAND = brandSlug;
    console.log(`>> Using brand: ${brandSlug}`);
  }

  for (const dir of dirs) {
    const abs = path.resolve(dir);
    try {
      // --client: apply client branding before build
      if (clientName) {
        const applyScript = resolveSiblingScript('brand-context', 'client-templates', 'scripts/apply.js');
        if (applyScript) {
          const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'banking-client-'));
          console.log(`>> Applying client "${clientName}" branding...`);
          execFileSync(process.execPath, [applyScript, '--client', clientName, '--source', abs, '--out', tmpDir], { stdio: 'inherit' });
          // Build from temp dir instead
          const outPath = await buildOne(tmpDir, { noBump, major: majorBump, skipVerify, trackChanges });
          // Copy output back to original dir
          const outputFiles = fs.readdirSync(tmpDir).filter(f => f.endsWith('.docx') || f.endsWith('.pdf'));
          for (const f of outputFiles) {
            fs.copyFileSync(path.join(tmpDir, f), path.join(abs, f));
          }
          fs.rmSync(tmpDir, { recursive: true, force: true });
        } else {
          console.warn('\u26a0\ufe0f  brand-context skill not found \u2014 using default branding');
          await buildOne(dir, { noBump, major: majorBump, skipVerify, trackChanges });
        }
      } else {
        await buildOne(dir, { noBump, major: majorBump, skipVerify, trackChanges });
      }

      // --compliance: run compliance matrix generation after successful build
      if (complianceFlag) {
        const complianceScript = resolveSiblingScript('compliance-engine', 'compliance', 'scripts/generate_matrix.js');
        if (complianceScript) {
          console.log('>> Running compliance matrix generation...');
          execFileSync(process.execPath, [complianceScript, abs], { stdio: 'inherit' });
        } else {
          console.warn('\u26a0\ufe0f  compliance-engine skill not found \u2014 skipping compliance appendix');
        }
      }
    } catch (err) {
      console.error(`\u274c Failed ${dir}: ${err.message}`);
      console.error(err.stack);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main().catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { buildOne };
