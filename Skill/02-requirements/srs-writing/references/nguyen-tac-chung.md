---
description: >-
  Nguyên tắc sử dụng chung cho các dịch vụ Bảo lãnh và CKTD. Business rules bắt buộc.
metadata:
  tags: [nguyen-tac, business-rules, banking, validation]
  source: IBANK2-Loan_Nguyên tắc sử dụng cho các dịch vụ (BL, CKTD)
---

# Nguyên tắc chung — Business Rules Library

> File này được load tự động bởi /srs-writing. Nếu file thiếu hoặc không có, AI phải flag `[MANUAL]` ở những chỗ cần business rule.

---

## 1. Nguyên tắc xử lý hover trên lưới dữ liệu

### 1.1 Maker — MH Giao dịch chờ xử lý

- MH hiển thị toàn bộ icon tại cột "Thao tác" → KHÔNG xử lý hover
- MH không hiển thị hết icon → hover tại bất kỳ bản ghi:
  - Hiển thị icon: Chỉnh sửa, Đẩy duyệt, Xoá, Ký số tổ chức
  - Mặc định enable
  - Hover icon → hiển thị tên thao tác

### 1.2 Checker — MH Duyệt giao dịch

- Tương tự Maker nhưng icon: Duyệt, Từ chối, Ký số tổ chức

---

## 2. Nguyên tắc validate số tiền giao dịch

### 2.1 Input tiêu chí tìm kiếm

- Cho nhập: số, dấu `.`, dấu `,`, số 0
- KHÔNG cho nhập: chữ, ký tự đặc biệt
- Hiển thị icon `x` xóa nhanh khi có input
- **Maxlength:**
  - VND/CLP/JPY/KRW: max 15 ký tự, không thập phân, chỉ nhập > 0
  - Loại khác: max 15 ký tự (13 nguyên + `.` + 2 thập phân), chỉ > 0
- **Paste:** chỉ paste số + dấu chấm, tự cắt nếu quá maxLength (phải → trái)
- **Format sau nhập:** tự thêm dấu `,` phân cách hàng nghìn

### 2.2 Input nhập liệu tại MH khởi tạo/chỉnh sửa

- VND/CLP/JPY/KRW:
  - Không thập phân, KHÔNG cho nhập 0 ở đầu
  - Tự chuẩn hóa: `09` → `9` khi outfocus
  - Max 15 ký tự số
- Loại khác:
  - Cho phép nhập 0 ở đầu + dấu `.`
  - Sau `.` tối đa 2 số thập phân
  - Số tiền chẵn → giữ nguyên (không hiển thị `.00`)
  - Nhập 1 số thập phân → tự thêm 0 (VD: `N.2` → `N.20`)
  - Max 15 ký tự (13 + `.` + 2)
  - Dấu `,` phân cách hàng nghìn

### 2.3 Hiển thị trên lưới/MH chi tiết

- VND/CLP/JPY/KRW: max 15 ký tự, chỉ phần nguyên
- Loại khác: max 15 ký tự (13 + `.` + 2), dấu `.` phân cách thập phân, dấu `,` hàng nghìn

---

## 3. Nguyên tắc xử lý dấu cách/khoảng trắng

### 3.1 Textbox tìm kiếm

- Client tự trim (cắt đầu + cuối) trước khi gửi BE
- VD: `"   400000183736   "` → gửi `"400000183736"`

### 3.2 Textbox nhập liệu

- Client tự trim trước khi gửi BE lưu trữ
- Số tiền > 15 ký tự → hệ thống hiển thị lỗi (PO chấp nhận)
