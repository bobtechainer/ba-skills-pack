# CHANGELOG — document-suite

## [3.2.0] — 2026-04-17

### Added
- **Full Word-visible track-changes via `--track-changes` flag** in `build_doc.js`.
  - When set and a previous build exists, the generated DOCX opens in Word with revision marks: insertions in green/underline (`<w:ins>`) and deletions in red/strikethrough (`<w:del>`), author "Techainer", date = today.
  - Algorithm: paragraph-level diff via `diffArrays` (npm `diff`); word-level diff via `diffWords` for changed body-text paragraphs. Structural elements (headings, tables, code blocks, lists) rendered normally.
  - Persistence: after each successful build, `_manifest.json.prev_markdown` stores the concatenated markdown snapshot for the next `--track-changes` run.
  - Implementation files changed: `scripts/generate_docx.js` (added `InsertedTextRun`/`DeletedTextRun` logic + `parseMarkdownWithDiff`), `scripts/build_doc.js` (added flag + snapshot persistence).
- `diff` npm package installed (word-level and array diff).

### Constraints / known limitations
- Tables, code blocks, headings, and list items are NOT tracked at word level — entire block shows as deleted+inserted if it changed (this is a docx-js limitation; complex XML structure inside revision marks).
- `--track-changes` on first build (no prior snapshot) emits a normal DOCX with a log message.
- `prev_markdown` snapshot stored as a JSON string field in `_manifest.json`; large docs may grow the manifest. Future: store as a separate `_prev_markdown.txt` file.

---

## [3.1.0] — 2026-04-17

### Added (feedback-driven)
- **Track-changes-lite in `build_doc.js`** — per-build section diff via SHA-256 hashes of each `.md` file.
  - Emits `_changes.md` alongside each DOCX: shows Modified/Added/Removed/Unchanged files with version delta (e.g., `v2.1 → v2.2`).
  - Persists `file_hashes` + `history[]` in `_manifest.json` for audit trail across versions.
  - Zero new CLI flags — auto-runs on every build.
- Fix feedback: "lúc gen new đã có option track change + tăng version chưa?" — version bump existed, track-changes did not.

### Note
- Full in-document track-changes (Word-visible `<w:ins>`/`<w:del>` XML marks between versions) is NOT implemented — would require diff-match-patch + docx-js revision runs (~2h). Section-level diff via `_changes.md` covers the common "what changed between v1.0 and v1.1?" question.

---

## [3.0.0] — 2026-04-17

### Changed (MAJOR — absorbed domain-docs skill)
- Merged `domain-docs` skill into `document-suite`. Single entry point for all document generation (BRD, SRS, HLD, LLD, proposals, SOW, reports, PRD, URD — banking or not).
- No `--profile` flag needed. Agent selects references/writing_rules dynamically based on brief + facts.yml + project CLAUDE.md.
- Previous `domain-docs` usage: `BANKING_DOCS_BRAND=<x> node skills/domain-docs/scripts/build_doc.js <dir>` → now `BANKING_DOCS_BRAND=<x> node skills/document-suite/scripts/build_doc.js <dir>`.

### Added (from domain-docs)
- 19 IEEE/IIBA/TOGAF-aligned templates (01_charter → 18_user_manual)
- Multi-file build pipeline (`build_doc.js` orchestrator)
- Bilingual VI/EN DOCX with dual-logo cover, TOC, semantic table widths
- 7 standards references (`references/standards/`)
- 6 writing rules (`writing_rules/`)
- `writing_rules/feedback_loop.md` — self-improve protocol
- `writing_rules/vietnamese_natural.md` — natural Vietnamese rules

---

(keep the rest of the original CHANGELOG entries below here as [2.2.0], [2.1.0], [2.0.0])

## [2.2.0] — 2026-04-17

### Added (from feedback)
- **TOC (Table of Contents)** in `scripts/generate_docx.js` — Word auto-updates on open. Fix feedback: "không thấy TOC đâu".
- **`writing_rules/vietnamese_natural.md`** — 7 nguyên tắc viết tiếng Việt tự nhiên (không máy móc). Fix feedback: "nghe như robot đọc slide".
- **`writing_rules/feedback_loop.md`** — Quy trình tự cải thiện skill từ user feedback (4 bước: nhận diện → log → upgrade → bump version). Fix feedback: "có thể thêm skill để nếu không đáp ứng được thì improve upgrade skill dựa trên feedback không".
- **BRD metadata fields** — Sponsor/Requester, Author, Delivery team, End users (all generic placeholders, values from `facts.yml` per project — no hardcoded role names). Fix feedback: old template had `Vendor:` which conflated commercial relationship with requirement ownership.

### Changed
- **H3 heading color** `COLORS.LIGHT` → `COLORS.SECONDARY` — readable contrast on white background.
- **SKILL.md** — Reference vietnamese_natural.md + feedback_loop.md in Writing Quality Gate.

### Source
- Feedback from: Tbrain Knowledge Training Platform (TBRAIN-KTP-2026), 2026-04-17
- Context: PO lên BRD cho BOD Tbrain review. 12 chapters rewritten with natural Vietnamese.

---

## [2.1.0] — 2026-04-15

### Added
- Brand-agnostic: `_shared/brands/<slug>.json` + `brand-context/clients/<slug>/` loader
- Bilingual VI/EN dual-logo cover page
- Multi-file MANDATORY enforcement (`01_xxx.md`, `02_xxx.md`)
- Diagram embedding (`<!-- DIAGRAM:xxx.svg -->` auto-resolves SVG→PNG)

### Changed
- Auto-version bump (1.0→1.1); `--no-bump` / `--major` flags

---

## [2.0.0] — 2026-03-20

### Added
- Initial release with IEEE 830 SRS, IIBA BABOK BRD, TOGAF HLD standards
- DOCX + PDF + HTML output via `build_doc.js`
- Output contract enforcement (min word count, min images, no personal names)
