# Viết Tiếng Việt Tự Nhiên — Không Máy Móc

Bộ rules này giải quyết 1 vấn đề: **AI viết tiếng Việt nghe giả, cứng, khó hiểu.**
Đọc xong file này → đọc lại đoạn vừa viết → sửa cho mượt.

---

## Test nhanh: Đọc to 3 giây

Đọc to đoạn vừa viết. Nếu nghe như:
- **Robot đọc slide** → viết lại
- **Phát thanh viên VTV** → viết lại (quá formal)
- **Đang giải thích cho đồng nghiệp** → OK

---

## 7 Nguyên tắc

### 1. Chủ ngữ là NGƯỜI — không phải hệ thống

Người đọc quan tâm người dùng làm gì, không phải hệ thống làm gì.

| ❌ Máy móc | ✅ Tự nhiên |
|---|---|
| "Hệ thống cung cấp khả năng tìm kiếm tri thức đa phương thức" | "Expert hỏi câu hỏi, hệ thống tìm câu trả lời trong 2 giây" |
| "Platform thực hiện quá trình đánh giá chuyên gia" | "Expert làm quiz, làm thử task, được senior review — xong 3 bước thì bắt đầu làm thật" |
| "Module này hỗ trợ quản lý tri thức dự án" | "PM upload tài liệu dự án. Expert hỏi bất cứ lúc nào, được trả lời ngay" |

### 2. Kể chuyện Trước → Sau

Mỗi tính năng = 1 câu chuyện nhỏ: trước đây thế nào → giờ thế nào → kết quả.

| ❌ Liệt kê tính năng | ✅ Kể chuyện |
|---|---|
| "Tính năng tạo khóa học tự động từ tài liệu dự án" | "Trước đây PM mất 2 ngày soạn khóa học. Giờ PM upload file, viết 1 dòng mô tả — 15 phút sau khóa học sẵn sàng, có cả quiz và audio tóm tắt" |
| "Hệ thống phát hiện lỗ hổng kiến thức tự động" | "Khi expert hỏi mà hệ thống không trả lời được, câu hỏi đó được ghi lại. Cuối tuần, PM nhận báo cáo: '15 expert hỏi về quy trình X nhưng chưa có tài liệu.' PM bổ sung ngay" |

### 3. Từ đời thường trước — từ chuyên môn sau (hoặc bỏ luôn)

| Từ máy móc | Từ tự nhiên | Khi nào dùng |
|---|---|---|
| triển khai | làm, xây, dựng | Luôn ưu tiên |
| tích hợp | kết nối, nối vào | Luôn ưu tiên |
| đảm bảo | chắc chắn, kiểm tra | Luôn ưu tiên |
| thực hiện | làm | Luôn ưu tiên |
| cung cấp | có, cho, đưa ra | Luôn ưu tiên |
| quy trình | cách làm, các bước | Trừ khi nói về quy trình chính thức |
| tối ưu hóa | cải thiện, làm tốt hơn | Luôn ưu tiên |
| giải pháp | cách giải quyết, cách làm | Trừ khi là tên sản phẩm |
| nền tảng | hệ thống | Trừ khi là tên sản phẩm |
| hạ tầng | máy chủ, server | BRD: tránh. SRS/HLD: OK |

### 4. Xóa "cụm từ zombie"

Cụm từ này không mang nghĩa — chỉ chiếm chỗ. Xóa mà câu vẫn đúng = cụm từ zombie.

Xóa hết:
- "nhằm mục đích" → bỏ, viết thẳng
- "với khả năng" → bỏ
- "thông qua việc" → bỏ
- "trong quá trình" → "khi"
- "đối với việc" → bỏ
- "một cách hiệu quả" → bỏ (nếu hiệu quả thì số liệu sẽ nói)
- "dựa trên cơ sở" → "dựa trên" hoặc "theo"
- "nhằm đáp ứng nhu cầu" → bỏ
- "góp phần nâng cao" → "tăng" hoặc "cải thiện"

**Ví dụ:**
- ❌ "Hệ thống được xây dựng nhằm mục đích cung cấp khả năng quản lý tri thức một cách hiệu quả cho đội ngũ chuyên gia"
- ✅ "Hệ thống giúp expert tìm thông tin nhanh — hỏi câu hỏi, nhận câu trả lời trong 2 giây"

### 5. Nhịp điệu: xen kẽ ngắn-dài

AI viết 5 câu liên tiếp cùng 15 từ = robot. Người viết xen kẽ câu ngắn (gây chú ý) với câu dài (giải thích).

**Ví dụ:**
> PM mất 3 ngày onboard expert. Ba ngày. Trong khi đó, dự án chờ, client hỏi tiến độ, expert ngồi không. Với hệ thống mới, PM upload tài liệu lúc sáng — chiều expert đã bắt đầu làm.

Chú ý: "Ba ngày." — 2 từ, nhấn mạnh. Câu tiếp 15 từ, giải thích hệ quả. Câu cuối 15 từ, giải pháp.

### 6. Mỗi đoạn = 1 ý + 1 ví dụ cụ thể

Không viết trừu tượng. Luôn kèm ví dụ cụ thể với CON SỐ hoặc TÌNH HUỐNG.

| ❌ Trừu tượng | ✅ Cụ thể |
|---|---|
| "Hỗ trợ nhiều loại file" | "PM gửi PDF hướng dẫn, video demo, ảnh mẫu — upload lên, hệ thống xử lý hết, không cần convert" |
| "Đánh giá chất lượng liên tục" | "Cứ 100 task expert làm, 5 task là bài kiểm tra ẩn. Nếu sai quá 15% → cảnh báo PM ngay" |
| "Giảm thời gian đánh giá" | "Expert cũ: làm test 2 tiếng. Expert mới trong hệ thống: quiz tự điều chỉnh độ khó, 20-30 phút xong" |

### 7. SCQA cho mỗi section lớn

Mở đầu mỗi chapter/section bằng:

- **S**ituation — Bối cảnh ai cũng biết: "Tbrain có 17,000 experts."
- **C**omplication — Vấn đề: "Nhưng mỗi dự án mới, PM mất 3-5 ngày chỉ để onboard."
- **Q**uestion — Ngầm hiểu: "Làm sao scale lên 10+ dự án?"
- **A**nswer — Giải pháp cụ thể: "Hệ thống tự tạo khóa học từ tài liệu. PM upload, 15 phút sau expert học được."

KHÔNG mở đầu bằng: "Phần này trình bày..." hoặc "Mục đích của chương này..."

---

## Checklist trước khi submit

- [ ] Đọc to 1 đoạn random — nghe tự nhiên không?
- [ ] Chủ ngữ câu đầu tiên mỗi đoạn = người (PM, expert, client), không phải hệ thống?
- [ ] Có ví dụ cụ thể (con số hoặc tình huống) trong mỗi đoạn dài?
- [ ] Không có cụm từ zombie ("nhằm mục đích", "với khả năng", "một cách hiệu quả")?
- [ ] Câu không quá 25 từ? Có xen kẽ câu ngắn (≤8 từ)?
- [ ] Mỗi section mở đầu bằng SCQA, không phải "Phần này trình bày..."?
