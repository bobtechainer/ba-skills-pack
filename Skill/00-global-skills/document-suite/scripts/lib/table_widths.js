/**
 * Semantic column width heuristic for banking documentation tables.
 *
 * Forked from tbrain-robot/proposals/generate_proposals.js computeColumnWidths,
 * extended with banking-specific patterns (Requirement IDs, Priority, Status,
 * Regulation references, Test Case IDs, etc.).
 *
 * Weights are normalized against TABLE_TOTAL_WIDTH in generate_docx.js so that
 * column widths always sum exactly to content width (no drift, no overflow).
 */

// Content-heavy columns (multi-paragraph text) — substring match
const WIDE_CONTENT = /(Deliverable|Description|Notes|Rationale|Details|Mitigation|Verdict|Remark|Focus|Explanation|Comment|Reasoning|Requirement|Acceptance Criteria|Expected Result|Actual Result|Business Rule|User Story|Scenario|Steps|Action|Resolution|Root Cause|Recommendation|Impact|Controls?|Evidence|Mapping|M\u00f4 t\u1ea3|N\u1ed9i dung|Ghi ch\u00fa|Y\u00eau c\u1ea7u|Bi\u1ec7n ph\u00e1p|L\u00fd do)/i;

// Narrow numeric / label columns — anchored exact match
const NARROW_NUMERIC = /^(Week|Day|Yr|Year|Qty|Hrs|Hours|Count|Num|No\.?|Wk|Q\d|Version|V\d|%|Percentage|SLA|RTO|RPO|Tu\u1ea7n|Ng\u00e0y|Th\u00e1ng|N\u0103m)$/i;

// Short ID / status / flag columns
const SHORT_ID = /^(#|A|B|C|ID|OK|Y\/N|Yes\/No|Priority|Status|Severity|Type|Level|H\/M\/L|Pass\/Fail|FR|NFR|BR|TC|UC|M\/O|\u0110\u1ed9 \u01b0u ti\u00ean|Tr\u1ea1ng th\u00e1i)$/i;

// Medium ID columns (requirement/test case ID references)
const MEDIUM_ID = /^(FR-\d+|NFR-\d+|BR-\d+|TC-\d+|UC-\d+|Req ID|M\u00e3 y\u00eau c\u1ea7u|M\u00e3 TC)$/i;

/**
 * Compute DXA column widths for a table header row.
 *
 * @param {string[]} headerRow - Array of header cell texts.
 * @param {number} tableTotalWidth - Total table width in DXA units.
 * @returns {number[]} Array of column widths in DXA, summing exactly to tableTotalWidth.
 */
function computeColumnWidths(headerRow, tableTotalWidth) {
  const weights = headerRow.map((h) => {
    const trimmed = (h || '').trim();
    if (SHORT_ID.test(trimmed)) return 0.3;
    if (MEDIUM_ID.test(trimmed)) return 0.55;
    if (NARROW_NUMERIC.test(trimmed)) return 0.5;
    if (WIDE_CONTENT.test(trimmed)) return 1.8;
    if (trimmed.length <= 5) return 0.9;
    if (trimmed.length <= 10) return 1.0;
    if (trimmed.length <= 15) return 1.15;
    return 1.3;
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
  const widths = weights.map((w) => Math.floor((w / totalWeight) * tableTotalWidth));

  // Absorb rounding drift into the last column so sum == tableTotalWidth exactly.
  const diff = tableTotalWidth - widths.reduce((a, b) => a + b, 0);
  widths[widths.length - 1] += diff;

  return widths;
}

module.exports = { computeColumnWidths };
