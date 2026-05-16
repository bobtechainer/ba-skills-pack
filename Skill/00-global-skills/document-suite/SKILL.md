---
name: document-suite
description: >
  Unified document skill for Techainer: generate, edit, and co-author professional
  .docx / .md / .pdf documents. Supports any document type (BRD, SRS, HLD, LLD,
  DBD, API Spec, Security Plan, Test Plan, UAT Plan, Deployment Plan, Runbook,
  SLA, SOW, Project Charter — banking or not). Absorbs former `domain-docs` skill.
  Agent dynamically selects standards (IEEE 830, IIBA BABOK, TOGAF, SBV 09/2020,
  OWASP, PCI-DSS) and writing_rules based on brief.
  Supersedes document-suite (generator pipeline), docx (low-level XML + docx-js),
  and document-suite (collaborative workflow).
  Triggers: document, doc, PRD, URD, BRD, SRS, HLD, LLD, proposal, architecture doc,
  report, SOW, RFP, meeting minutes, tracked changes, comments, Word document, .docx,
  tài liệu, báo cáo, đề xuất, yêu cầu, co-author, collaborative writing,
  banking doc, IEEE doc, project doc bundle.
  NOT for: slide decks (use slides-pro/pptx), spreadsheets (use spreadsheet-suite),
  communications (use communications-suite).
role_affinity: [cto, ba, pm, backend_dev, frontend_dev, qa_lead, ops]
domain: [documents, knowledge]
lifecycle_stage: [specification, design, documentation]
produces: [docx, pdf, md, html]
consumes: [md, docx, csv, json, facts.yml, research_notes]
maturity: stable
output_contract:
  default: { format: docx, min_word_count: 5000, no_personal_names: true }
  BRD: { min_word_count: 15000, min_images: 5, no_personal_names: true }
  SRS: { min_word_count: 20000, min_images: 8, no_personal_names: true }
  HLD: { min_word_count: 12000, min_images: 10, no_personal_names: true }
  LLD: { min_word_count: 15000, min_images: 8, no_personal_names: true }
  CHARTER: { min_word_count: 3000, min_images: 1, no_personal_names: true }
  SOW: { min_word_count: 5000, min_images: 2, no_personal_names: true }
  TEST_PLAN: { min_word_count: 10000, min_images: 3, no_personal_names: true }
tier: 1
languages: [en, vi]
modes: [generator, editor, collab]
version: 3.2.0
---

# Document Suite — Unified Document Creation, Editing, and Co-Authoring

The single entry point for any Techainer agent that needs to produce or manipulate
a structured document. Absorbs the former `domain-docs` skill. Supports all
document types — IEEE/IIBA/TOGAF banking docs and general docs — in one unified
pipeline. No `--profile` flag needed: the agent selects the relevant standards
and writing_rules dynamically from the brief, `facts.yml`, and project CLAUDE.md.

| Former skill       | New invocation                         |
|--------------------|----------------------------------------|
| `document-suite`         | `document-suite` with `mode=generator` |
| `docx`             | `document-suite` with `mode=editor`    |
| `document-suite`  | `document-suite` with `mode=collab`    |
| `domain-docs`      | `document-suite` with `mode=generator` (auto-selects IEEE/IIBA/TOGAF/SBV standards) |

See [MIGRATION.md](MIGRATION.md) for full migration details.

---

## Index

| Directory | Contents |
|-----------|---------|
| `templates/` | 19 IEEE/IIBA/TOGAF templates (01_charter → 18_user_manual) + 7 generic templates (urd, prd, rfp-response, report, meeting-minutes, status-update, weekly-digest) |
| `writing_rules/` | anti_slop, banking_tone, bilingual_glossary, doc_profiles, feedback_loop, vietnamese_natural |
| `references/standards/` | 7 standards: ieee_829_testing, ieee_830_srs, iiba_babok_brd, togaf_hld, sbv_09_2020_circular, owasp_stride, pci_dss_iso27001 |
| `references/writing-standards.md` | Generic writing standards (all doc types) |
| `scripts/` | build_doc.js (orchestrator), generate_docx.js, generate_html.js, generate_pdf.js, generate_rtm.js, verify_docs.js, render_diagrams.js, build_all.sh, lib/ |
| `examples/` | sample-prd.md, sample-bundle/ (BRD+SRS+HLD bundle), sample-charter/ |

---

## Hard Rules (violations = doc rejected)

1. **Multi-file MANDATORY for BRD/SRS/HLD/LLD** — each section = `01_xxx.md`, `02_xxx.md` file.
   Single-file generation is BANNED for these types. `build_doc.js` auto-inserts page breaks between files.
2. **NO personal names in body content.** Use roles: "Tech Lead", "BA", "PM", "CEO".
   Names ONLY in `_manifest.json` approvals (sign-off page).
3. **NO `<!-- PAGE_BREAK -->` inside chapter files.** `build_doc.js` handles page breaks between files.
4. **Diagrams as SVG + PNG pair** — generate SVG via diagram-pro, convert to PNG via cairosvg,
   reference `.svg` in markdown. `embedImage()` auto-resolves to `.png` sibling. Both files must exist.
5. **Minimum word counts by doc type:**

   | Doc Type | Min words | Min tables | Min diagrams |
   |----------|-----------|------------|-------------|
   | BRD | 15,000 | 20 | 5 |
   | SRS | 20,000 | 30 | 8 |
   | HLD | 12,000 | 15 | 10 |
   | LLD | 15,000 | 20 | 8 |
   | Charter | 3,000 | 5 | 1 |
   | SOW | 5,000 | 8 | 2 |
   | Test Plan | 10,000 | 15 | 3 |

---

## Mode Selector

Pick **one** mode at the start of the task. Switching modes mid-task is allowed but
must be explicit — each mode has a different pipeline and review model.

### `mode=generator` — Content pipeline (was: document-suite + domain-docs)

Use when the user wants a **new** document produced from requirements. Multi-phase
pipeline: GATHER → PROPOSE → GENERATE → EXPORT. Outputs Markdown source +
validated .docx/.pdf.

### `mode=editor` — Low-level .docx XML / docx-js (was: docx)

Use when the user needs to **edit an existing .docx** (tracked changes, comments,
find-and-replace, image insertion, template-preserving modifications), or when the
generator mode's opinionated output is wrong for the required format.

### `mode=collab` — Structured co-authoring workflow (was: document-suite)

Use when the user is **writing with** the agent rather than delegating. Three
stages: Context Gathering → Refinement & Structure → Reader Testing. Reader
Testing dispatches a fresh sub-agent with no context to catch blind spots.

---

## mode=generator — Professional Document Generator

> **CRITICAL: The PRIMARY deliverable is the .docx file, NOT Markdown.**
> Markdown is the intermediate format used for generation. Phase 4 (EXPORT) is
> mandatory. A task is NOT complete until `{name}.docx` exists and has been
> verified to open cleanly.

### Pipeline

```
Phase 1: GATHER   → Phase 2: PROPOSE → Phase 3: GENERATE → Phase 4: EXPORT
```

### Phase 1: GATHER

1. Parse intent → identify document type:
   - **URD** — User Requirements Document
   - **PRD** — Product Requirements Document
   - **BRD** — Business Requirements Document (IIBA BABOK)
   - **SRS** — Software Requirements Spec (IEEE 830 / ISO 29148)
   - **HLD / LLD** — High / Low Level Design (TOGAF 4+1, ISO 42010)
   - **DBD** — Database Design Document
   - **API Spec** — API Specification (OpenAPI 3.0)
   - **Security Plan** — STRIDE + OWASP + SBV 09/2020
   - **Test Plan** — IEEE 829 Master Test Plan
   - **UAT Plan** — IEEE 829 + ISTQB
   - **Deployment Plan** — ITIL-aligned release plan
   - **Runbook** — ITIL/SRE operational runbook
   - **SLA** — Service Level Agreement
   - **SOW** — Statement of Work
   - **Project Charter** — PMBOK project authorization
   - **Proposal** — Business or technical proposal
   - **Architecture** — ADR, C4 model, architecture overview
   - **Report** — Status / analysis / investigation
   - **RFP Response** — RFP / RFQ response
   - **Meeting Minutes** — Record + action items
   - **Custom** — User describes the structure

2. If the user provides a template file (.docx/.md/.pdf) → enter **Template Mode**.
3. Collect in ONE batch: audience, scope, existing materials, output format,
   tone, language (en / vi / bilingual).
4. Read any referenced files the user provides.
5. If a `facts.yml` exists in the project, treat it as single source of truth
   for numbers — never hardcode cross-doc numbers.
6. **Dynamic standard selection** — load from `references/standards/` based on doc type:
   - BRD → `references/standards/iiba_babok_brd.md`
   - SRS → `references/standards/ieee_830_srs.md`
   - HLD → `references/standards/togaf_hld.md`
   - Test Plan / UAT → `references/standards/ieee_829_testing.md`
   - Security Plan → `references/standards/owasp_stride.md` + `references/standards/pci_dss_iso27001.md`
   - Banking/SBV compliance → `references/standards/sbv_09_2020_circular.md`
7. **Dynamic writing_rules selection** — load based on context:
   - Always: `writing_rules/anti_slop.md`
   - Vietnamese content: `writing_rules/vietnamese_natural.md` + `writing_rules/bilingual_glossary.md`
   - Banking/formal: `writing_rules/banking_tone.md`
   - Profile-based depth: `writing_rules/doc_profiles.md`
8. **Context loading (if project has CLAUDE.md + knowledge/):**
   - Read `knowledge/terminology.yml` → use exact terms in output
   - Read `knowledge/{client}-standards.md` → follow format rules
   - Read `rules/doc-standards.md` → apply page layout, fonts, numbering
   - Read `history/feedback.jsonl` (last 20 entries) → apply learned corrections
   - Read `knowledge/compliance/` → include compliance references where relevant
   - If information is missing for a section → flag as `[TBD - Cần thông tin: ...]`
     and log in `history/open-questions.md` (HITL protocol)
   - When diagrams are needed → trigger `diagram-pro` skill
9. **Proactive research:** Before writing, search `knowledge/` and `knowledge/scanned/`
   for relevant domain information. Use `deep-research` if public info would help.

### Phase 2: PROPOSE

1. Load template from `templates/{type}.md` (or analyze user template).
   - IEEE/IIBA/TOGAF types: use numbered templates `01_charter.md` through `18_user_manual.md`
   - Generic types: use `urd.md`, `prd.md`, `rfp-response.md`, `report.md`, etc.
2. Generate the full outline (headings + 1-line description per section).
3. **Present to user → wait for approval.** Iterate until approved.

### Phase 3: GENERATE

#### Step 0: Load Writing Profile (MANDATORY — before writing anything)

Read `writing_rules/doc_profiles.md` and identify the profile for this doc type.
If no exact profile exists, derive one by answering:
1. Ai đọc? → Tech level (0-3)
2. Đọc xong làm gì? → Must-have content
3. Google 1 từ? → Từ đó thuộc doc khác, không phải doc này

**Apply the profile throughout Phase 3.** Every paragraph must pass the profile's
"Test" criterion. Example: BRD test = "PM đọc mà không cần hỏi dev → đạt."

#### Writing Quality Gate

**The "Đọc To" Test:** Read your paragraph out loud. If it doesn't sound like
explaining to the identified audience — rewrite. Write like explaining
to a colleague, not presenting to a conference.

| AI Slop | Human Version |
|---------|---------------|
| "The system provides comprehensive knowledge management capabilities" | "PM uploads project docs, platform creates a course in 15 minutes" |
| "Seamless integration with third-party systems" | "Odyssey calls `kb.chat.send()` via SDK, gets answer in <2s" |

Apply `writing_rules/anti_slop.md` to every paragraph. Every sentence must carry
a specific fact, number, or action. Delete anything that fails the "so what?" test.

#### Hard Rules in generation (see also top-level Hard Rules section)

1. **NO personal names in body content.** Use roles: "Tech Lead", "BA", "PM".
   Names ONLY in `_manifest.json` approvals (sign-off page).
2. **NO `<!-- PAGE_BREAK -->` inside chapter files.** The build pipeline adds them.
3. **Diagrams: SVG + PNG pair required.** Generate SVG, convert to PNG via
   `cairosvg.svg2png()`, reference `.svg` in markdown. Engine auto-resolves to PNG.
4. **Logo auto-loaded from brand config** — no hardcoded paths.
5. **Minimum content depth:** see output_contract table in YAML frontmatter.
6. **Multi-file MANDATORY for BRD/SRS/HLD/LLD.** Each section = separate file `01_xxx.md`. Single-file banned.

Split generation into independent files for better quality:

| File                       | Purpose                                         |
|----------------------------|-------------------------------------------------|
| `01_xxx.md`, `02_xxx.md`   | One file per major section (H2 boundary)        |
| `diagrams/`                | SVG + PNG diagrams (generated by diagram-pro)   |
| `appendix.md`              | Appendices, data tables, references             |
| `_manifest.json`           | Doc metadata + approval list (for audit)        |

- Apply `references/writing-standards.md`.
- Apply `writing_rules/anti_slop.md`.
- Reference facts as `{{facts.key}}`; resolved at export.
- Reference diagrams as `<!-- DIAGRAM:file.svg Caption -->`.

#### Diagram Generation (MANDATORY for technical docs)

For any section that describes architecture, flows, processes, or data models,
**invoke the `diagram-pro` skill** to generate SVG diagrams:

1. Identify sections needing diagrams (architecture, workflow, data flow, ER, etc.)
2. For each diagram, invoke `diagram-pro` with section context
3. Save SVG to `./diagrams/{name}.svg`
4. Reference in markdown: `<!-- DIAGRAM:{name}.svg Caption -->`
5. The EXPORT phase auto-embeds diagrams into DOCX

**Do NOT skip diagrams.** Professional documents require visual architecture.
If diagram-pro is unavailable, generate ASCII diagrams in code blocks as fallback.

### Phase 4: EXPORT (MANDATORY)

`generate_docx.js` provides full-featured output: cover page, approval table,
bilingual headings, diagram embedding, semantic table widths, professional
header/footer with page numbers, TOC.

For multi-file docs (BRD/SRS/HLD/LLD), always use `build_doc.js` (not `generate_docx.js` directly):

```bash
# Multi-file doc (BRD/SRS/HLD/LLD — MANDATORY path)
BANKING_DOCS_BRAND=<brand> node {baseDir}/scripts/build_doc.js <doc-folder>/ \
    --brand techainer --client <client-slug>

# Rebuild with Word-visible track-changes (ins/del marks between versions)
# Requires a previous build so prev_markdown snapshot exists in _manifest.json.
BANKING_DOCS_BRAND=<brand> node {baseDir}/scripts/build_doc.js <doc-folder>/ \
    --brand techainer --track-changes

# Single-file doc (proposal, report, charter, etc.)
node {baseDir}/scripts/generate_docx.js ./output/{name}.md ./output/{name}.docx \
    --brand techainer \
    --doc-code "PROPOSAL-v1.0" \
    --doc-title-vi "Tên tài liệu tiếng Việt" \
    --doc-title-en "English Document Title" \
    --project-code "PROJECT-CODE" \
    --project-name "Project Name" \
    --vendor "Tbrain AI" \
    --client "Client Name" \
    --version "1.0"

# To skip cover or approval page (e.g., for informal docs):
#   --no-cover       Skip cover page
#   --no-approval    Skip approval table

# PDF (optional)
node {baseDir}/scripts/generate_pdf.js ./output/{name}.md ./output/{name}.pdf

# Cross-doc RTM (after building all docs in a bundle)
node {baseDir}/scripts/generate_rtm.js docs/

# Verify the bundle
node {baseDir}/scripts/verify_docs.js docs/
```

If `{name}.docx` does not exist after export, debug and retry. Do NOT report the
task as complete without a valid .docx file.

#### Font profiles (pick one based on audience)

| Profile | Body font | Heading font | Khi nào dùng |
|---------|-----------|--------------|--------------|
| `arial` *(default)* | Arial 11pt | Arial Bold | AI-native product doc, internal comms, techy audience |
| `banking-pro` | Times New Roman 11pt | Arial Bold | **Recommended for VN banking clients** — serif body + sans heading |
| `banking-serif` | Times New Roman 11pt | Times New Roman Bold | Classic formal doc — hợp đồng, đề xuất highly regulated |

CLI flag: `--font-profile <name>`. Shortcut: `--brand techainer` auto-selects `banking-pro`.

---

## mode=editor — Low-Level .docx Manipulation

A .docx file is a ZIP archive of XML. This mode gives precise control over the
XML for any edit the generator cannot cleanly express.

### Quick reference

| Task                            | Approach                                            |
|---------------------------------|-----------------------------------------------------|
| Read / analyze content          | `pandoc` or `scripts/office/unpack.py`              |
| Create new document             | `docx-js` — see "Creating New Documents" below      |
| Edit existing document          | Unpack → edit XML → repack (3 steps)                |
| Accept all tracked changes      | `python scripts/accept_changes.py in.docx out.docx` |
| Convert .doc → .docx            | `soffice --headless --convert-to docx document.doc` |
| Extract tracked changes         | `pandoc --track-changes=all`                        |

### Creating new documents with docx-js

Install: `npm install -g docx`

Critical rules (these are non-negotiable — each has a failure story behind it):

1. **Set page size explicitly** — docx-js defaults to A4; VN banking clients
   also use A4 (8.27 × 11.69 in, 11906 × 16838 DXA); US clients use Letter
   (12240 × 15840 DXA). Never leave it implicit.
2. **Never use `\n` in TextRun** — use separate Paragraph elements.
3. **Never use unicode bullets** — use `LevelFormat.BULLET` with numbering config.
4. **PageBreak must be inside a Paragraph** — standalone creates invalid XML.
5. **ImageRun requires `type`** — always specify `png` / `jpg` / `jpeg` / etc.
6. **Tables need dual widths** — set `columnWidths` on the table AND `width` on
   each cell; both must match.
7. **Always use `WidthType.DXA`** for tables — `WidthType.PERCENTAGE` breaks in
   Google Docs and Word Online.
8. **Use `ShadingType.CLEAR`** for table shading, not SOLID (SOLID renders black).
9. **TOC requires `HeadingLevel` only** — no custom styles on heading paragraphs.
10. **Include `outlineLevel`** on heading paragraphStyles — required for TOC.
11. **WebP logos do NOT work** with `ImageRun`. Pre-convert to PNG via `sips`
    or Pillow. JPEG is supported natively.
12. **TOC fields render empty** until the user opens in Word and presses F9 —
    document this in each doc's `_README.md`.

### Editing existing documents (3 steps)

```bash
# Step 1: Unpack
python scripts/office/unpack.py document.docx unpacked/

# Step 2: Edit XML files in unpacked/word/ with the Edit tool.
#         Use "Techainer" as the tracked-changes author by default.
#         Use smart-quote XML entities for new content:
#           ' = &#x2019;   ' = &#x2018;
#           " = &#x201C;   " = &#x201D;

# Step 3: Pack
python scripts/office/pack.py unpacked/ output.docx --original document.docx
```

Use the `Edit` tool directly on XML files. Do NOT write Python scripts to do
string replacement — scripts add complexity and hide diffs.

### Tracked changes (author = "Techainer" by default)

```xml
<!-- Insertion -->
<w:ins w:id="1" w:author="Techainer" w:date="2026-04-11T00:00:00Z">
  <w:r><w:t>inserted text</w:t></w:r>
</w:ins>

<!-- Deletion -->
<w:del w:id="2" w:author="Techainer" w:date="2026-04-11T00:00:00Z">
  <w:r><w:delText>deleted text</w:delText></w:r>
</w:del>
```

**Common pitfall:** When deleting an entire paragraph, also mark the paragraph
mark itself as deleted via `<w:del/>` inside `<w:pPr><w:rPr>`, otherwise
accepting changes leaves an empty paragraph.

**Common pitfall:** `<w:commentRangeStart>` and `<w:commentRangeEnd>` are siblings
of `<w:r>`, NEVER inside `<w:r>`.

### Reference docs (load on demand)

- `references/docx_js_patterns.md` — docx-js API patterns
- `references/xml_reference.md` — OOXML schema notes (element order, tracked
  changes, comments, images, footnotes)
- `references/writing-standards.md` — shared with generator mode
- `writing_rules/anti_slop.md` — shared with generator mode

---

## mode=collab — Structured Co-Authoring Workflow

Use when the user is writing **with** the agent, not delegating. Three stages.

### Stage 1 — Context Gathering

Goal: close the gap between what the user knows and what the agent knows.

1. Ask open-ended questions: "What's the goal of this doc? Who reads it? What
   should they do after reading?"
2. Ask for existing context: previous drafts, related docs, chat logs, notes.
3. Confirm the audience's priors (what they already know vs. need explained).
4. Produce a short "context brief" and confirm it with the user before moving on.

### Stage 2 — Refinement & Structure

1. Propose a section outline.
2. For each section: brainstorm → outline → draft → edit → approve.
3. Iterate one section at a time; do not draft the whole doc before user review.
4. Stop and confirm after every major section.

### Stage 3 — Reader Testing

Dispatch a fresh agent instance with NO session context. Give it only the
finished doc and ask it to:

1. Summarize the main argument.
2. List any questions it still has.
3. Flag any confusing or ambiguous passages.

Use its answers as a blind-spot audit. Fix anything the test reader missed or
misunderstood, then re-test.

---

## Templates (load on demand)

### IEEE/IIBA/TOGAF templates (numbered — for formal project docs)

| ID | Template | Standard | Use When |
|----|----------|----------|----------|
| 01 | [templates/01_charter.md](templates/01_charter.md) | PMBOK | Project authorization, high-level scope |
| 02 | [templates/02_sow.md](templates/02_sow.md) | PMBOK | Statement of Work — contractual scope |
| 03 | [templates/03_proposal.md](templates/03_proposal.md) | — | Proposal / pitch doc |
| 04 | [templates/04_brd.md](templates/04_brd.md) | IIBA BABOK | Business Requirements |
| 05 | [templates/05_srs.md](templates/05_srs.md) | IEEE 830 / ISO 29148 | Software Requirements Spec |
| 06 | [templates/06_use_cases.md](templates/06_use_cases.md) | UML / UP | Use Cases & User Stories |
| 07 | [templates/07_hld.md](templates/07_hld.md) | TOGAF 4+1 / ISO 42010 | High Level Design |
| 08 | [templates/08_lld.md](templates/08_lld.md) | ISO 42010 | Low Level Design |
| 09 | [templates/09_dbd.md](templates/09_dbd.md) | ER / Data Dictionary | Database Design |
| 10 | [templates/10_api_spec.md](templates/10_api_spec.md) | OpenAPI 3.0 | API Specification |
| 11 | [templates/11_security_plan.md](templates/11_security_plan.md) | STRIDE + OWASP + SBV 09/2020 | Security Plan |
| 12 | [templates/12_test_plan.md](templates/12_test_plan.md) | IEEE 829 | Master Test Plan |
| 13 | [templates/13_uat_plan.md](templates/13_uat_plan.md) | IEEE 829 + ISTQB | UAT Plan |
| 14 | [templates/14_deployment_plan.md](templates/14_deployment_plan.md) | ITIL | Deployment / Release |
| 15 | [templates/15_runbook.md](templates/15_runbook.md) | ITIL / SRE | Runbook |
| 16 | [templates/16_sla.md](templates/16_sla.md) | ITIL | Service Level Agreement |
| 17 | [templates/17_rtm.md](templates/17_rtm.md) | — | Requirements Traceability Matrix |
| 18 | [templates/18_user_manual.md](templates/18_user_manual.md) | — | User Manual / Admin Guide |
| 19 | [templates/README.md](templates/README.md) | — | Template index |

### Generic templates (for internal/product docs)

| Template | Use When |
|----------|----------|
| [templates/urd.md](templates/urd.md) | User-focused requirements, UX/product team |
| [templates/prd.md](templates/prd.md) | Product roadmap, feature spec, engineering |
| [templates/rfp-response.md](templates/rfp-response.md) | Tender response with compliance matrix |
| [templates/report.md](templates/report.md) | Status / analysis / investigation |
| [templates/meeting-minutes.md](templates/meeting-minutes.md) | Meeting record + action items |
| [templates/status-update.md](templates/status-update.md) | Project RAG status report |
| [templates/weekly-digest.md](templates/weekly-digest.md) | Weekly team summary |

All templates use `{{TOKEN}}` placeholders: `{{PROJECT_NAME}}`, `{{CLIENT_NAME}}`,
`{{VENDOR_NAME}}`, `{{DATE_ISO}}`, `{{AUTHOR}}`, `{{VERSION}}`.
Never leave `{{TOKEN}}` unfilled in output. The quality gate will catch it.

---

## Commands Reference

```bash
# Build a BRD (multi-file, mandatory path)
BANKING_DOCS_BRAND=tbrain node skills/document-suite/scripts/build_doc.js \
  docs/02_analysis/01_brd --brand techainer --client <client-slug>

# Build an SRS
BANKING_DOCS_BRAND=tbrain node skills/document-suite/scripts/build_doc.js \
  docs/02_analysis/02_srs --brand techainer --client <client-slug>

# Build an HLD
BANKING_DOCS_BRAND=tbrain node skills/document-suite/scripts/build_doc.js \
  docs/03_design/01_hld --brand techainer --client <client-slug>

# Security Plan with compliance appendix
node skills/document-suite/scripts/build_doc.js docs/03_design/05_security_plan \
  --brand techainer --client <client-slug> --compliance-domain sbv-tt09,pci-dss

# Cross-doc RTM (run after all docs are built)
node skills/document-suite/scripts/generate_rtm.js docs/

# Verify the full bundle
node skills/document-suite/scripts/verify_docs.js docs/

# Generate a PRD / proposal (single-file)
node skills/document-suite/scripts/generate_docx.js output/my-prd.md output/my-prd.docx \
  --brand techainer --font-profile banking-pro

# Generate PDF
node skills/document-suite/scripts/generate_pdf.js output/doc.md output/doc.pdf
```

### use_skill() invocations (agent tool)

```js
// Generate a full BRD
use_skill("document-suite", {
  mode: "generator",
  doc_type: "BRD",
  project_name: "CoreLink Integration",
  facts_file: "docs/_research/facts.yml",
  brand: "techainer",
  client: "<client-slug>",
  output_dir: "docs/02_analysis/01_brd/"
})

// Generate a Security Plan with SBV compliance appendix
use_skill("document-suite", {
  mode: "generator",
  doc_type: "security-plan",
  facts_file: "docs/_research/facts.yml",
  brand: "techainer",
  client: "vcb",
  compliance_domain: "sbv-tt09,pci-dss",
  output_dir: "docs/03_design/05_security_plan/"
})

// Generate a PRD from a project brief
use_skill("document-suite", {
  mode: "generator",
  doc_type: "PRD",
  project_name: "My Project",
  client: "ACME Corp",
  source_files: ["brief.md", "facts.yml"],
  brand: "techainer",
  language: "en",
  output_dir: "./output/prd/"
})

// Co-author a proposal interactively
use_skill("document-suite", {
  mode: "collab",
  doc_type: "proposal",
  project_name: "New Platform",
  client: "VCB"
})

// Edit an existing DOCX (tracked changes)
use_skill("document-suite", {
  mode: "editor",
  input_file: "./existing-doc.docx",
  instruction: "Add a Risk section after section 5"
})
```

---

## Quality Checklist (check before returning output)

### Per-document checklist

**Hard rules (auto-reject if violated):**
- [ ] **NO personal names in body content** — grep for team member names, must return 0 hits
- [ ] **NO `<!-- PAGE_BREAK -->` inside chapter files** — `build_doc.js` handles page breaks
- [ ] **Every `.svg` diagram has a `.png` sibling** — `embedImage()` needs PNG for DOCX
- [ ] **Word count meets minimum** for doc type (see output_contract in YAML frontmatter)
- [ ] **Logo loaded from brand config** — no hardcoded logo path in content

**Content quality:**
- [ ] All `{{facts.*}}` placeholders resolved (no literal `{{facts.` in output)
- [ ] Bilingual: every H1 and H2 has `# Vietnamese / English` format (for bilingual docs)
- [ ] Approval table present with signatory rows from `_manifest.json`
- [ ] No "Lorem ipsum", "TODO", or "<!-- FILL" left in final output
- [ ] Version stamp, date, classification label on cover page
- [ ] Page numbers in footer (format: Page X / Y)
- [ ] DOCX file exists, non-zero bytes, opens without repair prompt
- [ ] `_manifest.json` present with correct version and date

**Structure:**
- [ ] Multi-file: BRD/SRS/HLD/LLD broken into `NN_section.md` files
- [ ] File ordering: all section files have 2-digit prefix (01_, 02_, ...) for correct sort
- [ ] Diagrams meet minimums: BRD ≥5, SRS ≥8, HLD ≥10
- [ ] Every diagram referenced in markdown: `<!-- DIAGRAM:file.svg Caption -->`
- [ ] Used `build_doc.js` for multi-file docs (NOT `generate_docx.js` directly)

---

## Anti-Slop Quality Gate (all modes)

- No filler phrases ("In today's rapidly evolving landscape", "It's important to note that").
- No generic buzzwords ("leverage", "synergy", "paradigm shift").
- No hedged assertions ("This could potentially help" → "This helps").
- No redundant summaries at section ends.
- Every sentence must carry information. If removing it doesn't lose meaning, remove it.
- Data-backed claims require sources.

See `writing_rules/anti_slop.md` for the full list.

---

## Completion Criteria

A `document-suite` task is complete only when ALL of these hold:

1. Mode was declared at the start and held consistently.
2. For `mode=generator`: `{name}.docx` exists in output dir, non-zero bytes, opens
   cleanly in Word / LibreOffice.
3. For `mode=editor`: The edited .docx opens without repair prompts.
4. For `mode=collab`: Reader-test feedback has been addressed.
5. Final message to user includes the concrete file path.

If any condition fails, fix it before responding to the user.

---

## Progress Reporting

```
▶ document-suite [mode=generator] Phase N/4: {PHASE_NAME}
  → {what's happening now}
  ✓ {what was completed}
  ⏳ {what's next}
```

---

## Composition

### As Producer
Outputs: `./output/{name}.md`, `./output/{name}.docx`, optionally `.pdf` / `.html`.

### As Consumer
Accepts: reference files (MD, DOCX, PDF), template files, data files (CSV, JSON),
`facts.yml`, `findings.md` from `planning-with-files`, research notes from
`deep-research`.

### Upstream skills
`planning-with-files`, `deep-research`, `debug-bug` (for investigation reports).

### Downstream skills
`communications-suite` (for cover emails / announcements), `pdf` (for post-processing).

## Quality Contract

Output MUST self-verify against [`skills/_shared/DESIGN_STANDARDS.md`](../_shared/DESIGN_STANDARDS.md) before returning.

**Document-suite-specific checklist (self-certify before export):**

- [ ] Typography: headings Georgia serif, body Inter 11–12pt (print) / 14–16px (screen)
- [ ] Body line-height: 1.55 minimum for readability
- [ ] Max 3 H2 sections per page — subsections H3 only
- [ ] Colors via semantic tokens — no raw hex hardcoded in templates
- [ ] All text-on-background contrast ≥ 4.5:1 (body) and ≥ 3:1 (large text/headings)
- [ ] Tables: header row in brand-primary with white text (contrast ≥ 4.5:1)
- [ ] No emoji in professional documents unless explicitly requested
- [ ] Every section title is an assertion (Pyramid Principle) — not a topic label
- [ ] Evidence before claims: numbers/data cited, not just adjectives
- [ ] Logo clear space ≥ 24px around logo; max-height equivalent to 56px
