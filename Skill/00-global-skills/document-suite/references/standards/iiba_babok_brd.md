# IIBA BABOK — Business Requirements Document (BRD)

Practical cheat sheet khi viết BRD theo chuẩn IIBA BABOK v3.

## Mục đích của BRD

BRD trả lời **"Tại sao làm dự án này và dự án này phải đạt được gì về mặt kinh doanh?"**. BRD là cầu nối giữa nhu cầu kinh doanh và yêu cầu kỹ thuật. Nó **không mô tả cách hệ thống hoạt động** — đó là việc của SRS.

Audience: Business owners, executives, regulators, legal & compliance, project steering committee.

## Cấu trúc chuẩn (15 sections)

1. **Executive Summary** — 1 trang, 4 điểm: vấn đề, giải pháp, benefits, ask.
2. **Document Purpose & Scope** — doc purpose, intended audience, doc conventions.
3. **Business Context / Background** — As-is state, why change is needed, market / regulatory drivers.
4. **Business Objectives** — SMART goals. Mỗi objective có KPI đo được.
5. **Business Success Criteria** — Ngưỡng để project được coi là thành công.
6. **Stakeholder Analysis** — Table Role × Interest × Influence × RACI.
7. **Business Requirements** — ID'd list `BR-xxx`, mỗi item có priority (H/M/L) và rationale.
8. **Functional Overview** — High-level capabilities (chưa đi vào technical requirement). 
9. **Scope — In and Out** — Bullet lists: in-scope, out-of-scope, deferred.
10. **Assumptions** — Điều được giả định đúng để project khả thi.
11. **Constraints** — Time, budget, regulatory, technology, resource constraints.
12. **Dependencies** — Upstream systems, other projects, approvals needed.
13. **Risks & Impact Analysis** — Risk register (Probability × Impact × Mitigation).
14. **Timeline & Milestones** — Top-level milestones, not detailed schedule.
15. **Approvals & Sign-off** — Approval table với vai trò, người, chức danh, ngày.

## Format chuẩn cho Business Requirement item

Mỗi BR phải gồm:

```
BR-001: Customer must earn 2 game rounds for every 5 million VND deposited
        into a new FD account opened on the [Client App].

Priority: High
Source: Thể lệ _02042026.docx Section 5.2
Rationale: Incentivize conversion to new FD products, consistent with
           35th anniversary campaign messaging.
Success metric: >30% of FD customers who deposit ≥5M VND receive at least
                one game round within 24h of transaction.
Acceptance criteria:
  - GIVEN a customer has opened an FD on [Client App]
    AND the deposit amount is ≥ 5,000,000 VND
    WHEN the transaction is confirmed
    THEN the system SHALL award ((amount / 5,000,000) * 2) rounds,
         capped at 50 rounds/month
Owner: [Client] Digital Banking Department
```

## BRD sections mà Vietnamese banking KH thường yêu cầu thêm

- **Compliance matrix** — Mapping mỗi business rule → Thông tư 09/2020/TT-NHNN article (nếu liên quan). Đây là delta so với BABOK international standard.
- **Anti-fraud controls** — Cụ thể: làm gì với giao dịch có dấu hiệu gian lận, void/reversal, giao dịch khống.
- **Legal & promotional** — Đối với promotion banking (game, khuyến mại), cần ghi rõ đã đăng ký với Sở Công Thương, khấu trừ thuế ra sao, thời hạn nhận thưởng.
- **Customer protection** — Cam kết gì với khách hàng nếu có issue (SLA trả thưởng, điều kiện hoàn trả).

## Red flags khi review BRD

- Không có ID'd business requirements → không thể track, RTM sẽ fail.
- Requirements phrased as solution ("The system will use React") → đây là technical decision, thuộc LLD, không thuộc BRD.
- Không có success criteria đo được → project không thể kết thúc vì không biết khi nào xong.
- Không có compliance mapping → regulatory audit sẽ fail.
- "TBD" trong delivery → không phải draft, là incomplete.
- Không có approval page với 2 bên (vendor + client) → không có legal weight.

## References

- IIBA BABOK Guide v3
- ISO/IEC/IEEE 29148:2018 — Systems and software engineering — Requirements engineering
- Perforce "How to write a BRD" (2023)
