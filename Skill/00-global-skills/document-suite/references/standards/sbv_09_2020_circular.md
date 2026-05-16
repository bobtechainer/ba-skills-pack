# Thông tư 09/2020/TT-NHNN — An toàn Hệ thống Thông tin trong Hoạt động Ngân hàng

Tóm tắt thực tế khi viết Security Plan / Compliance docs cho khách hàng ngân hàng Việt Nam.

## Thông tin Thông tư

- **Số hiệu**: 09/2020/TT-NHNN
- **Cơ quan ban hành**: Ngân hàng Nhà nước Việt Nam (SBV)
- **Ngày ký**: 21/10/2020
- **Hiệu lực**: 01/01/2021
- **Áp dụng cho**: Tổ chức tín dụng, chi nhánh ngân hàng nước ngoài, tổ chức cung ứng dịch vụ trung gian thanh toán, Kho bạc Nhà nước, Bảo hiểm Tiền gửi Việt Nam, Công ty Quản lý tài sản của các TCTD Việt Nam (VAMC)

## Phạm vi điều chỉnh

Thông tư quy định về đảm bảo an toàn hệ thống thông tin (HTTT) trong hoạt động ngân hàng, bao gồm:

1. **Quản lý HTTT** — Tổ chức bộ phận CNTT, quản lý tài sản HTTT, phân loại HTTT theo cấp độ
2. **Quản lý nhân sự** — Tuyển dụng, đào tạo, chấm dứt, bảo mật nhân sự
3. **Quản lý tài sản** — Tài sản thông tin, phân loại, định danh, bảo vệ
4. **Quản lý vật lý và môi trường** — Kiểm soát ra vào, bảo vệ thiết bị
5. **Quản lý vận hành, truyền thông** — Quy trình vận hành, sao lưu, chống mã độc, kiểm soát luồng dữ liệu
6. **Quản lý truy cập** — Định danh, xác thực, phân quyền, kiểm soát truy cập
7. **Tiếp nhận, phát triển, duy trì HTTT** — Yêu cầu an toàn trong phát triển phần mềm
8. **Quản lý sự cố** — Phát hiện, xử lý, ghi nhận, báo cáo sự cố
9. **Quản lý tính liên tục hoạt động** — BCM, BCP, DR
10. **Kiểm toán an toàn HTTT** — Kiểm toán nội bộ + bên ngoài định kỳ
11. **Tuân thủ** — Tuân thủ pháp luật, chính sách nội bộ
12. **Báo cáo SBV** — Báo cáo định kỳ và khi có sự cố

## Yêu cầu trọng yếu cho vendor khi làm dự án cho ngân hàng

### 1. Phân loại cấp độ HTTT (Điều 7, Điều 8)

Mỗi hệ thống phải được xác định cấp độ 1–5 theo tầm quan trọng + tác động khi xảy ra sự cố. Hệ thống liên quan thanh toán / giao dịch thường ở **Cấp 4 hoặc 5** (critical), đòi hỏi:
- Kiểm soát truy cập nhiều lớp
- Backup hàng ngày + offline copy
- Lưu log ≥ 12 tháng
- Kiểm toán an toàn độc lập ≥ 1 lần/năm
- RTO / RPO cam kết trong BCP

### 2. Kiểm soát truy cập (Điều 19 – 23)

- **Mỗi tài khoản truy cập chỉ gán cho một người**, không share account (critical rule, audit sẽ check).
- Mật khẩu: đủ độ phức tạp (chữ + số + ký tự), thay đổi định kỳ, không tái sử dụng.
- MFA cho truy cập hệ thống trọng yếu + truy cập từ xa.
- Log mọi hành vi truy cập, thao tác thay đổi quyền, truy cập dữ liệu nhạy cảm.
- Review quyền truy cập định kỳ (≥ 6 tháng/lần), thu hồi ngay khi nhân sự thay đổi.

### 3. Bảo vệ dữ liệu (Điều 24 – 27)

- **Mã hóa** dữ liệu nhạy cảm lúc lưu trữ + truyền tải (TLS 1.2+ tối thiểu).
- Không lưu mật khẩu dạng rõ — phải hash (bcrypt, scrypt, argon2).
- Dữ liệu khách hàng (PII, tài khoản, giao dịch) phải có biện pháp bảo vệ rò rỉ (DLP).
- Thu thập, xử lý, chia sẻ dữ liệu cá nhân phải tuân thủ Luật An ninh Mạng 2018 và Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu Cá nhân.

### 4. Bên thứ ba / Cloud (Điều 36, Điều 50)

- Khi dùng dịch vụ bên thứ ba (bao gồm cloud), nhà cung cấp phải:
  - Là doanh nghiệp hợp pháp tại Việt Nam hoặc có hiện diện pháp lý
  - Cam kết **không sao chép, sửa đổi, sử dụng, cung cấp dữ liệu** cho bên khác
  - Có năng lực an toàn đáp ứng cấp độ HTTT
  - Cho phép kiểm toán
- Hợp đồng phải có điều khoản về an toàn dữ liệu, cam kết SLA, quyền kiểm tra.
- Với cloud: ưu tiên triển khai data center tại Việt Nam cho dữ liệu nhạy cảm.

### 5. Quản lý sự cố (Điều 40 – 44)

- Phải có quy trình phát hiện, phân loại, xử lý, ghi nhận sự cố.
- Sự cố ảnh hưởng tới hoạt động ngân hàng hoặc dữ liệu khách hàng phải **báo cáo SBV trong vòng 24 giờ**.
- Sau sự cố phải có báo cáo điều tra nguyên nhân + biện pháp phòng ngừa tái diễn.

### 6. Kiểm toán (Điều 48)

- Kiểm toán an toàn HTTT định kỳ tối thiểu 1 năm/lần cho HTTT cấp 4 trở lên.
- Kết quả kiểm toán phải được báo cáo lãnh đạo + kế hoạch khắc phục các vấn đề phát hiện.

### 7. Tính liên tục hoạt động (Điều 45 – 47)

- Phải có Kế hoạch BCP (Business Continuity Plan) + DRP (Disaster Recovery Plan).
- Diễn tập BCP định kỳ (≥ 1 lần/năm).
- RTO và RPO phải phù hợp cấp độ HTTT (cấp 4: RTO ≤ 4h, RPO ≤ 1h là thông lệ; cấp 5 thậm chí thấp hơn).

## Mapping Thông tư vào Security Plan của vendor

Khi viết Security Plan (Document 11 trong bộ tài liệu dự án), phải có section "Compliance Matrix" với format:

| Điều khoản Thông tư | Yêu cầu | Section trong Security Plan | Cơ chế thực thi | Bằng chứng |
|---|---|---|---|---|
| Điều 19 | Mỗi account 1 người | §3.1 Authentication | OIDC + mỗi user có unique sub | IAM audit log |
| Điều 24 | Mã hóa dữ liệu lưu trữ | §5.2 Data at rest | PostgreSQL TDE + KMS | Encryption config + KMS audit |
| Điều 27 | Hash mật khẩu | §5.2 Credential storage | argon2id | Code review + pentest |
| Điều 36 | Bên thứ ba cam kết dữ liệu | §7.4 Vendor mgmt | DPA + NDA | Signed contracts |
| Điều 40 | Báo cáo sự cố ≤ 24h | §8.1 Incident Response | Runbook IR-01 | IR drill logs |
| Điều 48 | Kiểm toán năm | §9 Audit | Annual pentest + SOC review | Audit reports |

## Câu "Sổ tay khi audit SBV"

Khi SBV hoặc ngân hàng (Internal Audit) kiểm tra, họ thường yêu cầu ngay lập tức:

1. **Danh sách HTTT cấp độ + tài liệu phân loại**
2. **Access review gần nhất** (6 tháng gần nhất)
3. **Incident log** (12 tháng gần nhất)
4. **BCP drill report** gần nhất
5. **Kết quả pentest** gần nhất (tối đa 12 tháng)
6. **Danh sách vendor + hợp đồng DPA**
7. **Log thay đổi hệ thống** (6 tháng gần nhất)

Nếu không xuất trình được, audit sẽ fail. **Chuẩn bị sẵn folder "Audit Ready"** trong mọi dự án.

## References

- Thông tư 09/2020/TT-NHNN (link: thuvienphapluat.vn)
- Luật An ninh Mạng 2018 (Luật số 24/2018/QH14)
- Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu Cá nhân
- Thông tư 35/2016/TT-NHNN (tiền thân, đã bị thay thế một phần bởi 09/2020)
