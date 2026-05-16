# 4. Phạm vi & Kiến trúc Tổng quan / Scope & Architecture Overview

## 4.1. In-Scope / Trong phạm vi

- Phát triển Game Engine (9 module) — xem Section 1.1
- Mini-game "Hứng quà rơi" (*falling item catch game*) 60 giây
- Quay số Mega Draw (slot machine reveal) cuối chiến dịch
- Tích hợp với 6 banking microservices của MSB
- Mobile UI hub (9 màn hình) tối ưu cho MSB Digital Bank WebView
- Admin dashboard quản lý chương trình
- Báo cáo realtime tồn kho quà + số người tham gia

## 4.2. Out-of-Scope / Ngoài phạm vi

- Không can thiệp vào core banking system của MSB
- Không phát triển game engine riêng — sử dụng **Phaser 3** làm runtime
- Không triển khai hạ tầng cloud mới — chạy trên MSB Data Center hiện có
- Không xử lý thủ tục pháp lý khuyến mại (MSB tự làm với Sở Công Thương)
- Không thực hiện marketing campaign (MSB agency phụ trách)

## 4.3. Kiến trúc Tổng quan / Architecture Overview

<!-- DIAGRAM:architecture_overview.png Kiến trúc tổng quan Game Engine MSB Mega Game 2026 -->

Hệ thống bao gồm 3 lớp chính:

1. **Presentation Layer** — Next.js 15 + Tailwind + Phaser 3, chạy trong WebView của MSB Digital Bank
2. **Application Layer** — FastAPI backend, Rule Engine, Lucky Draw, Prize Management
3. **Data Layer** — SQLite (demo) / PostgreSQL (production), Redis cache, S3 asset storage

```python
# Example: Core Rule Engine snippet (simplified)
def award_rounds(customer_id: str, transaction: dict) -> int:
    """Award game rounds based on transaction type and amount."""
    if transaction.type == "FD_OPEN" and transaction.amount >= 5_000_000:
        return min(50, transaction.amount // 5_000_000 * 2)  # 2 rounds per 5M, max 50
    if transaction.type == "QR_PAYMENT" and transaction.amount >= 100_000:
        return 1  # 1 round per QR payment, max 3/day
    return 0
```

> **Nguyên tắc thiết kế:** Atomic prize pool decrement qua Redis INCR/DECR hoặc Postgres row-lock, đảm bảo zero double-spending ngay cả khi có traffic spike cao điểm Tết.

## 4.4. Integration Points

| Hệ thống MSB | Protocol | Mục đích |
|---|---|---|
| Payment Service | REST + Webhook | Validate giao dịch QR, bill, chuyển tiền |
| Wealth Service | REST | Validate FD, CCTG, M-Sinh lời |
| Card / USL Service | REST | Validate khoản vay, thẻ tín dụng |
| Account Service | REST | Lấy thông tin KYC, KH status |
| Notification Service | Message Queue (Kafka) | Push thông báo trúng giải |
| Data Warehouse | Batch export (daily) | Audit log, báo cáo compliance |
