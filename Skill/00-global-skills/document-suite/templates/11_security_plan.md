<!--
Template: security-plan — Security Plan / Ke hoach An toan Bao mat
Standard: STRIDE threat model + OWASP ASVS/API Top 10 + applicable regulatory circulars
          + ISO 27001 + PCI-DSS controls
Skill:    banking-docs
Version:  2.0.0
Usage:    Copy to docs/03_design/05_security_plan/, fill {{facts.*}} + TODO, then:
          node scripts/build_doc.js docs/03_design/05_security_plan --brand <vendor> --client <client>
-->

# Security Plan / Ke hoach An toan Bao mat

**Project**: {{facts.project.name_vi}} — {{facts.project.code}}
**Client**: {{facts.project.client}}
**Vendor**: {{facts.project.vendor}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.project.classification}}

> Reference: [STRIDE + OWASP](../standards/owasp_stride.md) · [Applicable regulatory circular](../standards/)

<!-- PAGE_BREAK -->

## 1. Pham vi & Muc tieu An toan / Security Scope & Objectives

### 1.1 Pham vi

<!-- FILL: Describe the full scope of this security plan — system modules, integrations, infrastructure, admin portals, data retention period. Reference facts.yml for module list. -->

### 1.2 Muc tieu an toan

| ID | Muc tieu | Do luong |
|---|---|---|
| SEC-OBJ-01 | Protect confidentiality of PII | <!-- FILL --> |
| SEC-OBJ-02 | Protect integrity of business-critical data | <!-- FILL --> |
| SEC-OBJ-03 | Protect availability | <!-- FILL --> |
| SEC-OBJ-04 | Prevent fraud | <!-- FILL --> |
| SEC-OBJ-05 | Regulatory compliance | <!-- FILL --> |
| SEC-OBJ-06 | Personal data protection compliance | <!-- FILL --> |
| SEC-OBJ-07 | Tamper-evident audit log | <!-- FILL --> |

<!-- FILL: Describe security responsibility split between vendor and client security team. -->

<!-- PAGE_BREAK -->

## 2. Mo hinh Moi de doa STRIDE / Threat Model

### 2.1 Phuong phap

STRIDE + DFD 4 levels (Context, Level 1, Level 2, Level 3). Risk matrix 3x3 Likelihood x Impact:

| L x I | Low | Medium | High |
|---|---|---|---|
| **Low** | Low | Low | Medium |
| **Medium** | Low | Medium | High |
| **High** | Medium | High | Critical |

### 2.2 Trust boundaries

| TB | Left | Right | Control |
|---|---|---|---|
| TB-1 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| TB-2 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| TB-3 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| TB-4 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| TB-5 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 2.3 Threat Register (overview)

| Module | # Threats | Critical (after mitigation) | High |
|---|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Detailed threat register in separate file (e.g., 03_threat_modeling_stride.md). -->

### 2.4 Example threats

| ID | Module | STRIDE | Description | Mitigation | Residual |
|---|---|---|---|---|---|
| THREAT-001 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| THREAT-002 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Sync threats from detailed threat model document. -->

<!-- PAGE_BREAK -->

## 3. Inventory Tai san & Phan loai / Asset Inventory

### 3.1 Tai san thong tin

| Asset | Loai | Do nhay | Chu so huu | Vi tri |
|---|---|---|---|---|
| A-01 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| A-02 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| A-03 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 3.2 Ma tran phan loai CIA

| Asset | C | I | A | Tong |
|---|---|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Each asset containing PII must have a separate DPIA entry. -->

<!-- PAGE_BREAK -->

## 4. Bien phap Kiem soat / Security Controls

### 4.1 Preventive Controls

| ID | Control | Implementation | Standard mapping |
|---|---|---|---|
| PC-01 | WAF | <!-- FILL --> | <!-- FILL --> |
| PC-02 | mTLS at trust boundaries | <!-- FILL --> | <!-- FILL --> |
| PC-03 | JWT with short TTL + refresh | <!-- FILL --> | <!-- FILL --> |
| PC-04 | Webhook signature verification | <!-- FILL --> | <!-- FILL --> |
| PC-05 | Input validation | <!-- FILL --> | <!-- FILL --> |
| PC-06 | Rate limiting | <!-- FILL --> | <!-- FILL --> |
| PC-07 | RBAC | <!-- FILL --> | <!-- FILL --> |
| PC-08 | CSPRNG for sensitive operations | <!-- FILL --> | <!-- FILL --> |
| PC-09 | TLS enforcement | <!-- FILL --> | <!-- FILL --> |
| PC-10 | Password hashing | <!-- FILL --> | <!-- FILL --> |

### 4.2 Detective Controls

| ID | Control | Implementation |
|---|---|---|
| DC-01 | SIEM aggregated log | <!-- FILL --> |
| DC-02 | Anomaly detection | <!-- FILL --> |
| DC-03 | Container runtime security | <!-- FILL --> |
| DC-04 | Integrity monitoring | <!-- FILL --> |
| DC-05 | Periodic pentest | <!-- FILL --> |

### 4.3 Corrective Controls

| ID | Control | Implementation |
|---|---|---|
| CC-01 | Auto-block suspicious activity | <!-- FILL --> |
| CC-02 | Auto-rollback CI/CD | <!-- FILL --> |
| CC-03 | Incident response playbook | <!-- FILL --> |
| CC-04 | Secret rotation | <!-- FILL --> |
| CC-05 | CVE patching SLA | <!-- FILL --> |

<!-- FILL: Add client-specific controls (DLP, CASB) if required. -->

<!-- PAGE_BREAK -->

## 5. Ban do Tuan thu / Compliance Mapping

### 5.1 Applicable regulatory circular

<!-- FILL: Map applicable regulatory requirements (e.g., SBV circulars, PDP regulations) to controls and evidence. -->

| Section | Requirement summary | Control | Evidence |
|---|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 5.2 Personal Data Protection (applicable decree)

| Section | Requirement | Implementation |
|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 5.3 OWASP ASVS v4.0 Level 2

| Chapter | Covered by |
|---|---|
| V1 Architecture | <!-- FILL --> |
| V2 Authentication | <!-- FILL --> |
| V3 Session | <!-- FILL --> |
| V4 Access Control | <!-- FILL --> |
| V5 Validation | <!-- FILL --> |
| V6 Crypto | <!-- FILL --> |
| V7 Error/Logging | <!-- FILL --> |
| V8 Data Protection | <!-- FILL --> |
| V9 Communications | <!-- FILL --> |
| V10 Malicious Code | <!-- FILL --> |
| V11 Business Logic | <!-- FILL --> |
| V12 Files & Resources | <!-- FILL --> |
| V13 API | <!-- FILL --> |
| V14 Config | <!-- FILL --> |

### 5.4 OWASP API Top 10 (2023)

| ID | Issue | Control |
|---|---|---|
| API1 BOLA | <!-- FILL --> |
| API2 Broken Auth | <!-- FILL --> |
| API3 BOPLA | <!-- FILL --> |
| API4 Rate | <!-- FILL --> |
| API5 BFLA | <!-- FILL --> |
| API6 SSRF | <!-- FILL --> |
| API7 Security Misconfig | <!-- FILL --> |
| API8 Injection | <!-- FILL --> |
| API9 Asset Mgmt | <!-- FILL --> |
| API10 Unsafe 3rd-party | <!-- FILL --> |

### 5.5 PCI-DSS applicability

<!-- FILL: State whether the system processes PAN. If not, declare PCI-DSS SAQ-A applicable and note no specific PCI controls needed. -->

<!-- FILL: Update compliance matrix with ISO 27001 controls mapping if client requires. -->

<!-- PAGE_BREAK -->

## 6. Access Control & Identity Management

### 6.1 Customer IAM

<!-- FILL: SSO integration with client IdP, token handoff approach, TTL, refresh strategy. -->

### 6.2 Admin IAM

<!-- FILL: Admin IdP, MFA requirements, jump host, session recording, role matrix. -->

| Role | Permissions |
|---|---|
| <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> |

### 6.3 Service-to-service IAM

<!-- FILL: mTLS, service identity, no shared accounts. -->

### 6.4 Secret Management

<!-- FILL: Vault/KMS approach, auto-rotation cadence, pre-commit secret scanning. -->

<!-- FILL: IAM provisioning/deprovisioning SLA (Joiners/Movers/Leavers). -->

<!-- PAGE_BREAK -->

## 7. Data Protection

### 7.1 Data Classification

<!-- FILL: Reference §3.1. Four classes: Public / Internal / Confidential / Restricted. -->

### 7.2 At rest

<!-- FILL: TDE, S3 encryption, field-level encryption for sensitive PII. -->

### 7.3 In transit

<!-- FILL: TLS version, mTLS, HSTS, certificate authority. -->

### 7.4 In use

<!-- FILL: Memory handling, log masking pre-write. -->

### 7.5 Data retention & deletion

| Data | Retention | After |
|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 7.6 Subject rights (PDP)

<!-- FILL: Right to access, rectification, erasure, portability. -->

<!-- FILL: Mapping of which fields are encrypted vs masked in logs. -->

<!-- PAGE_BREAK -->

## 8. Logging, Monitoring, Incident Response

### 8.1 Log strategy

| Log type | Content | Retention | Tool |
|---|---|---|---|
| Application log | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Access log | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Audit log | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Security log | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 8.2 Monitoring & Alerting

<!-- FILL: Monitoring stack, alert routing, severity-based thresholds. -->

| Alert | Threshold | Severity |
|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 8.3 Incident Response

<!-- FILL: NIST IR framework phases (Preparation, Detection, Containment, Eradication, Recovery, Post-mortem). SLA for notifying client and regulators. -->

<!-- FILL: List IR playbook titles (DDoS / Data Breach / Insider Threat / etc.) -->

<!-- PAGE_BREAK -->

## 9. Business Continuity & Disaster Recovery

### 9.1 BIA (Business Impact Analysis)

| Function | RTO | RPO | Impact downtime |
|---|---|---|---|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### 9.2 DR Architecture

<!-- FILL: Primary and DR locations, replication mode, failover mechanism. -->

### 9.3 Backup Strategy

<!-- FILL: Backup tools, frequency, offsite encryption, restore test cadence. -->

### 9.4 Tabletop Exercise

<!-- FILL: Quarterly tabletop exercise cadence and scenario types. -->

<!-- FILL: Add estimated cost of downtime per hour to justify DR spending. -->

<!-- PAGE_BREAK -->

## 10. Security Testing

### 10.1 SAST

<!-- FILL: Tools, CI/CD gate policy. -->

### 10.2 DAST

<!-- FILL: Tools, scan frequency. -->

### 10.3 Dependency scan

<!-- FILL: Tools, SBOM generation, CVE alerting. -->

### 10.4 Pentest

<!-- FILL: Cadence, scope, firm requirements (e.g., CREST-certified), fix SLA. -->

### 10.5 Red Team exercise

<!-- FILL: Annual APT simulation, purple team debrief. -->

### 10.6 Bug bounty

<!-- FILL: Platform, scope, timeline. -->

### 10.7 Coverage matrix

| Test type | Cadence | Owner | Target coverage |
|---|---|---|---|
| Unit test | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Integration | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Load test | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| SAST | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| DAST | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Pentest | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Add UAT security checklist for client sign-off. -->

<!-- PAGE_BREAK -->

## 11. Vendor & Third-Party Security

### 11.1 Vendor risk assessment

<!-- FILL: VRA process for external vendors (questionnaire, compliance certs, annual review). -->

### 11.2 Third-party libraries

<!-- FILL: SBOM tracking, license scan, CVE subscription. -->

### 11.3 Client-facing security agreement

<!-- FILL: DPA, security incident notification SLA, right to audit. -->

<!-- FILL: List all third-party services with risk rating. -->

<!-- PAGE_BREAK -->

## 12. Security Awareness & Training

| Audience | Content | Cadence |
|---|---|---|
| Vendor dev team | <!-- FILL --> | <!-- FILL --> |
| Vendor ops team | <!-- FILL --> | <!-- FILL --> |
| Client admin staff | <!-- FILL --> | <!-- FILL --> |
| End customer | <!-- FILL --> | <!-- FILL --> |

<!-- FILL: Link to LMS platform. -->

<!-- PAGE_BREAK -->

## 13. Audit & Assurance

### 13.1 Internal audit

<!-- FILL: Monthly self-assessment, quarterly compliance review. -->

### 13.2 External audit

<!-- FILL: Regulator audit, ISO 27001 surveillance, vendor certification sharing. -->

### 13.3 Continuous assurance

<!-- FILL: SIEM dashboard compliance KPI, monthly attestation. -->

### 13.4 Deliverable for regulatory audit

| Document | Responsibility |
|---|---|
| Security Plan (this doc) | Vendor |
| Pentest reports | Vendor |
| Audit log extract | Vendor + Client Compliance |
| Incident log | Vendor |
| Training record | Vendor HR |
| DR test report | Vendor SRE |

<!-- PAGE_BREAK -->

## 14. Phe duyet / Sign-off

| Role | Ten | Chu ky | Ngay |
|---|---|---|---|
| Client CISO | _________ | _________ | _________ |
| Client Compliance Officer | _________ | _________ | _________ |
| Client DPO | _________ | _________ | _________ |
| Vendor CISO | _________ | _________ | _________ |
| Vendor PM | _________ | _________ | _________ |

<!-- FILL: Attach vendor ISO 27001 cert + secret rotation log + latest pentest report. -->
