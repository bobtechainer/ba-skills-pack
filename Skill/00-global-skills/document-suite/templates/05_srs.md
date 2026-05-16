<!--
Template: srs — Software Requirements Specification / Dac ta Yeu cau Phan mem
Standard: IEEE 830-1998 — Recommended Practice for Software Requirements Specifications
Skill:    banking-docs
Version:  2.0.0
Usage:    Copy this file to your project's docs/02_analysis/02_srs/, fill {{facts.*}}
          placeholders + TODO comments, then build with:
          node scripts/build_doc.js docs/02_analysis/02_srs --brand <vendor> --client <client>
-->

# SRS / Software Requirements Specification

**Project**: {{facts.project.name_vi}} — {{facts.project.code}}
**Client**: {{facts.project.client}}
**Vendor**: {{facts.project.vendor}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.project.classification}}

> Reference: [IEEE 830-1998 §5 SRS Sections](../standards/ieee_830_srs.md)

<!-- PAGE_BREAK -->

## 1. Gioi thieu / Introduction

### 1.1 Muc dich / Purpose

<!-- FILL: This document specifies all functional requirements (FR) and non-functional requirements (NFR) for the system. Identify the intended audience: development team, QA, client acceptance, auditors/regulators. -->

### 1.2 Pham vi / Scope

<!-- FILL: List the system modules covered by this SRS. Reference the HLD for architecture details. State what is explicitly out of scope (reference BRD out-of-scope section). -->

### 1.3 Dinh nghia, Chu viet tat / Definitions, Acronyms

See Appendix §6.1. Standard banking terms per `bilingual_glossary.md`.

### 1.4 Tai lieu tham chieu / References

1. BRD-V1.0_{{facts.project.code}} — Business Requirements
2. HLD-V1.0_{{facts.project.code}} — High Level Design
3. <!-- FILL: project-specific references -->
4. IEEE 830-1998 SRS standard
5. ISO/IEC 25010:2011 — Quality model

### 1.5 Tong quan tai lieu / Overview

This document has 6 parts: (1) Introduction, (2) Overall Description, (3) Specific Requirements (FR + NFR), (4) Use Case Model, (5) Data Requirements, (6) Appendices.

<!-- FILL: Add project-specific reference documents. -->

<!-- PAGE_BREAK -->

## 2. Mo ta Tong quat / Overall Description

> Reference: [IEEE 830 §5.2 Overall Description](../standards/ieee_830_srs.md#52)

### 2.1 Quan diem san pham / Product Perspective

<!-- FILL: Describe how the system fits into the client's ecosystem (standalone module, integrated subsystem, etc.). Specify the architecture pattern (e.g., 3-tier, microservices) and integration approach with client systems. -->

### 2.2 Chuc nang chinh / Product Functions

| Nhom chuc nang | Mo ta tom tat |
|---|---|
| F-01 <!-- FILL --> | <!-- FILL --> |
| F-02 <!-- FILL --> | <!-- FILL --> |
| F-03 <!-- FILL --> | <!-- FILL --> |
| F-04 <!-- FILL --> | <!-- FILL --> |

### 2.3 Lop nguoi dung / User Classes

| Lop | Mo ta | Do am hieu | Tan suat dung |
|---|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 2.4 Moi truong van hanh / Operating Environment

<!-- FILL: Client devices (browser, OS, network), server infrastructure (K8s, DB, cache, queue), integration services. -->

### 2.5 Rang buoc thiet ke / Design Constraints

<!-- FILL: Technology stack constraints, TLS requirements, password hashing, audit log retention, compliance requirements. Reference facts.yml for specific values. -->

### 2.6 Gia dinh & Phu thuoc / Assumptions & Dependencies

<!-- FILL: Technical assumptions beyond BRD §8. -->

<!-- PAGE_BREAK -->

## 3. Yeu cau Cu the / Specific Requirements

> Reference: [IEEE 830 §5.3 Specific Requirements](../standards/ieee_830_srs.md#53)

### 3.1 Yeu cau Chuc nang / Functional Requirements (FR-XXX)

<!-- FILL: Convention: Each FR links to >= 1 BR (traceability); format FR-NNN, never reuse. Priority H/M/L. Each FR follows: ID / Title / Description / Input / Processing / Output / BR Mapping / Priority. -->

#### 3.1.1 Nhom <!-- FILL: group name --> (FR-001..FR-0XX)

**FR-001: <!-- FILL: title -->**
- **Input**: <!-- FILL -->
- **Processing**: <!-- FILL -->
- **Output**: <!-- FILL -->
- **BR Mapping**: BR-<!-- FILL -->. **Priority**: <!-- FILL -->.

**FR-002: <!-- FILL: title -->**
- **Input**: <!-- FILL -->
- **Processing**: <!-- FILL -->
- **Output**: <!-- FILL -->
- **BR Mapping**: BR-<!-- FILL -->. **Priority**: <!-- FILL -->.

#### 3.1.2 Nhom <!-- FILL: group name --> (FR-0XX..FR-0XX)

<!-- FILL: Repeat the pattern for each functional group. -->

<!-- FILL: Add FRs for all functional areas including admin, reporting, data export. -->

### 3.2 Yeu cau Phi Chuc nang / Non-Functional Requirements (NFR-XXX)

#### 3.2.1 Performance

| ID | Yeu cau | Target | Do bang |
|---|---|---|---|
| NFR-001 | API response time p99 | <!-- FILL --> ms | APM |
| NFR-002 | Concurrent peak users | <!-- FILL --> | Load test |
| NFR-003 | Throughput sustained | <!-- FILL --> TPS | Load test |
| NFR-004 | Throughput peak | <!-- FILL --> TPS | Load test |
| NFR-005 | DB query p95 | <!-- FILL --> ms | DB monitoring |

#### 3.2.2 Availability & Reliability

| ID | Yeu cau | Target |
|---|---|---|
| NFR-010 | Monthly uptime | <!-- FILL --> % |
| NFR-011 | Downtime budget | <!-- FILL --> min/month |
| NFR-012 | Planned maintenance window | <!-- FILL --> |
| NFR-013 | RTO | <!-- FILL --> min |
| NFR-014 | RPO | <!-- FILL --> min |

#### 3.2.3 Security

| ID | Yeu cau | Target |
|---|---|---|
| NFR-020 | TLS min version | <!-- FILL --> |
| NFR-021 | Password hash | <!-- FILL --> |
| NFR-022 | Session timeout | <!-- FILL --> min inactive |
| NFR-023 | Audit log retention | <!-- FILL --> days |

#### 3.2.4 Usability

| ID | Yeu cau | Target |
|---|---|---|
| NFR-030 | First meaningful paint | <!-- FILL --> |
| NFR-031 | Accessibility | <!-- FILL --> |
| NFR-032 | Language | <!-- FILL --> |

#### 3.2.5 Maintainability & Portability

| ID | Yeu cau | Target |
|---|---|---|
| NFR-040 | Unit test coverage | <!-- FILL --> % |
| NFR-041 | Integration tests | <!-- FILL --> cases |
| NFR-042 | Deployment | <!-- FILL --> |
| NFR-043 | Backup | <!-- FILL --> |

### 3.3 Giao dien Ngoai / External Interfaces

#### 3.3.1 Giao dien Nguoi dung (UI)

<!-- FILL: List screens/pages from facts.yml. -->

#### 3.3.2 Giao dien Phan cung

<!-- FILL: Hardware dependencies if any. -->

#### 3.3.3 Giao dien Phan mem

| Interface | Direction | Protocol | Auth |
|---|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

#### 3.3.4 Giao dien Truyen thong

<!-- FILL: Communication protocols (JSON/HTTPS, SSE, WebSocket, etc.). -->

<!-- PAGE_BREAK -->

## 4. Use Case Model (tom tat)

<!-- FILL: Summary of actor x UC mapping. Detailed UCs in 06_use_cases.md. -->

| Actor | Use Case lien quan |
|---|---|
| <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Keep this section as a summary; detailed UCs reference separate file. -->

<!-- PAGE_BREAK -->

## 5. Yeu cau Du lieu / Data Requirements

### 5.1 Entity chinh

| Entity | PK | Mo ta | Retention |
|---|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 5.2 Phan loai du lieu

| Lop | Vi du fields | Xu ly |
|---|---|---|
| PII | <!-- FILL --> | Masking in logs, encrypt at rest |
| Financial | <!-- FILL --> | Audit log required |
| System | <!-- FILL --> | Standard logging |
| Secret | <!-- FILL --> | Vault / KMS, never log |

### 5.3 DDL reference

<!-- FILL: Reference to DDL source file or migration scripts. -->

### 5.4 Volumetrics

| Entity | Row count estimate |
|---|---|
| <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Include storage sizing (GB) and backup frequency per table. -->

<!-- PAGE_BREAK -->

## 6. Phu luc / Appendices

### 6.1 Glossary

See BRD §12.1 + additional terms:
<!-- FILL: Technical glossary entries specific to SRS. -->

### 6.2 Analysis Models

<!-- FILL: Reference to diagrams directory (component, ER, sequence diagrams). -->

### 6.3 Issues List

| ID | Issue | Status | Owner |
|---|---|---|---|
| ISS-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 6.4 Sign-off

| Role | Ten | Chu ky | Ngay |
|---|---|---|---|
| Client Tech Owner | _________ | _________ | _________ |
| Client PO | _________ | _________ | _________ |
| Vendor Tech Lead | _________ | _________ | _________ |
| Vendor QA Lead | _________ | _________ | _________ |

<!-- FILL: After final review cycle, version bump to 1.0 and attach signed scan. -->
