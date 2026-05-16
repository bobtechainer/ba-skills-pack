# Reference Example — iBank2 Screen Spec Quality Standards

> Trích từ bản SRS thực tế (GD4_Loan_3.3 — Khai báo mục đích).
> Dùng làm mẫu cho AI khi viết SRS theo template iBank2 Screen Spec.

---

## Mẫu 1: Field Description (Loại dịch vụ — Dropdown)

**Đúng chuẩn:**

```
1. Tác nhân
   NSD: chọn loại dịch vụ con trong dịch vụ GN thanh toán mục đích khác
   Client: Hiển thị droplist danh sách loại dịch vụ và label "Chọn loại dịch vụ để tải bảng kê"
   Server: Trả về danh sách loại dịch vụ

2. Logic xử lý
   + Quy tắc nghiệp vụ
     NSD được chọn/thay đổi loại dịch vụ trong danh sách droplist
     NSD chỉ được chọn/thay đổi khi HT chưa lưu và chưa sinh mã giao dịch
     Disable thông tin nếu trước đó đã lưu giao dịch
     Chỉ được chọn 1 giá trị, gồm: Thanh toán trong nước / Thanh toán thuế nội địa / Thanh toán hóa đơn thu hộ
   + Mặc định: enable
   + Giá trị mặc định: Thanh toán trong nước
   + Nguồn giá trị: gọi API masterdata/par/category-by-type/list (truyền type = OTHER_DISBURSEMENT_TXN_CODE)
   + Popup khi đổi DV (nếu đã upload bảng kê):
     Icon: Cảnh báo
     Tiêu đề: Thông báo
     Nội dung: "Hệ thống sẽ thực hiện xóa dữ liệu đã nhập khi chọn lại loại dịch vụ. Quý khách có chắc chắn thay đổi?"
     Button: Hủy bỏ (đóng popup) / Xác nhận (xóa dữ liệu trừ hồ sơ PDF, chuyển về giao diện ban đầu)
```

**Sai — KHÔNG viết kiểu này:**

```
NSD chọn loại dịch vụ. Khi đổi → HT reset dữ liệu.
```

---

## Mẫu 2: Popup Description (4 phần bắt buộc)

**Đúng chuẩn:**

```
Icon: ❌ Lỗi
Tiêu đề: "Lỗi"
Nội dung: "Tập tin Excel đang bị khóa bảo vệ. Vui lòng gỡ bảo vệ trước khi tải lên"
Button: "Đóng" → đóng popup
```

**Sai — KHÔNG viết kiểu này:**

```
HT hiển thị thông báo lỗi khi file bị khóa.
```

---

## Mẫu 3: Grid Column Description

**Đúng chuẩn:**

```
Người thụ hưởng | Text | Read-Only | Y |
  Hiển thị theo format: Số tài khoản, Tên tài khoản và Tên ngân hàng viết tắt
  Số tài khoản: Hiển thị riêng biệt, in đậm, độ rộng đủ hiển thị 19 ký tự
  Tên tài khoản: Hiển thị dòng tiếp theo
  Tên ngân hàng: hiển thị tên viết tắt (ABBE_NAME)
  Cho phép kéo rộng cột để hiển thị đủ thông tin
  Khi NSD hover vào → hiển thị tooltip chứa đủ độ dài trường thông tin
```

---

## Mẫu 4: Logic xử lý — Client-side Validate

**Đúng chuẩn (liệt kê từng bước, có popup text):**

```
Client kiểm tra theo thứ tự:

1. Chưa tick checkbox đồng ý → popup:
   Icon: (x) Lỗi. Tiêu đề: "Lỗi".
   Nội dung: "Vui lòng đồng ý với Điều kiện chung về sử dụng dịch vụ BIDV Direct"
   Button: "Đóng"

2. Chưa upload bảng kê → popup:
   Icon: (x) Lỗi. Tiêu đề: "Lỗi".
   Nội dung: "Vui lòng tải lên bảng kê bên thụ hưởng"
   Button: "Đóng"

3. Còn bản ghi không hợp lệ → toast lỗi:
   "Lưu mục đích không thành công. Tồn tại giao dịch không hợp lệ."
```

---

## Mẫu 5: Quy tắc format số tiền

```
Quy tắc chung hiển thị tiền tệ:
- VND, CLP, JPY, KRW: Chỉ phần nguyên. Dấu "," ngăn cách hàng nghìn.
- Loại tiền khác: Phần nguyên + dấu "." + 2 chữ số thập phân. Dấu "," ngăn cách hàng nghìn.
```
