---
description: >-
  Template C — Digital Lending User Story. Đặc tả theo User Story (Card-Confirmation-Conversation).
  Dùng cho dự án digital lending, vay tiêu dùng, flow mobile app multi-step.
metadata:
  tags: [template, digital-lending, user-story, mobile, ccc]
  source: Vay tiêu dùng CBNV MB v12 (MBBank - Confluence)

# Template C: Digital Lending — User Story (CCC)

Dùng cho: Digital lending, vay tiêu dùng, flow mobile app, dự án dùng format Card-Confirmation-Conversation.

> [!CAUTION]
> **RULES BẮT BUỘC khi dùng template này:**
> 1. Mỗi field PHẢI có **đầy đủ mô tả**: Tác nhân + Logic + Validate + Thông báo lỗi
> 2. Liệt kê **TẤT CẢ API** endpoint + params + response — không tóm tắt
> 3. Popup/dialog PHẢI có: Icon + Tiêu đề + Nội dung + Buttons
> 4. Mockup người dùng gửi → PHẢI chèn vào cột Mockup tương ứng
> 5. Bảng phiên bản: chỉ THÊM dòng — KHÔNG XÓA. File suffix `_vN` trùng version cuối

---

## Bảng 1: Lịch sử cập nhật tài liệu

> **RULE:** Chỉ THÊM dòng mới — KHÔNG XÓA dòng cũ.

| Version      | Ngày         | Mô tả thay đổi   | Người sửa |
| ------------ | ------------ | ---------------- | --------- |
| «Số version» | «DD/MM/YYYY» | «Mô tả thay đổi» | «Tên BA»  |

---

## US«NN»: «KH muốn [hành động] [sản phẩm]»

> **LẶP LẠI section này cho mỗi User Story**

### 1. MỤC ĐÍCH YÊU CẦU (CARD)

#### 1.1 Mô tả mục đích yêu cầu

«Là [role], tôi muốn [action] [sản phẩm]»

| Mục                | Nội dung                                    |
| ------------------ | ------------------------------------------- |
| Mức độ rủi ro      | «Rủi ro cao [X] / Rủi ro thấp [ ]»          |
| Yêu cầu triển khai | «YCPT phức tạp [ ] / YCPT Thông thường [X]» |
| Phân loại yêu cầu  | «Điền phân loại YCPT»                       |

---

### 2. TIÊU CHÍ NGHIỆM THU (CONFIRMATION)

| STT | Scenario (kịch bản) | Given (trạng thái)   | When (điều kiện)                | Then (kết quả mong muốn) | Mockup        |
| --- | ------------------- | -------------------- | ------------------------------- | ------------------------ | ------------- |
| «N» | «Tên kịch bản test» | «Trạng thái ban đầu» | «Hành động / điều kiện trigger» | «Kết quả expected»       | «Link mockup» |

---

### 3. MÔ TẢ YÊU CẦU CHI TIẾT (CONVERSATION)

#### 3.1 Mô tả sản phẩm

| Mục                | Nội dung                                                                      |
| ------------------ | ----------------------------------------------------------------------------- |
| Sản phẩm           | «Tên sản phẩm: ví dụ Vay tiêu dùng CBNV MB»                                   |
| Điều kiện KH       | «Liệt kê điều kiện KH: tuổi, thời gian công tác, nợ, CIC, ...»                |
| Hạn mức khoản vay  | «Min / Max, công thức tính max»                                               |
| Đặc tính khoản vay | «Mã sản phẩm, category, sub product, mã limit»                                |
| Kỳ trả nợ          | «Các option: 1/3/6/12 tháng. Logic tính kỳ trả nợ đầu tiên, các kỳ tiếp theo» |

---

#### 3.2 Quy trình thực hiện

| Bước | Đơn vị thực hiện              | Mô tả nghiệp vụ                                                             | Tham chiếu                |
| ---- | ----------------------------- | --------------------------------------------------------------------------- | ------------------------- |
| «N»  | «KH / Mobile App / Server+MS» | «Mô tả hành động: click gì, gọi API gì, check điều kiện gì, kết quả trả về» | «Link tài liệu liên quan» |

**Hướng dẫn viết cột Mô tả:**

```
Bước KH:
  Mô tả hành động KH thực hiện trên app

Bước Mobile App:
  Gọi api «endpoint»
  Truyền params: «param1, param2»
  Check điều kiện:
  - Nếu [điều kiện A] → hiển thị [thông báo / MH tiếp]
  - Nếu [điều kiện B] → show popup [nội dung]

Bước Server:
  Check [logic business]: validate, CIC, điều kiện KH, ...
  Trả kết quả cho mobile app
```

---

#### 3.3 Bảng check điều kiện / thông báo lỗi

| Lỗi                                           | Câu thông báo                                |
| --------------------------------------------- | -------------------------------------------- |
| «Tên lỗi: Email, SĐT, CIC, Gói MB, Tuổi, ...» | «"Câu thông báo tiếng Việt hiển thị cho KH"» |

---

#### 3.4 Mô tả chi tiết màn hình

##### Bước «N»: «Tên bước: Nhập thông tin vay / Nhập thông tin giải ngân / Xác nhận / ...»

| Tên trường  | Định dạng                                              | M/O     | Editable / Read-Only   | Mô tả                                     |
| ----------- | ------------------------------------------------------ | ------- | ---------------------- | ----------------------------------------- |
| «Tên field» | «TextBox / Label / ComboBox / Button / Checkbox / ...» | «M / O» | «Editable / Read-only» | «Mô tả chi tiết (xem hướng dẫn bên dưới)» |

**Hướng dẫn viết cột Mô tả:**

```
Label / Read-Only:
  Giá trị lấy từ API «endpoint» field «field_name»

TextBox:
  Placeholder: "«text gợi ý»"
  Min/Max: «giá trị»
  Format: «chữ/số/đặc biệt»
  Maxlength: «N ký tự»

ComboBox:
  Gọi API «endpoint» lấy danh sách
  Default: «giá trị mặc định»
  Output: «field1, field2»
  Điều kiện hiển thị: «logic filter danh sách»
  Khi thay đổi → «reset field khác / validate lại»

Button:
  Click → «action: chuyển bước / gọi API / show popup»
  Validate trước khi action:
  - Nếu «điều kiện sai» → "«câu thông báo»"
  - Nếu OK → «chuyển bước N+1»
```

---

#### 3.5 Validate và xử lý đặc biệt

| Trường      | Validate rule                                       | Thông báo lỗi     | Xử lý                                             |
| ----------- | --------------------------------------------------- | ----------------- | ------------------------------------------------- |
| «Tên field» | «Rule: format, min/max, required, regex, API check» | «"Câu thông báo"» | «Action sau validate: block / warning / redirect» |

---

## Lưu ý cho BA khi dùng template

1. **Lặp lại** section "US«NN»" cho mỗi User Story trong sản phẩm
2. Mỗi US có đầy đủ **3 phần CCC**: Card → Confirmation → Conversation
3. Trong Conversation, mô tả từng **Bước (step)** với bảng field chi tiết riêng
4. Bảng field dùng format: **Tên trường | Định dạng | M/O | Editable/Read-Only | Mô tả**
5. Ghi rõ **API endpoint + params + response** cho mỗi field lấy từ server
6. Mỗi **condition check** cần có bảng thông báo lỗi tương ứng
7. Logic **transferChannel** (CITAD/NAPAS) và **routing** cần ghi rõ ngưỡng số tiền
