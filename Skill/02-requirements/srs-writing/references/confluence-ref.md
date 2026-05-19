# Confluence Reference Resolution — Tự động gắn link tài liệu

## Mục đích

Thay thế tag `[CROSS-REF: ...]` bằng **link Confluence thật** khi có thể.
Giữ nguyên tag khi không tìm thấy nguồn phù hợp.

---

## Dữ liệu tham chiếu

Dữ liệu nằm trong file `pages_index.md` — bảng tra cứu với cột: **Tên trang**, **Link**, **Thuộc mục** (breadcrumb), **Labels**.

### Nguồn dữ liệu (theo thứ tự ưu tiên)

1. **GitHub raw URL** (khuyến nghị — luôn có data mới nhất):

   ```
   https://raw.githubusercontent.com/bobtechainer/ba-skills-pack/main/tools/confluence_sync/data/<space_name>/artifacts/pages_index.md
   ```

   → Dùng `read_url_content` để fetch. Data được GitHub Actions auto-sync mỗi ngày.

2. **Local trong repo** (nếu user đã pull):

   ```
   tools/confluence_sync/data/confluence_*/artifacts/pages_index.md
   ```

3. **Local Knowledge Items** (nếu user tự chạy sync):
   ```
   ~/.gemini/antigravity/knowledge/confluence_*/artifacts/pages_index.md
   ```

### Lấy danh sách spaces

Để biết tên các space folder có sẵn, fetch file:

```
https://raw.githubusercontent.com/bobtechainer/ba-skills-pack/main/tools/confluence_sync/data/manifest.json
```

Nếu file này không tồn tại → thử đọc từ local path hoặc tìm folder `confluence_*` trong Knowledge Items.

---

## Khi nào chạy

- **Step 3** (Generate .md): Mỗi khi viết `[CROSS-REF: ...]`, LẬP TỨC tra cứu.
- **Step 3.5** (HTML preview): Hiển thị link đã resolve dưới dạng `<a href="...">`.

---

## Quy trình resolve

### 1. Trích xuất keyword từ tag

```
[CROSS-REF: GĐ 3]         → keyword = "GĐ 3", "giai đoạn 3", "GĐ3"
[CROSS-REF: Tham số phí]   → keyword = "Tham số phí", "phí"
[CROSS-REF: MH Khai báo]   → keyword = "Khai báo", "màn hình khai báo"
```

### 2. Tìm trong pages_index.md

- Đọc TẤT CẢ `pages_index.md` từ các KI `confluence_*`
- Tìm theo: **Tên trang** chứa keyword, hoặc **Thuộc mục** (breadcrumb) chứa keyword
- Ưu tiên: match chính xác > match một phần > match breadcrumb
- Nếu nhiều results → chọn match chính xác nhất, hoặc liệt kê top 3 với `[MULTI-MATCH]`

### 3. Thay thế trong .md

**Tìm thấy 1 match:**

```markdown
Trước: Có sẵn [CROSS-REF: GĐ 3]
Sau: Có sẵn (xem [RSD cấp 3_Payment_MVP](https://bidv-vn.atlassian.net/wiki/spaces/KH0012024/pages/297305645/...))
```

**Tìm thấy nhiều match — cần chọn:**

```markdown
Sau: Có sẵn [CROSS-REF: GĐ 3 — xem thêm: [RSD cấp 3](link1), [URD Payment LV3](link2)]
```

**Không tìm thấy:**

```markdown
Sau: Có sẵn [CROSS-REF: GĐ 3] ← Giữ nguyên, AI ghi chú "Chưa tìm thấy trên Confluence"
```

---

## Lưu ý quan trọng

- **KHÔNG xóa tag `[CROSS-REF]`** nếu chưa tìm thấy link — giữ để người dùng bổ sung
- Link Confluence phải là **full URL** (bắt đầu `https://`)
- Trong HTML preview: link hiển thị dưới dạng `<a>` có thể click
- Trong .docx: link hiển thị dưới dạng hyperlink
- Khi re-sync Confluence (chạy lại `sync_confluence.py`), link sẽ vẫn đúng vì dựa trên page ID

---

## Ví dụ thực tế

Input (URD nói "Xem GĐ 3"):

```markdown
| API danh sách GD | Có sẵn [CROSS-REF: GĐ 3] | BDR | API | ...
```

Sau resolve:

```markdown
| API danh sách GD | Có sẵn (xem [RSD cấp 3_Payment_MVP](https://bidv-vn.atlassian.net/wiki/spaces/KH0012024/pages/297305645/RSD+c+p+3_Payment_MVP)) | BDR | API | ...
```
