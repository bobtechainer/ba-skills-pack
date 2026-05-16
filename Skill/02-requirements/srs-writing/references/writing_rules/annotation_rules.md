# Annotation & Highlight Rules — Quy tắc Đánh dấu Thay đổi

**Violating the letter of these rules IS violating the spirit of these rules.**

---

## Annotation Tags

Sử dụng tags dạng `[TAG: message]` ở **CUỐI** nội dung cell.

| Tag           | Ý nghĩa                          | Khi nào dùng                    |
| ------------- | -------------------------------- | ------------------------------- |
| `[CHANGED]`   | Nội dung đã thay đổi so với v cũ | Sửa bất kỳ ô nào                |
| `[MANUAL]`    | Cần bổ sung thủ công             | Thiếu thông tin từ URD          |
| `[CROSS-REF]` | Tham chiếu chéo cần kiểm tra     | Liên quan đến section/file khác |
| `[NEW]`       | Nội dung mới hoàn toàn           | Thêm field/section mới          |
| `[DELETED]`   | Nội dung đã xóa                  | Ghi chú ô bị remove             |

### Format

```
✅ | 4 | Tỉ giá bán | Text | Read-Only | Y | 12 | Mô tả field [CHANGED: v2 sửa format 7→6 decimal + bổ sung DB reference] |
❌ | 4 | Tỉ giá bán | Text | Read-Only | Y | 12 | 🟢 v2: Sửa format 7→6 decimal. Mô tả field... |
```

### Rules

- Tag nằm ở **CUỐI** nội dung cell, KHÔNG ở đầu
- **KHÔNG BAO GIỜ** dùng emoji (🟢🟡🔴🟣) thay cho tag
- **KHÔNG** dùng `v2: ...` hoặc `[MỚI]` hoặc `[SỬA]` inline
- Docx export script tự chuyển `[TAG: message]` → text highlight + Word comment
- Xem `references/conventions.md` để biết danh sách tags và màu tương ứng

---

## Comment Registry — `temp/comment_registry.json`

> File `temp/comment_registry.json` lưu TẤT CẢ comments qua MỌI version.
> File này là **nguồn sự thật duy nhất** cho comments.

### Lifecycle

- v1 tạo registry lần đầu (nếu có annotation)
- v2 ĐỌC registry cũ → GIỮ NGUYÊN → THÊM comments mới → GHI LẠI
- v3 ĐỌC registry (chứa cả v1 + v2) → GIỮ → THÊM → GHI LẠI

**KHÔNG BAO GIỜ** tạo registry mới từ đầu khi đã có file cũ.

### Format

```json
[
  {
    "id": "0",
    "version": "v1",
    "file": "03_screen_01.md",
    "cellRef": "Tỉ giá bán > Mô tả",
    "tag": "MANUAL",
    "message": "Cần bổ sung: endpoint API chưa có trong URD",
    "highlightColor": "yellow"
  },
  {
    "id": "1",
    "version": "v2",
    "file": "03_screen_01.md",
    "cellRef": "Tỉ giá bán > Mô tả",
    "tag": "CHANGED",
    "message": "v2 sửa format 7→6 decimal",
    "highlightColor": "green"
  }
]
```

---

## Convention Detection — BẮT BUỘC

Trước khi viết/sửa BẤT KỲ file nào:

1. Đọc `references/conventions.md` → lấy quy ước màu
2. Đọc template đang dùng → kiểm tra template có quy ước riêng không
3. Đọc file user gửi lên (nếu có) → kiểm tra file đó có highlight sẵn không
4. Dùng quy ước tìm được → ghi vào SOP

**Nếu không đọc conventions trước → MỌI thay đổi sau đó đều INVALID.**
**Nếu file conventions không tồn tại → BRAINSTORM với user để chốt.**
**KHÔNG tự đoán convention. KHÔNG dùng emoji thay cho text highlight.**

---

## Annotation Verification Checkpoint (trước Export)

Trước khi export, AI PHẢI:

1. Mở SOP → đọc Annotation Tracker
2. Liệt kê số annotation đã chèn
3. Đối chiếu với số ô đã sửa — nếu annotation < ô sửa → THIẾU → quay lại sửa
4. Kiểm tra export script có `Comment`, `CommentRangeStart`, `parseAnnotation()` không
5. Nếu export script không có → THÊM VÀO trước khi chạy

---

## Anti-Rationalization

| Excuse                                       | Reality                                                                     |
| -------------------------------------------- | --------------------------------------------------------------------------- |
| "Sửa nhỏ, không cần annotation"              | Mọi thay đổi đều cần. Reviewer không biết chỗ nào sửa nếu không có.         |
| "Dùng emoji 🟢 cho nhanh"                    | Emoji hiện thành text trong Word. TextRun highlight mới là highlight thật.  |
| "Comment phức tạp quá, skip"                 | docx SKILL.md có full code mẫu. Copy paste. Không có lý do skip.            |
| "Chỉ cần ghi chú trong .md là đủ"            | .md là intermediate. User nhận .docx. Annotation phải hiện đúng trong Word. |
| "Sửa văn bản thường, không phải logic"       | Mọi ô. Không ngoại lệ. Kể cả typo.                                          |
| "Tôi sẽ tô màu sau khi viết xong"            | Annotation PHẢI được chèn LÚC VIẾT .md. Không phải sau.                     |
| "Convention file không có, tự đoán"          | Nếu không có → brainstorm với user để chốt. KHÔNG tự đoán.                  |
| "v1 không có comment, nên v2 cũng không cần" | SAI. v2 có thay đổi → v2 PHẢI có comment.                                   |
| "Registry file phức tạp quá, skip"           | Copy-paste format ở trên. 30 giây. Không có lý do skip.                     |
| "Tôi sẽ thêm comment sau khi export"         | Comment phải có TRƯỚC export. Sau = VIOLATION.                              |
| "File nhỏ, không cần registry"               | MỌI file. Không ngoại lệ. Registry là mandatory.                            |
