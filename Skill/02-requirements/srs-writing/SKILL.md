---
name: srs-writing
description: >-
  Use when creating a new SRS or editing an existing SRS.
  Orchestrates brainstorming, template selection, HTML preview generation,
  user review, and Word export.
  STOP if you are about to write SRS content without completing brainstorming first.
  STOP if you are about to export .docx without user reviewing HTML preview first.
  STOP if you are about to save a file without using the mandatory folder structure.
metadata:
  category: discipline
  triggers: SRS, viết SRS, tạo SRS, sửa SRS, edit SRS, URD, đặc tả, spec, yêu cầu, requirements, cập nhật SRS, feedback, chỉnh sửa
---

# SRS Writing — Orchestrator viết & sửa SRS

**Violating the letter of these rules IS violating the spirit of these rules.**

This skill is a **pipeline orchestrator**. It calls other skills in a fixed sequence. You NEVER generate SRS content yourself — you call skills and follow their output.

> [!CAUTION]
> **MANDATORY SKILL USAGE:**
> Bất kỳ khi nào tạo mới HOẶC sửa SRS → BẮT BUỘC phải dùng skill này (`Skill/02-requirements/srs-writing/SKILL.md`).
> Không được tự viết SRS mà không invoke skill này.
> PHẢI mở SKILL.md → đọc → làm theo pipeline.

---

## Index — Modular Rules

| File                                                                      | Nội dung                                                         |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [completeness_rules.md](references/writing_rules/completeness_rules.md)   | Actor+Logic pattern, API, UI chrome, Popup, Pagination           |
| [banking_field_rules.md](references/writing_rules/banking_field_rules.md) | Format số tiền, Grid tabs, File upload, Enable/Disable, Validate |
| [annotation_rules.md](references/writing_rules/annotation_rules.md)       | Tags, Comment registry, Convention detection, Verification       |
| [readability_rules.md](references/writing_rules/readability_rules.md)     | `<br>` insertion, "Đọc To" test, Image paths                     |
| [confluence-ref.md](references/confluence-ref.md)                         | Auto-resolve `[CROSS-REF]` → Confluence links via KI pages_index |

### Imported from document-suite (`Skill/00-global-skills/document-suite/`)

| File                                                                                            | Nội dung                                                                   |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [anti_slop.md](../00-global-skills/document-suite/writing_rules/anti_slop.md)                   | Banned phrases, claim→evidence discipline, "So what" test                  |
| [doc_profiles.md](../00-global-skills/document-suite/writing_rules/doc_profiles.md)             | Audience→tech level→tone selection. SRS = Level 3 Precise.                 |
| [bilingual_glossary.md](../00-global-skills/document-suite/writing_rules/bilingual_glossary.md) | Thuật ngữ VI-EN chuẩn cho banking                                          |
| [banking_tone.md](../00-global-skills/document-suite/writing_rules/banking_tone.md)             | Giọng văn chuyên nghiệp banking                                            |
| [Font profiles](../00-global-skills/document-suite/SKILL.md)                                    | 3 font profiles: `arial`, `banking-pro` **(recommended)**, `banking-serif` |

**RULE:** Trước khi viết (Step 3), ĐỌC `doc_profiles.md` → xác nhận SRS profile → ĐỌC `anti_slop.md` → apply.

---

## Red Flags — STOP IMMEDIATELY

If you catch yourself doing ANY of these, **STOP. Go back to the step you skipped.**

- Writing SRS content before brainstorming is complete
- Skipping the brainstorm step "because the URD is clear enough"
- Generating content that doesn't match the chosen HTML template structure
- Exporting .docx without user reviewing HTML preview first
- Using `\n` in table cells instead of separate Paragraphs
- Deciding template without asking the user
- Filling in information the user hasn't provided
- Saying "I'll adapt the pipeline for efficiency"
- **Asking more than ONE question in a single message**
- Saving files outside the mandatory folder structure
- Viết `[CROSS-REF]` mà KHÔNG tra cứu Confluence trước → VIOLATION
- Chuyển sang Step 3.5 mà còn `[CROSS-REF]` chưa resolve và chưa báo cáo → VIOLATION
- Writing all SRS content into a single .md file instead of splitting
- Skipping HTML preview generation ("user doesn't need to review")
- Export .docx without user confirmation after HTML review

---

## Mandatory Folder Structure

> [!CAUTION]
> **ALL files MUST be saved under this root:**
>
> ```
> c:\Working\Techainer\BA Skills\output\SRS_{TenDuAn}_{YYYYMMDD}\
> ├── temp\          ← draft .md files, research, plan, converted input
> ├── output\        ← .docx final files ONLY + HTML preview
> └── images\        ← mockups, screenshots (for embedding in .md)
> ```
>
> **Folder creation:** At STEP 0, create this folder structure FIRST.

**File naming in `output/`:**

- `SRS_{TenModule}_preview.html` — HTML preview for user review
- `SRS_{TenModule}_v1.docx`, `_v2.docx`, ... — NEVER overwrite.

**File paths:** ALWAYS use absolute paths. ALWAYS report full absolute path when creating files.

---

## Multi-File SRS Structure — MANDATORY SPLITTING

> [!CAUTION]
> You MUST split SRS content into multiple .md files. NEVER write everything into one single file.

```
temp/
├── 00_sop.md                  ← Session state (auto-created)
├── 00_version_history.md      ← Bảng phiên bản
├── 01_use_case.md             ← Đặc tả Use Case
├── 02_api_connections.md      ← Bảng kết nối API
├── 03_screen_01_[TenMH].md   ← Mô tả MH 1
├── 03_screen_02_[TenMH].md   ← Mô tả MH 2
├── 03_screen_NN_[TenMH].md   ← Mô tả MH N
├── 04_logic.md                ← Logic xử lý chung
└── 05_params.md               ← Tham số khai báo
```

- Mỗi màn hình = 1 file riêng. Khi sửa → chỉ sửa file liên quan.
- Khi export → ghép theo thứ tự `00_ → 01_ → 02_ → 03_ → 04_ → 05_`

---

## Pipeline — MANDATORY SEQUENCE

```
STEP 0 → STEP 1 → STEP 1.5 → STEP 2 → STEP 3 → STEP 3.25 → STEP 3.5 → STEP 4 → STEP 4.5 → STEP 5
  │         │         │          │         │          │            │           │          │          │
GATE 0   GATE 1    GATE 1.5   GATE 2    GATE 3    GATE 3.25     GATE 3.5    GATE 4    GATE 4.5    DONE
(input   (checklist (deep-read (plan     (gen .md  (CROSS-REF    (gen HTML   (verify   (user OK    (export
convert) complete)  brainstorm) approved) done)    resolved)⭐   preview)    pass)    + confirm)   .docx)
```

**NEVER skip a step. NEVER combine steps. NEVER reorder steps.**

Each GATE must pass before the next step begins. There are NO exceptions.

---

## Before Anything — The First Question

When this skill is activated, the VERY FIRST thing you do is ask:

> "Bạn muốn **tạo SRS mới** hay **sửa SRS đã có**?
> A. Tạo SRS mới từ tài liệu yêu cầu
> B. Sửa/cập nhật SRS đã có
> C. Khác — mô tả"

ALWAYS ASK. Do not infer. Do not assume.

---

## STEP 0: Convert Input → .md

1. Create mandatory folder structure FIRST
2. Read user's files → convert to .md → save to `temp/`
3. Extract images → save to `images/`

**Reading priority:** Python (pdfplumber/fitz/mammoth) → `view_file` → CLI → Browser (LAST resort)

After reading → confirm: "Tôi đã đọc file. Đây là tài liệu về [tóm tắt], thuộc lĩnh vực [domain]. Đúng không?"

**Create `temp/00_sop.md`** — session state file (see SOP section below).

**Convention Detection:** Đọc `references/conventions.md` → copy quy ước vào SOP. Nếu không có → brainstorm.

**GATE 0:** Input is .md + domain confirmed + folder created + SOP created.

---

## STEP 1: Brainstorm — HARD GATE

> [!CAUTION]
> INVOKE `brainstorming/SKILL.md`. FOLLOW ITS PIPELINE. COMPLETE ITS UNDERSTANDING LOCK.
> You do NOT brainstorm "in your head". You do NOT skip this.

### ONE QUESTION PER MESSAGE — ABSOLUTE RULE

> [!CAUTION]
> **ONE question. Send. Wait. Read answer. Then next question.**
> If your message contains more than one `?` → VIOLATION. Delete everything after the first question.

### Auto-detect trước, hỏi sau

Đọc context → tự nhận diện → điền sẵn → hỏi xác nhận. Chỉ hỏi từ đầu những gì CHƯA nhận diện được.

### Brainstorm Checklist

```
□ Phạm vi viết SRS (toàn bộ URD hay chỉ phần cụ thể?)
□ Template (user xem HTML preview rồi confirm)
□ Tên người viết (cho bảng phiên bản)
□ Mockup / màn hình (Figma link, ảnh, hoặc "chưa có")
□ SRS cũ tham khảo (nếu có)
□ Output format (mặc định: HTML preview → confirm → .docx)
```

### Hỏi template — BẮT BUỘC copy bảng dưới đây

```markdown
| #   | Template                             | Mô tả                                              | Preview                                                                                                                                                |
| --- | ------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A   | iBank2 Screen Spec — **Khuyến nghị** | Đặc tả MH web banking: use case + bảng field + API | [Xem preview](file:///c:/Working/Techainer/BA%20Skills/Skill/02-requirements/srs-writing/references/templates/banking/ibank2-screen-spec.html)         |
| B   | OBD Step Spec                        | Flow step-by-step mobile/onboarding                | [Xem preview](file:///c:/Working/Techainer/BA%20Skills/Skill/02-requirements/srs-writing/references/templates/banking/obd-step-spec.html)              |
| C   | Digital Lending CCC                  | User Story format cho vay tiêu dùng                | [Xem preview](file:///c:/Working/Techainer/BA%20Skills/Skill/02-requirements/srs-writing/references/templates/banking/digital-lending-user-story.html) |
| D   | Khác — paste mẫu hoặc upload         |                                                    |                                                                                                                                                        |
```

**GATE 1:** Understanding Lock confirmed + Decision Log done.

---

## STEP 1.5: Deep-Read Brainstorming — HARD GATE

> [!CAUTION]
> Step 1 = checklist mặc định. Step 1.5 = đọc KỸ input rồi hỏi dựa trên NỘI DUNG THỰC TẾ.

1. **Đọc toàn bộ input** — từng trang, không lướt
2. **Báo cáo findings** — số MH, entities, logic đặc biệt, điểm chưa rõ
3. **Brainstorm lần 2** — câu hỏi context-specific, vẫn ONE QUESTION PER MESSAGE
4. **Understanding Lock 2** — tóm tắt + xin xác nhận

**GATE 1.5:** Deep-read done + Understanding Lock 2 confirmed.

---

## STEP 2: Plan — Invoke `writing-plans` Skill

> [!CAUTION]
> Did you complete Step 1 AND Step 1.5? Understanding Lock 2 confirmed? If not → go back.

Invoke `Skill/00-global-skills/writing-plans/SKILL.md`.

Save plan to `temp/implementation_plan.md`. Plan MUST contain:

1. Understanding summary (domain, project, template)
2. Scope (danh sách use cases / sections)
3. Map: nội dung yêu cầu → section template
4. File split plan: content → files, theo Multi-File SRS
5. Flags: chỗ cần `[MANUAL]` và `[CROSS-REF]`
6. Output paths: full absolute path

**GATE 2:** User approved plan.

---

## STEP 3: Generate SRS (.md) — SPLIT INTO MULTIPLE FILES

> [!CAUTION]
> Did user approve plan in Step 2? If not → go back.
> Generate multiple .md files following Multi-File SRS Structure.

### Load Profile FIRST (from document-suite)

Đọc `doc_profiles.md` → SRS profile: Tech Level 3, Tone Precise, Audience: Dev+QA+Architect.

### Apply Rules

1. Read [completeness_rules.md](references/writing_rules/completeness_rules.md) → apply Actor+Logic, API, UI chrome, Popup, Pagination
2. Read [banking_field_rules.md](references/writing_rules/banking_field_rules.md) → apply format, tabs, upload, validate
3. Read [annotation_rules.md](references/writing_rules/annotation_rules.md) → apply tags if editing
4. Read [readability_rules.md](references/writing_rules/readability_rules.md) → apply readability pass after each file
5. Read [anti_slop.md](../00-global-skills/document-suite/writing_rules/anti_slop.md) → remove banned phrases
6. (**Chuẩn bị cho Step 3.25**) Gắn tag `[CROSS-REF: ...]` theo [annotation_rules.md](references/writing_rules/annotation_rules.md) — Step 3.25 sẽ resolve thành link

> [!NOTE]
> `[CROSS-REF]` tags sẽ được resolve ở **Step 3.25** (bước riêng). Ở Step 3 chỉ cần gắn tag đúng format.

### Template Enforcement — CRITICAL

> [!CAUTION]
> **Output .md PHẢI match cấu trúc template HTML đã chọn.**
>
> Template HTML = **CONTRACT**. Mỗi section trong template = 1 section tương ứng trong output.
>
> - Template có section "Phiên bản tài liệu" → .md PHẢI có section tương ứng
> - Template có bảng "Use Case" với N cột → .md PHẢI có bảng với ĐÚNG N cột, ĐÚNG tên cột
> - Template có section "Mô tả màn hình" → .md PHẢI có ĐÚNG cấu trúc: Mockup → Field table → Grid → Pagination
>
> **Nếu output structure ≠ template structure → bạn CHƯA HOÀN THÀNH. Fix trước khi tiếp tục.**

### After generating — REPORT all files with FULL ABSOLUTE PATH.

**GATE 3:** All .md files generated + readability pass done.

---

## STEP 3.25: Resolve Confluence CROSS-REF — HARD GATE ⭐ MỚI

> [!CAUTION]
> **BẮT BUỘC. KHÔNG ĐƯỢC BỎ QUA. KHÔNG ĐƯỢC GỘP VÀO STEP KHÁC.**
> Mỗi `[CROSS-REF]` trong output .md PHẢI được tra cứu trong Confluence data.
> Nếu bạn chuyển sang Step 3.5 mà còn `[CROSS-REF]` chưa resolve → VIOLATION.

### Quy trình — THỰC HIỆN TỪNG BƯỚC, KHÔNG ĐƯỢC BỎ BƯỚC NÀO

#### 1. Load danh sách Confluence spaces

**Chạy lệnh sau (chọn 1 trong 3 cách):**

```python
# Cách 1 — Local repo (ưu tiên)
view_file("c:/Working/Techainer/BA Skills/tools/confluence_sync/data/manifest.json")

# Cách 2 — GitHub URL
read_url_content("https://raw.githubusercontent.com/bobtechainer/ba-skills-pack/main/tools/confluence_sync/data/manifest.json")

# Cách 3 — Knowledge Items
find_by_name(SearchDirectory="~/.gemini/antigravity/knowledge", Pattern="confluence_*")
```

**Nếu CẢ 3 cách đều không có data → HỎI USER:** "Chưa có dữ liệu Confluence. Bạn muốn chạy `python tools/confluence_sync/sync_confluence.py` không?"

#### 2. Đọc pages_index.md của space chính

Từ manifest.json, chọn space phù hợp (VD: `confluence_2024kh001_ibank_20` cho dự án iBank2).

```python
# Đọc bảng tra cứu
view_file("c:/Working/Techainer/BA Skills/tools/confluence_sync/data/<space_dir>/artifacts/pages_index.md")
```

#### 3. Quét TẤT CẢ file .md đã generate → tìm `[CROSS-REF]`

```python
grep_search(SearchPath="<temp_dir>", Query="CROSS-REF")
```

#### 4. Với MỖI kết quả → tìm trong pages_index.md → thay thế

| Tag trong .md                 | Keyword tìm            | Thay bằng                        |
| ----------------------------- | ---------------------- | -------------------------------- |
| `[CROSS-REF: GĐ 3]`           | "GĐ 3", "cấp 3", "RSD" | `(xem [RSD cấp 3_Payment](URL))` |
| `[CROSS-REF: SRS GĐ 3]`       | "SRS", "GĐ 3"          | `(xem [SRS Giải ngân GĐ3](URL))` |
| `[CROSS-REF: PTTK module FX]` | "FX", "tỷ giá"         | `(xem [PTTK FX](URL))`           |

**Tìm thấy:** Thay `[CROSS-REF: ...]` bằng `(xem [Tên trang](https://bidv-vn.atlassian.net/wiki/...))`
**Không tìm thấy:** Sửa thành `[CROSS-REF: ... — chưa tìm thấy trên Confluence]`

#### 5. BÁO CÁO (BẮT BUỘC — phải hiển thị cho user)

```
📊 Confluence Reference Resolution: X/Y resolved
✅ [CROSS-REF: GĐ 3] → RSD cấp 3_Payment_MVP (link)
✅ [CROSS-REF: PTTK FX] → PTTK Foreign Exchange (link)
❌ [CROSS-REF: mục 5 URD] → Chưa tìm thấy
```

**GATE 3.25:** Báo cáo đã hiển thị + mỗi CROSS-REF đều có link HOẶC ghi chú "chưa tìm thấy".

---

## STEP 3.5: Generate HTML Preview — HARD GATE ⭐

> [!CAUTION]
> **BẮT BUỘC.** Sau khi generate .md, PHẢI tạo HTML preview cho user review.
> KHÔNG ĐƯỢC bỏ qua bước này. KHÔNG ĐƯỢC nói "user không cần review HTML".

### Quy trình

1. **Đọc template HTML** đã chọn (VD: `references/templates/banking/ibank2-screen-spec.html`)
2. **Đọc tất cả file .md** đã generate ở Step 3
3. **Thay thế `«placeholder»`** → nội dung thực từ .md files
4. **Save HTML** → `output/SRS_{TenModule}_preview.html`
5. **Báo user** với full absolute path: "Đã tạo HTML preview. Xin mở file để review."

### Rules Fill HTML

- Mỗi `«placeholder»` trong template PHẢI được thay thế bằng nội dung tương ứng
- Giữ nguyên HTML structure: CSS, tags, classes — chỉ thay nội dung `«...»`
- Các element static (header, rule boxes, instructions) → giữ nguyên
- Các element dynamic (`class="placeholder"`) → thay bằng nội dung thực
- Nếu có nhiều rows (field table, API table) → duplicate `<tr>` cho mỗi row
- Nếu có mockup → embed `<img src="absolute-path">`
- Nếu có `[MANUAL]` hoặc `[CROSS-REF]` → hiện dạng highlighted text trong HTML

### Post-fill check

- Scan HTML for remaining `«` → nếu còn → THIẾU content → quay lại Step 3
- Open HTML locally → verify structure matches template
- Verify tất cả bảng có đủ rows, không có cell rỗng

**GATE 3.5:** HTML preview generated + no remaining `«placeholder»`.

---

## STEP 4: Verify Checklist

> [!CAUTION]
> Run this checklist on BOTH .md files AND HTML preview.

```
□ Every field has Actor (NSD/Client/Server) + Logic? (→ completeness_rules.md)
□ All APIs from URD listed? (count URD APIs vs SRS APIs)
□ UI chrome present (Nav, Breadcrumb, Progress, Loading)?
□ Every popup has 4 parts (Icon, Title, Content, Buttons)?
□ Mockup embedded with ABSOLUTE path? Image file exists?
□ Version table has all history rows (none deleted)?
□ SRS split into multiple .md files (not one giant file)?
□ HTML preview generated at output/?
□ HTML has no remaining «placeholder»?
□ HTML structure matches chosen template?
□ Format số tiền specified? (→ banking_field_rules.md)
□ Grid: ALL columns listed for BOTH tabs?
□ Grid: Tab focus mặc định specified?
□ File upload: protection check + popup lỗi described?
□ SOP file updated?
□ (Edit) Annotations present? → annotation_rules.md
□ Anti-slop check passed? (→ anti_slop.md)
□ **Confluence CROSS-REF resolved?** Mỗi tag có link hoặc ghi chú "chưa tìm thấy"? (→ confluence-ref.md)
```

**If ANY item fails → go back to Step 3 and fix. Do NOT proceed.**

---

## STEP 4.5: User Review HTML — HARD GATE ⭐ MỚI

> [!CAUTION]
> **BẮT BUỘC.** User PHẢI review HTML preview trước khi export .docx.
> AI KHÔNG ĐƯỢC tự quyết định export mà không hỏi user.

### Quy trình

1. **Hỏi user:** "Bạn đã review HTML preview chưa? Có chỉnh sửa gì không?"
2. **Nếu user muốn sửa:**
   - Hỏi chi tiết cần sửa (ONE QUESTION PER MESSAGE)
   - Quay lại Step 3 → sửa .md → re-generate HTML (Step 3.5) → verify (Step 4)
   - Loop cho đến khi user OK
3. **Nếu user OK → hỏi:**
   > "Bạn có muốn xuất ra file .docx không?
   > A. Có — xuất .docx ngay
   > B. Không — dừng tại HTML"
4. **Nếu A → Step 5**
5. **Nếu B → DONE** — pipeline kết thúc tại HTML

**GATE 4.5:** User confirmed HTML + User chose to export.

---

## STEP 5: Export .docx

> [!CAUTION]
> **CHỈ ĐẾN BƯỚC NÀY KHI USER ĐÃ CONFIRM Ở STEP 4.5.**
>
> AI KHÔNG ĐƯỢC viết export script từ đầu.
> AI PHẢI copy `04-documentation/docx/scripts/export_template.js` rồi chỉ sửa phần CONFIG.

### Export sequence

1. **COPY** template: `Skill/04-documentation/docx/scripts/export_template.js` → `temp/export_docx.js`
2. **SỬA** phần CONFIG (BASE, OUT, FILES, DOC_TITLE, font profile = `banking-pro`)
3. **CHẠY** `node temp/export_docx.js`
4. **VERIFY** `node Skill/04-documentation/docx/scripts/verify_docx.js output.docx`
5. Nếu verify FAIL → sửa → lại bước 3-4
6. Nếu verify PASS → báo user full absolute path

### Font Profile (from document-suite)

| Profile                     | Body                 | Heading              | Khi nào                |
| --------------------------- | -------------------- | -------------------- | ---------------------- |
| `arial`                     | Arial 11pt           | Arial Bold           | AI-native, internal    |
| `banking-pro` **(default)** | Times New Roman 11pt | Arial Bold           | **VN banking clients** |
| `banking-serif`             | Times New Roman 11pt | Times New Roman Bold | Formal/regulated       |

### Image embedding

Images MUST be **embedded as binary** in .docx. Provide absolute paths in .md → docx skill handles embedding.

### NEVER overwrite

```
✅ _v1.docx exists → create _v2.docx
❌ _v1.docx exists → overwrite it
```

---

## SOP File — `temp/00_sop.md`

Auto-create at Step 0. Update after every step.

```markdown
# SOP — [Tên project]

## Context

- Mode: [Tạo mới / Sửa]
- Template: [chưa chọn]
- Domain: [domain]
- Version hiện tại: [v1 / vN]
- Tên người viết: [chưa hỏi]
- Font profile: banking-pro

## Convention Highlight & Comment

- Nguồn: [conventions.md / brainstorm / chưa xác định]
- Quy ước màu: [copy từ conventions.md hoặc brainstorm result]
- Tag mapping: [copy từ conventions.md hoặc brainstorm result]

## Annotation Tracker

| File      | Cell | Tag | Message |
| --------- | ---- | --- | ------- |
| (chưa có) |      |     |         |

## Checklist trạng thái

- [ ] Step 0: Convert done
- [ ] Step 0: SOP created
- [ ] Step 0: Convention detected
- [ ] Step 1: Brainstorm done
- [ ] Step 1.5: Deep-read done
- [ ] Step 2: Plan approved
- [ ] Step 3: Generate done
- [ ] Step 3: Readability pass done
- [ ] Step 3.5: HTML preview generated ⭐
- [ ] Step 4: Verify pass
- [ ] Step 4.5: User reviewed HTML ⭐
- [ ] Step 4.5: User confirmed export ⭐
- [ ] Step 5: Export done

## Files

| #                    | File | Status |
| -------------------- | ---- | ------ |
| (liệt kê sau Step 3) |      |        |
```

---

## Pipeline Mode B — EDIT (Sửa SRS)

**ALWAYS create new version file — NEVER overwrite.**

### Step 0 for Edit

Input PHẢI là .md. Nếu user gửi docx/pdf → convert trước.

### Step 1 for Edit: Auto-detect + Confirm

KHÔNG hỏi lại checklist từ đầu. Đọc .md → tự nhận diện → xác nhận 1 lần → hỏi "Bạn muốn sửa gì?"

### Step 2 for Edit: Analyze + Plan

1. Diff old ↔ new → find changed sections
2. Cross-reference check (see `references/cross-ref-check.md`)
3. Impact analysis table → version = current + 1

### Step 3 for Edit: Sửa + Annotation

**READ** `references/writing_rules/annotation_rules.md` — follow ALL rules.

- Only modify changed .md files
- Mỗi ô sửa → thêm `[CHANGED: lý do]` cuối cell
- Update `comment_registry.json`
- Readability pass after edit

### Step 3.5 for Edit: Re-generate HTML

Same as Mode A Step 3.5 — fill template with updated .md content.

### Steps 4, 4.5, 5: Same as Mode A

---

## Common Rationalizations — DO NOT FALL FOR THESE

| Excuse                                            | Reality                                                     |
| ------------------------------------------------- | ----------------------------------------------------------- |
| "The URD is clear, skip brainstorm"               | Brainstorm finds gaps that reading misses. NEVER skip.      |
| "I'll brainstorm implicitly while planning"       | Implicit = no brainstorm. INVOKE the skill.                 |
| "User wants results fast, skip steps"             | Skipping = rework later. Pipeline exists for a reason.      |
| "I already know the template"                     | USER picks template. Ask them.                              |
| "User doesn't need HTML preview"                  | User MUST review HTML. It's in the pipeline. NO exceptions. |
| "I'll ask multiple questions to save time"        | Bundling confuses. ONE question per message. Period.        |
| "I'll save to random location"                    | Use mandatory folder structure. ALWAYS.                     |
| "I'll put it all in one .md file"                 | Split into multiple files. Maintenance matters.             |
| "Output structure doesn't need to match template" | Template = CONTRACT. Output MUST match.                     |
| "I can export docx without asking user"           | User MUST confirm after HTML review. ALWAYS ASK.            |
| "I'll skip anti-slop check"                       | Every sentence must carry information. Read anti_slop.md.   |
| "Brainstorm is overkill for small edits"          | Even small edits affect cross-references. Follow pipeline.  |

---

## Skill Invocation Rule

When pipeline says "invoke skill X" → OPEN SKILL.md → READ → FOLLOW. **Each time.**

### Skills this pipeline uses

| Step     | Skill                | Path                                                                  |
| -------- | -------------------- | --------------------------------------------------------------------- |
| 0        | Doc Profiles         | `00-global-skills/document-suite/writing_rules/doc_profiles.md`       |
| 1        | Brainstorming        | `00-global-skills/brainstorming/SKILL.md`                             |
| 2        | Writing Plans        | `00-global-skills/writing-plans/SKILL.md`                             |
| 2 (edit) | Systematic Debugging | `00-global-skills/systematic-debugging/SKILL.md`                      |
| 3        | Anti-Slop            | `00-global-skills/document-suite/writing_rules/anti_slop.md`          |
| 3        | Banking Tone         | `00-global-skills/document-suite/writing_rules/banking_tone.md`       |
| 3        | Bilingual Glossary   | `00-global-skills/document-suite/writing_rules/bilingual_glossary.md` |
| 5        | Humanize Writing     | `00-global-skills/humanize-writing/SKILL.md`                          |
| 5        | Docx Export          | `04-documentation/docx/SKILL.md`                                      |

---

## Valid Exceptions — ONLY THESE

- User says "bản cập nhật nhỏ" AND change = literally 1-2 fields → simplified pipeline but STILL verify + HTML preview + export via skill
- User provides own .docx template → use as-is

**Everything else:** Full pipeline. No exceptions.

---

## References

| Document                                                                     | Content                                   |
| ---------------------------------------------------------------------------- | ----------------------------------------- |
| [Template Index](references/templates/README.md)                             | All available templates                   |
| [Nguyên tắc chung](references/nguyen-tac-chung.md)                           | Banking business rules                    |
| [Cross-Ref Check](references/cross-ref-check.md)                             | Find related sections when editing        |
| [Confluence Ref](references/confluence-ref.md)                               | Auto-resolve CROSS-REF → Confluence links |
| [Diff Strategies](references/diff-strategies.md)                             | Comparison strategies per trigger         |
| [Quality Samples](references/examples/ibank2-screen-spec-quality-samples.md) | 5 quality patterns to cross-check         |

---

## Limitations

- Needs user input (requirements, template choice, mockups)
- Output still needs human BA review before sending to client
- New domain without template → extract from user's file or use generic
- AI flags issues — human decides
