<!--
Template: hld — High Level Design / Thiet ke Tong the
Standard: TOGAF 9.2 ADM + Kruchten 4+1 Architectural View Model
Skill:    banking-docs
Version:  2.0.0
Usage:    Copy to docs/03_design/01_hld/, fill {{facts.*}} + TODO, then build with:
          node scripts/build_doc.js docs/03_design/01_hld --brand <vendor> --client <client>
-->

# HLD / High Level Design

**Project**: {{facts.project.name_vi}} — {{facts.project.code}}
**Client**: {{facts.project.client}}
**Vendor**: {{facts.project.vendor}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.project.classification}}

> Reference: [TOGAF ADM Phase C/D + Kruchten 4+1](../standards/togaf_hld.md)

<!-- PAGE_BREAK -->

## 1. Tong quan Kien truc / Architecture Overview

<!-- FILL: 2-3 paragraphs describing the overall architecture — pattern (microservices, monolith, event-driven), integration approach with client systems, number of modules. Reference facts.yml for specific values. -->

### 1.1 Muc tieu kien truc

| Goal | Mo ta | Do luong |
|---|---|---|
| G-01 | <!-- FILL: performance goal --> | <!-- FILL --> |
| G-02 | <!-- FILL: availability goal --> | <!-- FILL --> |
| G-03 | <!-- FILL: security goal --> | <!-- FILL --> |
| G-04 | <!-- FILL: compliance goal --> | <!-- FILL --> |
| G-05 | <!-- FILL: separation of trust domains --> | <!-- FILL --> |

### 1.2 Nguon driver va quyet dinh

All Architecture Decision Records (ADRs) reside in `docs/03_design/01_hld/adr/`. Each ADR has status (Proposed / Accepted / Superseded), context, decision, consequences.

<!-- FILL: 2-3 paragraphs on overall architecture, without module-level detail. -->

<!-- PAGE_BREAK -->

## 2. Nguyen tac Kien truc / Architecture Principles

| ID | Nguyen tac | Rationale | Implication |
|---|---|---|---|
| P-01 | <!-- FILL: e.g., Stateless services --> | <!-- FILL --> | <!-- FILL --> |
| P-02 | <!-- FILL: e.g., Event-driven --> | <!-- FILL --> | <!-- FILL --> |
| P-03 | <!-- FILL: e.g., Single source of truth --> | <!-- FILL --> | <!-- FILL --> |
| P-04 | <!-- FILL: e.g., Security by design --> | <!-- FILL --> | <!-- FILL --> |
| P-05 | <!-- FILL: e.g., Zero trust network --> | <!-- FILL --> | <!-- FILL --> |
| P-06 | <!-- FILL: e.g., Fail fast, recover fast --> | <!-- FILL --> | <!-- FILL --> |
| P-07 | <!-- FILL: e.g., Observability first --> | <!-- FILL --> | <!-- FILL --> |
| P-08 | <!-- FILL: e.g., Defense in depth --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Add project-specific principles. -->

<!-- PAGE_BREAK -->

## 3. Logical View — Thanh phan & Module

> Reference: [Kruchten 4+1 — Logical View](../standards/togaf_hld.md#logical-view)

### 3.1 Component diagram (tong the)

<!-- FILL: Insert ASCII component diagram or reference an exported PNG. Show client app, API gateway, backend services, data stores, and client integration services. -->

### 3.2 Bang module

| Code | Ten VI / EN | Trach nhiem chinh | Dependency |
|---|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 3.3 ER diagram (entities chinh)

<!-- FILL: ASCII or mermaid ER diagram showing main entities and their relationships. -->

<!-- DIAGRAM: logical_components.png — export from draw.io, include trust boundaries -->

<!-- FILL: Add component-level responsibility matrix, interface contracts (OpenAPI / AsyncAPI). -->

<!-- PAGE_BREAK -->

## 4. Process View — Luong xu ly chinh

> Reference: [Kruchten 4+1 — Process View](../standards/togaf_hld.md#process-view)

### 4.1 Scenario 1 — <!-- FILL: primary business flow -->

<!-- FILL: ASCII sequence diagram showing the end-to-end flow with SLA targets per hop. -->

### 4.2 Scenario 2 — <!-- FILL: secondary business flow -->

<!-- FILL: ASCII sequence diagram. -->

### 4.3 Scenario 3 — <!-- FILL: administrative or batch flow -->

<!-- FILL: ASCII sequence diagram. -->

<!-- DIAGRAM: sequence_flows.png -->

<!-- FILL: Add sequences for error paths, refund/reversal, admin operations. -->

<!-- PAGE_BREAK -->

## 5. Development View — Tech Stack & Deployment Units

> Reference: [Kruchten 4+1 — Development View](../standards/togaf_hld.md#development-view)

### 5.1 Tech stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | <!-- FILL --> | <!-- FILL --> |
| UI library | <!-- FILL --> | <!-- FILL --> |
| Backend language | <!-- FILL --> | <!-- FILL --> |
| Backend framework | <!-- FILL --> | <!-- FILL --> |
| Database | <!-- FILL --> | <!-- FILL --> |
| Cache | <!-- FILL --> | <!-- FILL --> |
| Queue | <!-- FILL --> | <!-- FILL --> |
| API Gateway | <!-- FILL --> | <!-- FILL --> |
| Container | <!-- FILL --> | <!-- FILL --> |
| Observability | <!-- FILL --> | <!-- FILL --> |

### 5.2 Deployment units

| Service | Replicas (peak) | CPU/Pod | RAM/Pod | Scaling rule |
|---|---|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 5.3 Repository & CI/CD

<!-- FILL: Repository structure, CI/CD pipeline description (build, test, SAST, container scan, deploy strategy). -->

<!-- FILL: Add branch strategy, secret management, deploy cadence. -->

<!-- PAGE_BREAK -->

## 6. Physical View — Infrastructure Topology

> Reference: [Kruchten 4+1 — Physical View](../standards/togaf_hld.md#physical-view)

### 6.1 Topology cao cap

<!-- FILL: ASCII topology diagram showing CDN, AZs, ingress, K8s, data stores, backup, and integration tunnels. -->

### 6.2 Network segmentation

| Zone | Mo ta | Ingress |
|---|---|---|
| Public | <!-- FILL --> | <!-- FILL --> |
| DMZ | <!-- FILL --> | <!-- FILL --> |
| App tier | <!-- FILL --> | <!-- FILL --> |
| Data tier | <!-- FILL --> | <!-- FILL --> |
| Admin | <!-- FILL --> | <!-- FILL --> |
| Integration | <!-- FILL --> | <!-- FILL --> |

### 6.3 DR Strategy

<!-- FILL: Primary and DR data center locations, replication approach, failover mechanism, RTO/RPO targets, backup strategy. -->

<!-- DIAGRAM: physical_topology.png -->

<!-- FILL: Detail IP ranges, subnets, firewall rule table. -->

<!-- PAGE_BREAK -->

## 7. Scenarios — Use Case End-to-End

<!-- FILL: 5 most important scenarios proving the architecture meets key NFRs. -->

| # | Scenario | NFR demonstrated | Risk |
|---|---|---|---|
| SC-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| SC-02 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| SC-03 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| SC-04 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| SC-05 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Add scenario details (sequence + failure mode + recovery) in separate file. -->

<!-- PAGE_BREAK -->

## 8. Architecture Decision Records (tom tat)

| ADR | Title | Status | Tom tat quyet dinh |
|---|---|---|---|
| ADR-001 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| ADR-002 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| ADR-003 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Each ADR is a separate file in adr/ folder, linked from this table. -->

<!-- PAGE_BREAK -->

## 9. NFR Mapping — Tu yeu cau den thiet ke

| NFR ID | Yeu cau | Design tactic |
|---|---|---|
| NFR-001 | <!-- FILL --> | <!-- FILL --> |
| NFR-002 | <!-- FILL --> | <!-- FILL --> |
| NFR-010 | <!-- FILL --> | <!-- FILL --> |
| NFR-013 | <!-- FILL --> | <!-- FILL --> |
| NFR-020 | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Every NFR from SRS §3.2 MUST have a row mapping here. -->

<!-- PAGE_BREAK -->

## 10. Cross-cutting Concerns

### 10.1 Security

<!-- FILL: Threat model reference, compliance mapping reference, secret rotation policy, input validation approach. -->

### 10.2 Logging & Observability

<!-- FILL: Log format, metrics system, tracing approach, alerting on-call. -->

### 10.3 Configuration Management

<!-- FILL: Config injection method, feature flags approach. -->

### 10.4 Internationalization

<!-- FILL: Primary language, secondary language for auditors/admin. -->

### 10.5 Accessibility

<!-- FILL: WCAG compliance targets, exceptions for interactive content. -->

### 10.6 Dependency Management

<!-- FILL: SBOM generation, CVE scanning cadence, patch SLA. -->

<!-- FILL: Add project-specific cross-cutting concerns (multi-tenancy, cost control). -->

<!-- PAGE_BREAK -->

## 11. Phe duyet / Sign-off

| Role | Ten | Chu ky | Ngay |
|---|---|---|---|
| Client Chief Architect | _________ | _________ | _________ |
| Client Security Officer | _________ | _________ | _________ |
| Vendor Tech Lead | _________ | _________ | _________ |
| Vendor SRE Lead | _________ | _________ | _________ |

<!-- FILL: Attach exported diagram PNGs before sign-off. -->
