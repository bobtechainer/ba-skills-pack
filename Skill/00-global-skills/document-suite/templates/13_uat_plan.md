<!--
Template: uat-plan — User Acceptance Test Plan / Kế hoạch Kiểm thử Chấp nhận Người dùng
Standard: IEEE 829-2008 + ISTQB Acceptance Testing
Skill:    banking-docs
Version:  2.0.0
Usage:    node scripts/build_doc.js <folder> --brand <vendor> --client <client>
-->

# Kế hoạch Kiểm thử Chấp nhận Người dùng / User Acceptance Test Plan

**Project**: {{facts.project.name}} — {{facts.project.code}}
**Client**: {{facts.client.name}}
**Vendor**: {{facts.vendor.name}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.doc.classification}}

<!-- PAGE_BREAK -->

## 1. Mục đích & Mục tiêu UAT / UAT Purpose & Objectives

<!-- FILL: 1-2 paragraph explaining why UAT is needed and what success looks like from the business perspective -->

**What goes here**:
- Business goal: confirm the system satisfies contractual requirements and is fit for production use.
- UAT differentiator vs SIT: business-driven scenarios executed by real end-users.
- Explicit reference to contract acceptance criteria / SOW clauses.

**Example structure**:

| Objective | Measurable Outcome |
|---|---|
| Validate business workflows end-to-end | 100% P0 scenarios pass |
| Confirm regulatory compliance in live-like data | Zero regulatory gap |
| Verify user experience for target personas | Client UX sign-off |
| <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 2. Phạm vi UAT / UAT Scope

<!-- FILL: what is in and out of UAT, aligned with contractual deliverables -->

**What goes here**:
- Modules in UAT scope (business-critical workflows).
- Integrations included (upstream / downstream systems in UAT env).
- Explicit exclusions with justification.

**Example structure**:

| Scope | Module / Flow | Justification |
|---|---|---|
| In | Customer onboarding E2E | Contract clause 4.2 |
| In | Loan origination workflow | Contract clause 4.3 |
| Out | Legacy MIS report migration | Separate statement of work |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 3. Môi trường & Dữ liệu UAT / UAT Environment & Test Data

<!-- FILL: description of the UAT environment, data provisioning process, masking approach -->

**What goes here**:
- UAT environment specification (dedicated, production-like).
- Test data: masked production subset vs synthetic, volume, refresh frequency.
- Access provisioning for client testers (VPN, SSO, dedicated accounts).
- Segregation from other environments to avoid cross-contamination.

**Example structure**:

| Aspect | Value |
|---|---|
| Environment URL | https://uat.{{facts.project.code}}.{{facts.client.name}} |
| Topology | Production-like, 3-node HA |
| Data type | Masked production + synthetic edge cases |
| Data volume | 500k customers, 2M transactions |
| Refresh cadence | Per release / on-request |
| Access | Client SSO + named UAT accounts |
| <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 4. Tiêu chí Vào UAT / UAT Entry Criteria

<!-- FILL: mandatory gates to commence UAT -->

**What goes here**:
- Code freeze declared and release candidate tagged.
- Prior test phases (unit / integration / SIT) passed with documented evidence.
- UAT environment deployed, smoke-tested, data ready.
- Training delivered to client testers.

**Example structure**:

| # | Entry Criterion | Evidence | Status |
|---|---|---|---|
| E1 | Code freeze + RC tagged | Git tag + release notes | <!-- FILL --> |
| E2 | SIT completed — 95% pass | SIT summary report | <!-- FILL --> |
| E3 | Zero open P0/P1 defects | Jira dashboard | <!-- FILL --> |
| E4 | UAT env deployed + smoke pass | Deployment log + smoke report | <!-- FILL --> |
| E5 | UAT data loaded + validated | Data loading report | <!-- FILL --> |
| E6 | Client testers trained | Training attendance log | <!-- FILL --> |
| E7 | UAT plan approved | Signed UAT plan | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 5. Tiêu chí Ra UAT / UAT Exit Criteria

<!-- FILL: conditions required to declare UAT complete and system acceptable -->

**What goes here**:
- % of test cases passed per priority.
- Zero blocker (P0) and zero major (P1) defects open.
- All critical business workflows executed and signed off.
- Client formal sign-off obtained in writing.

**Example structure**:

| # | Exit Criterion | Target |
|---|---|---|
| X1 | P0 test cases pass rate | 100% |
| X2 | P1 test cases pass rate | 95% |
| X3 | P2 test cases pass rate | 90% |
| X4 | Open P0 defects | 0 |
| X5 | Open P1 defects | 0 |
| X6 | Client UAT sign-off document | Signed |
| X7 | Regulatory compliance evidence | Reviewed and accepted |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 6. Kịch bản UAT / UAT Scenarios

<!-- FILL: catalogue of UAT scenarios derived from business workflows -->

**What goes here**:
- Scenario catalogue indexed by business process.
- Each scenario: ID, description, expected business outcome, priority.
- Cross-reference to SRS requirements and contract acceptance criteria.

**Example structure**:

| ID | Description | Expected Outcome | Priority |
|---|---|---|---|
| UAT-001 | New retail customer onboarding with valid ID | Customer activated, CIF created, welcome notification sent | P0 |
| UAT-002 | Onboarding rejected for sanctioned individual | AML block, case raised, audit trail stored | P0 |
| UAT-003 | Loan application approval under threshold | Auto-approval, disbursement triggered | P0 |
| UAT-004 | Bulk import of 1k customers | All processed, reconciliation report matches | P1 |
| UAT-005 | Monthly regulatory report extraction | Report generated in required SBV format | P0 |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 7. Ví dụ Kịch bản Chi tiết / UAT Script Examples

<!-- FILL: 3 fully-written step-by-step scripts aimed at non-technical business testers -->

**What goes here**:
- Step-by-step actions and verifications, worded for business users.
- Pre-conditions, inputs, expected results per step, pass/fail checkbox.
- Written so the client can reproduce independently without vendor help.

**Example — UAT-001 Customer Onboarding**:

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Login as branch officer `uat_bo_01` | Dashboard loads within 3s | ☐ |
| 2 | Click "New Customer" → select "Individual" | Form opens with KYC fields | ☐ |
| 3 | Enter valid ID number + name + DOB | Fields accepted, no validation error | ☐ |
| 4 | Upload ID photo (sample file `id_valid.jpg`) | Upload succeeds, OCR extracts fields | ☐ |
| 5 | Submit form | AML check runs, result = CLEAR, CIF assigned | ☐ |
| 6 | Verify CIF in search screen | Customer found, status = ACTIVE | ☐ |

**Example — UAT-002 Sanctioned Individual**:

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Login as branch officer | Dashboard loads | ☐ |
| 2 | Submit onboarding with sanctioned name from test list | AML block, red banner displayed | ☐ |
| 3 | Verify case created in compliance queue | Case visible with reference ID | ☐ |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | ☐ |

**Example — UAT-005 Regulatory Report**:

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Login as reporting officer | Report menu visible | ☐ |
| 2 | Select "SBV Monthly — M01" with period 2026-03 | Job queued | ☐ |
| 3 | Wait for completion notification | Report status = READY | ☐ |
| 4 | Download file and open in validator | SBV schema passes, checksum match | ☐ |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | ☐ |

<!-- PAGE_BREAK -->

## 8. Quản lý Lỗi / Defect Management

<!-- FILL: severity / priority matrix and workflow -->

**What goes here**:
- Severity definitions (business impact) and priority definitions (time pressure).
- Defect lifecycle workflow — new → triaged → assigned → fixed → retested → closed.
- SLAs for acknowledging, fixing and retesting defects during UAT.

**Severity / Priority Matrix**:

| Severity | Definition | Example |
|---|---|---|
| S1 Critical | Workflow blocked, no workaround | Cannot onboard any customer |
| S2 Major | Workflow impacted, workaround exists | Bulk import fails for > 500 rows |
| S3 Minor | Cosmetic / non-blocking | Label mis-translation |
| S4 Trivial | Enhancement / nice-to-have | Alignment of column in report |

**Defect SLA during UAT**:

| Severity | Acknowledge | Fix & redeploy | Retest |
|---|---|---|---|
| S1 | 2h | 24h | 4h |
| S2 | 4h | 48h | 8h |
| S3 | 1 business day | Next minor release | Next cycle |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 9. Lịch UAT / UAT Schedule

<!-- FILL: day-by-day plan covering UAT window -->

**What goes here**:
- Daily cadence of scenario execution, defect triage, retest cycles.
- Standing meetings (daily stand-up, triage, end-of-day report).
- Contingency buffer for re-testing after defect fixes.

**Example structure**:

| Day | Activities | Expected Output |
|---|---|---|
| D1 | Kick-off + smoke test + UAT-001..005 | Daily report |
| D2-D4 | Core workflows P0 execution | Execution status |
| D5 | Defect triage + retest | Updated status |
| D6-D8 | P1 workflows + edge cases | Execution status |
| D9 | Regression + integration scenarios | Execution status |
| D10 | Final triage + sign-off meeting | Signed UAT report |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 10. Đội UAT & Vai trò / UAT Team & Roles

<!-- FILL: roster of UAT participants from both sides -->

**What goes here**:
- Client side: UAT coordinator, business testers per domain, sign-off authority.
- Vendor side: UAT support lead, defect owners, environment support.
- Named individuals with back-ups.

**Example structure**:

| Role | Name | Organisation | Back-up |
|---|---|---|---|
| UAT Coordinator (Client) | <!-- FILL --> | {{facts.client.name}} | <!-- FILL --> |
| Business Tester — Retail | <!-- FILL --> | {{facts.client.name}} | <!-- FILL --> |
| Business Tester — Compliance | <!-- FILL --> | {{facts.client.name}} | <!-- FILL --> |
| UAT Support Lead (Vendor) | <!-- FILL --> | {{facts.vendor.name}} | <!-- FILL --> |
| Defect Triage Lead | <!-- FILL --> | {{facts.vendor.name}} | <!-- FILL --> |
| Sign-off Authority | <!-- FILL --> | {{facts.client.name}} | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 11. Giao tiếp & Leo thang / Communication & Escalation

<!-- FILL: channels, cadence, escalation path -->

**What goes here**:
- Primary channel (dedicated Slack / Teams) + email for formal records.
- Daily stand-up + end-of-day report distribution list.
- Escalation path with defined response SLA per tier.

**Escalation Matrix**:

| Tier | Trigger | Escalate To | Response SLA |
|---|---|---|---|
| T1 | Blocker open > 4h | Vendor UAT Lead | 1h |
| T2 | Blocker open > 24h | Vendor PM + Client PM | 4h |
| T3 | Blocker open > 48h | Vendor Sponsor + Client Sponsor | Same day |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 12. Ký xác nhận & Chấp nhận / Sign-off & Acceptance

<!-- FILL: formal acceptance block referencing contract clauses -->

**What goes here**:
- Conditions for acceptance as per contract.
- Named signatories and signature lines.
- Attachment list for sign-off (final UAT report, outstanding defect list, risk acceptance).

| Role | Name | Signature | Date |
|---|---|---|---|
| Client UAT Coordinator | <!-- FILL --> | _______________ | ____ |
| Client Project Sponsor | <!-- FILL --> | _______________ | ____ |
| Vendor Project Manager | <!-- FILL --> | _______________ | ____ |
| Vendor QA Manager | <!-- FILL --> | _______________ | ____ |
