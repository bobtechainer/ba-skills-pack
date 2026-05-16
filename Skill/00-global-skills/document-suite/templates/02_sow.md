<!--
Template: sow — Statement of Work / Tuyên bo Pham vi Cong viec
Standard: PMBOK 7th Edition — Project Management Body of Knowledge
Skill:    banking-docs
Version:  2.0.0
Usage:    Copy to docs/01_contract/02_sow/, fill {{facts.*}} + TODO, then build with:
          node scripts/build_doc.js docs/01_contract/02_sow --brand <vendor> --client <client>
-->

# SOW / Statement of Work

**Project**: {{facts.project.name_vi}} — {{facts.project.code}}
**Client**: {{facts.project.client}}
**Vendor**: {{facts.project.vendor}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.project.classification}}

> Reference: [PMBOK — Scope, Schedule, Cost](../standards/pmbok_sow.md)

<!-- PAGE_BREAK -->

## 1. Tuyen bo Pham vi / Project Scope Statement

### 1.1 Boi canh

<!-- FILL: 2-3 paragraphs describing the project background, client context, and why the vendor was selected. Reference the client's strategic initiative and campaign/project parameters from facts.yml. -->

### 1.2 Pham vi cong viec (high level)

<!-- FILL: Numbered list of 8-12 high-level responsibilities the vendor undertakes (analysis, design, build, integrate, test, deploy, operate, handover, etc.). -->

### 1.3 Cac module trong pham vi

<!-- FILL: List the system modules from facts.yml. Example: {{facts.modules.0.name_vi}}, {{facts.modules.1.name_vi}}, etc. -->

### 1.4 Ngoai pham vi

<!-- FILL: List items explicitly excluded from vendor responsibility. Reference BRD out-of-scope section. -->

<!-- PAGE_BREAK -->

## 2. Deliverables — San pham Ban giao

<!-- FILL: Each deliverable has acceptance criteria. Payment tied to client sign-off (UAT sign-off). -->

| ID | Deliverable | Format | Acceptance Criteria | Milestone |
|---|---|---|---|---|
| D-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| D-02 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| D-03 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| D-04 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| D-05 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Each deliverable must have a storage location (SharePoint, GitHub release). -->

<!-- PAGE_BREAK -->

## 3. Timeline & Milestones

### 3.1 Gantt tom tat

<!-- FILL: Insert text-based Gantt or reference a Gantt chart attachment. Show phases (Analysis, Design, Build, Test, UAT, Go-live) and milestone markers. -->

### 3.2 Chi tiet milestone

| Milestone | Date | Deliverables | Dependency upstream |
|---|---|---|---|
| M0 — Kickoff | <!-- FILL --> | SOW signed, team formed | Contract executed |
| M1 — Analysis frozen | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| M2 — Design approved | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| M3 — Build complete | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| M4 — UAT signed off | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| M5 — Go-live | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| M6 — Post-campaign / Post-release | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| M7 — Final handover | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 3.3 Critical path

<!-- FILL: Describe the critical path with slack analysis. -->

<!-- PAGE_BREAK -->

## 4. Pricing & Payment Schedule

### 4.1 Tong gia tri hop dong

<!-- FILL: Total contract value (ex-VAT), currency, payment method. -->

| Muc | So tien | % |
|---|---|---|
| <!-- FILL: cost category --> | TBD | <!-- FILL --> |
| <!-- FILL: cost category --> | TBD | <!-- FILL --> |
| <!-- FILL: cost category --> | TBD | <!-- FILL --> |
| **Tong (chua VAT)** | **TBD** | **100%** |

### 4.2 Lich thanh toan

| Dot | Dieu kien | % | So tien | Han thanh toan |
|---|---|---|---|---|
| 1 | <!-- FILL --> | <!-- FILL --> | TBD | <!-- FILL --> |
| 2 | <!-- FILL --> | <!-- FILL --> | TBD | <!-- FILL --> |
| 3 | <!-- FILL --> | <!-- FILL --> | TBD | <!-- FILL --> |

### 4.3 Chi phi phu thu

<!-- FILL: VAT, infrastructure costs, third-party costs, change request rates. -->

<!-- PAGE_BREAK -->

## 5. Gia dinh, Rang buoc, Loai tru / Assumptions, Constraints, Exclusions

### 5.1 Assumptions

<!-- FILL: Numbered list of project assumptions. Each must have a verification owner and deadline. -->

1. <!-- FILL: assumption -->
2. <!-- FILL: assumption -->
3. <!-- FILL: assumption -->

### 5.2 Constraints

<!-- FILL: Numbered list of constraints (language, browser targets, regulations, budget, schedule, technology stack, code ownership). -->

1. <!-- FILL: constraint -->
2. <!-- FILL: constraint -->

### 5.3 Exclusions

<!-- FILL: Items not in scope beyond those listed in 1.4. -->

- <!-- FILL: exclusion -->
- <!-- FILL: exclusion -->

<!-- FILL: All unverified assumptions MUST have a timeline to verify + owner. -->

<!-- PAGE_BREAK -->

## 6. Tieu chi Nghiem thu / Acceptance Criteria

### 6.1 Nguyen tac

- Acceptance per deliverable D-01..D-XX.
- Each deliverable has a separate acceptance checklist.
- Client has <!-- FILL: N --> business days from receipt to respond; silence = deemed acceptance.

### 6.2 Acceptance checklist mau

<!-- FILL: Sample acceptance checklist for a key deliverable (e.g., backend services). -->

| # | Tieu chi | Pass / Fail |
|---|---|---|
| 1 | <!-- FILL --> | ☐ |
| 2 | <!-- FILL --> | ☐ |
| 3 | <!-- FILL --> | ☐ |

### 6.3 Go-live criteria

<!-- FILL: List go-live prerequisites (checklist items, UAT pass rate, pentest, DR test, sign-offs, regulatory license). -->

<!-- PAGE_BREAK -->

## 7. Quy trinh Quan ly Thay doi / Change Management

### 7.1 Change Request (CR) workflow

<!-- FILL: Describe the CR process: request form, impact assessment, steering committee review, approval/rejection, baseline update. -->

### 7.2 Threshold phe duyet

| Impact | Phe duyet boi |
|---|---|
| <!-- FILL: small --> | <!-- FILL --> |
| <!-- FILL: medium --> | <!-- FILL --> |
| <!-- FILL: large --> | <!-- FILL --> |

### 7.3 CR log mau

| ID | Title | Requested by | Status | Impact | Approved date |
|---|---|---|---|---|---|
| CR-001 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Attach blank CR form (Annex B). -->

<!-- PAGE_BREAK -->

## 8. Dieu khoan & Dieu kien / Terms & Conditions

### 8.1 So huu tri tue (IP)

<!-- FILL: Define IP ownership for custom code, third-party libraries, vendor reusable frameworks, and documentation. Specify transfer conditions. -->

### 8.2 Bao mat thong tin

<!-- FILL: NDA requirements, DPA obligations, penalty for unauthorized disclosure. -->

### 8.3 Bao hanh / Warranty

<!-- FILL: Warranty period, scope, exclusions, SLA for fixes by priority. -->

### 8.4 Trach nhiem phap ly / Liability

<!-- FILL: Maximum liability, exclusions, professional indemnity insurance. -->

### 8.5 Cham dut hop dong / Termination

<!-- FILL: Termination for convenience (notice period, early termination fee), termination for cause, transition assistance. -->

### 8.6 Force Majeure

<!-- FILL: Definition and consequences of force majeure events. -->

### 8.7 Luat ap dung & Giai quyet tranh chap

<!-- FILL: Governing law, language priority, dispute resolution (negotiation, mediation, arbitration). -->

<!-- PAGE_BREAK -->

## 9. Chu ky / Signatures

<!-- FILL: Signature block. SOW effective from last signature date and is an inseparable annex of the Master Services Agreement. -->

### Dai dien {{facts.project.client}}

| | |
|---|---|
| Ten | _________________________ |
| Chuc vu | _________________________ |
| Ngay | _________________________ |
| Chu ky & dong dau | _________________________ |

### Dai dien {{facts.project.vendor}}

| | |
|---|---|
| Ten | _________________________ |
| Chuc vu | _________________________ |
| Ngay | _________________________ |
| Chu ky & dong dau | _________________________ |

### Annex dinh kem

- Annex A — Rate card man-day
- Annex B — Change Request template
- Annex C — Acceptance checklist master
- Annex D — Reference BRD/SRS outline
- Annex E — UAT scenario master list

<!-- FILL: Print required copies per party, scan and store in DMS. -->
