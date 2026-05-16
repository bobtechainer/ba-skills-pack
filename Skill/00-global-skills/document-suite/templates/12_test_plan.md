<!--
Template: test-plan — Master Test Plan / Kế hoạch Kiểm thử Tổng thể
Standard: IEEE 829-2008 Test Documentation
Skill:    banking-docs
Version:  2.0.0
Usage:    node scripts/build_doc.js <folder> --brand <vendor> --client <client>
-->

# Kế hoạch Kiểm thử Tổng thể / Master Test Plan

**Project**: {{facts.project.name}} — {{facts.project.code}}
**Client**: {{facts.client.name}}
**Vendor**: {{facts.vendor.name}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.doc.classification}}

<!-- PAGE_BREAK -->

## 1. Định danh & Tổng quan / Test Plan Identifier & Overview

<!-- FILL: 1-2 paragraph — purpose of the test plan, reference to SRS/SDD, intended audience -->

**What goes here**:
- Unique test plan ID referencing project code and release (e.g. `{{facts.project.code}}-TP-v{{facts.doc.version}}`).
- Overall test objective — validate functional / non-functional / regulatory requirements.
- Link back to parent documents: SRS, SDD, URD, contractual acceptance criteria.

**Example structure**:

| Attribute | Value |
|---|---|
| Test Plan ID | {{facts.project.code}}-TP-v{{facts.doc.version}} |
| Parent SRS | <!-- FILL: SRS doc ID --> |
| Parent SDD | <!-- FILL: SDD doc ID --> |
| Author | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 2. Phạm vi / Scope

<!-- FILL: summary paragraph delineating what is tested and what is explicitly excluded -->

**What goes here**:
- Features In: modules, APIs, batch jobs, reports, integrations covered.
- Features Out: explicitly excluded items with justification (out of contract / tested elsewhere / future release).
- Reference to requirement traceability baseline.

**Features In**:

| ID | Module / Feature | Requirement Ref |
|---|---|---|
| IN-01 | Core onboarding service | REQ-FUN-001..025 |
| IN-02 | AML screening gateway | REQ-REG-010..018 |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

**Features Out**:

| ID | Feature | Justification |
|---|---|---|
| OUT-01 | Legacy branch UI | End-of-life, not in contract |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 3. Chiến lược & Phương pháp Kiểm thử / Test Strategy & Approach

<!-- FILL: 1 paragraph summarising V-model alignment, shift-left practices, risk-based prioritisation -->

**What goes here**:
- Test levels applied: unit / integration / system / UAT / performance / security / regression.
- Approach per level: automation coverage target, frameworks, data strategy.
- Test pyramid target ratios (e.g. 70% unit / 20% integration / 10% end-to-end).

**Example structure**:

| Level | Owner | Environment | Automation Target | Exit Gate |
|---|---|---|---|---|
| Unit | Dev team | Local / CI | 85% branch coverage | CI green |
| Integration | Dev + QA | Dev-Int | 60% API coverage | Smoke pass |
| System | QA | SIT | 40% end-to-end | 95% pass rate |
| UAT | Client + QA | UAT | Manual + scripted | Client sign-off |
| Performance | SRE + QA | Perf | JMeter / k6 | SLA targets met |
| Security | Sec team | Staging | SAST / DAST / Pentest | Zero critical CVE |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 4. Đối tượng Kiểm thử / Test Items

<!-- FILL: list of subsystems / components under test with build versions -->

**What goes here**:
- Subsystems, services, micro-services, batch components under test.
- Artifact versions / Git tag references at test start.
- Third-party dependencies included in scope.

**Example structure**:

| Item ID | Subsystem | Build / Tag | Source Repo |
|---|---|---|---|
| TI-01 | Onboarding API | v{{facts.doc.version}}-rc.1 | repo/onboarding |
| TI-02 | KYC worker | v{{facts.doc.version}}-rc.1 | repo/kyc |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 5. Tính năng Cần Kiểm thử / Features to be Tested

<!-- FILL: decomposition of in-scope features with priority and owner -->

**What goes here**:
- Feature-level breakdown aligned with SRS numbering.
- Priority P0 (blocker) / P1 (major) / P2 (minor) — drives test depth.
- Responsible test engineer per feature.

**Example structure**:

| Feature ID | Description | Priority | Responsible |
|---|---|---|---|
| F-01 | Customer registration flow | P0 | <!-- FILL: tester name --> |
| F-02 | AML watchlist screening | P0 | <!-- FILL --> |
| F-03 | Document upload & OCR | P1 | <!-- FILL --> |
| F-04 | Audit log export | P2 | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 6. Môi trường Kiểm thử / Test Environment

<!-- FILL: description of dedicated QA environment, network segregation, data masking -->

**What goes here**:
- Hardware: nodes, CPU, RAM, storage, database sizing per environment.
- Software: OS, runtime, dependencies, exact versions.
- Network: VLANs, firewall rules, VPN access for client testers.
- Data: synthetic vs masked production, volumes, refresh cadence.

**Example structure**:

| Component | Dev | SIT | UAT | Perf |
|---|---|---|---|---|
| App nodes | 1x 4vCPU | 2x 8vCPU | 3x 8vCPU | 6x 16vCPU |
| DB | PG 15 single | PG 15 HA | PG 15 HA | PG 15 HA+replica |
| Data volume | 1k records | 50k records | 500k masked | 10M synthetic |
| Refresh | On-demand | Weekly | Per release | Per test cycle |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 7. Công cụ Kiểm thử / Test Tools

<!-- FILL: list of tooling choices with rationale -->

**What goes here**:
- Test management (e.g. Xray / Zephyr / TestRail) — central evidence store.
- Automation frameworks (Playwright / Cypress / RestAssured / pytest).
- Performance (k6 / JMeter / Gatling).
- Security (SonarQube / OWASP ZAP / Burp Suite).
- Defect tracking (Jira) integration.

**Example structure**:

| Category | Tool | Rationale |
|---|---|---|
| Test mgmt | Xray on Jira | Traceability to requirements |
| API automation | RestAssured + JUnit 5 | Team Java expertise |
| UI automation | Playwright | Cross-browser, fast, reliable |
| Performance | k6 | Code-as-config, CI-friendly |
| SAST | SonarQube | Existing enterprise licence |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 8. Tiêu chí Vào / Ra / Entry & Exit Criteria

<!-- FILL: gates required to start and finish each test phase -->

**What goes here**:
- Entry criteria per phase: code freeze, environment ready, smoke passed, data loaded.
- Exit criteria per phase: % test cases passed, zero blocker defects, coverage thresholds, sign-off.
- Suspension and resumption criteria (when to halt testing).

**Example structure**:

| Phase | Entry Criteria | Exit Criteria |
|---|---|---|
| SIT | Build deployed + smoke pass + test data ready | 95% tests pass, 0 P0/P1 open |
| UAT | SIT signed off + UAT env ready + client trained | 100% P0 pass, 95% P1 pass, client sign-off |
| Perf | Functionally stable + representative dataset loaded | SLA targets met (see §6 SLA) |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 9. Sản phẩm Bàn giao / Test Deliverables

<!-- FILL: list of artefacts delivered at each milestone -->

**What goes here**:
- Test cases (in test management tool + exportable PDF).
- Test execution reports per phase (daily + phase-end).
- Defect reports with root cause analysis.
- Coverage report and traceability matrix.
- Final test summary report for go-live.

**Example structure**:

| Deliverable | Format | Owner | Delivery Milestone |
|---|---|---|---|
| Test case repository | Xray | QA Lead | Before SIT start |
| Daily execution report | Email + dashboard | QA Lead | Daily during execution |
| Phase summary report | PDF | QA Manager | End of each phase |
| Traceability matrix | XLSX | QA Lead | Pre-UAT gate |
| Final test summary | PDF | QA Manager | Pre go-live |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 10. Lịch & Mốc thời gian / Schedule & Milestones

<!-- FILL: high-level testing calendar aligned with project plan -->

**What goes here**:
- Start / end dates per test phase.
- Dependency on dev milestones (feature freeze / code freeze / release candidate).
- Buffer windows for defect fix cycles.

**Example structure**:

| Milestone | Start | End | Dependency |
|---|---|---|---|
| Unit & Integration | <!-- FILL --> | <!-- FILL --> | Dev sprint complete |
| SIT | <!-- FILL --> | <!-- FILL --> | Code freeze |
| Performance | <!-- FILL --> | <!-- FILL --> | SIT stable |
| UAT | <!-- FILL --> | <!-- FILL --> | SIT signed off |
| Go-live | <!-- FILL --> | <!-- FILL --> | UAT signed off |

<!-- PAGE_BREAK -->

## 11. Rủi ro & Dự phòng / Risks & Contingencies

<!-- FILL: test-specific risks with mitigation -->

**What goes here**:
- Resource risks (tester availability, environment slippage).
- Technical risks (flaky tests, data refresh failure, tool licence expiry).
- Mitigation and contingency for each risk (named owner).

**Example structure**:

| Risk ID | Description | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-T01 | UAT env unavailable on schedule | M | H | Parallel prep of backup env |
| R-T02 | Masked data refresh fails | M | H | Fallback to previous snapshot |
| R-T03 | Client tester absence | M | M | Paired tester from vendor side |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 12. Vai trò & Trách nhiệm / Roles & Responsibilities

<!-- FILL: RACI table for testing organisation -->

**What goes here**:
- Test Manager, QA Lead, Automation Lead, Performance Lead, Security Lead.
- Client-side roles: UAT coordinator, business testers, sign-off authority.
- RACI matrix mapping activities to roles.

**Example structure**:

| Activity | Test Mgr | QA Lead | Dev Lead | Client UAT |
|---|---|---|---|---|
| Test plan approval | A | R | C | C |
| Test case design | A | R | C | I |
| SIT execution | A | R | C | I |
| UAT execution | C | C | I | R |
| Final sign-off | A | C | C | R |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 13. Phê duyệt / Approvals

<!-- FILL: formal sign-off block -->

**What goes here**:
- Named approvers with role and signature line.
- Version history of the test plan.

| Role | Name | Signature | Date |
|---|---|---|---|
| Vendor Test Manager | <!-- FILL --> | _______________ | ____ |
| Vendor Project Manager | <!-- FILL --> | _______________ | ____ |
| Client QA Lead | <!-- FILL --> | _______________ | ____ |
| Client Project Sponsor | <!-- FILL --> | _______________ | ____ |
