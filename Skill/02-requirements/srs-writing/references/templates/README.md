# SRS Templates Index

Templates chia theo domain. Mỗi template là file `.md` — AI đọc cấu trúc, user review format.

## Banking

| Template                          | Mô tả                                                                                                                                     | Nguồn gốc                       | File                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| **A. iBank2 Screen Spec**         | Đặc tả MH web banking: use case + bảng field nhiều cột (STT/Hạng mục/Kiểu hiển thị/Thao tác/Bắt buộc/Mô tả) + kết nối API + logic xử lý   | IBANK2-GD4 (chị Nga - Alphaway) | [ibank2-screen-spec.md](./banking/ibank2-screen-spec.md)                 |
| **B. OBD Step Spec**              | Flow step-by-step dạng BDD (Given/When/Then) cho mobile app: onboarding, EKYC, wizard multi-step                                          | OBD.docx (chị Nga - Alphaway)   | [obd-step-spec.md](./banking/obd-step-spec.md)                           |
| **C. Digital Lending User Story** | User Story format CCC (Card-Confirmation-Conversation): vay tiêu dùng, lending flow, bảng field (Tên trường/Định dạng/M-O/Editable/Mô tả) | Vay CBNV MB v12 (MBBank)        | [digital-lending-user-story.md](./banking/digital-lending-user-story.md) |

## Generic

| Template         | Mô tả                                        | File                                         |
| ---------------- | -------------------------------------------- | -------------------------------------------- |
| **Standard SRS** | SRS chung cho mọi domain — IEEE 830 inspired | [standard-srs.md](./generic/standard-srs.md) |

## Cách chọn template

| Nếu dự án có...                                       | Chọn                      |
| ----------------------------------------------------- | ------------------------- |
| Web banking, nhiều field, dropdown, validate phức tạp | **A. iBank2 Screen Spec** |
| Mobile app, flow step-by-step, EKYC, onboarding       | **B. OBD Step Spec**      |
| Digital lending, vay tiêu dùng, User Story CCC        | **C. Digital Lending**    |
| Không thuộc banking hoặc chưa rõ                      | **Standard SRS**          |

## Quy ước template

- **Static (giữ nguyên)**: Tên bảng, header cột, labels, section headings
- **Dynamic (AI điền)**: Ký hiệu `«...»` — instructions hướng dẫn AI điền nội dung cụ thể
- AI đọc instructions → fill nội dung vào đúng vị trí → giữ nguyên format

## Thêm template mới

1. Lấy file SRS mẫu (PDF/DOCX) → đọc toàn bộ nội dung
2. Phân biệt static vs dynamic
3. Tạo file `.md` trong `templates/{domain}/` với instructions `«...»`
4. Update bảng ở file README này

### Nếu nguồn là PDF

Hướng dẫn user convert PDF → Word trước:

1. Mở MS Word → File → Open → chọn PDF → OK
2. File → Save As → .docx
3. Gửi file .docx cho AI → AI đọc content → tạo template .md
