# PM Outsource Survey Redesign — Design

Ngày: 2026-06-10

## 1. Bối cảnh

Đã có một phiên bản web khảo sát PM outsource được làm theo hướng clone `tools/ba-survey/` và mở rộng thành bộ câu hỏi khá rộng. Tuy nhiên người dùng phản hồi rằng phiên bản đó có 3 vấn đề:

1. Quá nhiều câu hỏi và bị dàn trải.
2. Chưa thuần tiếng Việt.
3. Chưa bám sát các insight đã có trong thư mục `research/`.

Các tài liệu research hiện có cho thấy cách làm đúng của bộ BA trước không phải là hỏi rộng theo vai trò, mà là hỏi rất sát một công việc cụ thể rồi rút ra skill. Cụ thể:

- `research/knowledge_base.md` cho thấy BA được nghiên cứu xoay quanh một công việc rất cụ thể: viết SRS ngân hàng, sửa SRS khi URD/Figma thay đổi, tái sử dụng tài liệu cũ, xử lý thiếu thông tin, và onboard người mới.
- `research/_extracted.txt` chứa câu trả lời thực tế: tài liệu có nhiều version, template khác nhau theo ngân hàng, người mới chủ yếu hỏi người cũ, AI trước đây cho output kém hơn tự làm, bảo mật dữ liệu chặt.
- `research/google_form_template.md.resolved` cho thấy survey tốt là survey ngắn, dùng tiếng Việt tự nhiên, và bám vào đúng workflow thực tế thay vì hỏi lý thuyết chung.

Do đó phiên bản PM survey mới cần chuyển từ “PM nói chung” sang “PM outsource bàn giao công việc cho người kế nhiệm”.

## 2. Mục tiêu mới

Mục tiêu của survey không phải là mô tả toàn bộ nghề PM, mà là thu đủ thông tin để:

1. PM mới có thể tiếp quản dự án nhanh hơn khi PM cũ nghỉ hoặc bàn giao.
2. Xây skill AI hỗ trợ onboarding PM mới.
3. Xây skill AI hỗ trợ các task lặp lại của PM như:
   - tóm tắt trạng thái dự án,
   - liệt kê rủi ro/vấn đề,
   - tạo báo cáo tuần,
   - tóm tắt yêu cầu thay đổi,
   - gợi ý người cần hỏi,
   - tạo tài liệu handover.

## 3. Nguyên tắc thiết kế lại

### 3.1 Ngắn hơn nhưng sắc hơn

Survey mới sẽ rút từ 44 câu xuống **23 câu**.

Không cố bao phủ mọi khía cạnh PM. Chỉ giữ các câu phục vụ trực tiếp cho bài toán handover và skill hóa.

### 3.2 Thuần tiếng Việt

Toàn bộ tiêu đề, mô tả landing, section title, option text và dashboard text sẽ dùng tiếng Việt.

Một số từ chuyên môn nếu đội dự án quen dùng thì vẫn có thể xuất hiện trong trao đổi nội bộ, nhưng nội dung hiển thị cho người làm khảo sát phải ưu tiên cách viết tiếng Việt dễ hiểu, ví dụ:

- Phạm vi công việc
- Kế hoạch / mốc bàn giao
- Rủi ro
- Vấn đề
- Người liên quan / người có quyền quyết định
- Yêu cầu thay đổi
- Bàn giao / phát hành nếu cần

### 3.3 Bám vào research đã có

Survey mới phải kế thừa logic của bộ BA trước:

- Hỏi theo workflow thật.
- Hỏi “khi nhận bàn giao có gì / thiếu gì”.
- Hỏi “người mới sẽ dễ sai gì”.
- Hỏi “task lặp lại nào tốn thời gian nhất”.
- Hỏi “khi tài liệu không đủ thì hỏi ai”.
- Hỏi “AI nên giúp việc gì trước”.

## 4. Tên gọi và định vị mới

### Tên web

**Khảo sát bàn giao công việc PM outsource**

### Mô tả landing

> Khảo sát này giúp bọn em hiểu cách anh/chị đang quản lý dự án outsource, những tài liệu, routine, rủi ro và quy ước ngầm cần bàn giao, để thiết kế skill AI hỗ trợ PM mới tiếp quản công việc nhanh hơn. Anh/chị chọn đáp án gần đúng nhất, mỗi câu có thể ghi thêm nếu muốn.

### Thời lượng hiển thị

- **23 câu hỏi**
- **~8–10 phút**

## 5. Cấu trúc khảo sát mới

Survey mới gồm 6 phần:

1. Thông tin dự án và trách nhiệm PM
2. Tài liệu và nguồn thông tin khi nhận bàn giao
3. Công việc lặp lại hằng ngày/hằng tuần
4. Thay đổi, rủi ro và vấn đề đang cháy
5. Giao tiếp, người cần hỏi và quy ước ngầm
6. PM mới và skill AI cần hỗ trợ

Tổng số câu: **23**

## 6. Bộ câu hỏi mới

### Phần 1 — Thông tin dự án và trách nhiệm PM

#### 1.1 Hiện tại anh/chị đang quản lý loại dự án outsource nào nhiều nhất?

Type: `single-choice`

Options:

- Dự án làm theo phạm vi cố định
- Dự án làm theo thời gian và nhân sự
- Đội outsource vận hành dài hạn cho khách hàng
- Dự án bảo trì/nâng cấp hệ thống có sẵn
- Khác

#### 1.2 Trong dự án đó, PM thực tế chịu trách nhiệm những phần nào?

Type: `multi-check`

Options:

- Theo dõi tiến độ và mốc bàn giao
- Làm rõ yêu cầu với khách hàng
- Quản lý phạm vi và yêu cầu thay đổi
- Điều phối công việc của đội dự án
- Báo cáo tình trạng dự án cho khách hàng
- Báo cáo nội bộ cho quản lý
- Theo dõi rủi ro và vấn đề phát sinh
- Theo dõi chi phí/effort nếu có

#### 1.3 Nếu PM mới vào thay anh/chị, phần nào khó nắm nhất trong 1 tuần đầu?

Type: `multi-check`

Options:

- Dự án đang làm đến đâu
- Phạm vi nào đã cam kết với khách hàng
- Khách hàng thật sự đang kỳ vọng gì
- Việc nào đang trễ hoặc có nguy cơ trễ
- Ai là người quyết định ở mỗi bên
- Đội dự án đang mạnh/yếu ở đâu
- Tài liệu nào mới nhất, tài liệu nào đã cũ
- Quy trình báo cáo và họp định kỳ

### Phần 2 — Tài liệu và nguồn thông tin khi nhận bàn giao

#### 2.1 Khi nhận bàn giao một dự án, anh/chị thường có sẵn những gì?

Type: `matrix`

Rows:

- Hợp đồng/phạm vi công việc
- Kế hoạch dự án hoặc mốc bàn giao
- Danh sách nhân sự dự án
- Danh sách người liên hệ phía khách hàng
- Báo cáo tuần gần nhất
- Danh sách rủi ro/vấn đề
- Danh sách yêu cầu thay đổi
- Biên bản họp hoặc ghi chú trao đổi cũ
- Tài liệu yêu cầu hoặc mô tả nghiệp vụ
- Link công cụ quản lý task

Columns:

- Có và dùng được
- Có nhưng chưa đủ
- Có nhưng đã cũ
- Không có

#### 2.2 Trong các tài liệu trên, tài liệu nào PM mới bắt buộc phải đọc đầu tiên?

Type: `multi-check`

Options:

- Hợp đồng/phạm vi công việc
- Kế hoạch dự án hoặc mốc bàn giao
- Báo cáo tuần gần nhất
- Danh sách rủi ro/vấn đề
- Danh sách yêu cầu thay đổi
- Biên bản họp gần nhất
- Công cụ quản lý task
- Danh sách người liên hệ

#### 2.3 Tài liệu dự án hiện tại có hay bị lệch so với thực tế không?

Type: `single-range`

Options:

- Hiếm khi lệch, tài liệu khá cập nhật
- Có lệch nhẹ nhưng vẫn dùng được
- Lệch khá nhiều, phải hỏi người đang làm
- Lệch rất nhiều, tài liệu chỉ để tham khảo
- Không có tài liệu đủ tin cậy

#### 2.4 Khi tài liệu không đủ, anh/chị thường phải hỏi ai để hiểu đúng tình hình?

Type: `multi-check`

Options:

- PM cũ
- Quản lý trực tiếp
- Trưởng nhóm kỹ thuật
- BA
- QA/QC
- Lập trình viên chính
- Khách hàng
- Sales/account phụ trách khách hàng

### Phần 3 — Công việc lặp lại hằng ngày/hằng tuần

#### 3.1 Những việc nào PM phải làm lặp lại hằng ngày?

Type: `multi-check`

Options:

- Kiểm tra trạng thái công việc
- Hỏi đội dự án có bị vướng gì không
- Nhắc người phụ trách cập nhật tiến độ
- Trả lời tin nhắn/email của khách hàng
- Kiểm tra lỗi hoặc vấn đề mới phát sinh
- Cập nhật kế hoạch hoặc mốc bàn giao
- Báo cáo nhanh cho quản lý
- Chuẩn bị nội dung cho cuộc họp gần nhất

#### 3.2 Những việc nào PM phải làm lặp lại hằng tuần?

Type: `multi-check`

Options:

- Gửi báo cáo tuần cho khách hàng
- Gửi báo cáo tuần nội bộ
- Họp cập nhật tiến độ với khách hàng
- Họp nội bộ với đội dự án
- Rà soát rủi ro/vấn đề
- Rà soát kế hoạch và mốc bàn giao
- Rà soát yêu cầu thay đổi
- Chuẩn bị demo hoặc nghiệm thu

#### 3.3 Việc lặp lại nào tốn thời gian nhất với PM?

Type: `single-choice`

Options:

- Tổng hợp báo cáo
- Theo dõi và nhắc tiến độ
- Làm rõ yêu cầu với khách hàng
- Xử lý thay đổi phạm vi
- Họp và ghi chú sau họp
- Theo dõi rủi ro/vấn đề
- Khác

#### 3.4 Báo cáo tuần thường phải lấy thông tin từ đâu?

Type: `multi-check`

Options:

- Công cụ quản lý công việc
- Tin nhắn/email
- Biên bản họp
- Hỏi trực tiếp từng thành viên
- File kế hoạch dự án
- Danh sách lỗi/vấn đề
- Danh sách yêu cầu thay đổi
- Ghi chú riêng của PM

### Phần 4 — Thay đổi, rủi ro và vấn đề đang cháy

#### 4.1 Dự án outsource thường bị thay đổi vì lý do gì?

Type: `multi-check`

Options:

- Khách hàng đổi ý hoặc đổi ưu tiên
- Yêu cầu ban đầu chưa rõ
- Sau khi demo mới phát hiện thiếu
- Đội dự án hiểu sai yêu cầu
- Phụ thuộc bên thứ ba thay đổi
- Ước lượng ban đầu chưa sát
- Có vấn đề kỹ thuật mới phát hiện
- Có người nghỉ hoặc đổi nhân sự

#### 4.2 Khi có yêu cầu mới nghi là ngoài phạm vi, PM thường làm gì đầu tiên?

Type: `single-choice`

Options:

- Ghi nhận rồi phân tích ảnh hưởng trước
- Hỏi quản lý/account trước khi phản hồi
- Từ chối ngay vì ngoài phạm vi
- Cho đội làm nếu thấy nhỏ
- Tách thành yêu cầu thay đổi chính thức

#### 4.3 Dấu hiệu nào cho thấy dự án sắp có vấn đề trước khi nó bùng lên?

Type: `multi-check`

Options:

- Công việc quá hạn nhưng chưa ai báo
- Thành viên trả lời mơ hồ về tiến độ
- Khách hàng hỏi lại nhiều lần cùng một vấn đề
- Lỗi phát sinh nhiều hơn bình thường
- Phần việc phụ thuộc bên khác chưa có phản hồi
- Kế hoạch phải dời nhiều lần
- Không có bản demo đúng hẹn
- Nội bộ và khách hàng hiểu khác nhau

#### 4.4 Những vấn đề nào PM mới cần biết ngay khi nhận dự án?

Type: `multi-check`

Options:

- Việc đang trễ
- Rủi ro có thể ảnh hưởng mốc bàn giao
- Khách hàng đang không hài lòng
- Yêu cầu thay đổi đang chờ quyết định
- Lỗi nghiêm trọng chưa xử lý xong
- Thiếu người hoặc người sắp nghỉ
- Phụ thuộc bên ngoài chưa xong
- Vấn đề về chi phí/effort nếu có

### Phần 5 — Giao tiếp, người cần hỏi và quy ước ngầm

#### 5.1 Thông tin nào bắt buộc phải xác nhận bằng văn bản, không chỉ nói miệng?

Type: `multi-check`

Options:

- Thay đổi phạm vi
- Thay đổi kế hoạch hoặc mốc bàn giao
- Thay đổi chi phí/effort
- Xác nhận nghiệm thu
- Xác nhận bàn giao/phát hành
- Kết luận sau cuộc họp quan trọng
- Khách hàng chấp nhận rủi ro
- Từ chối yêu cầu ngoài phạm vi

#### 5.2 PM mới dễ hiểu sai điều gì nhất khi giao tiếp với khách hàng?

Type: `multi-check`

Options:

- Ai mới là người có quyền quyết định
- Khách hàng nói “gấp” nhưng thực tế mức độ ưu tiên khác
- Khách hàng đồng ý miệng nhưng chưa chốt chính thức
- Một bên khách hàng đồng ý nhưng bên khác chưa đồng ý
- Khách hàng tưởng một việc đã nằm trong phạm vi
- Khách hàng dùng từ chuyên môn khác với đội dự án
- Khách hàng không nói rõ deadline thật

#### 5.3 Có quy ước ngầm nào PM mới bắt buộc phải biết không?

Type: `single-choice`

Options:

- Có nhiều, nếu không biết sẽ dễ làm sai
- Có một vài quy ước quan trọng
- Ít, chủ yếu đã ghi trong tài liệu
- Hầu như không có
- Không chắc

#### 5.4 Nếu có quy ước ngầm, nó thường thuộc nhóm nào?

Type: `multi-check`

Options:

- Cách phản hồi khách hàng
- Cách báo cáo nội bộ
- Khi nào phải báo quản lý
- Ai cần được hỏi trước khi quyết định
- Việc gì không được tự cam kết
- Cách xử lý khi khách hàng gây áp lực
- Cách ghi nhận thay đổi phạm vi
- Cách ưu tiên việc cho đội dự án

### Phần 6 — PM mới và skill AI cần hỗ trợ

#### 6.1 Nếu PM mới chỉ có 1 ngày đầu để nắm dự án, anh/chị muốn họ đọc/xem gì trước?

Type: `multi-check`

Options:

- Tóm tắt trạng thái dự án hiện tại
- Kế hoạch và mốc bàn giao
- Danh sách rủi ro/vấn đề
- Danh sách người liên hệ
- Báo cáo tuần gần nhất
- Yêu cầu thay đổi đang chờ xử lý
- Công cụ quản lý công việc
- Các quyết định quan trọng đã chốt

#### 6.2 PM mới thường dễ làm sai việc gì nhất?

Type: `multi-check`

Options:

- Cam kết với khách hàng khi chưa hỏi nội bộ
- Không biết việc nào đang trễ
- Không nắm phạm vi đã cam kết
- Không lưu xác nhận bằng văn bản
- Bỏ sót người cần được thông báo
- Không biết lịch họp/báo cáo định kỳ
- Không báo sớm khi có rủi ro
- Không biết yêu cầu thay đổi nào đang chờ

#### 6.3 Nếu có skill AI hỗ trợ PM mới, anh/chị muốn ưu tiên việc nào nhất?

Type: `multi-check`

Options:

- Tạo tài liệu bàn giao dự án
- Tóm tắt trạng thái dự án hiện tại
- Tạo báo cáo tuần
- Liệt kê rủi ro/vấn đề cần chú ý
- Tóm tắt yêu cầu thay đổi
- Tạo danh sách việc cần làm trong tuần
- Soạn nội dung cập nhật cho khách hàng
- Gợi ý câu hỏi cần hỏi PM cũ/đội dự án

#### 6.4 Anh/chị có thể cung cấp bản mẫu/đã ẩn thông tin nhạy cảm của tài liệu nào để thiết kế skill không?

Type: `multi-check`

Options:

- Báo cáo tuần
- Kế hoạch dự án
- Danh sách rủi ro/vấn đề
- Danh sách yêu cầu thay đổi
- Biên bản họp
- Tài liệu phạm vi công việc
- Tài liệu bàn giao nếu có
- Ảnh chụp công cụ quản lý công việc

## 7. Thay đổi cần thực hiện trong web

### 7.1 Nội dung

- Thay question bank hiện tại bằng 23 câu mới.
- Bỏ toàn bộ option tiếng Anh không cần thiết.
- Đổi landing, thank-you page và dashboard copy theo định vị mới.

### 7.2 UI text

Các text chính cần đổi:

- Tên app: `Khảo sát bàn giao công việc PM outsource`
- Dashboard title: `Kết quả khảo sát PM`
- Landing description theo phần 4 ở trên.
- Số câu: `23`
- Thời lượng: `~8–10 phút`

### 7.3 Kỹ thuật

Giữ nguyên:

- React + Vite structure.
- Landing page, survey page, thank-you page, dashboard page.
- Sidebar, progress bar, optional ghi thêm.
- localStorage fallback.
- Vercel SPA rewrite.
- Password dashboard hiện tại.

Không cần đổi cấu trúc app hay loại input.

## 8. Acceptance criteria

Phiên bản redesign được coi là đạt khi:

1. App PM survey chỉ còn **23 câu / 6 phần**.
2. Nội dung hiển thị cho người dùng là tiếng Việt tự nhiên.
3. Landing, thank-you page và dashboard dùng định vị “bàn giao công việc PM outsource”.
4. Dashboard vẫn hoạt động với question types hiện có.
5. Build/lint vẫn pass.
6. Deploy lại được lên Vercel.
7. Bộ câu hỏi mới bám sát insight từ `research/` thay vì hỏi PM chung chung.

## 9. Ngoài phạm vi

- Không đổi framework.
- Không thêm backend thật.
- Không thêm upload file vào survey.
- Không đổi password dashboard ở vòng này.
- Không thêm AI analytics trong dashboard.

## 10. Kế hoạch triển khai cấp cao

1. Cập nhật spec và plan cho redesign.
2. Sửa `tools/pm-survey/src/data/questions.js` theo bộ 23 câu mới.
3. Sửa landing/thank-you/dashboard copy sang tiếng Việt only.
4. Chạy lint/build lại.
5. Deploy lại lên Vercel project `pm-survey`.
