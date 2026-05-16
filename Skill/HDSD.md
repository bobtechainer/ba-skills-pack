# HƯỚNG DẪN SỬ DỤNG — BA Skills Pack

**Bộ skill hỗ trợ BA viết và quản lý SRS — dùng cho mọi domain**

> Bộ skill này hoạt động theo mô hình **orchestrator** — `/srs-writing` điều phối các skill trong `00-global-skills/` và `04-documentation/` theo đúng thứ tự. Khi pipeline chỉ định dùng skill nào → BẮT BUỘC đọc và tuân thủ SKILL.md của skill đó. Nếu người dùng không nói rõ domain, skill sẽ hỏi.

---

## Nguyên tắc kiến trúc — MD-First Pipeline

> **Markdown (.md) là định dạng trung gian duy nhất.** Mọi input → chuyển về .md. Mọi output → sinh từ .md. Không bao giờ xử lý trực tiếp trên .docx/.pdf/.xlsx.

```
 INPUT (bất kỳ)          PROCESS             OUTPUT (bất kỳ)
 ┌──────────┐    ┌─────────────────┐    ┌──────────┐
 │ .pdf     │    │                 │    │ .docx    │
 │ .docx    │ →  │   .md (trung    │ →  │ .pdf     │
 │ .xlsx    │    │   gian duy nhất)│    │ .xlsx    │
 │ chat/url │    │                 │    │ .pptx    │
 └──────────┘    └─────────────────┘    └──────────┘
```

### Quy tắc MD-First

1. **Input → MD.** Mọi file người dùng gửi (.pdf, .docx, .xlsx, .pptx, URL, chat) → đọc nội dung → chuyển về .md trước khi xử lý tiếp.
2. **Template = .md.** Templates là file .md có style metadata trong YAML frontmatter + `«instructions»` ở phần dynamic.
3. **Output ← MD.** Khi gen SRS/tài liệu → sinh .md trước → export sang định dạng yêu cầu qua `04-documentation/` skills.
4. **Unified standard style.** Tất cả SRS output dùng **1 bộ style thống nhất** — không cần y chang file gốc từng pixel. Cấu trúc + nội dung giống, style theo chuẩn chung.

---

## Rules bắt buộc

1. **Hỏi từng câu một, tự nhiên.** Không đánh số Q1/Q2. Chờ trả lời rồi mới tiếp.
2. **Confirm qua file, không qua chat.** Tạo `implementation_plan.md` → user review/comment → OK mới gen.
3. **Humanize trước khi xuất.** Mọi deliverable cuối phải qua `/humanize-writing`.
4. **Documentation dispatch rule.** `.docx/.xlsx/.pdf/.pptx` → bắt buộc gọi skill trong `04-documentation/`.
5. **Project folder.** AI tự tạo folder `SRS_{TenDuAn}_{YYYYMMDD}/` chứa `temp/` (draft) và `output/` (cuối).
6. **Domain-aware.** Detect domain từ file/context. Không detect được → hỏi.
7. **Template = file .md có style metadata.** Khi hỏi template, gắn link .md. User review trực tiếp trên .md.
8. **Static vs Dynamic.** Giữ nguyên 100% phần tĩnh của template, chỉ fill phần động `«...»`.
9. **Annotation = Word comment.** Khi export .docx: highlight ô + Word comment, không text inline.
10. **Output mặc định = .docx nhưng trung gian luôn = .md.** Gen .md trước, rồi export.
11. **Versioning.** Tạo version mới = tạo file mới với suffix `_vN` (ví dụ: `SRS_GiaiNgan_v2.md`). PHẢI cập nhật bảng **Phiên bản tài liệu** ở đầu file. PHẢI đánh dấu thay đổi bằng **Word comment** ở bản .docx.
12. **Bảng phiên bản tài liệu.** Mọi file SRS output PHẢI có bảng version ở đầu:
    | Version | Ngày | Người sửa | Mô tả thay đổi |
    |---------|------|----------|----------------|
13. **Line breaks trong bảng Word.** Mỗi dòng trong ô bảng PHẢI là 1 Paragraph riêng (KHÔNG dùng `\n`). Xem thêm rule trong `04-documentation/docx/SKILL.md`.
14. **Mandatory SRS skill.** Bất kỳ khi nào tạo mới HOẶC sửa SRS → BẮT BUỘC phải dùng `Skill/02-requirements/srs-writing/SKILL.md`. KHÔNG được tự viết SRS mà không invoke skill này. PHẢI mở SKILL.md → đọc → làm theo pipeline.
15. **Không ghi đè file.** Khi sửa SRS: LUÔN tạo file .docx mới `_vN+1`. KHÔNG BAO GIỜ ghi đè file cũ.
16. **Báo full path.** Mọi file tạo ra PHẢI báo đầy đủ đường dẫn tuyệt đối, không chỉ tên file.
17. **Tách file SRS.** SRS .md PHẢI tách thành nhiều file theo section (00_version, 01_use_case, 02_api, 03_screen_NN, 04_logic, 05_params). Không viết 1 file khổng lồ.

---

## Cấu trúc thư mục

```
Skill/
├── HDSD.md
├── 00-global-skills/                ← Pipeline dependencies
│   ├── brainstorming/
│   ├── writing-plans/
│   ├── document-suite/
│   ├── humanize-writing/
│   └── systematic-debugging/
├── 02-requirements/
│   └── srs-writing/                 ← Tạo & sửa SRS (unified orchestrator)
│       └── references/templates/    ← Templates .md chia theo domain (có style metadata)
└── 04-documentation/
    ├── docx/                        ← Xuất Word
    ├── xlsx/                        ← Xuất Excel
    ├── pdf/                         ← Xuất PDF
    ├── pptx/                        ← Xuất PowerPoint
    └── office-productivity/         ← Dispatcher xuất file
```

---

## Documentation dispatch rule

| Format       | Gọi skill                               | Ví dụ                     |
| ------------ | --------------------------------------- | ------------------------- |
| .docx        | `04-documentation/docx/`                | "Xuất SRS ra Word"        |
| .xlsx        | `04-documentation/xlsx/`                | "Tạo traceability matrix" |
| .pdf         | `04-documentation/pdf/`                 | "Xuất PDF bản cuối"       |
| .pptx        | `04-documentation/pptx/`                | "Tạo slide training"      |
| Nhiều format | `04-documentation/office-productivity/` | "Xuất trọn bộ"            |

---

## Flow làm việc (MD-First)

```
Nhận tài liệu + mockup (bất kỳ format)
       ↓
  ★ Convert input → .md  ← BƯỚC BẮT BUỘC
       ↓
  Detect domain (tự động từ nội dung .md)
       ↓
  Brainstorm (hỏi dynamic, có khuyến nghị)
       ↓
  Chọn template (.md — user review trực tiếp)
       ↓
  Tạo implementation_plan.md
       ↓
  User review + comment trên file
       ↓
  [Lặp sửa plan cho đến khi OK]
       ↓
  ★ Gen SRS dạng .md (giữ static, fill dynamic)  ← KẾT QUẢ TRUNG GIAN
       ↓
  /humanize-writing (trên .md)
       ↓
  ★ Export .md → .docx (áp dụng styles từ template)  ← OUTPUT CUỐI
       ↓
  Annotation → Word comment + highlight
       ↓
  Gửi khách hàng
```

---

## Unified Standard Style — Output .docx

Tất cả SRS output dùng **1 bộ style chung**. Không cần y chang file gốc. AI áp dụng bộ style này khi export .docx:

```yaml
styles:
  document:
    font_default: "Times New Roman"
    font_size_body: 12 # pt
    font_size_heading1: 16
    font_size_heading2: 14
    font_size_heading3: 13
    font_size_table_cell: 10
    line_spacing: 1.15
    page_margin: "2.54cm" # tất cả 4 cạnh
  table:
    header_bg: "#4472C4"
    header_font_color: "#FFFFFF"
    header_font_bold: true
    border_color: "#000000"
    border_width: 0.5
    cell_padding: "0.1cm"
  highlights:
    changed: "#92D050" # Xanh lá - thay đổi so với version trước
    manual: "#FFFF00" # Vàng - cần điền thủ công
    cross_ref: "#92D050" # Xanh lá - cross reference
    conflict: "#FF0000" # Đỏ - xung đột
```

> [!NOTE]
> Đây là bộ style **mặc định duy nhất**. Mọi template đều dùng chung. Nếu khách hàng có brand guide riêng → override trong `styles:` block của template cụ thể.
