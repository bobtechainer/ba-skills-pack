# PCI-DSS + ISO 27001 Quick Reference

Summary of two standards the vendor may need to cite in Security Plan / Compliance Matrix, particularly when the banking project touches payment cards or requires enterprise security certification.

## PCI-DSS (Payment Card Industry Data Security Standard)

### When applicable

PCI-DSS applies when a system **stores, processes, or transmits cardholder data (CHD)**. For a banking promotional project, PCI-DSS applies only if:
- The application flow triggers card payment directly from the UI (e.g., "buy extra rounds with credit card")
- System receives card numbers from the client's Payment Service, even transiently
- Application logs contain masked PAN (Primary Account Number)

If the application only interacts with `transaction_id` tokens from the client's Payment Service (and never sees actual card data), PCI-DSS scope is **out of scope** for the vendor, but **in scope for the client** as the acquirer.

### 12 PCI-DSS requirements (v4.0)

| # | Requirement | Typical controls |
|---|---|---|
| 1 | Install and maintain network security controls | Segmented network, firewalls, no direct external access to CHD env |
| 2 | Apply secure configurations to all system components | Hardened OS baselines, no default creds, config management |
| 3 | Protect stored account data | Minimize storage, mask/truncate PAN, encrypt at rest (AES-256), key mgmt |
| 4 | Protect cardholder data with strong cryptography during transmission | TLS 1.2+, strong ciphers, no deprecated protocols |
| 5 | Protect all systems and networks from malicious software | Anti-malware on all in-scope systems, regular updates |
| 6 | Develop and maintain secure systems and software | Secure SDLC, vuln management, patching SLA, code review |
| 7 | Restrict access to system components and cardholder data by business need to know | RBAC, least privilege, documented access matrix |
| 8 | Identify users and authenticate access | Unique IDs, MFA for all admin + remote access, password policy |
| 9 | Restrict physical access to cardholder data | Data center controls, media handling, device inventory |
| 10 | Log and monitor all access to system components and cardholder data | Audit logs, SIEM, retention ≥ 1 year, reviews |
| 11 | Test security of systems and networks regularly | Vuln scans quarterly, pentest annually, IDS/IPS |
| 12 | Support information security with organizational policies and programs | Written security policy, training, incident response, vendor mgmt |

### PCI-DSS Scoping — "in scope" vs "out of scope"

**In scope**: Any system that stores, processes, transmits CHD, OR any system that could impact the security of CHD environment (CDE).

**Scope reduction techniques**:
- **Tokenization** — replace PAN with a token that has no value outside the token vault; tokens can be handled by out-of-scope systems.
- **P2PE** (Point-to-Point Encryption) — encrypt at card reader, decrypt only in secure HSM; cleartext never touches merchant systems.
- **Network segmentation** — isolate CDE via firewalls; non-CDE networks are out of scope if segmentation is verified.

For the vendor: **always request the client to use tokenization for the Rule Engine ↔ Payment Service interface**. This keeps the vendor's systems out of PCI scope.

## ISO 27001 (Information Security Management System)

### When applicable

ISO 27001 is a **management standard**, not a control standard. It certifies that an organization has a working Information Security Management System (ISMS). Vietnamese banks typically require ISO 27001 certification of their vendors as a procurement prerequisite.

If the vendor holds ISO 27001 certification, cite it in the Security Plan cover + in Compliance Matrix. If not, commit to **align with** ISO 27001:2022 controls.

### ISO 27001:2022 structure

The standard itself has 10 main clauses (management system requirements):

1. Scope
2. Normative references
3. Terms and definitions
4. Context of the organization
5. Leadership
6. Planning (risk assessment, risk treatment)
7. Support (resources, training, awareness, documentation)
8. Operation
9. Performance evaluation (monitoring, internal audit, management review)
10. Improvement

The **93 controls** are in Annex A (updated from 114 in the 2013 version), grouped into 4 themes:

| Theme | # controls | Focus |
|---|---|---|
| A.5 Organizational | 37 | Policies, roles, asset mgmt, supplier mgmt |
| A.6 People | 8 | Screening, training, disciplinary, termination |
| A.7 Physical | 14 | Secure areas, equipment, media |
| A.8 Technological | 34 | Access control, crypto, logging, change mgmt, backup, network |

### Key Annex A controls for banking projects

Cite these in the Security Plan Compliance Matrix:

| Control | Name | Application to banking app |
|---|---|---|
| A.5.1 | Policies for information security | Written InfoSec policy signed by leadership |
| A.5.10 | Acceptable use of information | User agreement, AUP for staff |
| A.5.19 | Information security in supplier relationships | DPA with [Client], NDA, SLA |
| A.5.23 | Information security for use of cloud services | Cloud vendor due diligence, data residency |
| A.5.24 | Information security incident management planning | IR plan, runbook, 24h SBV notification |
| A.5.30 | ICT readiness for business continuity | BCP, DRP, RTO/RPO |
| A.8.2 | Privileged access rights | Jump hosts, admin account monitoring |
| A.8.3 | Information access restriction | RBAC, need-to-know |
| A.8.5 | Secure authentication | MFA, strong passwords |
| A.8.9 | Configuration management | Infrastructure as code, change mgmt |
| A.8.12 | Data leakage prevention | DLP scans on email, egress monitoring |
| A.8.15 | Logging | Structured logs, SIEM forwarding |
| A.8.16 | Monitoring activities | 24/7 SOC or managed SOC |
| A.8.23 | Web filtering | Egress proxy, URL filtering |
| A.8.25 | Secure development life cycle | SSDLC, threat modeling, code review |
| A.8.28 | Secure coding | Secure coding standards, SAST |
| A.8.29 | Security testing in development and acceptance | Unit + integration + pentest |
| A.8.34 | Protection of information systems during audit testing | Access to audit logs restricted |

## Citation pattern for Security Plan

When writing the Security Plan Compliance Matrix section, use this format:

| Control | Standard | Required by | Implementation | Evidence |
|---|---|---|---|---|
| Authentication | ISO 27001 A.8.5, PCI-DSS 8.3, TT 09/2020 Đ.19 | [Client] + SBV + PCI if applicable | OIDC + MFA for admin, customer auth via [Client App] SSO | IAM config, MFA enrollment report |
| Audit logging | ISO 27001 A.8.15, PCI-DSS 10.2, TT 09/2020 Đ.42 | [Client] + SBV | Structured JSON logs to central SIEM, 365-day retention | SIEM dashboard screenshot, log retention config |
| Encryption at rest | ISO 27001 A.8.24, PCI-DSS 3.5, TT 09/2020 Đ.24 | [Client] + SBV + PCI if applicable | PostgreSQL TDE + AWS KMS envelope encryption | KMS audit log, DB config |

## References

- PCI-DSS v4.0 (2022), Payment Card Industry Security Standards Council
- ISO/IEC 27001:2022 — Information security management systems — Requirements
- ISO/IEC 27002:2022 — Information security controls (companion to 27001)
- NIST Cybersecurity Framework 2.0 (often cross-walked with ISO 27001)
- Advisera ISO 27001 + PCI-DSS integration guide
