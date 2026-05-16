---
description: >-
  Quy ước highlight màu và Word comment annotations cho SRS output.
metadata:
  tags: [convention, highlight, annotation, srs, word-comment]
---

# Conventions — Highlight & Word Comments

## Highlight màu

Quy ước màu trong SRS output:

| Màu          | HighlightColor | Ý nghĩa                             | Ví dụ                           |
| ------------ | -------------- | ----------------------------------- | ------------------------------- |
| 🟢 Xanh lá   | green          | Nội dung thay đổi/bổ sung           | Field mới thêm, logic sửa       |
| 🟣 Tím       | magenta        | Nội dung riêng cho loại dịch vụ A   | Logic chỉ áp dụng cho nhóm A    |
| 🟡 Vàng      | yellow         | Cần người dùng bổ sung (`[MANUAL]`) | Thiếu info, AI không đủ context |
| 🟠 Cam       | yellow         | AI suy luận (`[ASSUMED]`)           | Cần xác nhận                    |
| 🔴 Đỏ        | red            | Mâu thuẫn (`[CONFLICT]`)            | URD nói khác mockup             |
| ⬜ Không màu | —              | Nội dung chung / không đổi          | Giữ nguyên                      |

## Annotations → Word Comments

> **QUAN TRỌNG:** Annotations KHÔNG bao giờ để dưới dạng text inline trong ô bảng.
> Thay vào đó: **text highlight (TextRun) + Word comment** giải thích.
> Highlight = TEXT-LEVEL (chỉ bôi đoạn text thay đổi), KHÔNG phải cell-level.

### Cách thực hiện trong Word

1. **Highlight text** bằng `TextRun({ highlight: "green" })` (text-level, KHÔNG dùng cell shading)
2. **Thêm Word comment** vào đoạn text đó giải thích: AI lấy từ đâu, user cần làm gì
3. Comment id PHẢI là STRING. `comments.children` PHẢI là plain objects.
4. Xem `04-documentation/docx/SKILL.md` section "Word Comments + Text Highlight" để copy-paste code

### Mapping Tag → Word Output

| Tag           | HighlightColor | Word Comment nội dung                         |
| ------------- | -------------- | --------------------------------------------- |
| `[MANUAL]`    | yellow         | "Cần bổ sung: [mô tả thiếu gì]"               |
| `[CROSS-REF]` | green          | "Lấy từ [tên section/GĐ]: [chi tiết]"         |
| `[ASSUMED]`   | yellow         | "AI suy luận: [lý do]. Cần xác nhận"          |
| `[REUSED]`    | magenta        | "Tái sử dụng từ: [nguồn SRS/module]"          |
| `[CONFLICT]`  | red            | "Mâu thuẫn: [nguồn A] nói X, [nguồn B] nói Y" |
| `[INFERRED]`  | (không)        | "AI suy từ context: [chi tiết rule áp dụng]"  |
| `[AMBIGUOUS]` | yellow         | "Mập mờ: [nhiều cách hiểu]. Cần hỏi PO/khách" |
| `[CHANGED]`   | green          | "Đã sửa: [lý do thay đổi so với bản trước]"   |

### Ví dụ

**Thay vì:**

```
| 1 | Loại tiền | Dropdown | Select | Y | [CROSS-REF: Tương tự GĐ 3, field Loại tiền] |
```

**Làm đúng:**

```
Ô "Mô tả" của row "Loại tiền":
  - Cell shading: #92D050 (xanh lá)
  - Word comment: "Lấy từ GĐ 3 - MH Nhập thông tin, field Loại tiền. Logic hiển thị giống hệt."
  - Nội dung ô: "Hiển thị dropdown loại tiền theo API /currencies. Mặc định = VND"
```

User nhìn thấy:

- Ô xanh lá → biết đây là nội dung tham chiếu chéo
- Hover/click → đọc comment biết lấy từ đâu
- Reply comment nếu cần phản hồi

### Lưu ý khi dùng `/srs-writing`

Khi sửa SRS, mọi ô bị thay đổi đều phải:

1. Highlight xanh (#92D050)
2. Word comment: "Đã sửa: [lý do]. Bản trước: [nội dung cũ tóm tắt]"
