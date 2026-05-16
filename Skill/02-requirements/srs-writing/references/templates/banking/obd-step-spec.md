---
description: >-
  Template B — OBD Step Spec. Đặc tả theo step dạng BDD cho dự án mobile app.
  Dùng cho dự án có flow step-by-step, EKYC, onboarding.
metadata:
  tags: [template, obd, step-spec, mobile, bdd]
  source: OBD.docx (chị Nga - BA Alphaway)


# Template B: OBD — Đặc tả Step (BDD/Mobile)

Dùng cho: Mobile app, dự án có flow step-by-step, EKYC, onboarding, wizard multi-step.

> [!CAUTION]
> **RULES BẮT BUỘC khi dùng template này:**
> 1. Mỗi field PHẢI có **đầy đủ mô tả**: Tác nhân + Logic + Validate + Thông báo lỗi
> 2. Liệt kê **TẤT CẢ API** endpoint + params — không tóm tắt
> 3. Popup/dialog PHẢI có: Icon + Tiêu đề + Nội dung + Buttons
> 4. Mockup → PHẢI chèn ngay trong section tương ứng
> 5. Bảng revision: chỉ THÊM dòng — KHÔNG XÓA. File suffix `_vN` trùng version cuối

---

## Header

| Mục   | Nội dung                 |
| ----- | ------------------------ |
| FIGMA | «Link Figma của dự án»   |
| BRD   | «Link tài liệu BRD»      |
| MIRO  | «Link MIRO flow diagram» |

---

## Document Revision Control Table

> **RULE:** Chỉ THÊM dòng mới — KHÔNG XÓA dòng cũ.

| Version No. | Date Revised | Change Description | A/M/D                   | Prepared By | Approved By   |
| ----------- | ------------ | ------------------ | ----------------------- | ----------- | ------------- |
| «N»         | «DD/MM/YYYY» | «Mô tả thay đổi»   | «Add / Modify / Delete» | «Tên BA»    | «Tên PM/Lead» |

---

## Step «N»: «Tên step»

> **LẶP LẠI section này cho mỗi step trong luồng**

**FIGMA:** «Link Figma cho step này»
**MIRO:** «Link MIRO cho step này»

**Given:** «Trạng thái trước: KH đang ở đâu, đã làm gì trước step này»
**When:** «Hành động trigger: click gì, nhập gì, swipe gì»
**Then:**

- «Kết quả 1: FE hiển thị gì»
- «Kết quả 2: BE xử lý gì»
- «Kết quả 3: Validate gì»

**Các bước xử lý chi tiết:**

### Bảng xử lý chi tiết

| No  | Step                                                                        | UI                     | Description             |
| --- | --------------------------------------------------------------------------- | ---------------------- | ----------------------- |
| «N» | «Tên sub-step: ví dụ "(1) Click Đăng ký tài khoản (2) Kiểm tra Device NFC"» | «Ảnh/link MH từ Figma» | «Xem chi tiết bên dưới» |

### Description cho step «N»

**Mô tả xử lý tổng quan:**

«Mô tả xử lý chính, dùng ký hiệu | để ngắt các điều kiện/nhánh logic»

Pattern viết Description:

```
Tại MH [tên MH]:
[Action của KH]
FE check [điều kiện]
Nếu [điều kiện A]:
  Show [element/popup] theo UI
  [Button 1]: Click → [hành động]
  [Button 2]: Click → [hành động]
Nếu [điều kiện B]:
  Check [logic tiếp theo]
  → chuyển Step[N+1]
```

**Check điều kiện:**

- «FE check: logic FE validate trước khi gửi server»
- «BE check: API call + logic server-side»

**Show/Hide logic:**

- «Nếu [điều kiện] → hiển thị [element]»
- «Nếu [điều kiện khác] → ẩn [element]»

**Validate rules:**

| Trường      | Validate                                                | Thông báo lỗi                |
| ----------- | ------------------------------------------------------- | ---------------------------- |
| «Tên field» | «Rule: required / format / min-max / regex / length(N)» | «"Câu thông báo tiếng Việt"» |

**API call:**

| Mục            | Giá trị                                                   |
| -------------- | --------------------------------------------------------- |
| Endpoint       | «URL endpoint»                                            |
| Request        | «Params truyền lên»                                       |
| Response       | «Output fields nhận về»                                   |
| Xử lý response | «Logic sau khi nhận: show gì, chuyển step nào, lưu DB gì» |

**Popup (nếu có):**

| Mục         | Nội dung                                      |
| ----------- | --------------------------------------------- |
| Icon        | «Loại icon: warning / success / error / info» |
| Tiêu đề     | «Tiêu đề popup»                               |
| Nội dung    | «Nội dung tiếng Việt»                         |
| Button trái | «Tên + action khi click»                      |
| Button phải | «Tên + action khi click»                      |

**Back:** «Hành động khi KH nhấn back: quay về MH nào, trạng thái gì»

**Chuyển tiếp:** «Điều kiện chuyển step tiếp: → chuyển Step[N+1] / link confluence page»

---

## Lưu ý cho BA khi dùng template

1. **Lặp lại** section "Step N" cho mỗi step trong luồng onboarding
2. Mỗi step có **Revision Control Table riêng** nếu được quản lý version độc lập
3. Description dùng **ký hiệu |** để ngắt dòng khi xuất Word (mỗi | = 1 dòng mới trong ô bảng)
4. Mỗi sub-step trong bảng xử lý chi tiết có **section Description riêng** bên dưới
5. Đặt link Figma + MIRO cho **từng step** (không chỉ ở header)
