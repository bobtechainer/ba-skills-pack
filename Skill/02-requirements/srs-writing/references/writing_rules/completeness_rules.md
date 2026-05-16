# SRS Completeness Rules — Quy tắc Đầy đủ Nội dung

**Violating the letter of these rules IS violating the spirit of these rules.**

---

## Actor + Logic Pattern — BẮT BUỘC cho MỌI field

Mỗi field/element trong bảng mô tả màn hình **PHẢI có 2 phần**:

### Phần 1: Tác nhân (Actor)

```
NSD: hành động gì (chọn, nhập, click)
Client: hiển thị gì (render, show, hide)
Server: trả về gì (response, data)
```

- Mỗi field PHẢI chỉ rõ AI LÀM (NSD / Client / Server)
- Nếu field có nhiều actor → liệt kê từng actor riêng dòng
- `NSD` = người sử dụng (end user)
- `Client` = ứng dụng phía client (browser, mobile app)
- `Server` = backend / API / core banking

### Phần 2: Logic xử lý

```
+ Quy tắc nghiệp vụ: liệt kê rules áp dụng
+ Mặc định: giá trị mặc định khi mở MH
+ Nguồn giá trị: API nào, bảng nào cung cấp dữ liệu
+ Validate: rule validate + thông báo lỗi chính xác
```

- PHẢI có ít nhất 1 trong 4 mục trên
- Nếu không có rule → ghi rõ "Không có rule đặc biệt"
- Nếu thiếu thông tin → ghi `[MANUAL: cần bổ sung]`

### Ví dụ đúng

```
| 5 | Số tài khoản | Textbox | Input | Y | 19 |
NSD: nhập số tài khoản nguồn (max 19 ký tự)
Client: hiển thị Textbox, auto-format khi blur
Server: validate TK tồn tại qua API /account/check

+ QT NV: TK phải thuộc chi nhánh đăng nhập
+ Mặc định: rỗng
+ Nguồn: NSD nhập thủ công
+ Validate: (1) Không rỗng → "Vui lòng nhập STK"
            (2) Đúng 19 ký tự → "STK phải đủ 19 ký tự"
            (3) TK tồn tại → "STK không tồn tại" |
```

### Ví dụ sai (VIOLATION)

```
❌ | 5 | Số tài khoản | Textbox | Input | Y | 19 | Nhập số tài khoản |
   → Thiếu Actor. Thiếu Logic. KHÔNG ĐẠT.
```

**If a field is missing Actor or Logic → bạn CHƯA HOÀN THÀNH. Fix trước khi tiếp tục.**

---

## API Completeness

- Liệt kê **TẤT CẢ** API từ URD — KHÔNG tóm tắt, KHÔNG bỏ sót
- Đếm số API trong URD → đếm số API trong SRS → hai số PHẢI bằng nhau
- Nếu thiếu endpoint → `«xem PTTK [tên API]»` + Word comment `[MANUAL]`

---

## UI Chrome — BẮT BUỘC

Bảng field PHẢI bắt đầu bằng 4 element UI chrome:

| STT | Element        | Luôn có |
| --- | -------------- | ------- |
| 1   | Navigation Bar | ✅      |
| 2   | Breadcrumb     | ✅      |
| 3   | Tiêu đề MH     | ✅      |
| 4   | Progress Bar   | Nếu có  |

Thiếu UI chrome = VIOLATION. Thêm vào trước khi viết field.

---

## Popup / Dialog — BẮT BUỘC 4 phần

Mỗi popup PHẢI có **đủ 4 phần**:

```
Icon: «Lỗi / Thông báo / Xác nhận / Cảnh báo»
Tiêu đề: «tiêu đề popup — text chính xác từ URD»
Nội dung: «nội dung tiếng Việt — text chính xác từ URD»
Button: «Hủy bỏ → action, Xác nhận → action»
```

- Text popup PHẢI lấy **CHÍNH XÁC** từ URD, KHÔNG paraphrase
- Scan URD để tìm tất cả popup wording → copy nguyên văn

---

## Pagination — Lưới dữ liệu

Mọi lưới (grid/table data) PHẢI có section phân trang:

| Mục                 | Bắt buộc |
| ------------------- | -------- |
| Số bản ghi mặc định | ✅       |
| Sticky header       | ✅       |
| Empty state text    | ✅       |
| Loading state text  | ✅       |
| Tab focus mặc định  | Nếu có   |

---

## Mandatory Elements Checklist

| Element        | Rule                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| **APIs**       | List ALL từ URD. Thiếu → `«xem PTTK [tên]»` + `[MANUAL]`               |
| **UI chrome**  | Nav Bar, Breadcrumb, Progress Bar, Loading — PHẢI có trong field table |
| **Popups**     | PHẢI có: Icon + Tiêu đề + Nội dung + Buttons                           |
| **Pagination** | Records per page, sticky header, empty state, loading state            |
| **Mockup**     | Nếu có → embed với absolute path dưới `a. Mockup Màn hình`. ALWAYS.    |
| **Version**    | Bảng phiên bản ở đầu. NEVER delete dòng cũ. Chỉ append.                |
