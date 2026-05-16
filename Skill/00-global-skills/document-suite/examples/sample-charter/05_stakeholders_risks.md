# 5. Các bên Liên quan & Rủi ro / Stakeholders & Risks

## 5.1. Các bên Liên quan / Stakeholders

| Stakeholder | Vai trò | RACI |
|---|---|---|
| MSB Digital Banking Department | Chủ sở hữu sản phẩm (*product owner*) | A |
| MSB CTO Office | Phê duyệt kỹ thuật, review security | A |
| MSB Marketing | Chủ sở hữu chiến dịch truyền thông | C |
| MSB Legal & Compliance | Đảm bảo tuân thủ Thông tư 09/2020/TT-NHNN | C |
| Alphaway Project Manager | Quản lý dự án end-to-end | R |
| Alphaway Solution Architect | Thiết kế kiến trúc, review code | R |
| Alphaway Dev Team | Phát triển backend + frontend + game | R |
| Alphaway QA Team | Kiểm thử + UAT | R |
| MSB End Customers | Người dùng cuối (*end users*) | I |
| SBV (Ngân hàng Nhà nước) | Cơ quan giám sát | I |

> *RACI: **R**esponsible — người làm, **A**ccountable — người chịu trách nhiệm cuối, **C**onsulted — tham vấn, **I**nformed — được thông báo.*

## 5.2. Bản đồ Rủi ro / Risk Register (High-Level)

| # | Rủi ro | Xác suất | Tác động | Biện pháp giảm thiểu |
|---|---|---|---|---|
| R-01 | Traffic spike vượt quá capacity đã thiết kế | M | H | Load testing 2x peak, auto-scaling, CDN cho static assets |
| R-02 | Fraud / gaming bằng bot farm | H | H | Device fingerprint, rate limit, behavioral detection |
| R-03 | Không kịp go-live 01/06/2026 | M | Critical | Buffer 2 tuần, critical path tracking, weekly sync |
| R-04 | Vỡ compliance Thông tư 09/2020 | L | Critical | Security review Week 6, pentest Week 8, DPA với MSB |
| R-05 | Integration với MSB microservices chậm / lỗi | M | H | Sandbox environment Week 2, contract testing |
| R-06 | Data drift: số giải hiển thị ≠ số giải thực tế | L | Critical | Atomic DB operations, daily reconciliation job |
| R-07 | Khách hàng khiếu nại giải thưởng | M | M | Customer support playbook, SLA rõ ràng 7/14 ngày |

**Legend:** Xác suất (*Probability*): L=Low, M=Medium, H=High. Tác động (*Impact*): L=Low, M=Medium, H=High, Critical=Showstopper.

## 5.3. Assumptions / Các giả định

1. MSB cung cấp đầy đủ API sandbox trước Week 2
2. MSB Legal đã phê duyệt thể lệ khuyến mại trước Week 4
3. Không có phát sinh scope change sau Week 6 (lock scope)
4. MSB hỗ trợ testing trên 2 môi trường: SIT + UAT
5. Alphaway có thể sử dụng asset Fluent Emoji (MIT license) cho game visuals
