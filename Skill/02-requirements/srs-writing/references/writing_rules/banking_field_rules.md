# Banking Field Rules — Quy tắc Nghiệp vụ Banking

Các quy tắc đặc thù cho SRS dự án banking / tài chính.

---

## Format số tiền

| Loại tiền | Format           | Ví dụ     |
| --------- | ---------------- | --------- |
| VND       | Integer only     | 1.000.000 |
| Ngoại tệ  | 2 decimal places | 1,234.56  |

- Dấu ngăn cách hàng nghìn: dấu chấm (.) cho VND
- Luôn ghi rõ quy tắc format trong cột Mô tả của field số tiền

---

## Grid / Lưới dữ liệu — Tabs

- **Tab hợp lệ (HL):** liệt kê đầy đủ các cột
- **Tab không hợp lệ (KHL):** thường có THÊM các cột: **Trạng thái**, **Mô tả lỗi**, **Tên hợp lệ**
- Nếu có button action (VD: "Cập nhật tên hợp lệ") → PHẢI mô tả riêng
- Quy tắc UX: **tooltip on hover** (hiển thị đầy đủ khi hover), **kéo rộng cột**
- **Tab focus mặc định:** có GD KHL → focus tab KHL. Không có → focus tab HL.
- ALL columns phải listed cho BOTH tabs

---

## File Upload

- Protection check: PHẢI check file có password-protected không
- Nếu file protected → popup lỗi riêng
- Check: format file, dung lượng, nội dung, headers
- Mô tả chi tiết từng bước validate

---

## Field Enable/Disable

- Field có trạng thái enable/disable PHẢI ghi rõ **điều kiện disable**
- VD: "Sau khi lưu GD → field này disable"
- VD: "Khi dropdown A = 'Giá trị X' → field này enable"

---

## Button Validate Sequence

Nút **Lưu / Tiếp tục** PHẢI có client-side validate chi tiết, theo thứ tự:

1. Check checkbox bắt buộc → popup nếu thiếu
2. Check file upload (nếu có) → popup nếu lỗi
3. Check bản ghi không hợp lệ → popup nếu có
4. Check required fields → popup/toast từng field
5. Submit → gọi API

---

## Download Filenames

- Tên file tải về PHẢI cụ thể theo loại dịch vụ
- Pattern: `KET-QUA-KIEM-TRA-{tên-loại-DV}`
- KHÔNG dùng tên chung

---

## Logic Completeness Check

Khi viết section Logic xử lý, BẮT BUỘC kiểm tra URD có các logic sau:

1. Logic validate file upload (format, size, protection, content)
2. Logic validate bên thụ hưởng (check 24/7, tên TK, NH hưởng)
3. Logic cross-check giữa các bảng kê (hóa đơn vs BTH, FX vs tổng tiền)
4. Logic tính phí chuyển tiền (nếu URD có — thường ở mục riêng)
5. Logic lưu thông tin giao dịch (nếu URD có — flow gửi server)
6. Logic validate client-side khi nhấn Lưu/Tiếp tục
7. Logic reset dữ liệu khi đổi loại DV

Nếu URD có logic tính phí hoặc logic lưu GD → PHẢI tạo file riêng.
Nếu URD KHÔNG có → ghi `«Tham chiếu PTTK»` + `[MANUAL]`.

---

## Tham số khai báo

Nếu URD mentions `PAR_*` tables → PHẢI có section Tham số khai báo.
