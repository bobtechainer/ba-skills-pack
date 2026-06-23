# PM Survey — Cost Section + De-handover Copy — Design

Ngày: 2026-06-23

## 1. Bối cảnh

Survey PM outsource (web tại `tools/pm-survey/`, deploy `techainer-pm-survey.vercel.app`) hiện có 5 phần / 22 câu, gửi cho khách hàng (PM phía đối tác/ngân hàng). Có 2 vấn đề cần xử lý:

1. Chữ "bàn giao" xuất hiện ở phần khách hàng nhìn thấy. Khách đọc thấy "bàn giao" dễ hiểu nhầm là sắp bị thay người/đuổi việc, nên cần bỏ.
2. PM của công ty chịu trách nhiệm cả ngân sách và margin dự án, nhưng survey chưa hỏi gì về chi phí. Cần thêm một nhóm câu hỏi định lượng về chi phí.

## 2. Mục tiêu

- Bỏ mọi cụm "bàn giao" (và "handover") ở phần hiển thị cho người làm khảo sát, thay bằng cách diễn đạt trung tính.
- Thêm 1 phần mới về chi phí/ngân sách/margin, thiên định lượng, ưu tiên thang Likert 5 mức bên cạnh câu trắc nghiệm.

## 3. Phần A — Bỏ "bàn giao"

| Chỗ | Cũ | Mới |
|---|---|---|
| `index.html` `<title>` | Khảo sát bàn giao công việc PM outsource | Khảo sát quy trình quản lý module outsource |
| `index.html` meta description | …skill AI hỗ trợ handover, vận hành dự án và onboarding PM mới | …skill AI hỗ trợ công việc hằng ngày của PM dự án ngân hàng (bỏ "handover") |
| `LandingPage` mô tả | …đến lúc bàn giao. | …đến lúc giao sản phẩm. |
| `ThankYouPage` | …hỗ trợ bàn giao công việc và onboarding PM mới… | …hỗ trợ công việc hằng ngày của PM dự án… |
| `questions.js` tên phần cuối | Giao tiếp, bàn giao và cải thiện | Giao tiếp, phối hợp và cải thiện |
| `questions.js` câu 1.2 (row) | Timeline, deadline bàn giao | Timeline, deadline giao sản phẩm |
| `questions.js` câu 3.1 (row) | Kế hoạch dự án, mốc bàn giao | Kế hoạch dự án, mốc giao sản phẩm |
| `questions.js` câu nghỉ phép | "…cần bao lâu để bàn giao đủ cho họ…" | "Anh/chị nghỉ phép 2 tuần, một đồng nghiệp phụ trách tạm. Anh/chị cần bao lâu để cập nhật đủ tình hình cho họ nắm việc?" |

> Lưu ý: `<title>` đồng bộ theo h1 landing mà user đã đặt ("Khảo sát quy trình quản lý module outsource") để trang nhất quán.

## 4. Phần B — Phần mới "Chi phí, ngân sách và margin"

Hướng thiết kế đã chốt: **vòng đời chi phí**. Đặt làm **Phần 5 mới**, ngay trước phần "Giao tiếp, phối hợp và cải thiện" (phần đó dồn xuống Phần 6). PM nắm cả ngân sách và margin nên hỏi sâu được.

6 câu (2 Likert ma trận + 3 thang định lượng + 1 trắc nghiệm). Loại input dùng lại loại có sẵn của app: `single-range`, `single-choice`, `matrix` (Likert = matrix 5 cột mức độ).

1. **5.1** `single-range` — Khi dự án xong, chi phí thực tế thường lệch bao nhiêu so với ước lượng ban đầu?
   Lệch dưới 5% / 5–15% / 15–30% / 30–50% / Trên 50%
2. **5.2** `single-range` — Trong 12 tháng qua, bao nhiêu phần các dự án anh/chị phụ trách bị vượt ngân sách (hoặc vượt effort cho phép)?
   Không có dự án nào / Dưới một phần tư / Khoảng một nửa / Hơn một nửa / Gần như tất cả
3. **5.3** `matrix` (Likert tần suất) — Mấy việc liên quan đến tiền dưới đây, anh/chị làm thường xuyên đến mức nào?
   Hàng: Cập nhật chi phí/effort thực tế so với kế hoạch · Đối chiếu giờ công thực tế với ước lượng · Tính lại margin khi có thay đổi · Rà soát các khoản phát sinh ngoài dự toán · Báo cáo tình hình chi phí cho quản lý
   Cột: Không làm / Hằng tháng / Vài lần một tháng / Hằng tuần / Hằng ngày
4. **5.4** `matrix` (Likert mức ảnh hưởng) — Những thứ dưới đây làm đội chi phí dự án của anh/chị nhiều đến mức nào?
   Hàng: Làm thêm yêu cầu ngoài hợp đồng mà không tính tiền · Sửa tới sửa lui do hiểu sai yêu cầu · Ước lượng ban đầu thấp hơn thực tế · Tăng ca hoặc dồn người để kịp hạn · Chờ phía ngân hàng phản hồi làm kéo dài việc · Lỗi phát hiện muộn nên sửa tốn kém
   Cột: Không đáng kể / Ít / Vừa / Nhiều / Rất nhiều
5. **5.5** `single-range` — Anh/chị cập nhật được con số chi phí và margin thực tế của dự án bao lâu một lần?
   Gần như theo thời gian thực / Hằng tuần / Hằng tháng / Theo mốc thanh toán / Hầu như không cập nhật
6. **5.6** `single-choice` — Thường thì anh/chị nhận ra dự án sắp vượt chi phí vào lúc nào?
   Ngay từ khi ước lượng, biết trước là sát / Khi đang làm, còn kịp điều chỉnh / Khi ngân sách gần cạn / Khi đã lỡ vượt rồi / Chỉ biết lúc quyết toán cuối dự án

## 5. Kết quả mong đợi

- Survey thành **6 phần / 28 câu**.
- Không còn "bàn giao"/"handover" ở phần hiển thị.
- Lint/build pass; redeploy Vercel project `pm-survey`.
- Không đổi cấu trúc app, loại input, storage key, backend.

## 6. Ngoài phạm vi

- Không đổi password dashboard, framework, backend.
- Không thêm câu về công cụ theo dõi chi phí / dữ liệu lời-lỗ ở vòng này (có thể bổ sung sau nếu cần).
