#!/usr/bin/env node
/**
 * Domain Documentation — Brand-Agnostic DOCX Generator
 *
 * Forked from tbrain-robot/proposals/generate_proposals.js, extended for banking
 * project documentation (BRD / SRS / HLD / LLD / DBD / API Spec / Security Plan /
 * Test Plan / UAT / Deployment / Runbook / User Manual / SLA).
 *
 * Extensions over the base:
 *   - A4 page size (Vietnam banking standard)
 *   - Cover page with dual logos (Vendor + client, via lib/cover.js)
 *   - Approval / sign-off page
 *   - Image embedding (ImageRun with proper type/altText)
 *   - <!-- DIAGRAM:filename.png --> auto-embed from doc folder's diagrams/
 *   - <!-- PAGE_BREAK --> explicit page break marker
 *   - <!-- METADATA:key=value --> inline frontmatter marker (parsed by build_doc.js)
 *   - Bilingual heading support: "# Tiêu đề / English Title" auto-splits
 *   - Semantic column widths (extended for banking patterns: FR-, BR-, TC-, etc.)
 *   - Footer with vendor + project code + page numbering
 *
 * Direct CLI usage (single .md file):
 *   node generate_docx.js input.md output.docx --doc-code BRD-v1.0 --project "<PROJECT-CODE>"
 *
 * Programmatic usage (from build_doc.js multi-file orchestrator):
 *   const { buildDocument } = require('./generate_docx');
 *   buildDocument({ markdown, meta, docDir }) -> Promise<Buffer>
 */

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, HeadingLevel, BorderStyle, AlignmentType,
  Header, Footer, TabStopPosition, TabStopType,
  SectionType, PageNumber, PageBreak, TableLayoutType,
  ImageRun, TableOfContents,
  InsertedTextRun, DeletedTextRun,
  InternalHyperlink, Bookmark,
} = require('docx');

const { COLORS, FONT, PAGE, TABLE_TOTAL_WIDTH, LOGOS, META } = require('./lib/brand');
const { computeColumnWidths } = require('./lib/table_widths');
const { buildCoverPage, buildApprovalPage, pickStrings } = require('./lib/cover');

// ── Helpers ────────────────────────────────────────────────
function thinBorder(color = COLORS.TABLE_BORDER) {
  return { style: BorderStyle.SINGLE, size: 1, color };
}
function cellBorders(color) {
  const b = thinBorder(color);
  return { top: b, bottom: b, left: b, right: b };
}
function stripLinks(text) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

// ── Inline bold parser ─────────────────────────────────────
function parseLine(line) {
  const clean = stripLinks(line);
  const runs = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIdx = 0, match;
  while ((match = regex.exec(clean)) !== null) {
    if (match.index > lastIdx) runs.push(new TextRun({ text: clean.slice(lastIdx, match.index), font: FONT.MAIN, size: FONT.SIZE_BODY, color: COLORS.TEXT_BODY }));
    runs.push(new TextRun({ text: match[1], font: FONT.MAIN, size: FONT.SIZE_BODY, color: COLORS.TEXT_BODY, bold: true }));
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < clean.length) runs.push(new TextRun({ text: clean.slice(lastIdx), font: FONT.MAIN, size: FONT.SIZE_BODY, color: COLORS.TEXT_BODY }));
  if (runs.length === 0) runs.push(new TextRun({ text: clean, font: FONT.MAIN, size: FONT.SIZE_BODY, color: COLORS.TEXT_BODY }));
  return runs;
}
function parseCellText(text) {
  return parseLine(text);
}

// ── Image embedding ────────────────────────────────────────
/**
 * Embed an image (from docDir/diagrams/*.png or docDir/*.png).
 *
 * - Accepts png / jpg / jpeg / gif / bmp (docx-js limitations).
 * - Auto-scales to content width (6.27" on A4 minus margins) while preserving aspect ratio.
 * - Emits fallback text paragraph if file missing (build continues).
 */
function embedImage(fileName, docDir, caption) {
  // SVG auto-resolve: if fileName is .svg, prefer .png version (docx-js cannot render SVG)
  const svgToPng = fileName.replace(/\.svg$/i, '.png');
  const namesToTry = fileName.toLowerCase().endsWith('.svg')
    ? [svgToPng, fileName] // prefer PNG, fallback to SVG (will warn)
    : [fileName];

  let imgPath = null;
  for (const name of namesToTry) {
    const candidates = [
      path.join(docDir, 'diagrams', name),
      path.join(docDir, name),
      path.join(docDir, '_assets', name),
    ];
    imgPath = candidates.find((p) => fs.existsSync(p));
    if (imgPath) break;
  }

  if (!imgPath) {
    return [new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [new TextRun({
        text: `[\u26a0\ufe0f Missing diagram: ${fileName}]`,
        font: FONT.MAIN, size: FONT.SIZE_SMALL, color: COLORS.DANGER, italics: true,
      })],
    })];
  }

  const ext = path.extname(imgPath).toLowerCase().replace('.', '');
  if (ext === 'svg') {
    // SVG cannot be embedded in docx — warn and show placeholder
    return [new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [new TextRun({
        text: `[\u26a0\ufe0f ${fileName}: SVG not supported in DOCX. Convert to PNG: cairosvg.svg2png(url='${fileName}', write_to='${svgToPng}')]`,
        font: FONT.MAIN, size: FONT.SIZE_SMALL, color: COLORS.WARN || 'F59E0B', italics: true,
      })],
    })];
  }

  const typeMap = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png', gif: 'gif', bmp: 'bmp' };
  const type = typeMap[ext] || 'png';

  // Read image and detect dimensions via PNG/JPEG header sniffing (avoids extra dep).
  const data = fs.readFileSync(imgPath);
  const { width: natW, height: natH } = sniffImageSize(data, type);

  // Content width on A4 = 6.27" = 602 px at 96 DPI
  const maxWidthPx = 560;
  const scale = Math.min(1, maxWidthPx / Math.max(1, natW));
  const widthPx = Math.max(100, Math.floor((natW || maxWidthPx) * scale));
  const heightPx = Math.max(60, Math.floor((natH || 400) * scale));

  const elements = [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: caption ? 80 : 200 },
    children: [new ImageRun({
      type,
      data,
      transformation: { width: widthPx, height: heightPx },
      altText: { title: caption || fileName, description: caption || fileName, name: fileName },
    })],
  })];

  if (caption) {
    elements.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [new TextRun({
        text: caption, font: FONT.MAIN, size: FONT.SIZE_SMALL, italics: true, color: COLORS.TEXT_LIGHT,
      })],
    }));
  }
  return elements;
}

/**
 * Minimal PNG/JPEG dimension sniffer (no external deps).
 */
function sniffImageSize(buffer, type) {
  try {
    if (type === 'png') {
      // PNG: IHDR starts at byte 16, width at 16-20, height at 20-24
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
    if (type === 'jpeg') {
      // Walk JPEG segments until SOF0..SOF3 marker
      let i = 2;
      while (i < buffer.length) {
        if (buffer[i] !== 0xff) break;
        const marker = buffer[i + 1];
        const size = buffer.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xc3) {
          const height = buffer.readUInt16BE(i + 5);
          const width = buffer.readUInt16BE(i + 7);
          return { width, height };
        }
        i += 2 + size;
      }
    }
  } catch (_) { /* fall through */ }
  return { width: 0, height: 0 };
}

// ── Table builder ──────────────────────────────────────────
function makeTableFrom(rows, headerRow) {
  const columnWidths = computeColumnWidths(headerRow, TABLE_TOTAL_WIDTH);
  const header = new TableRow({
    tableHeader: true,
    children: headerRow.map((text, i) => new TableCell({
      width: { size: columnWidths[i], type: WidthType.DXA },
      shading: { fill: COLORS.TABLE_HEADER },
      borders: cellBorders(COLORS.TABLE_BORDER),
      children: [new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [new TextRun({ text, font: FONT.MAIN, size: FONT.SIZE_BODY, bold: true, color: COLORS.PRIMARY })],
      })],
    })),
  });
  const dataRows = rows.map((cells, idx) => new TableRow({
    children: cells.map((text, i) => new TableCell({
      width: { size: columnWidths[i] || Math.floor(TABLE_TOTAL_WIDTH / cells.length), type: WidthType.DXA },
      shading: { fill: idx % 2 === 0 ? COLORS.WHITE : COLORS.TABLE_ALT },
      borders: cellBorders(COLORS.TABLE_BORDER),
      children: [new Paragraph({
        spacing: { before: 40, after: 40 },
        children: parseCellText(text),
      })],
    })),
  }));
  return new Table({
    width: { size: TABLE_TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths,
    layout: TableLayoutType.FIXED,
    rows: [header, ...dataRows],
  });
}
function parseTable(lines) {
  const parsed = lines.map((l) => l.split('|').map((c) => c.trim()).filter((c) => c && !c.match(/^:?-+:?$/)));
  if (parsed.length < 2) return null;
  const headerRow = parsed[0];
  const dataRows = parsed.slice(1).filter((r) => !r.every((c) => /^:?-+:?$/.test(c)));
  return makeTableFrom(dataRows, headerRow);
}

// ── Heading ────────────────────────────────────────────────
let _bookmarkId = 1000;
function nextBookmarkId() { return _bookmarkId++; }
function resetBookmarkId() { _bookmarkId = 1000; }

function bookmarkSlug(text, level, index) {
  const base = (text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
  return `toc_h${level}_${index}_${base || 'heading'}`;
}

function headingParagraph(text, level, bookmarkName) {
  // Bilingual parser: "# Tiêu đề / English Title" -> two TextRuns on same paragraph
  const bilingualMatch = text.match(/^(.+?)\s+\/\s+(.+)$/);
  const viText = bilingualMatch ? bilingualMatch[1] : text;
  const enText = bilingualMatch ? bilingualMatch[2] : null;

  const config = {
    1: { color: COLORS.PRIMARY, size: FONT.SIZE_H1, spacing: { before: 400, after: 200 }, border: true, heading: HeadingLevel.HEADING_1 },
    2: { color: COLORS.SECONDARY, size: FONT.SIZE_H2, spacing: { before: 320, after: 160 }, border: false, heading: HeadingLevel.HEADING_2 },
    3: { color: COLORS.SECONDARY, size: FONT.SIZE_H3, spacing: { before: 260, after: 120 }, border: false, heading: HeadingLevel.HEADING_3 },
    4: { color: COLORS.TEXT_BODY, size: FONT.SIZE_H4, spacing: { before: 220, after: 100 }, border: false, heading: HeadingLevel.HEADING_4 },
  }[level] || { color: COLORS.PRIMARY, size: 24, spacing: { before: 200, after: 100 }, border: false, heading: HeadingLevel.HEADING_4 };

  const runs = [
    new TextRun({ text: viText, font: FONT.MAIN, size: config.size, bold: true, color: config.color }),
  ];
  if (enText) {
    runs.push(new TextRun({ text: `  \u2014  ${enText}`, font: FONT.MAIN, size: Math.max(18, config.size - 6), italics: true, color: COLORS.TEXT_LIGHT }));
  }

  // Wrap in a Bookmark so the static TOC can hyperlink to it.
  const children = bookmarkName
    ? [new Bookmark({ id: bookmarkName, children: runs })]
    : runs;

  return new Paragraph({
    spacing: config.spacing,
    heading: config.heading,
    border: config.border ? { bottom: { style: BorderStyle.SINGLE, size: 2, color: config.color, space: 4 } } : undefined,
    children,
  });
}

// ── Static TOC (Google Docs-compatible) ────────────────────
/**
 * Extract H1-H3 headings from markdown so we can build a static, visible TOC.
 *
 * Why static? Word's TableOfContents field requires the reader to "update fields"
 * (F9) to populate it. Google Docs ignores/breaks the field entirely — users see
 * a blank or malformed TOC. A statically-rendered TOC is real text; both Word and
 * Google Docs display it correctly on open.
 */
function extractHeadings(markdown) {
  const headings = [];
  const lines = markdown.split('\n');
  let inCode = false;
  let idx = 0;
  for (const line of lines) {
    if (line.trim().startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) continue;
    const m = line.match(/^(#{1,3})\s+(.+?)\s*$/);
    if (!m) continue;
    const level = m[1].length;
    const rawText = m[2].replace(/\*\*/g, '').trim();
    const bilingualMatch = rawText.match(/^(.+?)\s+\/\s+(.+)$/);
    const viText = bilingualMatch ? bilingualMatch[1] : rawText;
    const enText = bilingualMatch ? bilingualMatch[2] : null;
    const bookmark = bookmarkSlug(rawText, level, idx);
    headings.push({ level, viText, enText, rawText, bookmark });
    idx++;
  }
  return headings;
}

function buildStaticToc(headings, locale) {
  const S = pickStrings(locale);
  const title = new Paragraph({
    spacing: { before: 400, after: 200 },
    heading: HeadingLevel.HEADING_1,
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.PRIMARY, space: 4 } },
    children: [new TextRun({ text: S.toc, font: FONT.MAIN, size: FONT.SIZE_H1, bold: true, color: COLORS.PRIMARY })],
  });

  const entries = headings.map(({ level, viText, enText, bookmark }) => {
    const indentLeft = 360 * (level - 1);
    const size = level === 1 ? FONT.SIZE_BODY + 2 : FONT.SIZE_BODY;
    const color = level === 1 ? COLORS.PRIMARY : COLORS.TEXT_BODY;
    const bold = level === 1;

    const linkRuns = [
      new TextRun({ text: viText, font: FONT.MAIN, size, bold, color }),
    ];
    if (enText) {
      linkRuns.push(new TextRun({
        text: `  \u2014  ${enText}`,
        font: FONT.MAIN, size: Math.max(16, size - 2),
        italics: true, color: COLORS.TEXT_LIGHT,
      }));
    }

    return new Paragraph({
      spacing: {
        before: level === 1 ? 120 : 40,
        after: level === 1 ? 80 : 40,
      },
      indent: { left: indentLeft },
      children: [new InternalHyperlink({ anchor: bookmark, children: linkRuns })],
    });
  });

  return [title, ...entries, new Paragraph({ children: [new PageBreak()] })];
}

// ── Blockquote ─────────────────────────────────────────────
function blockquoteParagraph(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: COLORS.ACCENT, space: 8 } },
    children: [new TextRun({ text, font: FONT.MAIN, size: FONT.SIZE_BODY, color: COLORS.TEXT_LIGHT, italics: true })],
  });
}

// ── Track-Changes helpers ──────────────────────────────────
let _diffWords = null;
let _diffArrays = null;
function getDiff() {
  if (!_diffWords) {
    const diffLib = require('diff');
    _diffWords = diffLib.diffWords;
    _diffArrays = diffLib.diffArrays;
  }
  return { diffWords: _diffWords, diffArrays: _diffArrays };
}

// Global revision ID counter (reset per document)
let _revId = 1;
function nextRevId() { return _revId++; }
function resetRevId() { _revId = 1; }

const TC_AUTHOR = 'Tbrain';
function tcDate() { return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); }

/**
 * Split concatenated markdown into logical paragraphs.
 * We split on blank lines, keeping headings, table blocks,
 * and code blocks together.  Returns array of non-empty strings.
 */
function splitIntoParagraphs(md) {
  if (!md) return [];
  const paras = [];
  const lines = md.split('\n');
  let buf = [];
  let inCode = false;
  let inTable = false;

  const flush = () => {
    const joined = buf.join('\n').trim();
    if (joined) paras.push(joined);
    buf = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) inCode = !inCode;
    const isTableLine = line.trim().startsWith('|');
    if (inCode) { buf.push(line); continue; }
    if (isTableLine) { inTable = true; buf.push(line); continue; }
    if (inTable && !isTableLine) { inTable = false; flush(); }
    if (line.trim() === '') { flush(); continue; }
    buf.push(line);
  }
  flush();
  return paras;
}

/**
 * Build an InsertedTextRun (entire text as inserted).
 */
function makeInsertedRun(text, extraProps) {
  return new InsertedTextRun({
    id: nextRevId(),
    author: TC_AUTHOR,
    date: tcDate(),
    text,
    font: FONT.MAIN,
    size: FONT.SIZE_BODY,
    color: '00B050',        // green
    underline: { type: 'single' },
    ...(extraProps || {}),
  });
}

/**
 * Build a DeletedTextRun (entire text as deleted).
 */
function makeDeletedRun(text, extraProps) {
  return new DeletedTextRun({
    id: nextRevId(),
    author: TC_AUTHOR,
    date: tcDate(),
    text,
    font: FONT.MAIN,
    size: FONT.SIZE_BODY,
    color: 'FF0000',        // red
    strike: true,
    ...(extraProps || {}),
  });
}

/**
 * Diff two plain-text lines word-by-word and return mixed TextRun/InsertedTextRun/DeletedTextRun.
 * Returns an array of run children suitable for a Paragraph's children[].
 */
function diffLineToRuns(prevText, currText) {
  const { diffWords } = getDiff();
  const changes = diffWords(prevText || '', currText || '');
  const runs = [];
  for (const change of changes) {
    const text = change.value;
    if (!text) continue;
    if (change.added) {
      runs.push(makeInsertedRun(text));
    } else if (change.removed) {
      runs.push(makeDeletedRun(text));
    } else {
      // Unchanged — normal TextRun
      runs.push(new TextRun({ text, font: FONT.MAIN, size: FONT.SIZE_BODY, color: COLORS.TEXT_BODY }));
    }
  }
  return runs;
}

/**
 * Given two sets of paragraph strings, produce the merged diff as an array of
 * { type: 'equal'|'insert'|'delete', value: string }
 */
function diffParagraphs(prevParas, currParas) {
  const { diffArrays } = getDiff();
  const changes = diffArrays(prevParas, currParas);
  const result = [];
  for (const change of changes) {
    if (change.added) {
      for (const v of change.value) result.push({ type: 'insert', value: v });
    } else if (change.removed) {
      for (const v of change.value) result.push({ type: 'delete', value: v });
    } else {
      for (const v of change.value) result.push({ type: 'equal', value: v });
    }
  }
  return result;
}

/**
 * Check if a paragraph string is a simple body-text paragraph (not heading, not
 * table, not code block, not bullet) — i.e. suitable for word-level diffing.
 */
function isBodyPara(text) {
  const first = text.split('\n')[0].trim();
  return (
    !first.startsWith('#') &&
    !first.startsWith('|') &&
    !first.startsWith('```') &&
    !first.startsWith('- ') &&
    !first.startsWith('* ') &&
    !first.startsWith('> ') &&
    !/^\d+\.\s/.test(first)
  );
}

// ── Main Parser ────────────────────────────────────────────
function parseMarkdown(content, docDir, opts = {}) {
  const elements = [];
  // Strip YAML frontmatter (block at start between two "---" lines)
  if (content.startsWith('---\n')) {
    const fm = content.match(/^---\n[\s\S]*?\n---\n?/);
    if (fm) content = content.slice(fm[0].length);
  }
  // Strip non-marker HTML comments (preserve PAGE_BREAK / DIAGRAM: / IMAGE: / METADATA:)
  content = content.replace(/<!--(?!\s*(?:PAGE_BREAK|DIAGRAM:|IMAGE:|METADATA:))[\s\S]*?-->/g, '');
  const lines = content.split('\n');
  let i = 0;
  // Headings array (same order as extractHeadings) — used to attach bookmarks
  // to H1-H3 so the static TOC's internal hyperlinks resolve.
  const headings = opts.headings || null;
  let headingCursor = 0;

  while (i < lines.length) {
    const line = lines[i];

    // <!-- PAGE_BREAK -->
    if (line.trim() === '<!-- PAGE_BREAK -->') {
      elements.push(new Paragraph({ children: [new PageBreak()] }));
      i++; continue;
    }

    // <!-- DIAGRAM:file.png Caption -->
    const diagramMatch = line.trim().match(/^<!--\s*DIAGRAM:\s*([^\s]+)(?:\s+(.+?))?\s*-->$/);
    if (diagramMatch) {
      const fileName = diagramMatch[1];
      const caption = diagramMatch[2] || null;
      elements.push(...embedImage(fileName, docDir, caption));
      i++; continue;
    }

    // <!-- IMAGE:file.png Caption -->  (alias, used for screenshots)
    const imageMatch = line.trim().match(/^<!--\s*IMAGE:\s*([^\s]+)(?:\s+(.+?))?\s*-->$/);
    if (imageMatch) {
      elements.push(...embedImage(imageMatch[1], docDir, imageMatch[2] || null));
      i++; continue;
    }

    // Skip other HTML comments and metadata markers
    if (line.trim().startsWith('<!--') && line.trim().endsWith('-->')) { i++; continue; }
    if (line.trim().startsWith('<br')) { i++; continue; }
    if (line.trim() === '') { i++; continue; }

    // Code blocks
    if (line.trim().startsWith('```')) {
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      codeLines.forEach((codeLine, idx) => {
        elements.push(new Paragraph({
          spacing: {
            before: idx === 0 ? 80 : 0,
            after: idx === codeLines.length - 1 ? 80 : 0,
            line: 240,
          },
          indent: { left: 360 },
          border: {
            left: { style: BorderStyle.SINGLE, size: 4, color: COLORS.TABLE_BORDER, space: 8 },
          },
          children: [new TextRun({
            text: codeLine.length > 0 ? codeLine : ' ',
            font: FONT.MONO, size: 18, color: COLORS.TEXT_BODY,
          })],
        }));
      });
      i++; continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].replace(/\*\*/g, '');
      // Attach bookmark to H1-H3 so static TOC hyperlinks anchor here.
      let bookmarkName;
      if (headings && level <= 3) {
        const h = headings[headingCursor];
        if (h && h.level === level) {
          bookmarkName = h.bookmark;
          headingCursor++;
        }
      }
      elements.push(headingParagraph(text, level, bookmarkName));
      i++; continue;
    }

    // Table block
    if (line.trim().startsWith('|') && line.includes('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const tbl = parseTable(tableLines);
      if (tbl) {
        elements.push(tbl);
        elements.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      }
      continue;
    }

    // Bullet / numbered
    const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
    if (bulletMatch) {
      const indent = Math.floor(bulletMatch[1].length / 2);
      elements.push(new Paragraph({
        spacing: { before: 40, after: 40 }, indent: { left: 360 + indent * 360 },
        children: [new TextRun({ text: '\u2022  ', font: FONT.MAIN, size: FONT.SIZE_BODY, color: COLORS.SECONDARY, bold: true }), ...parseLine(bulletMatch[2])],
      }));
      i++; continue;
    }
    if (numberMatch) {
      const indent = Math.floor(numberMatch[1].length / 2);
      elements.push(new Paragraph({
        spacing: { before: 40, after: 40 }, indent: { left: 360 + indent * 360 },
        children: [new TextRun({ text: `${numberMatch[2]}. `, font: FONT.MAIN, size: FONT.SIZE_BODY, color: COLORS.PRIMARY, bold: true }), ...parseLine(numberMatch[3])],
      }));
      i++; continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      const text = line.trim().replace(/^>\s*/, '');
      elements.push(blockquoteParagraph(text));
      i++; continue;
    }

    // Italic-only line
    if (line.trim().startsWith('*') && line.trim().endsWith('*') && !line.trim().startsWith('**')) {
      const text = line.trim().replace(/^\*|\*$/g, '');
      elements.push(new Paragraph({
        spacing: { before: 40, after: 80 },
        children: [new TextRun({ text, font: FONT.MAIN, size: FONT.SIZE_SMALL, color: COLORS.TEXT_LIGHT, italics: true })],
      }));
      i++; continue;
    }

    // Horizontal rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(new Paragraph({
        spacing: { before: 120, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.TABLE_BORDER, space: 4 } },
        children: [],
      }));
      i++; continue;
    }

    // Body text
    elements.push(new Paragraph({ spacing: { before: 60, after: 60, line: 276 }, children: parseLine(line) }));
    i++;
  }
  return elements;
}

// ── Track-Changes-aware markdown parser ────────────────────
/**
 * parseMarkdownWithDiff(current, prev, docDir)
 *
 * Compares prevMarkdown vs current markdown at the paragraph level.
 * - Identical paragraphs → rendered normally via parseMarkdown paragraph-by-paragraph.
 * - Inserted paragraphs (in current, not in prev) → body text wrapped in InsertedTextRun.
 * - Deleted paragraphs (in prev, not in current) → body text wrapped in DeletedTextRun.
 * - Equal paragraphs that differ in wording (detected via diffArrays equal pairs that
 *   share same heading or are body text) → word-level diff via diffLineToRuns.
 *
 * Tables, code blocks, headings: leave as-is (treat whole block as insert/delete).
 */
function parseMarkdownWithDiff(currentMarkdown, prevMarkdown, docDir) {
  const prevParas = splitIntoParagraphs(prevMarkdown);
  const currParas = splitIntoParagraphs(currentMarkdown);
  const ops = diffParagraphs(prevParas, currParas);

  const elements = [];

  for (const op of ops) {
    const text = op.value;

    if (op.type === 'equal') {
      // Unchanged paragraph — render normally
      elements.push(...parseMarkdown(text, docDir));
      continue;
    }

    if (op.type === 'insert') {
      // Entire paragraph is new — render it but wrap body text runs as InsertedTextRun
      if (isBodyPara(text)) {
        // Simple body text: word-level diff (all words as inserted vs empty prev)
        const runs = diffLineToRuns('', text);
        elements.push(new Paragraph({
          spacing: { before: 60, after: 60, line: 276 },
          children: runs.length > 0 ? runs : [makeInsertedRun(text)],
        }));
      } else {
        // Heading / table / list / code block — render normally (track-changes not applied to structural elements)
        elements.push(...parseMarkdown(text, docDir));
      }
      continue;
    }

    if (op.type === 'delete') {
      // Paragraph was removed — show it with deleted styling
      if (isBodyPara(text)) {
        const runs = diffLineToRuns(text, '');
        elements.push(new Paragraph({
          spacing: { before: 60, after: 60, line: 276 },
          children: runs.length > 0 ? runs : [makeDeletedRun(text)],
        }));
      } else {
        // Structural block deleted — wrap as deleted text paragraph (simplified)
        elements.push(new Paragraph({
          spacing: { before: 60, after: 60, line: 276 },
          children: [makeDeletedRun('[Deleted block: ' + text.slice(0, 80).replace(/\n/g, ' ') + (text.length > 80 ? '...' : '') + ']')],
        }));
      }
      continue;
    }
  }

  return elements;
}

// ── Build document with cover + approval + body ────────────
function buildDocument({ markdown, meta, docDir, prevMarkdown }) {
  const resolvedDocDir = docDir || process.cwd();
  // Resolve locale: explicit meta.locale → meta.language → 'vi' default
  const locale = (meta && (meta.locale || meta.language)) || 'vi';
  meta = { ...meta, locale };
  const S = pickStrings(locale);
  resetBookmarkId();
  const headings = extractHeadings(markdown);
  let bodyElements;
  if (prevMarkdown && typeof prevMarkdown === 'string') {
    resetRevId();
    // Track-changes diff path — bookmarks omitted (links fall back to text).
    bodyElements = parseMarkdownWithDiff(markdown, prevMarkdown, resolvedDocDir);
  } else {
    bodyElements = parseMarkdown(markdown, resolvedDocDir, { headings });
  }
  const coverElements = buildCoverPage(meta, resolvedDocDir);
  const approvalElements = buildApprovalPage(meta, resolvedDocDir);

  // Header for body: vendor + project + doc code (tab-stopped right)
  const bodyHeader = new Header({
    children: [new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.PRIMARY, space: 4 } },
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      children: [
        new TextRun({ text: meta.vendor || META.name_short || '', font: FONT.MAIN, size: 18, color: COLORS.PRIMARY, bold: true }),
        new TextRun({ text: '  \u00d7  ', font: FONT.MAIN, size: 18, color: COLORS.TEXT_LIGHT }),
        new TextRun({ text: meta.client || '', font: FONT.MAIN, size: 18, color: COLORS.SECONDARY, bold: true }),
        new TextRun({ text: `  |  ${(locale === 'en' ? meta.doc_title_en : meta.doc_title_vi) || meta.doc_title_en || meta.doc_title_vi || S.defaultTitle}`, font: FONT.MAIN, size: 16, color: COLORS.TEXT_LIGHT, italics: true }),
        new TextRun({ text: '\t', font: FONT.MAIN }),
        new TextRun({ text: meta.doc_code || 'DOC-v1.0', font: FONT.MAIN, size: 16, color: COLORS.TEXT_LIGHT, italics: true }),
      ],
    })],
  });

  const bodyFooter = new Footer({
    children: [new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.TABLE_BORDER, space: 4 } },
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      children: [
        new TextRun({ text: `${meta.vendor || META.name_short || ''} \u2014 ${meta.project_code || ''} \u2014 ${meta.classification_short || 'CONFIDENTIAL'}`, font: FONT.MAIN, size: 16, color: COLORS.TEXT_LIGHT }),
        new TextRun({ text: '\t', font: FONT.MAIN }),
        new TextRun({ text: 'Page ', font: FONT.MAIN, size: 16, color: COLORS.TEXT_LIGHT }),
        new TextRun({ children: [PageNumber.CURRENT], font: FONT.MAIN, size: 16, color: COLORS.TEXT_LIGHT }),
        new TextRun({ text: ' / ', font: FONT.MAIN, size: 16, color: COLORS.TEXT_LIGHT }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT.MAIN, size: 16, color: COLORS.TEXT_LIGHT }),
      ],
    })],
  });

  // Static TOC (rendered as real text + internal hyperlinks to heading bookmarks).
  // A Word TableOfContents field requires a client that populates it on open;
  // Google Docs does not, so the field renders blank/broken there. Static text
  // works everywhere.
  const tocElements = buildStaticToc(headings, locale);

  return new Document({
    creator: meta.vendor || META.name || '',
    title: `${meta.doc_title_en || meta.doc_title_vi || 'Project Document'} \u2014 ${meta.project_name || ''}`,
    subject: meta.doc_code || 'DOC-v1.0',
    description: `${meta.doc_title_vi || ''} / ${meta.doc_title_en || ''} for ${meta.project_name || ''}`,
    styles: {
      default: {
        document: {
          run: { font: FONT.MAIN, size: FONT.SIZE_BODY, color: COLORS.TEXT_BODY },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: PAGE.MARGIN,
          size: { width: PAGE.WIDTH, height: PAGE.HEIGHT },
        },
        type: SectionType.CONTINUOUS,
      },
      headers: { default: bodyHeader },
      footers: { default: bodyFooter },
      children: [...coverElements, ...approvalElements, ...tocElements, ...bodyElements],
    }],
  });
}

async function renderToBuffer(args) {
  const doc = buildDocument(args);
  return Packer.toBuffer(doc);
}

// ── CLI ────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2 || args.includes('-h') || args.includes('--help')) {
    console.error('Usage: generate_docx.js <input.md> <output.docx> [--doc-code X] [--doc-title-vi X] [--doc-title-en X] [--project-code X] [--project-name X] [--version X]');
    process.exit(1);
  }
  const input = args[0];
  const output = args[1];
  const flags = {};
  for (let i = 2; i < args.length; i += 2) {
    const k = args[i].replace(/^--/, '').replace(/-/g, '_');
    flags[k] = args[i + 1];
  }
  const markdown = fs.readFileSync(input, 'utf8');
  const docDir = path.dirname(path.resolve(input));
  // Sniff frontmatter for language/locale fallback before parser strips it
  const fmMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
  let fmLocale = null;
  if (fmMatch) {
    const langLine = fmMatch[1].match(/^(?:language|locale)\s*:\s*['"]?([a-zA-Z-]+)['"]?\s*$/m);
    if (langLine) fmLocale = langLine[1].toLowerCase().slice(0, 2);
  }
  const locale = (flags.locale || fmLocale || 'vi').toLowerCase().slice(0, 2);
  const isEn = locale === 'en';
  const meta = {
    locale,
    doc_code: flags.doc_code || 'DOC-v1.0',
    doc_title_vi: flags.doc_title_vi || (isEn ? null : 'T\u00e0i li\u1ec7u D\u1ef1 \u00e1n'),
    doc_title_en: flags.doc_title_en || (isEn ? 'Project Document' : null),
    project_code: flags.project_code || (META.slug ? META.slug.toUpperCase() : ''),
    project_name: flags.project_name || META.name || '',
    version: flags.version || '1.0',
    date: flags.date || new Date().toISOString().slice(0, 10),
    vendor: flags.vendor || META.name || '',
    client: flags.client || '',
    classification: flags.classification || (isEn ? 'CONFIDENTIAL \u2014 Restricted' : 'CONFIDENTIAL \u2014 Restricted'),
    classification_short: flags.classification_short || 'CONFIDENTIAL',
  };
  const buffer = await renderToBuffer({ markdown, meta, docDir });
  fs.writeFileSync(output, buffer);
  console.log(`\u2705 Generated: ${output} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

if (require.main === module) {
  main().catch((err) => { console.error('\u274c Error:', err); process.exit(1); });
}

module.exports = { buildDocument, renderToBuffer, parseMarkdown, embedImage };
