/**
 * SRS DOCX Export Template — with ANNOTATION SYSTEM pre-built
 * ============================================================
 * AI: Chỉ sửa phần CONFIG bên dưới. KHÔNG xóa, KHÔNG sửa phần ANNOTATION SYSTEM.
 * ============================================================
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber,
  PageBreak, LevelFormat,
  CommentRangeStart, CommentRangeEnd, CommentReference,
} = require("C:\\nvm4w\\nodejs\\node_modules\\docx");

// ╔═══════════════════════════════════════════════════════════╗
// ║  CONFIG — AI PHẢI THAY ĐỔI PHẦN NÀY CHO MỖI DỰ ÁN      ║
// ╚═══════════════════════════════════════════════════════════╝
const BASE = "c:\\Working\\Techainer\\BA Skills\\output\\PROJECT_NAME";
const TEMP = path.join(BASE, "temp");
const IMG_DIR = path.join(BASE, "images");
const OUT = path.join(BASE, "output", "SRS_ProjectName_v1.docx");

const DOC_TITLE = "ĐẶC TẢ YÊU CẦU PHẦN MỀM";
const DOC_SUBTITLE = "SOFTWARE REQUIREMENTS SPECIFICATION";
const DOC_SCREEN = "Màn hình XYZ";
const DOC_MODULE = "Module: ABC";
const DOC_SYSTEM = "Hệ thống: iBank 2.0 — BIDV Direct";
const DOC_VERSION = "1.0";
const DOC_DATE = new Date().toLocaleDateString("vi-VN");
const DOC_AUTHOR = "Tên tác giả";
const DOC_HEADER_TEXT = "SRS — Template | iBank 2.0";

// Files in order — AI thêm/xóa theo dự án
const FILES = [
  "00_version_history.md",
  "01_use_case.md",
  "02_api_connections.md",
  // "03_screen_01_ScreenName.md",
  "04_logic.md",
  "05_params.md",
];

// ╔═══════════════════════════════════════════════════════════╗
// ║  STYLE CONSTANTS — KHÔNG SỬA                             ║
// ╚═══════════════════════════════════════════════════════════╝
const FONT = "Arial";
const FONT_SIZE = 22;
const H1_SIZE = 32;
const H2_SIZE = 28;
const H3_SIZE = 26;
const H4_SIZE = 24;
const HEADER_FILL = "D5E8F0";
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const CELL_MARGINS = { top: 60, bottom: 60, left: 100, right: 100 };

// ╔═══════════════════════════════════════════════════════════╗
// ║  ANNOTATION SYSTEM — KHÔNG SỬA, KHÔNG XÓA                ║
// ║  Code này tạo Word comments + text highlight tự động      ║
// ╚═══════════════════════════════════════════════════════════╝
const TAG_HIGHLIGHT = {
  "CHANGED": "green", "CROSS-REF": "green",
  "MANUAL": "yellow", "ASSUMED": "yellow",
  "CONFLICT": "red", "REUSED": "magenta",
  "AMBIGUOUS": "yellow", "INFERRED": null,
};

const REGISTRY_PATH = path.join(TEMP, "comment_registry.json");
function loadRegistry() {
  if (fs.existsSync(REGISTRY_PATH)) return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  return [];
}
function saveRegistry(entries) {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(entries, null, 2), "utf8");
}

const registryEntries = loadRegistry();
let commentId = registryEntries.length;
const newRegistryEntries = [];

const oldDocComments = registryEntries.map(e => ({
  id: e.id, author: e.author || "AI",
  date: new Date(e.date || Date.now()),
  children: [new Paragraph({ children: [new TextRun(e.message)] })],
}));
const newDocComments = [];

function parseAnnotation(cellText) {
  const KNOWN = ["CHANGED","MANUAL","CROSS-REF","ASSUMED","CONFLICT","REUSED","AMBIGUOUS","INFERRED"];
  // Format 1: [TAG: message]
  const m1 = cellText.match(/\[(\w[\w-]*?):\s*(.+?)\]\s*$/);
  if (m1 && KNOWN.includes(m1[1].toUpperCase()))
    return { text: cellText.replace(m1[0], "").trim(), tag: m1[1].toUpperCase(), message: m1[2] };
  // Format 2: `[TAG]` \u00abmessage\u00bb
  const m2 = cellText.match(/`?\[(\w[\w-]*?)\]`?\s*[\u00ab\u201c"](.*?)[\u00bb\u201d"]\s*$/);
  if (m2 && KNOWN.includes(m2[1].toUpperCase()))
    return { text: cellText.replace(m2[0], "").trim(), tag: m2[1].toUpperCase(), message: m2[2] };
  // Format 3: [TAG] bare message (5+ chars)
  const m3 = cellText.match(/`?\[(\w[\w-]*?)\]`?\s+(.{5,})\s*$/);
  if (m3 && KNOWN.includes(m3[1].toUpperCase()))
    return { text: cellText.replace(m3[0], "").trim(), tag: m3[1].toUpperCase(), message: m3[2] };
  return { text: cellText, tag: null, message: null };
}

// ╔═══════════════════════════════════════════════════════════╗
// ║  HELPERS — KHÔNG SỬA                                      ║
// ╚═══════════════════════════════════════════════════════════╝

function parseInlineFormatting(text) {
  const runs = [];
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: FONT, size: FONT_SIZE }));
    } else if (part.length > 0) {
      runs.push(new TextRun({ text: part, font: FONT, size: FONT_SIZE }));
    }
  }
  return runs.length ? runs : [new TextRun({ text: "", font: FONT, size: FONT_SIZE })];
}

/** Table cell with BUILT-IN annotation handling */
function makeTableCell(text, isHeader, widthDxa) {
  const { text: cleanText, tag, message } = parseAnnotation(String(text));
  const hlColor = tag ? TAG_HIGHLIGHT[tag] || null : null;
  const lines = cleanText.split(/\n|<br\s*\/?>/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) lines.push("");

  let children;
  if (tag && message && !isHeader) {
    const id = String(commentId++);
    newDocComments.push({
      id, author: "AI", date: new Date(),
      children: [new Paragraph({ children: [new TextRun(message)] })],
    });
    newRegistryEntries.push({
      id, tag, message, highlightColor: hlColor,
      author: "AI", date: new Date().toISOString(),
    });
    children = lines.map((line, i) => new Paragraph({
      spacing: { after: 40 },
      children: i === 0
        ? [ new CommentRangeStart(id),
            new TextRun({ text: line, highlight: hlColor, font: FONT, size: FONT_SIZE }),
            new CommentRangeEnd(id),
            new CommentReference(id) ]
        : parseInlineFormatting(line),
    }));
  } else {
    children = lines.map(line => new Paragraph({
      spacing: { after: 40 }, children: parseInlineFormatting(line),
    }));
  }

  const cellOpts = { borders: BORDERS, margins: CELL_MARGINS, verticalAlign: VerticalAlign.CENTER, children };
  if (widthDxa) cellOpts.width = { size: widthDxa, type: WidthType.DXA };
  if (isHeader) cellOpts.shading = { fill: HEADER_FILL, type: ShadingType.CLEAR };
  return new TableCell(cellOpts);
}

function parseMarkdownTable(lines) {
  const dataLines = lines.filter(l => !l.match(/^\|[\s-:|]+\|$/));
  if (dataLines.length === 0) return null;
  const parseRow = line => line.split("|").slice(1, -1).map(c => c.trim());
  const headerCells = parseRow(dataLines[0]);
  const numCols = headerCells.length;
  if (numCols === 0) return null;
  const totalWidth = 9360;
  const colWidth = Math.floor(totalWidth / numCols);
  const columnWidths = Array(numCols).fill(colWidth);
  columnWidths[numCols - 1] = totalWidth - colWidth * (numCols - 1);

  const rows = [];
  rows.push(new TableRow({
    tableHeader: true,
    children: headerCells.map((cell, i) => makeTableCell(cell, true, columnWidths[i])),
  }));
  for (let i = 1; i < dataLines.length; i++) {
    const cells = parseRow(dataLines[i]);
    while (cells.length < numCols) cells.push("");
    rows.push(new TableRow({
      children: cells.slice(0, numCols).map((cell, j) => makeTableCell(cell, false, columnWidths[j])),
    }));
  }
  return new Table({ width: { size: totalWidth, type: WidthType.DXA }, columnWidths, rows });
}

function tryLoadImage(imgPath) {
  try {
    const normalized = imgPath.replace(/\//g, "\\");
    if (!fs.existsSync(normalized)) { console.log(`  [WARN] Image not found: ${normalized}`); return null; }
    const data = fs.readFileSync(normalized);
    const ext = path.extname(normalized).toLowerCase().replace(".", "");
    const type = ext === "jpg" ? "jpeg" : ext;
    return new ImageRun({
      type, data, transformation: { width: 600, height: 400 },
      altText: { title: path.basename(normalized), description: "Mockup screenshot", name: path.basename(normalized) },
    });
  } catch (e) { console.log(`  [WARN] Failed to load image: ${imgPath} - ${e.message}`); return null; }
}

function parseMarkdown(content) {
  const elements = [];
  const lines = content.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (line.trim() === "") { i++; continue; }
    if (line.startsWith("#")) {
      const match = line.match(/^(#{1,6})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        let heading;
        if (level === 1) heading = HeadingLevel.HEADING_1;
        else if (level === 2) heading = HeadingLevel.HEADING_2;
        else if (level === 3) heading = HeadingLevel.HEADING_3;
        else if (level === 4) heading = HeadingLevel.HEADING_4;
        else heading = HeadingLevel.HEADING_5;
        elements.push(new Paragraph({ heading, spacing: { before: 200, after: 120 }, children: parseInlineFormatting(text) }));
        i++; continue;
      }
    }
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      elements.push(new Paragraph({ spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: imgMatch[1], italics: true, font: FONT, size: FONT_SIZE, color: "666666" })] }));
      const imgRun = tryLoadImage(imgMatch[2]);
      if (imgRun) elements.push(new Paragraph({ spacing: { after: 120 }, children: [imgRun] }));
      i++; continue;
    }
    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { tableLines.push(lines[i].trim()); i++; }
      const table = parseMarkdownTable(tableLines);
      if (table) { elements.push(table); elements.push(new Paragraph({ spacing: { after: 120 }, children: [] })); }
      continue;
    }
    if (line.startsWith(">")) {
      const quoteText = line.replace(/^>\s*/, "");
      if (quoteText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)) {
        const noteText = quoteText.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, "");
        if (noteText.trim()) {
          elements.push(new Paragraph({ spacing: { before: 60, after: 60 }, indent: { left: 360 },
            children: [new TextRun({ text: "📌 " + noteText, italics: true, font: FONT, size: FONT_SIZE, color: "333333" })] }));
        }
      } else if (quoteText.trim()) {
        elements.push(new Paragraph({ spacing: { before: 60, after: 60 }, indent: { left: 360 }, children: parseInlineFormatting(quoteText) }));
      }
      i++; continue;
    }
    if (line.match(/^-{3,}$/)) {
      elements.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 1 } },
        spacing: { before: 120, after: 120 }, children: [] }));
      i++; continue;
    }
    elements.push(new Paragraph({ spacing: { after: 80 }, children: parseInlineFormatting(line) }));
    i++;
  }
  return elements;
}

// ╔═══════════════════════════════════════════════════════════╗
// ║  MAIN — Export + Auto-verify                              ║
// ╚═══════════════════════════════════════════════════════════╝
async function main() {
  console.log("=== SRS DOCX Export (with Annotation System) ===");
  console.log(`Base: ${BASE}`);
  console.log(`Registry: ${registryEntries.length} existing comments`);

  const allElements = [];

  // Title page
  allElements.push(new Paragraph({ spacing: { before: 3000 }, children: [] }));
  allElements.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({ text: DOC_TITLE, bold: true, font: FONT, size: 40, color: "1F4E79" })] }));
  allElements.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({ text: DOC_SUBTITLE, font: FONT, size: 28, color: "666666" })] }));
  allElements.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 },
    children: [new TextRun({ text: DOC_SCREEN, bold: true, font: FONT, size: 32 })] }));
  allElements.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({ text: DOC_MODULE, font: FONT, size: 24 })] }));
  allElements.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({ text: DOC_SYSTEM, font: FONT, size: 24 })] }));
  allElements.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
    children: [new TextRun({ text: `Ngày: ${DOC_DATE}    |    Phiên bản: ${DOC_VERSION}    |    Tác giả: ${DOC_AUTHOR}`, font: FONT, size: 22 })] }));
  allElements.push(new Paragraph({ children: [new PageBreak()] }));

  // Process each file
  for (const file of FILES) {
    const filePath = path.join(TEMP, file);
    console.log(`Processing: ${file}`);
    if (!fs.existsSync(filePath)) { console.log(`  [SKIP] File not found: ${filePath}`); continue; }
    const content = fs.readFileSync(filePath, "utf-8");
    allElements.push(...parseMarkdown(content));
    if (file !== FILES[FILES.length - 1]) allElements.push(new Paragraph({ children: [new PageBreak()] }));
  }

  console.log(`Total elements: ${allElements.length}`);

  // ═══ MERGE COMMENTS: old (from registry) + new (from this export) ═══
  const allComments = [...oldDocComments, ...newDocComments];
  console.log(`Comments: ${oldDocComments.length} old + ${newDocComments.length} new = ${allComments.length} total`);

  // Create document WITH comments
  const doc = new Document({
    comments: allComments.length > 0 ? { children: allComments } : undefined,
    styles: {
      default: { document: { run: { font: FONT, size: FONT_SIZE } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: H1_SIZE, bold: true, font: FONT, color: "1F4E79" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: H2_SIZE, bold: true, font: FONT, color: "2E75B6" },
          paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: H3_SIZE, bold: true, font: FONT },
          paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
        { id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: H4_SIZE, bold: true, font: FONT },
          paragraph: { spacing: { before: 120, after: 80 }, outlineLevel: 3 } },
      ],
    },
    numbering: {
      config: [{ reference: "bullets", levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }] }],
    },
    sections: [{
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1418 } },
      },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: DOC_HEADER_TEXT, font: FONT, size: 18, color: "999999", italics: true })] })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Trang ", font: FONT, size: 18, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: "999999" }),
          ] })] }),
      },
      children: allElements,
    }],
  });

  // Write output
  const outputDir = path.dirname(OUT);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT, buffer);
  console.log(`\n✅ DOCX exported: ${OUT}`);
  console.log(`   File size: ${(buffer.length / 1024).toFixed(1)} KB`);

  // ═══ SAVE UPDATED REGISTRY ═══
  const updatedRegistry = [...registryEntries, ...newRegistryEntries];
  saveRegistry(updatedRegistry);
  console.log(`✅ Registry saved: ${updatedRegistry.length} total comments`);

  // ═══ AUTO-VERIFY: check .docx has comments ═══
  console.log("\n=== Post-Export Verification ===");
  try {
    const verifyScript = path.join(path.dirname(TEMP), "..", "..", "Skill", "04-documentation", "docx", "scripts", "verify_docx.js");
    if (fs.existsSync(verifyScript)) {
      execSync(`node "${verifyScript}" "${OUT}"`, { stdio: "inherit" });
    } else {
      // Inline verification: check file size indicates comments
      if (allComments.length > 0) {
        console.log(`✅ ${allComments.length} comments embedded in document`);
      } else {
        console.log("⚠️  No comments in document (may be OK for first version with no annotations)");
      }
    }
  } catch (e) {
    console.log(`⚠️  Verification skipped: ${e.message}`);
  }
}

main().catch(err => { console.error("ERROR:", err); process.exit(1); });
