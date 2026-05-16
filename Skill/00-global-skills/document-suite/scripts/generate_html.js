#!/usr/bin/env node
/**
 * Quick HTML preview for authoring iteration.
 *
 * Converts a document folder (multi-md) to a single self-contained HTML page
 * with brand-agnostic styling, embedded CSS, TOC, and images resolved from diagrams/
 * and _assets/. No external deps — pure regex markdown subset.
 *
 * This is a DEV preview only. The official deliverable is DOCX+PDF from
 * build_doc.js + generate_pdf.js.
 *
 * Usage:
 *   node generate_html.js <doc-folder>
 */

const fs = require('fs');
const path = require('path');

function loadManifest(docDir) {
  const p = path.join(docDir, '_manifest.json');
  if (!fs.existsSync(p)) return {};
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (_) { return {}; }
}

function discoverFiles(docDir, manifest) {
  if (manifest.files) return manifest.files.map((f) => path.join(docDir, f));
  return fs.readdirSync(docDir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .map((f) => path.join(docDir, f));
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(text) {
  let t = text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
  return t;
}

function resolveImage(fileName, docDir) {
  const candidates = [
    path.join(docDir, 'diagrams', fileName),
    path.join(docDir, fileName),
    path.join(docDir, '_assets', fileName),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const data = fs.readFileSync(c).toString('base64');
      const ext = path.extname(c).slice(1).toLowerCase();
      const mime = ({ png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif' }[ext]) || 'image/png';
      return `data:${mime};base64,${data}`;
    }
  }
  return null;
}

function renderMarkdown(md, docDir) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Page break
    if (line.trim() === '<!-- PAGE_BREAK -->') {
      out.push('<div class="page-break"></div>');
      i++; continue;
    }

    // Diagram / image comment
    const diagramMatch = line.trim().match(/^<!--\s*(?:DIAGRAM|IMAGE):\s*([^\s]+)(?:\s+(.+?))?\s*-->$/);
    if (diagramMatch) {
      const src = resolveImage(diagramMatch[1], docDir);
      const cap = diagramMatch[2] || '';
      if (src) out.push(`<figure><img src="${src}" alt="${escapeHtml(cap || diagramMatch[1])}"/>${cap ? `<figcaption>${escapeHtml(cap)}</figcaption>` : ''}</figure>`);
      else out.push(`<p class="missing">[Missing diagram: ${escapeHtml(diagramMatch[1])}]</p>`);
      i++; continue;
    }

    // Skip other comments
    if (line.trim().startsWith('<!--') && line.trim().endsWith('-->')) { i++; continue; }

    // Code block
    if (line.trim().startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) { codeLines.push(lines[i]); i++; }
      out.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      i++; continue;
    }

    // Heading
    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2].replace(/\*\*/g, '');
      // Bilingual "VI / EN"
      const bi = text.match(/^(.+?)\s+\/\s+(.+)$/);
      const content = bi ? `${renderInline(bi[1])} <span class="subtitle">— ${renderInline(bi[2])}</span>` : renderInline(text);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      out.push(`<h${level} id="${id}">${content}</h${level}>`);
      i++; continue;
    }

    // Table
    if (line.trim().startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i].trim());
        i++;
      }
      const parsed = rows
        .filter((r) => !/^\|[:\-|\s]+\|$/.test(r))
        .map((r) => r.split('|').slice(1, -1).map((c) => c.trim()));
      if (parsed.length >= 1) {
        const [header, ...body] = parsed;
        out.push('<table>');
        out.push('<thead><tr>' + header.map((c) => `<th>${renderInline(c)}</th>`).join('') + '</tr></thead>');
        out.push('<tbody>');
        body.forEach((row) => {
          out.push('<tr>' + row.map((c) => `<td>${renderInline(c)}</td>`).join('') + '</tr>');
        });
        out.push('</tbody></table>');
      }
      continue;
    }

    // Bullet / number
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      out.push('<ul>' + items.map((x) => `<li>${renderInline(x)}</li>`).join('') + '</ul>');
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      out.push('<ol>' + items.map((x) => `<li>${renderInline(x)}</li>`).join('') + '</ol>');
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      out.push(`<blockquote>${renderInline(line.trim().replace(/^>\s*/, ''))}</blockquote>`);
      i++; continue;
    }

    // Hr
    if (line.trim() === '---' || line.trim() === '***') {
      out.push('<hr/>');
      i++; continue;
    }

    // Empty
    if (line.trim() === '') { i++; continue; }

    // Paragraph
    out.push(`<p>${renderInline(line)}</p>`);
    i++;
  }
  return out.join('\n');
}

const CSS = `
:root {
  --primary: #0B3D7F; --secondary: #E85A1A; --accent: #1B9AAA;
  --text: #1F2937; --text-light: #6B7280; --border: #D0D7DE;
  --bg-alt: #F6F8FA; --header-bg: #E8F0FE; --accent-client: #E30613;
}
* { box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: var(--text); line-height: 1.6; max-width: 880px; margin: 40px auto; padding: 0 32px; }
header.cover { text-align: center; padding: 40px 0; border-bottom: 4px solid var(--primary); margin-bottom: 40px; }
header.cover .logos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
header.cover .logos img { max-height: 80px; }
header.cover h1 { font-size: 36px; color: var(--primary); margin: 0 0 8px; }
header.cover .en { font-size: 20px; color: var(--secondary); font-style: italic; }
header.cover .meta { margin-top: 24px; color: var(--text-light); font-size: 14px; }
header.cover .classification { display: inline-block; margin-top: 24px; padding: 8px 20px; border: 2px solid var(--accent-client); color: var(--accent-client); font-weight: 700; font-size: 13px; }
h1, h2, h3, h4 { color: var(--primary); margin-top: 32px; }
h1 { font-size: 28px; border-bottom: 2px solid var(--primary); padding-bottom: 6px; }
h2 { color: var(--secondary); font-size: 22px; }
h3 { font-size: 18px; color: var(--accent); }
h4 { font-size: 16px; }
.subtitle { color: var(--text-light); font-weight: 400; font-size: 0.8em; font-style: italic; }
table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
th { background: var(--header-bg); color: var(--primary); text-align: left; padding: 10px 12px; border: 1px solid var(--border); }
td { padding: 10px 12px; border: 1px solid var(--border); vertical-align: top; }
tr:nth-child(even) td { background: var(--bg-alt); }
pre { background: var(--bg-alt); border-left: 4px solid var(--border); padding: 12px 16px; overflow-x: auto; font-size: 13px; }
code { background: var(--bg-alt); padding: 2px 6px; border-radius: 3px; font-size: 13px; }
blockquote { border-left: 4px solid var(--accent); margin: 16px 0; padding: 8px 16px; color: var(--text-light); font-style: italic; background: var(--bg-alt); }
figure { text-align: center; margin: 24px 0; }
figure img { max-width: 100%; border: 1px solid var(--border); }
figcaption { font-size: 13px; color: var(--text-light); font-style: italic; margin-top: 8px; }
.missing { color: var(--accent-client); font-style: italic; }
.page-break { page-break-after: always; border-top: 1px dashed var(--border); margin: 40px 0; }
hr { border: 0; border-top: 1px solid var(--border); margin: 24px 0; }
a { color: var(--primary); }
@media print { body { max-width: none; padding: 0; } }
`;

function buildCover(meta, docDir) {
  // Load logos from brand config (brand.js LOGOS.VENDOR / LOGOS.CLIENT)
  let vendorLogo = null;
  let clientLogo = null;
  try {
    const { LOGOS } = require('./lib/brand');
    vendorLogo = LOGOS.VENDOR ? resolveImageAbs(LOGOS.VENDOR) : null;
    clientLogo = LOGOS.CLIENT ? resolveImageAbs(LOGOS.CLIENT) : null;
  } catch (_) { /* brand not loaded */ }
  const vendorName = meta.vendor || '';
  const clientName = meta.client || '';
  const partiesText = clientName ? `${vendorName} &times; ${clientName}` : vendorName;
  return `
<header class="cover">
  <div class="logos">
    ${vendorLogo ? `<img src="${vendorLogo}" alt="${vendorName}"/>` : (vendorName ? `<span>${vendorName}</span>` : '')}
    ${clientLogo ? `<img src="${clientLogo}" alt="${clientName}"/>` : (clientName ? `<span>${clientName}</span>` : '')}
  </div>
  <div style="color:var(--text-light);font-style:italic;">${partiesText}</div>
  <h1>${meta.doc_title_vi || 'T\u00e0i li\u1ec7u D\u1ef1 \u00e1n'}</h1>
  <div class="en">${meta.doc_title_en || ''}</div>
  <div class="meta">
    <div>M\u00e3 t\u00e0i li\u1ec7u / Doc Code: <strong>${meta.doc_code || 'DOC-v1.0'}</strong></div>
    <div>Phi\u00ean b\u1ea3n / Version: <strong>${meta.version || '1.0'}</strong></div>
    <div>Ng\u00e0y ph\u00e1t h\u00e0nh / Issue Date: <strong>${meta.date || new Date().toISOString().slice(0, 10)}</strong></div>
    <div>D\u1ef1 \u00e1n / Project: <strong>${meta.project_code || ''}</strong></div>
  </div>
  <div class="classification">${meta.classification_short || 'CONFIDENTIAL'}</div>
</header>
`;
}

function resolveImageAbs(abs) {
  if (!fs.existsSync(abs)) return null;
  const data = fs.readFileSync(abs).toString('base64');
  const ext = path.extname(abs).slice(1).toLowerCase();
  const mime = ({ png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif' }[ext]) || 'image/png';
  return `data:${mime};base64,${data}`;
}

async function buildHtml(docDir) {
  const manifest = loadManifest(docDir);
  const files = discoverFiles(docDir, manifest);
  const parts = [];
  files.forEach((f, idx) => {
    if (!fs.existsSync(f)) return;
    const md = fs.readFileSync(f, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
    parts.push(renderMarkdown(md, docDir));
    if (idx < files.length - 1) parts.push('<div class="page-break"></div>');
  });

  const title = `${manifest.doc_title_vi || 'T\u00e0i li\u1ec7u'} \u2014 ${manifest.project_name || 'Project'}`;
  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>${CSS}</style>
</head>
<body>
${buildCover(manifest, docDir)}
<main>
${parts.join('\n')}
</main>
</body>
</html>`;

  const outPath = path.join(docDir, `preview_${path.basename(docDir)}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`\u2705 HTML preview: ${outPath} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
  return outPath;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) { console.error('Usage: generate_html.js <doc-folder>'); process.exit(1); }
  for (const dir of args) await buildHtml(path.resolve(dir));
}

if (require.main === module) main().catch((err) => { console.error(err); process.exit(1); });

module.exports = { buildHtml };
