---
description: >-
  Logic tìm tất cả chỗ liên quan khi sửa 1 field trong SRS. Giải quyết "sửa trên quên sửa dưới".
metadata:
  tags: [cross-reference, consistency, field-check]
---

# Cross-Reference Check

## Mục đích

Khi sửa 1 field/logic/rule trong SRS, phải tìm TẤT CẢ chỗ khác trong file nhắc đến cùng field đó.

## Chiến lược tìm

### 1. Tìm theo tên field

- Exact match: "Loại dịch vụ" xuất hiện ở đâu?
- Synonym match: "Loại DV" / "service type" / "LDV"
- Phạm vi: toàn bộ SRS, không chỉ section đang sửa

### 2. Tìm theo API endpoint

- Nếu sửa logic liên quan API X → tìm tất cả section gọi API X
- Kiểm tra: response field nào lấy từ API X?

### 3. Tìm theo validation rule

- Cùng field ở MH khác nhau → rule có giống?
- VD: "Số tiền" ở MH Khai báo và MH Xác nhận phải cùng maxlength

### 4. Tìm theo logic nghiệp vụ

- Rule thay đổi → field nào bị ảnh hưởng?
- VD: thay rule tính phí → ảnh hưởng MH hiển thị phí lẫn MH xác nhận

### 5. Tìm theo tham số

- Config thay đổi → MH nào dùng config đó?

## Output format

```
Cross-reference check cho field "[tên field]":

Tìm thấy [N] chỗ liên quan:
1. [Section A] dòng [X]: [context ngắn]  — Cần sửa: [Có/Không/Review]
2. [Section B] dòng [Y]: [context ngắn]  — Cần sửa: [Có/Không/Review]
...
```

## Rule

Nếu cross-ref check tìm thấy > 0 chỗ liên quan → liệt kê HẾT → confirm với người dùng → mới sửa.
