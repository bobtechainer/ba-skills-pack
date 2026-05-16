# Writing Rules: Tone & Terminology

Áp dụng cho mọi tài liệu do project team tạo ra.

---

## 0. BRD Writing Level (CRITICAL — khác SRS/HLD)

BRD viết cho: **CEO, PM, BA, client stakeholders** — KHÔNG phải developers.
SRS/HLD mới viết cho developers. BRD = nghiệp vụ thuần túy.

### Những gì KHÔNG ĐƯỢC xuất hiện trong BRD:
- Tên thư viện/tool (Tesseract, mammoth.js, pgvector, Cognee, DeepAgentsJS, LangGraph)
- Tên thuật toán (HDBSCAN, CAT/IRT, RRF, BM25, HNSW)
- Chi tiết kiến trúc (Supabase RLS, vector dimensions, Temporal.io)
- Code blocks (Gherkin thuộc SRS)
- API specs (REST endpoints, SDK methods)
- Infrastructure (Docker, database schema)

### Những gì NÊN có trong BRD:
- Vấn đề nghiệp vụ + con số (chi phí, thời gian, %)
- Yêu cầu bằng ngôn ngữ tự nhiên: "Expert phải được đánh giá trước khi làm việc"
- Chỉ số thành công đo được: "Giảm 75% thời gian onboarding"
- Câu chuyện người dùng: "Khi PM nhận dự án mới, PM cần..."
- Quy tắc kinh doanh: "Dữ liệu mỗi khách hàng phải tách biệt hoàn toàn"
- Rủi ro về mặt kinh doanh: "Nếu expert không chịu học → delay delivery"

### Quy tắc viết BRD:
1. **Giải thích trước, thuật ngữ sau.** Đừng viết "knowledge graph" — viết "hệ thống hiểu mối liên hệ giữa các khái niệm" rồi mới nói tên kỹ thuật nếu cần.
2. **1 câu = 1 ý.** Tối đa 25 từ/câu. Dài hơn → tách.
3. **Kể chuyện Trước→Sau.** "PM mất 3 ngày → giờ upload file, 15 phút sau khóa học sẵn sàng."
4. **Tables ở BRD: nghiệp vụ.** Cột: Vấn đề | Giải pháp | Kết quả. KHÔNG: Library | Boundary | API.
5. **Mỗi tính năng: WHY (vấn đề) + WHAT (giải pháp bằng ngôn ngữ thường) + KẾT QUẢ (con số).**
6. **Test "đọc to":** Đọc to đoạn vừa viết — nếu nghe không tự nhiên như đang nói chuyện với đồng nghiệp, viết lại.

### Ví dụ:

| ❌ BRD viết sai (technical) | ✅ BRD viết đúng (nghiệp vụ) |
|---|---|
| "Platform cung cấp Hybrid RAG kết hợp pgvector + BM25 + Cognee knowledge graph, accuracy 90%" | "Khi expert hỏi, hệ thống tìm câu trả lời từ tài liệu dự án. Độ chính xác đạt 90% — nghĩa là cứ 10 câu hỏi thì 9 câu trả lời đúng." |
| "Ingestion pipeline parse 9 formats qua Docling, Whisper, Tree-sitter" | "Hệ thống nhận được mọi loại file phổ biến: PDF, Word, ảnh, video, code. PM chỉ cần upload, không cần convert hay xử lý gì trước." |
| "CAT/IRT adaptive testing giảm 40-60% assessment time" | "Quiz đánh giá tự điều chỉnh độ khó: expert giỏi thì ít câu hỏi hơn, expert yếu thì nhiều câu + giải thích khi sai. Kết quả: thời gian đánh giá giảm từ 2 giờ xuống 30 phút." |
| "HDBSCAN clustering unanswered questions" | "Hệ thống tự nhóm các câu hỏi chưa trả lời được theo chủ đề, để PM thấy ngay lỗ hổng kiến thức nằm ở đâu." |

---

## 1. Tone & Register

**Formal, precise, non-flowery.** Banking readers are auditors, regulators, engineers, and executives. They skim for facts. They punish ambiguity. They will not finish a paragraph that wastes their time.

### Do
- Viết câu ngắn, chủ ngữ rõ ràng. Ưu tiên câu chủ động.
- Dùng động từ quy tắc (*shall, must, is required to, phải, bắt buộc, chịu trách nhiệm*).
- Chỉ định rõ ai chịu trách nhiệm (the vendor, the client, end customer, regulator).
- Dùng số liệu cụ thể, có đơn vị (VND, giây, %, giao dịch/giây).
- Phân biệt rõ "phải" (mandatory / MUST) và "nên" (recommended / SHOULD) và "có thể" (optional / MAY) theo chuẩn RFC 2119.

### Don't
- Không dùng ngôn ngữ marketing (*"giải pháp đột phá"*, *"trải nghiệm đẳng cấp"*, *"cutting-edge"*).
- Không viết "hệ thống sẽ đảm bảo chất lượng cao" — thay bằng "hệ thống đáp ứng SLA 99.9%, response p99 < 2 giây".
- Không "dường như", "có thể sẽ", "khoảng". Thay bằng số cụ thể hoặc ghi "TBD — xác định ở giai đoạn X".
- Không dùng emoji trong tài liệu formal (trừ trong Test Case status icons nếu client đồng ý).

## 2. Identifier conventions

Mọi yêu cầu, use case, test case phải có ID stable, traceable:

| Prefix | Ý nghĩa | Format | Ví dụ |
|---|---|---|---|
| BR- | Business Rule (BRD) | `BR-\d{3}` | `BR-001` |
| FR- | Functional Requirement (SRS) | `FR-\d{3}` | `FR-042` |
| NFR- | Non-Functional Requirement (SRS) | `NFR-\d{3}` | `NFR-005` |
| UC- | Use Case | `UC-\d{3}` | `UC-012` |
| TC- | Test Case | `TC-\d{3}` | `TC-156` |
| RISK- | Risk Register entry | `RISK-\d{2}` | `RISK-07` |
| MSG- | System Message (error / notification) | `MSG-\d{3}` | `MSG-018` |

**Rule:** Đã cấp ID không được tái sử dụng, kể cả khi yêu cầu bị loại. Thay bằng `FR-042 [DEPRECATED v1.1]`.

## 3. Severity / Priority labels

- **Priority:** High / Medium / Low (H/M/L). Không dùng P0/P1/P2 (gây nhầm với incident severity).
- **Incident severity:** Critical / High / Medium / Low. P0/P1/P2/P3 được phép dùng trong Runbook và SLA nhưng phải định nghĩa trong glossary.
- **RFC 2119 keywords** (MUST, SHOULD, MAY) phải viết IN HOA khi được dùng như từ khóa, không hoa khi là từ thông thường.

## 4. Numbers, dates, currency

- Số lớn: dùng dấu chấm phẩy ngăn cách hàng nghìn, ví dụ `57,281 giải` (theo IIBA/quốc tế) HOẶC `57.281 giải` (theo Việt Nam) — **chọn một, dùng nhất quán trong cả project**. Khuyến nghị chuẩn VN (dấu chấm phẩy ngăn nghìn = `.`).
- Tiền VND: `18.655 tỷ VND` hoặc `18,655,000,000 VND`. Tránh `18.6B VND`.
- Ngày: `dd/mm/yyyy` (VN) hoặc `yyyy-mm-dd` (ISO). Không dùng `mm/dd/yyyy`.
- Thời gian: 24h format `14:30`. Không dùng AM/PM trừ khi tài liệu hướng dẫn khách hàng.
- Phần trăm: `99.9%` hoặc `99,9%` — nhất quán.

## 5. Bilingual rules

Nếu doc là bilingual VI/EN:
- **Tiêu đề H1/H2 MUST** có cả VI và EN, dạng `# Tiếng Việt / English`.
- H3/H4 có thể chỉ VI nếu thuật ngữ quá dài, miễn là EN term đã xuất hiện một lần ở phần trước.
- Thuật ngữ kỹ thuật: VI primary, EN trong ngoặc đơn hoặc italic lần xuất hiện đầu. Ví dụ: "bảo mật (*security*)", "hàm băm (*hash function*)".
- Không dịch các thuật ngữ industry-standard: API, REST, OAuth, JWT, microservices, deployment, failover, DDL, DML, NAT, TLS, SBV, KYC, AML, PCI-DSS, ISO 27001.
- Xem `bilingual_glossary.md` cho bảng terms chuẩn.

## 6. Paragraphs & lists

- Paragraph **tối đa 5 câu**. Nếu dài hơn, xem xét tách section.
- Bullet list khi có **3+ items song song**. 2 items viết thành câu.
- Numbered list khi **thứ tự quan trọng** (bước, mức độ ưu tiên). Ngược lại dùng bullet.
- Không nested quá 2 cấp.

## 7. Tables

- Mọi bảng phải có header row bold + màu header.
- Column header phải cụ thể (không dùng "Info" hay "Details"). Ví dụ tốt: "Biện pháp giảm thiểu / Mitigation", "Ngưỡng SLA / SLA Threshold".
- Số cột tối đa **6** (trên A4). Nhiều hơn → split table hoặc landscape page.
- Mọi row phải có action hoặc fact cụ thể. Không có "TBD" trong delivery cuối.

## 8. Cross-references

- Khi nhắc section khác, format: `§ 3.2`, `Section 3.2`, hoặc `Xem Mục 3.2`.
- Khi nhắc doc khác, format: `Xem <BRD §4.1>` hoặc `See BRD Section 4.1`.
- Khi nhắc ID: dùng đúng ID đã định nghĩa, không tự biên.

## 9. Confidentiality

Mọi tài liệu deliverable cho the client PHẢI có:
1. Classification banner ở cover page (CONFIDENTIAL / INTERNAL / PUBLIC)
2. Footer mỗi trang với classification short code
3. Câu "Tài liệu nội bộ của {{facts.project.vendor}} × {{facts.project.client}} — không sao chép hoặc phân phối" ở cover
