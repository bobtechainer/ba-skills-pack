---
description: >-
  Template A — iBank2 Screen Spec. Đặc tả MH chi tiết cho web banking / iBanking.
  Dùng cho dự án có nhiều field, bảng, dropdown, logic validate phức tạp.
metadata:
  tags: [template, ibank2, screen-spec, web, banking]
  source: IBANK2-GD4_Loan_3.3 (chị Nga - BA Alphaway)
# Template A: iBank2 — Đặc tả màn hình (Screen Spec)

Dùng cho: Web banking, iBanking, dự án có MH nhiều field, bảng dữ liệu, dropdown, validate phức tạp.

> [!CAUTION]
> **RULES BẮT BUỘC khi dùng template này:**
> 1. Mỗi field PHẢI có **2 phần**: Tác nhân (NSD/Client/Server) + Logic xử lý
> 2. Liệt kê **TẤT CẢ API** từ URD — không tóm tắt. Thiếu endpoint → `«xem PTTK»` + `[MANUAL]`
> 3. Bảng field PHẢI có **UI chrome**: Navigation Bar, Breadcrumb, Progress Bar, Loading states
> 4. Popup/dialog PHẢI có **4 phần**: Icon + Tiêu đề + Nội dung + Buttons
> 5. Lưới dữ liệu PHẢI ghi **phân trang**: số bản ghi mặc định, sticky header, empty state
> 6. Mockup người dùng gửi → PHẢI chèn ngay dưới `a. Mockup Màn hình`
> 7. Số tiền PHẢI có **quy tắc format**: VND (chỉ nguyên) vs ngoại tệ (2 thập phân), dấu ngăn cách nghìn
> 8. File tải về PHẢI có **tên file cụ thể** theo loại DV: `KET-QUA-KIEM-TRA-BANG-KE-{tên loại DV}`
> 9. Tab lưới PHẢI có **tab focus mặc định**: nếu có GD không hợp lệ → focus tab KHL, ngược lại → focus tab HL
> 10. Nút chức năng PHẢI có **validate client-side chi tiết**: liệt kê từng bước check + popup/toast tương ứng
> 11. Field có trạng thái enable/disable PHẢI ghi rõ: **điều kiện disable** (VD: sau khi lưu GD → disable)
> 12. File upload PHẢI check: **file protection** (password-protected Excel) + popup lỗi tương ứng
>
> **Reference examples:** xem `references/examples/ibank2-screen-spec-quality-samples.md`

---

## Phiên bản tài liệu

> **RULE:** Chỉ THÊM dòng mới — KHÔNG XÓA dòng cũ. File suffix `_vN` PHẢI trùng version cuối.

| Version      | Lý do                            | Date         | Người sửa | Mô tả                     |
| ------------ | -------------------------------- | ------------ | --------- | ------------------------- |
| «Số version» | «Thêm mới / Bổ sung / Chỉnh sửa» | «DD/MM/YYYY» | «Tên BA»  | «Mô tả thay đổi chi tiết» |

> **Quy ước highlight:**
>
> - 🟢 Xanh lá: Nội dung thay đổi/bổ sung so với giai đoạn trước
> - 🟣 Tím: Nội dung riêng cho loại dịch vụ A
> - 🟡 Vàng: Nội dung riêng cho loại dịch vụ B
> - ⬜ Không màu: Nội dung chung / không đổi

---

## 1. Đặc tả Use Case

| Mục                   | Nội dung                                                            |
| --------------------- | ------------------------------------------------------------------- |
| Mã                    | «Mã use case, ví dụ: UC-LOAN-03»                                    |
| Tên                   | «Tên use case ngắn gọn»                                             |
| Mô tả                 | «Là [role] tôi muốn [action] để [mục đích]»                         |
| Tác nhân chủ động     | «Người dùng khách hàng / Admin / ...»                               |
| Tác nhân thụ động     | «Client WEB, Open API, Server, hệ thống liên quan»                  |
| Mức độ ưu tiên        | «High / Medium / Low»                                               |
| Điều kiện kích hoạt   | «Mô tả context trước khi vào UC này: NSD vừa làm gì, đang ở MH nào» |
| Điều kiện trước       | «Liệt kê điều kiện: đăng nhập, phân quyền, hoàn thành step trước»   |
| Kết quả mong muốn     | «Liệt kê kết quả: hiển thị MH, NSD nhìn thấy gì, NSD có thể làm gì» |
| Luồng chính           | «Liệt kê từng bước: 1. → 2. → 3. → ...»                             |
| Luồng thay thế        | «N/A hoặc mô tả luồng thay thế»                                     |
| Luồng ngoại lệ        | «1. Mất kết nối. 2. Server lỗi. 3. Timeout. ...»                    |
| Quy tắc nghiệp vụ     | «Business rules đặc thù cho UC này»                                 |
| Yêu cầu phi chức năng | «Performance, logging, IP tracking, ...»                            |

---

## 2. Sơ đồ luồng xử lý

### 2.1 Yêu cầu với các kết nối phát sinh mới / cần chỉnh sửa

> **RULE:** Liệt kê TẤT CẢ API từ URD. Không tóm tắt. Thiếu endpoint → `«xem PTTK [tên API]»` + Word comment `[MANUAL]`.

| Tên kết nối       | Trạng thái                     | Backend cung cấp   | Phương thức tích hợp | Luồng gọi API              | Mô tả kết nối                             | Link tài liệu            |
| ----------------- | ------------------------------ | ------------------ | -------------------- | -------------------------- | ----------------------------------------- | ------------------------ |
| «Tên API/kết nối» | «Có sẵn / Tạo mới / Chỉnh sửa» | «BDR / Core / ...» | «API / DBlink / Job» | «FE → Open API → BE → ...» | «Mô tả ngắn: API làm gì, endpoint nếu có» | «Link PTTK / Confluence» |

---

## 3. Mô tả và logic xử lý màn hình

### 3.1. Mô tả màn hình WEB

**Link Figma:** «Link Figma»

#### 3.1.N Màn hình «Tên màn hình»

##### a. Mockup Màn hình

«Chèn ảnh mockup tại đây — BẮT BUỘC nếu người dùng cung cấp ảnh»

> Liệt kê các trạng thái MH khác nhau:
>
> - «MH khi bắt đầu vào»
> - «MH sau khi NSD thao tác A»
> - «MH khi có lỗi»
> - «MH khi expand/collapse section»

##### b. Mô tả màn hình

> **RULE:** Bảng bên dưới PHẢI bắt đầu bằng **UI chrome** (Navigation Bar, Breadcrumb, Tiêu đề, Progress Bar).

| STT | Hạng mục                        | Kiểu hiển thị                               | Kiểu thao tác                              | Bắt buộc | Độ dài               | Mô tả                                                                    |
| --- | ------------------------------- | ------------------------------------------- | ------------------------------------------ | -------- | -------------------- | ------------------------------------------------------------------------ |
| 1   | Navigation Bar                  | Navigation Bar                              | Click                                      | --       | --                   | «Theo thiết kế và xử lý chung của hệ thống»                              |
| 2   | Breadcrumb                      | Breadcrumb                                  | Click                                      | Y        | --                   | «Trang chủ / [Menu cha] / [Tên MH hiện tại]. Mô tả onclick cho từng cấp» |
| 3   | Tiêu đề màn hình                | Label + Icon                                | Click                                      | --       | --                   | «Label: [Tên MH]»                                                        |
| 4   | Thanh tiến trình (Progress Bar) | Label                                       | Read-Only                                  | --       | --                   | «Hiển thị trạng thái các bước. Gồm N bước: [liệt kê]»                    |
| «N» | «Tên field/element»             | «Label / Textbox / Dropdown / Button / ...» | «Click / Select / Input / Read-Only / ...» | «Y/N/--» | «Max length hoặc --» | «Mô tả chi tiết (xem hướng dẫn bên dưới)»                                |

> [!IMPORTANT]
> **Cột Độ dài:** PHẢI điền giá trị cụ thể nếu URD ghi (ví dụ: 19 ký tự cho STK, 255 cho tên, 10 cho ngày dd/mm/yyyy). Nếu URD không ghi → `--`. KHÔNG để trống toàn bộ.

**Hướng dẫn viết cột Mô tả — BẮT BUỘC theo pattern:**

```
1. Tác nhân
   NSD: hành động gì (chọn, nhập, click)
   Client: hiển thị gì
   Server: trả về gì

2. Logic xử lý
   + Quy tắc nghiệp vụ: liệt kê rules
   + Mặc định: giá trị mặc định khi mở MH
   + Nguồn giá trị hiển thị: API nào, bảng nào
   + Validate: rule validate + thông báo lỗi

3. Mô tả popup (nếu có) — BẮT BUỘC đủ 4 phần:
   Icon: «loại icon: Lỗi / Thông báo / Xác nhận»
   Tiêu đề: «tiêu đề popup»
   Nội dung: «nội dung tiếng Việt»
   Button: «Hủy bỏ → action, Xác nhận → action»
```

---

### 3.1.N+1 Chi tiết lưới dữ liệu «Tên lưới»

> [!IMPORTANT]
> **GRID COMPLETENESS CHECK:** Đọc lại URD để liệt kê TẤT CẢ các cột trong lưới:
>
> - Tab hợp lệ: liệt kê đầy đủ các cột
> - Tab không hợp lệ: thường có THÊM các cột: **Trạng thái**, **Mô tả lỗi**, **Tên hợp lệ**
> - Nếu có button action (VD: "Cập nhật tên hợp lệ") → PHẢI mô tả riêng
> - Quy tắc UX: **tooltip on hover** (hiển thị đầy đủ khi hover), **kéo rộng cột**

| STT | Cột                  | Kiểu hiển thị                                 | Kiểu thao tác                     | Bắt buộc | Mô tả                                     |
| --- | -------------------- | --------------------------------------------- | --------------------------------- | -------- | ----------------------------------------- |
| «N» | «Tên cột trong lưới» | «Label / Textbox / Dropdown / Checkbox / ...» | «Click / Input / Read-Only / ...» | «Y/N»    | «Logic hiển thị, validate, nguồn dữ liệu» |

**Phân trang lưới:**

| Mục                 | Giá trị                                               |
| ------------------- | ----------------------------------------------------- |
| Số bản ghi mặc định | «N bản ghi/trang»                                     |
| Sticky header       | «Có / Không»                                          |
| Empty state         | «Thông báo khi không có dữ liệu: "«Chưa có dữ liệu»"» |
| Loading state       | «Icon loading + text: "«Đang tải dữ liệu...»"»        |
| Tab focus mặc định  | «Có GD KHL → focus tab KHL. Không có → focus tab HL»  |

---

## 4. Logic xử lý

> [!IMPORTANT]
> **LOGIC COMPLETENESS CHECK — BẮT BUỘC kiểm tra URD có các logic sau không:**
>
> 1. Logic validate file upload (check format, dung lượng, protection, nội dung)
> 2. Logic validate bên thụ hưởng (check 24/7, tên TK, NH hưởng)
> 3. Logic cross-check giữa các bảng kê (hóa đơn vs BTH, FX vs tổng tiền)
> 4. Logic tính phí chuyển tiền (nếu URD có — thường ở mục riêng)
> 5. Logic lưu thông tin giao dịch (nếu URD có — flow gửi server)
> 6. Logic validate client-side khi nhấn Lưu/Tiếp tục
> 7. Logic reset dữ liệu khi đổi loại DV
>
> Nếu URD có logic tính phí hoặc logic lưu GD → PHẢI tạo file riêng.
> Nếu URD KHÔNG có → ghi `«Tham chiếu PTTK»` + `[MANUAL]`.

### 4.N Logic «Tên logic»

«Mô tả chi tiết logic xử lý:»

- «Điều kiện: Nếu ... thì ...»
- «Công thức tính: ...»
- «API gọi: endpoint, params, response»
- «Thời điểm gọi: khi nào»
- «Xử lý lỗi: popup/toast text chính xác»

---

## 5. Tham số khai báo

### 5.N Tham số «Tên tham số»

| Mục     | Giá trị                 |
| ------- | ----------------------- |
| Bảng    | «Tên bảng DB»           |
| Trường  | «Tên trường»            |
| Giá trị | «Giá trị tham số»       |
| Mô tả   | «Mô tả ý nghĩa tham số» |
