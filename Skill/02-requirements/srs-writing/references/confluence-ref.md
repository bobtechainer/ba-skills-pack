# Confluence Reference Resolution — HARD GATE

**Violating the letter of these rules IS violating the spirit of these rules.**

> [!CAUTION]
> **BẮT BUỘC. KHÔNG ĐƯỢC BỎ QUA.**
> Mỗi `[CROSS-REF]` trong output .md mà KHÔNG có link Confluence = VIOLATION.
> Nếu bạn thấy `[CROSS-REF]` trong output mà không kèm link `https://` → bạn CHƯA LÀM BƯỚC NÀY.

---

## Red Flags — STOP nếu bạn đang làm những điều này

- Viết `[CROSS-REF: ...]` mà KHÔNG tra cứu Confluence → VIOLATION
- Viết `<span class="tag-crossref">CROSS-REF</span>` mà không kèm `<a href>` → VIOLATION
- Nói "sẽ gắn link sau" → VIOLATION. Gắn LÚC VIẾT.
- Nói "không tìm thấy" mà CHƯA đọc `pages_index.md` → VIOLATION
- Bỏ qua vì "file to" hoặc "mất thời gian" → VIOLATION

---

## GATE: Trước Step 3.5 (HTML Preview)

Trước khi chuyển sang Step 3.5, PHẢI kiểm tra:

```
□ Đã đọc ít nhất 1 file pages_index.md?
□ Mỗi [CROSS-REF] đều đã được tra cứu?
□ Nếu tìm thấy → đã gắn link (xem [...](URL))?
□ Nếu không tìm thấy → đã ghi chú "[CROSS-REF: ... — Chưa tìm thấy trên Confluence]"?
```

**Nếu CHƯA → quay lại Step 3. KHÔNG được sang Step 3.5.**

---

## Quy trình — BẮT BUỘC thực hiện ĐẦY ĐỦ

### Bước 1: Load danh sách spaces (1 lần đầu tiên)

Đọc manifest.json để biết có những space nào:

**Cách 1 — Local (nhanh):**

```
Tìm file: tools/confluence_sync/data/manifest.json trong repo
```

**Cách 2 — GitHub URL (nếu local không có):**

```
read_url_content("https://raw.githubusercontent.com/bobtechainer/ba-skills-pack/main/tools/confluence_sync/data/manifest.json")
```

**Cách 3 — Knowledge Items (fallback cuối):**

```
Tìm folder: ~/.gemini/antigravity/knowledge/confluence_*/artifacts/pages_index.md
```

**Nếu CẢ 3 cách đều không có data → hỏi user:** "Chưa có dữ liệu Confluence. Bạn muốn chạy sync không?"

### Bước 2: Đọc pages_index.md phù hợp

Từ manifest.json, chọn space phù hợp với project (VD: `confluence_2024kh001_ibank_20` cho iBank2).

**Đọc file:**

```
view_file("tools/confluence_sync/data/<space_dir>/artifacts/pages_index.md")
```

Hoặc qua URL:

```
read_url_content("https://raw.githubusercontent.com/bobtechainer/ba-skills-pack/main/tools/confluence_sync/data/<space_dir>/artifacts/pages_index.md")
```

### Bước 3: Với MỖI `[CROSS-REF]` → tra cứu

Trích keyword từ tag → tìm trong `pages_index.md`:

| Tag                           | Keyword tìm                                 | Cách tìm                                |
| ----------------------------- | ------------------------------------------- | --------------------------------------- |
| `[CROSS-REF: GĐ 3]`           | "GĐ 3", "giai đoạn 3", "cấp 3", "RSD cấp 3" | Tìm trong cột "Tên trang"               |
| `[CROSS-REF: SRS GĐ 3]`       | "SRS", "GĐ 3", "RSD"                        | Tìm trong cột "Tên trang" + "Thuộc mục" |
| `[CROSS-REF: PTTK module FX]` | "FX", "tỷ giá", "Foreign Exchange"          | Tìm trong cột "Tên trang" + "Labels"    |
| `[CROSS-REF: mục 3.2.6 URD]`  | "3.2.6", "URD"                              | Tìm có trang nào chứa "URD" + "3.2.6"   |

**Ưu tiên match:** exact title > partial title > breadcrumb > label

### Bước 4: Thay thế trong .md

**Tìm thấy:**

```markdown
Trước: Có sẵn [CROSS-REF: GĐ 3]
Sau: Có sẵn (xem [RSD cấp 3_Payment_MVP](https://bidv-vn.atlassian.net/wiki/spaces/KH0012024/pages/297305645))
```

**Nhiều match:**

```markdown
Sau: Có sẵn (xem [RSD cấp 3](link1) hoặc [URD LV3](link2))
```

**Không tìm thấy — GHI RÕ:**

```markdown
Sau: Có sẵn [CROSS-REF: GĐ 3 — chưa tìm thấy trên Confluence]
```

### Bước 5: Trong HTML preview

Mỗi link đã resolve → render `<a href="URL" target="_blank">Tên trang</a>`:

```html
<td>
  Có sẵn (xem
  <a href="https://bidv-vn.atlassian.net/..." target="_blank"
    >RSD cấp 3_Payment_MVP</a
  >)
</td>
```

`[CROSS-REF]` chưa resolve → render với class `tag-crossref` + ghi chú:

```html
<span class="tag-crossref">CROSS-REF — chưa tìm thấy</span>
```

---

## Anti-Rationalization

| Excuse                                | Reality                                                              |
| ------------------------------------- | -------------------------------------------------------------------- |
| "Tìm kiếm mất thời gian"              | Đọc pages_index.md mất <5 giây. grep keyword là xong.                |
| "Không biết tìm ở đâu"                | Bước 1 ghi RÕ 3 cách. Thử lần lượt.                                  |
| "Quá nhiều CROSS-REF"                 | Từng cái một. Không skip cái nào.                                    |
| "Sẽ gắn link sau ở Step 3.5"          | KHÔNG. Gắn NGAY khi viết .md ở Step 3.                               |
| "Không tìm thấy match"                | Ghi rõ `[CROSS-REF: ... — chưa tìm thấy]`. KHÔNG để trống.           |
| "User sẽ tự bổ sung"                  | Đúng nhưng bạn PHẢI thử tìm TRƯỚC. Kết quả = link hoặc ghi chú.      |
| "File pages_index.md quá lớn"         | Dùng grep/search. Không cần đọc hết.                                 |
| "Chỉ là tham chiếu, không quan trọng" | Tham chiếu = GIÁ TRỊ CHÍNH của SRS. Link click được = chuyên nghiệp. |

---

## Verification Checkpoint

Sau Step 3, trước Step 3.5, AI PHẢI tự kiểm tra:

1. Đếm số `[CROSS-REF]` trong tất cả file .md
2. Đếm số link `https://bidv-vn.atlassian.net` đã gắn
3. Báo cáo: "X/Y CROSS-REF đã resolve thành link Confluence"
4. Nếu có CROSS-REF chưa resolve → giải thích lý do cho TỪNG cái

**Ví dụ báo cáo:**

```
📊 Confluence Reference: 8/10 resolved
✅ CROSS-REF: GĐ 3 → RSD cấp 3_Payment_MVP
✅ CROSS-REF: PTTK module FX → PTTK Foreign Exchange v2
❌ CROSS-REF: mục 5 URD → Chưa tìm thấy (URD chưa upload lên Confluence)
❌ CROSS-REF: PTTK S3/ECM → Chưa tìm thấy
```
