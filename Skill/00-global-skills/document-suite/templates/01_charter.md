<!--
Template: charter — Project Charter / Điều lệ Dự án
Standard: PMBOK 7th Edition — Project Charter
Skill:    banking-docs
Version:  2.0.0
Usage:    node scripts/build_doc.js <folder> --brand <vendor> --client <client>
-->

# Điều lệ Dự án / Project Charter

**Project**: {{facts.project.name}} — {{facts.project.code}}
**Client**: {{facts.client.name}}
**Vendor**: {{facts.vendor.name}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.doc.classification}}

> Per PMBOK 7th Ed., the Project Charter formally authorises the project, names the Project Manager, and links the work to organisational strategy. It is the single source of truth for scope intent, high-level constraints, and stakeholder authority.

<!-- PAGE_BREAK -->

## 1. Mục đích Dự án / Project Purpose & Justification

<!-- FILL: 1-2 paragraphs explaining WHY this project exists, linking to the client's strategic objective (e.g., digital transformation pillar, Basel III compliance, NIM uplift). Reference banking_tone.md for executive register. -->

**What goes here**:
- Strategic alignment statement (which corporate pillar / OKR this serves)
- The business pain or regulatory trigger driving the initiative
- Expected strategic outcome in measurable terms (NIM, CIR, NPS, time-to-market)
- Link to any prior BRD / feasibility study (cite document ID + date)

**Strategic alignment table**:

| Strategic Pillar | Project Contribution | KPI Lift Expected |
|---|---|---|
| <!-- FILL: pillar --> | <!-- FILL: contribution --> | <!-- FILL: KPI lift --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 2. Lý do Kinh doanh / Business Case Summary

<!-- FILL: Condensed 1-page business case. Full case lives in 02_business_case.md — here only the executive abstract. -->

**What goes here**:
- Problem statement (1 sentence)
- Quantified opportunity (revenue / cost / risk avoidance, in VND)
- Recommended option (vs. status-quo and alternatives considered)
- Headline ROI / NPV / Payback

**Business case snapshot**:

| Metric | Value | Basis of Estimate |
|---|---|---|
| Total Investment (CAPEX + OPEX Y1) | VND <!-- FILL --> | Vendor quote + internal FTE |
| 3-year NPV | VND <!-- FILL --> | Discount rate 12% |
| Payback Period | <!-- FILL --> months | Per finance model v<!-- FILL --> |
| IRR | <!-- FILL --> % | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 3. Phạm vi Tổng thể / High-Level Scope

<!-- FILL: One paragraph describing the boundary of the project. Detailed scope decomposition belongs in the SOW (04). -->

**In-Scope**:
- <!-- FILL: capability 1, e.g., "Customer onboarding via mobile app for retail segment" -->
- <!-- FILL: capability 2 -->
- <!-- FILL: capability 3 -->

**Out-of-Scope** (explicit exclusions to prevent scope creep):
- <!-- FILL: e.g., "Corporate banking onboarding (planned for Phase 2)" -->
- <!-- FILL --> 
- <!-- FILL --> 

**Key Deliverables**:

| # | Deliverable | Acceptance Owner |
|---|---|---|
| D1 | <!-- FILL: deliverable --> | <!-- FILL: owner --> |
| D2 | <!-- FILL --> | <!-- FILL --> |
| D3 | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 4. Mốc Quan trọng / Milestones Summary

<!-- FILL: List 5-8 high-level milestones with target dates. Detailed schedule belongs in the project plan, not here. -->

**Milestone schedule**:

| ID | Milestone | Target Date | Gate Criteria |
|---|---|---|---|
| M0 | Charter sign-off | {{facts.doc.date}} | Steering Committee approval |
| M1 | BRD baseline approved | <!-- FILL --> | Business sign-off + IT review |
| M2 | UAT entry | <!-- FILL --> | SIT exit + 0 Sev-1 defects |
| M3 | Pilot Go-Live | <!-- FILL --> | UAT pass + DR drill complete |
| M4 | Full Production rollout | <!-- FILL --> | Pilot KPIs met for 30 days |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 5. Tóm tắt Ngân sách / Budget Summary

<!-- FILL: High-level budget envelope with the major cost categories. Detailed cost breakdown structure (CBS) lives in the SOW or financial annex. -->

**Budget envelope (VND)**:

| Category | Y0 | Y1 | Y2 | Total |
|---|---|---|---|---|
| Software licences | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Professional services | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Infrastructure / cloud | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Internal FTE allocation | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Contingency (10-15%) | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| **Total** | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

> Funding source: <!-- FILL: e.g., "FY{{facts.doc.year}} Digital Transformation CAPEX line item DT-2026-014" -->

<!-- PAGE_BREAK -->

## 6. Các bên Liên quan Chính / Key Stakeholders

<!-- FILL: Identify the people who must be informed, consulted, or have approval rights. Use RACI labels. -->

**Stakeholder register**:

| Role | Name | Organisation | RACI | Sign-off Authority |
|---|---|---|---|---|
| Project Sponsor | <!-- FILL --> | {{facts.client.name}} | A | Yes — Charter, change requests >5% budget |
| Project Manager | <!-- FILL --> | {{facts.vendor.name}} | R | No — escalates to Sponsor |
| Business Owner | <!-- FILL --> | {{facts.client.name}} | A | Yes — scope, UAT |
| IT Owner | <!-- FILL --> | {{facts.client.name}} | C | Yes — architecture, security |
| Compliance / Risk | <!-- FILL --> | {{facts.client.name}} | C | Yes — regulatory matters |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 7. Rủi ro Cấp cao / High-Level Risks

<!-- FILL: Top 5-8 risks visible at charter stage. Detailed risk register is maintained separately and reviewed bi-weekly. -->

**High-level risk register**:

| ID | Risk | Likelihood | Impact | Initial Response |
|---|---|---|---|---|
| R1 | <!-- FILL: risk description --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL: response --> |
| R2 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| R3 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 8. Thẩm quyền PM / Project Manager Authority

<!-- FILL: Make explicit what the PM can decide unilaterally vs. what must be escalated. This avoids decision paralysis later. -->

**Authority matrix**:

| Domain | PM May Approve Up To | Escalate Above To |
|---|---|---|
| Budget reallocation within category | 5% of total | Sponsor |
| Schedule slip | 2 weeks per milestone | Steering Committee |
| Scope change (functional) | None — log as CR | Change Control Board |
| Resource hiring (vendor side) | Per agreed ramp plan | Vendor Delivery Director |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

> The PM is empowered to convene the Steering Committee at any time and to halt work if a Sev-1 risk materialises.

<!-- PAGE_BREAK -->

## 9. Phê duyệt / Sign-off

<!-- FILL: Signature block. Once signed, this charter is baselined and changes require formal CR. -->

**Approval signatures**:

| Role | Name | Signature | Date |
|---|---|---|---|
| Project Sponsor | <!-- FILL --> | _______________ | _____ |
| Business Owner | <!-- FILL --> | _______________ | _____ |
| IT Owner | <!-- FILL --> | _______________ | _____ |
| Project Manager | <!-- FILL --> | _______________ | _____ |
| Vendor Delivery Director | <!-- FILL --> | _______________ | _____ |

---

**Document Control**

| Version | Date | Author | Change Summary |
|---|---|---|---|
| 0.1 | <!-- FILL --> | <!-- FILL --> | Initial draft |
| 1.0 | {{facts.doc.date}} | {{facts.vendor.name}} | Baseline for sign-off |
