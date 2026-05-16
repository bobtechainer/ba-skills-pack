/**
 * Cover page + approval/signature page builder — brand-agnostic.
 *
 * Produces:
 *   - Cover section: Vendor logo (left) + Client logo (right, optional),
 *     bilingual VI/EN title, doc code, version, date, classification stamp.
 *   - Approval section: sign-off table with configurable roles from brand config,
 *     signature lines.
 *
 * Brand + client are loaded from config, not hardcoded. If no client logo
 * is configured, the cover renders vendor logo only (centered).
 */
const fs = require('fs');
const path = require('path');
const {
  Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, HeightRule, VerticalAlign,
  PageBreak,
} = require('docx');
const { COLORS, FONT, PAGE, TABLE_TOTAL_WIDTH, LOGOS } = require('./brand');

// ── i18n strings for cover + approval pages ─────────────────
const STRINGS = {
  vi: {
    docCode: 'Mã tài liệu',
    version: 'Phiên bản',
    issueDate: 'Ngày phát hành',
    project: 'Dự án',
    approval: 'Phê duyệt tài liệu',
    role: 'Vai trò',
    name: 'Họ và tên',
    title: 'Chức danh',
    signature: 'Chữ ký',
    date: 'Ngày',
    approvalIntro: 'Tài liệu này sẽ có hiệu lực chính thức sau khi được tất cả các bên dưới đây ký và đóng dấu.',
    approvalFooter: 'Khi được ký phê duyệt, tài liệu này thay thế mọi phiên bản trước.',
    toc: 'Mục lục',
    defaultTitle: 'Tài liệu Dự án',
  },
  en: {
    docCode: 'Document Code',
    version: 'Version',
    issueDate: 'Issue Date',
    project: 'Project',
    approval: 'Document Approval',
    role: 'Role',
    name: 'Name',
    title: 'Title',
    signature: 'Signature',
    date: 'Date',
    approvalIntro: 'This document becomes effective once signed by all parties below.',
    approvalFooter: 'Once signed, this document supersedes all prior versions.',
    toc: 'Table of Contents',
    defaultTitle: 'Project Document',
  },
};

function pickStrings(locale) {
  return STRINGS[locale] || STRINGS.vi;
}

// ── Logo cell: render logo image inside a borderless cell ────────
function logoCell(logoPath, widthPx, alignment) {
  let imageChildren;
  if (fs.existsSync(logoPath)) {
    imageChildren = [
      new ImageRun({
        type: 'png',
        data: fs.readFileSync(logoPath),
        transformation: { width: widthPx, height: Math.floor(widthPx * 0.32) },
        altText: { title: 'Logo', description: 'Company logo', name: 'logo' },
      }),
    ];
  } else {
    imageChildren = [new TextRun({ text: '[logo missing]', font: FONT.MAIN, size: 18, color: COLORS.TEXT_LIGHT })];
  }
  return new TableCell({
    width: { size: Math.floor(TABLE_TOTAL_WIDTH / 2), type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment, children: imageChildren })],
  });
}

/**
 * Build cover page elements.
 *
 * @param {object} meta
 * @param {string} meta.doc_title_vi  - Vietnamese title
 * @param {string} meta.doc_title_en  - English title
 * @param {string} meta.doc_code      - Doc code e.g. "BRD-v1.0"
 * @param {string} meta.project_code  - Project code e.g. "TBRAIN-KTP-2026"
 * @param {string} meta.project_name  - Project full name
 * @param {string} meta.version       - Version string
 * @param {string} meta.date          - Date string (yyyy-mm-dd or dd/mm/yyyy)
 * @param {string} meta.classification - e.g. "CONFIDENTIAL — Restricted"
 * @param {string} meta.vendor        - Vendor name (from brand config)
 * @param {string} meta.client        - Client name (optional, from --client flag)
 * @returns {Paragraph[]}
 */
function buildCoverPage(meta, docDir) {
  const elements = [];
  const S = pickStrings(meta && meta.locale);

  // _client/ sidecar overrides
  let localColors = { ...COLORS };
  let localLogos = { ...LOGOS };
  let localMeta = { ...meta };
  const clientDir = path.join(docDir || '', '_client');
  if (fs.existsSync(clientDir)) {
    // Override colors
    const colorsPath = path.join(clientDir, 'colors.json');
    if (fs.existsSync(colorsPath)) {
      const cc = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
      if (cc.primary) localColors.PRIMARY = cc.primary;
      if (cc.secondary) localColors.SECONDARY = cc.secondary;
    }
    // Override logo
    const logoPath = path.join(clientDir, 'logo.png');
    if (fs.existsSync(logoPath)) localLogos.CLIENT = logoPath;
    // Override meta from cover_override.json
    const overridePath = path.join(clientDir, 'cover_override.json');
    if (fs.existsSync(overridePath)) {
      const ov = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
      Object.assign(localMeta, ov);
    }
  }

  // Top spacer
  elements.push(new Paragraph({ spacing: { before: 600, after: 0 }, children: [] }));

  // Logos row: Vendor left, Client right (if configured)
  const vendorLogoPath = localLogos.VENDOR;
  const clientLogoPath = localLogos.CLIENT;
  const hasClientLogo = clientLogoPath && fs.existsSync(clientLogoPath);
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder };

  if (vendorLogoPath && hasClientLogo) {
    // Two logos: vendor left, client right
    const logoTable = new Table({
      width: { size: TABLE_TOTAL_WIDTH, type: WidthType.DXA },
      columnWidths: [Math.floor(TABLE_TOTAL_WIDTH / 2), Math.floor(TABLE_TOTAL_WIDTH / 2)],
      borders: noBorders,
      rows: [new TableRow({
        height: { value: 2000, rule: HeightRule.ATLEAST },
        children: [logoCell(vendorLogoPath, 200, AlignmentType.LEFT), logoCell(clientLogoPath, 150, AlignmentType.RIGHT)],
      })],
    });
    elements.push(logoTable);
  } else if (vendorLogoPath) {
    // Single logo: centered, full width — no empty second cell
    const logoTable = new Table({
      width: { size: TABLE_TOTAL_WIDTH, type: WidthType.DXA },
      columnWidths: [TABLE_TOTAL_WIDTH],
      borders: noBorders,
      rows: [new TableRow({
        height: { value: 2000, rule: HeightRule.ATLEAST },
        children: [logoCell(vendorLogoPath, 240, AlignmentType.CENTER)],
      })],
    });
    elements.push(logoTable);
  }

  // "Vendor × Client" text (skip client part if not configured)
  const vendorName = localMeta.vendor || '';
  const clientName = localMeta.client || '';
  const partiesText = clientName ? `${vendorName}   \u00d7   ${clientName}` : vendorName;
  if (partiesText) {
    elements.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 200 },
      children: [
        new TextRun({
          text: partiesText,
          font: FONT.MAIN, size: 22, color: localColors.TEXT_LIGHT || COLORS.TEXT_LIGHT, italics: true,
        }),
      ],
    }));
  }

  // Horizontal rule (brand primary color)
  elements.push(new Paragraph({
    spacing: { before: 100, after: 400 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: localColors.PRIMARY, space: 4 } },
    children: [],
  }));

  // Project name banner
  const projectFallback = (meta && meta.locale === 'en')
    ? (localMeta.doc_title_en || S.defaultTitle)
    : (localMeta.doc_title_vi || S.defaultTitle);
  const projectName = localMeta.project_name || projectFallback || '';
  if (projectName) {
    elements.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [new TextRun({
        text: projectName.toUpperCase(),
        font: FONT.MAIN, size: 32, bold: true, color: localColors.PRIMARY,
      })],
    }));
  }

  // Bilingual title — Vietnamese line
  const primaryTitle = (meta && meta.locale === 'en')
    ? (localMeta.doc_title_en || localMeta.doc_title_vi || S.defaultTitle)
    : (localMeta.doc_title_vi || localMeta.doc_title_en || S.defaultTitle);
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 120 },
    children: [new TextRun({
      text: primaryTitle,
      font: FONT.MAIN, size: 44, bold: true, color: localColors.PRIMARY,
    })],
  }));

  // Bilingual title — English line (optional)
  const secondaryTitle = (meta && meta.locale === 'en')
    ? (localMeta.doc_title_vi && localMeta.doc_title_vi !== primaryTitle ? localMeta.doc_title_vi : null)
    : (localMeta.doc_title_en && localMeta.doc_title_en !== primaryTitle ? localMeta.doc_title_en : null);
  if (secondaryTitle) {
    elements.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 600 },
      children: [new TextRun({
        text: secondaryTitle,
        font: FONT.MAIN, size: 28, italics: true, color: localColors.SECONDARY,
      })],
    }));
  }

  // Doc code + version + date block (locale-aware labels)
  const metaLines = [
    [`${S.docCode}:`, localMeta.doc_code || 'DOC-v1.0'],
    [`${S.version}:`, localMeta.version || '1.0'],
    [`${S.issueDate}:`, localMeta.date || new Date().toISOString().slice(0, 10)],
    [`${S.project}:`, localMeta.project_code || ''],
  ];
  for (const [label, value] of metaLines) {
    elements.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({ text: `${label} `, font: FONT.MAIN, size: 22, color: localColors.TEXT_LIGHT || COLORS.TEXT_LIGHT }),
        new TextRun({ text: value, font: FONT.MAIN, size: 22, bold: true, color: localColors.TEXT_BODY || COLORS.TEXT_BODY }),
      ],
    }));
  }

  // Classification stamp
  const stampColor = localColors.CLIENT_PRIMARY || COLORS.CLIENT_PRIMARY || COLORS.ACCENT;
  const classificationText = localMeta.classification || localMeta.classification_short || 'CONFIDENTIAL';
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 800, after: 0 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 6, color: stampColor, space: 8 },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: stampColor, space: 8 },
    },
    children: [new TextRun({
      text: classificationText,
      font: FONT.MAIN, size: 20, bold: true, color: stampColor,
    })],
  }));

  // Page break to approval page
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  return elements;
}

/**
 * Build approval / sign-off table section.
 *
 * @param {object} meta
 * @param {Array<{role:string, name:string, title:string, party:string}>} meta.approvals
 */
function buildApprovalPage(meta, docDir) {
  const elements = [];
  const S = pickStrings(meta && meta.locale);

  // _client/ sidecar overrides for approval page
  let localColors = { ...COLORS };
  let localMeta = { ...meta };
  const clientDir = path.join(docDir || '', '_client');
  if (fs.existsSync(clientDir)) {
    // Override colors
    const colorsPath = path.join(clientDir, 'colors.json');
    if (fs.existsSync(colorsPath)) {
      const cc = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
      if (cc.primary) localColors.PRIMARY = cc.primary;
      if (cc.secondary) localColors.SECONDARY = cc.secondary;
    }
    // Override approval roles from YAML
    const rolesPath = path.join(clientDir, 'approval_roles.yml');
    if (fs.existsSync(rolesPath)) {
      try {
        const rolesContent = fs.readFileSync(rolesPath, 'utf8');
        // Simple YAML array parser for approval roles
        const approvals = [];
        let current = null;
        for (const line of rolesContent.split('\n')) {
          const itemMatch = line.match(/^-\s+(.*)$/);
          const kvMatch = line.match(/^\s+(\w+):\s*(.+)$/);
          if (itemMatch) {
            if (current) approvals.push(current);
            current = {};
            const inlineKv = itemMatch[1].match(/^(\w+):\s*(.+)$/);
            if (inlineKv) current[inlineKv[1]] = inlineKv[2].trim();
          } else if (kvMatch && current) {
            current[kvMatch[1]] = kvMatch[2].trim();
          }
        }
        if (current) approvals.push(current);
        if (approvals.length > 0) localMeta.approvals = approvals;
      } catch (_) { /* ignore parse errors */ }
    }
    // Override meta from cover_override.json
    const overridePath = path.join(clientDir, 'cover_override.json');
    if (fs.existsSync(overridePath)) {
      const ov = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
      Object.assign(localMeta, ov);
    }
  }

  elements.push(new Paragraph({
    spacing: { before: 400, after: 240 },
    children: [new TextRun({
      text: S.approval,
      font: FONT.MAIN, size: 32, bold: true, color: localColors.PRIMARY,
    })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: localColors.PRIMARY, space: 4 } },
  }));

  elements.push(new Paragraph({
    spacing: { before: 120, after: 240 },
    children: [new TextRun({
      text: S.approvalIntro,
      font: FONT.MAIN, size: 20, color: COLORS.TEXT_LIGHT, italics: true,
    })],
  }));

  // Approval table: Role | Name | Title | Party | Signature | Date
  const headerCells = [S.role, S.name, S.title, S.signature, S.date];
  const colWidths = [
    Math.floor(TABLE_TOTAL_WIDTH * 0.18),
    Math.floor(TABLE_TOTAL_WIDTH * 0.22),
    Math.floor(TABLE_TOTAL_WIDTH * 0.25),
    Math.floor(TABLE_TOTAL_WIDTH * 0.20),
    0,
  ];
  colWidths[4] = TABLE_TOTAL_WIDTH - colWidths.slice(0, 4).reduce((a, b) => a + b, 0);

  const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: COLORS.TABLE_BORDER };
  const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

  const headerRow = new TableRow({
    tableHeader: true,
    height: { value: 500, rule: HeightRule.ATLEAST },
    children: headerCells.map((t, i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: COLORS.TABLE_HEADER },
      borders: cellBorders,
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 80 },
        children: [new TextRun({ text: t, font: FONT.MAIN, size: 20, bold: true, color: localColors.PRIMARY })],
      })],
    })),
  });

  // Build default approvals from brand config approval_roles (e.g., ["Project Manager", "Tech Lead", "CTO"])
  // or from meta.vendor / meta.client names. No hardcoded vendor/client names.
  const vendorShort = localMeta.vendor || '';
  const clientShort = localMeta.client || '';
  const configRoles = require('./brand').META.approval_roles || ['Prepared by', 'Reviewed by', 'Approved by'];
  const defaultApprovals = configRoles.map((r) => ({
    role: r,
    name: '',
    title: vendorShort ? `${r}, ${vendorShort}` : r,
  }));
  // Add client approval rows if client is specified
  if (clientShort) {
    defaultApprovals.push({ role: `Reviewed by (${clientShort})`, name: '', title: `Reviewer, ${clientShort}` });
    defaultApprovals.push({ role: `Approved by (${clientShort})`, name: '', title: `Approver, ${clientShort}` });
  }

  const approvals = localMeta.approvals && localMeta.approvals.length ? localMeta.approvals : defaultApprovals;

  const bodyRows = approvals.map((a) => new TableRow({
    height: { value: 1200, rule: HeightRule.ATLEAST },
    children: [
      new TableCell({
        width: { size: colWidths[0], type: WidthType.DXA },
        borders: cellBorders,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [new TextRun({ text: a.role, font: FONT.MAIN, size: 20, bold: true, color: COLORS.TEXT_BODY })],
        })],
      }),
      new TableCell({
        width: { size: colWidths[1], type: WidthType.DXA },
        borders: cellBorders,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [new TextRun({ text: a.name || '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0', font: FONT.MAIN, size: 20, color: COLORS.TEXT_BODY })],
        })],
      }),
      new TableCell({
        width: { size: colWidths[2], type: WidthType.DXA },
        borders: cellBorders,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [new TextRun({ text: a.title, font: FONT.MAIN, size: 20, color: COLORS.TEXT_LIGHT })],
        })],
      }),
      new TableCell({
        width: { size: colWidths[3], type: WidthType.DXA },
        borders: cellBorders,
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: '\u00a0', font: FONT.MAIN, size: 20 })] })],
      }),
      new TableCell({
        width: { size: colWidths[4], type: WidthType.DXA },
        borders: cellBorders,
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: '\u00a0', font: FONT.MAIN, size: 20 })] })],
      }),
    ],
  }));

  const approvalTable = new Table({
    width: { size: TABLE_TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...bodyRows],
  });

  elements.push(approvalTable);

  // Footer note
  elements.push(new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [new TextRun({
      text: S.approvalFooter,
      font: FONT.MAIN, size: 18, italics: true, color: COLORS.TEXT_LIGHT,
    })],
  }));

  // Page break to body
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  return elements;
}

module.exports = { buildCoverPage, buildApprovalPage, pickStrings, STRINGS };
