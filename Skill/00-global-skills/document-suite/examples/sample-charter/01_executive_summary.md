# 1. Tóm tắt Điều hành / Executive Summary

Dự án **MSB Mega Game 2026** là chương trình khuyến mại gamification kỷ niệm 35 năm thành lập Ngân hàng Thương mại Cổ phần Hàng hải Việt Nam (MSB). Chương trình triển khai trong 90 ngày, từ **01/06/2026 đến 31/08/2026**, tích hợp trên ứng dụng **MSB Digital Bank**, với tổng quỹ giải thưởng **18,655 tỷ VND** và **57,281 giải**.

Alphaway Technology (gọi tắt là "Alphaway") là đơn vị đối tác phát triển (*development partner*), chịu trách nhiệm thiết kế, phát triển, kiểm thử và triển khai toàn bộ hệ thống Game Engine cho MSB.

## 1.1. Phạm vi tổng thể / Overall Scope

Dự án bao gồm **9 module cốt lõi** được xây dựng trên kiến trúc microservices, tích hợp với các hệ thống ngân hàng hiện có (Payment, Wealth, Card, USL, Account, Notification).

| # | Module | Chức năng chính |
|---|---|---|
| 1 | Event Processing | Nhận và xác thực giao dịch giao dịch (*transaction event*) realtime |
| 2 | Rule Engine | Tính toán lượt quay và sinh mã dự thưởng theo quy tắc nghiệp vụ |
| 3 | Gamification & Loyalty | Tích lũy lượt chơi, điểm Loyalty, quản lý ví người dùng |
| 4 | Prize Management | Kho quà, phân bổ, trạng thái còn / đã trúng / đã trao |
| 5 | Lucky Draw | Random giải ngày + quay số tháng / Mega |
| 6 | Reward Codes | Sinh, cấp phát, loại trừ mã dự thưởng trúng |
| 7 | Notification | Push / SMS / Email / In-app realtime |
| 8 | Reporting | Dashboard, báo cáo, admin operations |
| 9 | Mobile UI Hub | Floating button, game screens, leaderboard, kho quà |

## 1.2. Giá trị cốt lõi / Key Value

> "Khẳng định năng lực chuyển đổi số của MSB và gia tăng engagement với **1 triệu+ khách hàng số** thông qua hình thức game hóa (*gamification*) hiện đại, an toàn và tuân thủ pháp luật." — MSB Digital Banking Department
