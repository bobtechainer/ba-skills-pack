<!--
Template: brd — Business Requirements Document / Tai lieu Yeu cau Nghiep vu
Standard: IIBA BABOK v3 — Business Analysis Body of Knowledge
Skill:    banking-docs
Version:  2.0.0
Usage:    Copy this file to your project's docs/02_analysis/01_brd/, fill {{facts.*}}
          placeholders + TODO comments, then build with:
          node scripts/build_doc.js docs/02_analysis/01_brd --brand <vendor> --client <client>
-->

# BRD / Business Requirements Document

**Project**: {{facts.project.name_vi}} — {{facts.project.code}}
**Sponsor / Requester**: {{facts.project.sponsor}}
**Author**: {{facts.project.author}}
**Delivery team**: {{facts.project.delivery_team}}
**End users**: {{facts.project.end_users}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.project.classification}}


> Reference: [IIBA BABOK §3 Business Analysis Planning](../standards/iiba_babok_brd.md)

<!-- PAGE_BREAK -->

## 1. Tom tat Dieu hanh / Executive Summary

<!-- FILL: 4-6 sentences summarising the project — name, high-level business objectives, budget/scale, timeline, key metrics the client needs to remember. Reference facts.yml for project parameters. -->

<!-- PAGE_BREAK -->

## 2. Boi canh Kinh doanh / Business Context

### 2.1 Boi canh thi truong

<!-- FILL: Market context — competitors, market position, MAU baseline, growth targets. -->

### 2.2 Boi canh noi bo

<!-- FILL: Internal context — strategic initiative, alignment with corporate goals. -->

### 2.3 Driver kinh doanh

| Driver | Mo ta / Description | Chi so do / KPI |
|---|---|---|
| D-01 | <!-- FILL --> | <!-- FILL --> |
| D-02 | <!-- FILL --> | <!-- FILL --> |
| D-03 | <!-- FILL --> | <!-- FILL --> |
| D-04 | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Describe why this project was initiated. Cite corporate strategy, market pressure, regulatory mandate, or specific growth opportunity. -->

<!-- PAGE_BREAK -->

## 3. Muc tieu Kinh doanh / Business Objectives

> Reference: [IIBA BABOK §6.1 Business Need](../standards/iiba_babok_brd.md#61)

<!-- FILL: Each objective (OBJ-XX) must be SMART, have an owner, deadline, and link to business requirements (BR-XXX). -->

| ID | Muc tieu / Objective | Chi so do / Target Metric | Chu so huu / Owner | Deadline |
|---|---|---|---|---|
| OBJ-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| OBJ-02 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| OBJ-03 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Each OBJ must have a specific numeric target — do not use "improve significantly" or "enhance quality". -->

<!-- PAGE_BREAK -->

## 4. Cac Ben Lien quan & RACI / Stakeholders & RACI

> Reference: [IIBA BABOK §10.43 Stakeholder List, Map, and Personas](../standards/iiba_babok_brd.md#1043)

### 4.1 Danh sach stakeholder

| ID | Vai tro / Role | To chuc / Organization | Lien he chinh | Moi quan tam chinh |
|---|---|---|---|---|
| STK-01 | Project Sponsor | {{facts.project.client}} | <!-- FILL --> | <!-- FILL --> |
| STK-02 | Product Owner | {{facts.project.client}} | <!-- FILL --> | <!-- FILL --> |
| STK-03 | Technical Owner | {{facts.project.client}} | <!-- FILL --> | <!-- FILL --> |
| STK-04 | Compliance Officer | {{facts.project.client}} | <!-- FILL --> | <!-- FILL --> |
| STK-05 | Vendor PM | {{facts.project.vendor}} | <!-- FILL --> | <!-- FILL --> |
| STK-06 | Vendor Tech Lead | {{facts.project.vendor}} | <!-- FILL --> | <!-- FILL --> |
| STK-07 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 4.2 Ma tran RACI cho hoat dong chinh

| Hoat dong | Sponsor | PO | Tech Owner | Compliance | Vendor PM | Vendor TL |
|---|---|---|---|---|---|---|
| <!-- FILL: activity --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL: activity --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

R=Responsible, A=Accountable, C=Consulted, I=Informed.

<!-- FILL: Add secondary stakeholders (PR, legal, customer support). Specify communication channels (Slack, email DL). -->

<!-- PAGE_BREAK -->

## 5. Pham vi / Scope (In / Out)

### 5.1 In Scope

<!-- FILL: List modules, integrations, features, processes, and compliance requirements that are in scope. Reference HLD for architecture details. -->

- <!-- FILL: capability 1 -->
- <!-- FILL: capability 2 -->
- <!-- FILL: capability 3 -->

### 5.2 Out of Scope

<!-- FILL: List items explicitly excluded with rationale. -->

- <!-- FILL: exclusion 1 -->
- <!-- FILL: exclusion 2 -->

<!-- FILL: Out-of-scope must be agreed with Sponsor. If items are "TBD", list them separately in §8 Dependencies. -->

<!-- PAGE_BREAK -->

## 6. Yeu cau Nghiep vu / Business Requirements (BR-XXX)

> Reference: [IIBA BABOK §10.27 Functional Decomposition](../standards/iiba_babok_brd.md#1027)

<!-- FILL: Convention: BR-001..BR-NNN, never reuse IDs. Each BR has Priority (H/M/L), Source, Rationale, Acceptance Criteria (Gherkin). Group BRs by functional area. -->

### 6.1 Nhom A — <!-- FILL: group name -->

#### BR-001: <!-- FILL: requirement title -->

**Phat bieu**. <!-- FILL: requirement statement using SHALL/MUST. -->

**Priority**: <!-- FILL -->. **Source**: <!-- FILL -->. **Owner**: <!-- FILL -->.

```
GIVEN <condition>
 WHEN <action>
 THEN <expected result>
```

#### BR-002: <!-- FILL: requirement title -->

**Phat bieu**. <!-- FILL: requirement statement. -->

### 6.2 Nhom B — <!-- FILL: group name -->

#### BR-011: <!-- FILL: requirement title -->

**Phat bieu**. <!-- FILL -->

<!-- FILL: Add remaining BRs grouped by functional area. IDs must be sequential, no gaps. -->

<!-- PAGE_BREAK -->

## 7. Quy tac Nghiep vu & Rang buoc / Business Rules & Constraints

| ID | Loai | Mo ta | Source |
|---|---|---|---|
| RULE-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| RULE-02 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| RULE-03 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: List non-functional business rules, regulatory rules, and operational rules that do not change per BR. -->

<!-- PAGE_BREAK -->

## 8. Gia dinh & Phu thuoc / Assumptions & Dependencies

### 8.1 Assumptions (ASM)

| ID | Gia dinh | Owner xac thuc | He qua neu sai |
|---|---|---|---|
| ASM-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| ASM-02 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 8.2 Dependencies (DEP)

| ID | Phu thuoc | Owner | Ngay can |
|---|---|---|---|
| DEP-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| DEP-02 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: All unverified assumptions must have an owner and deadline to verify. -->

<!-- PAGE_BREAK -->

## 9. Rui ro & Giam thieu / Risks & Mitigation

| ID | Rui ro | Likelihood | Impact | Muc | Mitigation | Owner |
|---|---|---|---|---|---|---|
| RISK-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| RISK-02 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| RISK-03 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Each risk must have clear likelihood x impact, specific mitigation (not "monitor"), and a single owner. -->

<!-- PAGE_BREAK -->

## 10. Tieu chi Thanh cong / Success Criteria

| ID | Tieu chi | Do bang | Nguong dat |
|---|---|---|---|
| SC-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| SC-02 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| SC-03 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Each criterion must be measurable with a formula and specific data source. -->

<!-- PAGE_BREAK -->

## 11. Truy vet sang SRS / Traceability to SRS

<!-- FILL: Each BR-XXX in this document MUST be realized by at least one FR-XXX in the SRS. Table below is auto-generated from traceability matrix. -->

| BR | Mo ta ngan | FR lien quan | Test Case |
|---|---|---|---|
| BR-001 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| BR-002 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Update this table from traceability matrix after completing SRS and Test Plan. -->

<!-- PAGE_BREAK -->

## 12. Phu luc / Appendix

### 12.1 Thuat ngu / Glossary

<!-- FILL: Project-specific terms. Reference bilingual_glossary.md for standard banking terminology. -->

| Term | Dinh nghia |
|---|---|
| <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> |

### 12.2 Tai lieu tham chieu / References

1. <!-- FILL: regulatory reference -->
2. <!-- FILL: internal reference -->
3. IIBA BABOK v3.0 — Business Analysis Body of Knowledge

### 12.3 Lich su thay doi / Change Log

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | <!-- FILL --> | <!-- FILL --> | Draft initial |
| 1.0 | {{facts.doc.date}} | <!-- FILL --> | Approved baseline |

### 12.4 Phe duyet / Sign-off

| Role | Ten | Chu ky | Ngay |
|---|---|---|---|
| Client Project Sponsor | _________ | _________ | _________ |
| Client Product Owner | _________ | _________ | _________ |
| Client Compliance | _________ | _________ | _________ |
| Vendor PM | _________ | _________ | _________ |

<!-- FILL: After sign-off, scan and attach to end of document, version bump to 1.1 -->
