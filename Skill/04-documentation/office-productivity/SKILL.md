---
name: office-productivity
description: >-
  Use when needing to choose the right export format (docx/xlsx/pdf/pptx)
  or when building SRS export pipelines.
metadata:
  category: technique
  triggers: xuất file, export, format, pipeline, bộ file, trọn bộ
---

# Office Productivity — Format dispatcher

Chọn đúng skill xuất file hoặc chạy pipeline xuất trọn bộ.

## When to use

- Không chắc nên xuất format nào
- Cần xuất nhiều format cùng lúc (docx + pdf + xlsx)
- Xây pipeline: SRS markdown → humanize → docx → pdf

## Format selection

| Cần gì                          | Skill  | Format | Khi nào                      |
| ------------------------------- | ------ | ------ | ---------------------------- |
| Tài liệu SRS gửi review         | `docx` | .docx  | Cần edit, highlight, comment |
| Ma trận truy vết, field mapping | `xlsx` | .xlsx  | Cần track, filter, sort      |
| Slide training, status update   | `pptx` | .pptx  | Cần trình bày                |
| Bản cuối chính thức             | `pdf`  | .pdf   | Lưu trữ, không cho edit      |

## Pipelines

### Pipeline 1: SRS delivery

```
/srs-writing → SRS.md
  → /humanize-writing → SRS_polished.md
  ├── docx → SRS.docx (gửi review, có highlight + comment)
  └── pdf → SRS.pdf (lưu trữ bản cuối)
```

### Pipeline 2: SRS update package

```
/srs-writing → SRS_updated.md
  → /humanize-writing → SRS_updated_polished.md
  ├── docx → SRS_v2.docx (bản sửa gửi khách)
  └── xlsx → Changes_v2.xlsx (bảng thay đổi)
```

### Pipeline 3: Training package

```
Training outline.md
  ├── pptx → Training_Slides.pptx
  └── pdf → Training_Handout.pdf
```

## Input

| #   | Input            | Bắt buộc | Mô tả              |
| --- | ---------------- | -------- | ------------------ |
| 1   | Source content   | Có       | Markdown hoặc data |
| 2   | Target format(s) | Có       | "docx + pdf"       |
| 3   | Pipeline         | Không    | "SRS delivery"     |

## Rule

Mọi deliverable cuối phải qua `/humanize-writing` trước khi đổ vào docx/pdf.

## Limitations

- Dispatcher chỉ route, không tự tạo file
- Embed Excel trong Word không hỗ trợ
