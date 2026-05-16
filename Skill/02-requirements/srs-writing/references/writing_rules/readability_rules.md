# Readability Rules — Quy tắc Dễ đọc

---

## Readability Pass — BẮT BUỘC sau khi viết mỗi file

Sau khi viết xong MỖI file .md, bạn PHẢI đọc lại toàn bộ các bảng trong file.

### Quy trình

1. Đọc lại từng cell trong bảng
2. Tự đánh giá: cell nào dài quá, nội dung dồn lại khó đọc?
3. Chèn `<br>` ở những chỗ hợp lý để ngắt dòng
4. Không có rule cố định — tùy ngữ cảnh, dùng judgment

### Khi nào ngắt dòng

- Cell chứa **≥ 2 ý độc lập** (2 điều kiện, 2 bước, 2 rules) → **nên ngắt**
- Cell chỉ là 1 câu đơn → **không cần ngắt**
- Liệt kê nhiều items → mỗi item 1 dòng

### Ví dụ

```
❌ NSD đăng nhập thành công. NSD có quyền tạo GD. NSD đã chọn HĐTD.
✅ NSD đăng nhập thành công.<br>NSD có quyền tạo GD.<br>NSD đã chọn HĐTD.
```

### Kỹ thuật

- `<br>` trong .md → docx export script chuyển thành xuống dòng thật trong Word
- Script bắt buộc split cell content trên regex `/\n|<br\s*\/?>/`
- Nếu export ra Word mà thấy chữ `<br>` hiện trên file → export script viết sai → sửa script

---

## "Đọc To" Test (từ document-suite)

Đọc paragraph vừa viết thành tiếng. Nếu không nghe giống đang giải thích cho đúng audience — viết lại.

| AI Slop                                        | Human Version                                        |
| ---------------------------------------------- | ---------------------------------------------------- |
| "Hệ thống cung cấp khả năng quản lý toàn diện" | "NSD tạo GD mới, hệ thống validate trong 2 giây"     |
| "Tích hợp liền mạch với hệ thống bên thứ ba"   | "Gọi API /account/check qua Open API, response < 1s" |

---

## Image Paths — ALWAYS Absolute

```markdown
✅ ![MH Khai báo](c:\Working\Techainer\BA Skills\output\SRS_X\images\mockup_01.png)
❌ ![MH Khai báo](mockup_01.png)
❌ ![MH Khai báo](images/mockup_01.png)
```

- Trước khi reference image → VERIFY file tồn tại tại path đó
- Nếu file không tồn tại → KHÔNG reference. Flag `[MANUAL: cần bổ sung mockup]`
