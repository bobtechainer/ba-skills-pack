---
description: >-
  Template chung — Standard SRS. Phù hợp cho mọi domain chưa có template riêng.
metadata:
  tags: [template, generic, standard, ieee830]
---

# Template: Standard SRS

Dùng cho: Mọi domain chưa có template chuyên biệt. Dựa trên IEEE 830 simplified.

---

## Cấu trúc khung xương

### 1. Tổng quan (Overview)

```markdown
| Mục         | Nội dung     |
| ----------- | ------------ |
| Mã tài liệu | [Mã]         |
| Tên dự án   | [Tên]        |
| Phiên bản   | [v1.0]       |
| Ngày tạo    | [DD/MM/YYYY] |
| Tác giả     | [Tên BA]     |
| Phê duyệt   | [Tên PM/PO]  |
```

### 2. Phạm vi (Scope)

```markdown
- Mục đích hệ thống: [mô tả]
- Đối tượng sử dụng: [roles]
- Ranh giới hệ thống: [trong scope / ngoài scope]
```

### 3. Đặc tả chức năng (Functional Requirements)

#### 3.N Use Case: [Tên UC]

```markdown
| Mục               | Nội dung                                    |
| ----------------- | ------------------------------------------- |
| Mã                | [UC-XXX-NN]                                 |
| Tên               | [Tên use case]                              |
| Mô tả             | [Là [role] tôi muốn [action] để [mục đích]] |
| Tác nhân          | [Primary / Secondary actors]                |
| Điều kiện trước   | [Preconditions]                             |
| Luồng chính       | 1. ... 2. ... 3. ...                        |
| Luồng thay thế    | [Alternative flows]                         |
| Luồng ngoại lệ    | [Exception flows]                           |
| Kết quả mong muốn | [Expected outcome]                          |
```

#### Bảng field chi tiết (cho mỗi màn hình)

```markdown
| STT | Hạng mục    | Kiểu hiển thị                   | Kiểu thao tác                 | Bắt buộc | Độ dài | Mô tả            |
| --- | ----------- | ------------------------------- | ----------------------------- | -------- | ------ | ---------------- |
| [N] | [Tên field] | [Label/Textbox/Dropdown/Button] | [Click/Select/Input/Readonly] | [Y/N]    | [max]  | [Mô tả chi tiết] |
```

### 4. Quy tắc nghiệp vụ (Business Rules)

```markdown
| Mã     | Tên rule | Mô tả           | Áp dụng cho    |
| ------ | -------- | --------------- | -------------- |
| BR-001 | [Tên]    | [Chi tiết rule] | [UC/field nào] |
```

### 5. Yêu cầu phi chức năng (Non-Functional Requirements)

```markdown
| Loại         | Yêu cầu | Tiêu chí chấp nhận |
| ------------ | ------- | ------------------ |
| Performance  | [Mô tả] | [Metric]           |
| Security     | [Mô tả] | [Standard]         |
| Availability | [Mô tả] | [SLA]              |
```

### 6. Phụ lục

- Danh sách API
- Glossary
- Tài liệu tham khảo
