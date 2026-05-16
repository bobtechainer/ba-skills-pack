<!--
Template: deployment-plan — Deployment / Release Plan / Kế hoạch Triển khai & Phát hành
Standard: ITIL 4 Release Management + Deployment Management
Skill:    banking-docs
Version:  2.0.0
Usage:    node scripts/build_doc.js <folder> --brand <vendor> --client <client>
-->

# Kế hoạch Triển khai & Phát hành / Deployment & Release Plan

**Project**: {{facts.project.name}} — {{facts.project.code}}
**Client**: {{facts.client.name}}
**Vendor**: {{facts.vendor.name}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.doc.classification}}

<!-- PAGE_BREAK -->

## 1. Tổng quan Triển khai / Deployment Overview

<!-- FILL: 1-2 paragraph — what is being released, the business driver, target date -->

**What goes here**:
- Release scope summary referencing the release notes.
- Business driver and regulatory deadlines (if any).
- Target production date and deployment window.

**Example structure**:

| Attribute | Value |
|---|---|
| Release Name | {{facts.project.code}}-R{{facts.doc.version}} |
| Release Type | Major / Minor / Patch |
| Target Date | <!-- FILL --> |
| Window | <!-- FILL: e.g. 02:00–05:00 ICT Saturday --> |
| Change Ticket | <!-- FILL: CHG-xxxxx --> |

<!-- PAGE_BREAK -->

## 2. Chiến lược Phát hành / Release Strategy

<!-- FILL: one-paragraph justification of chosen deployment pattern -->

**What goes here**:
- Strategy options considered: blue-green / canary / rolling / big-bang.
- Selected strategy with rationale (blast radius, rollback complexity, downtime tolerance).
- Traffic cutover approach and % ramp schedule (for canary).

**Example structure**:

| Strategy | Description | Selected | Rationale |
|---|---|---|---|
| Blue-Green | Two identical stacks, switch at LB | ☐ | Near-zero downtime, full rollback |
| Canary | 5% → 25% → 100% ramp | ☐ | Detect runtime defects early |
| Rolling | Replace N pods at a time | ☐ | Works within single cluster |
| Big-Bang | Full replacement in one window | ☐ | Only when mandatory |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 3. Bản đồ Môi trường / Environment Map

<!-- FILL: diagram / table describing deployment targets and promotion path -->

**What goes here**:
- Dev → SIT → UAT → Staging → Production promotion order.
- Responsibility, approval gate, and deployment tool per environment.
- Secrets and configuration source per environment.

**Example structure**:

| Environment | Purpose | Owner | Deploy Tool | Approval |
|---|---|---|---|---|
| Dev | Developer loop | Dev Lead | CI pipeline auto | N/A |
| SIT | Integration testing | QA Lead | CD pipeline | QA Lead |
| UAT | Client acceptance | QA + Client | CD pipeline | Client UAT Lead |
| Staging | Production rehearsal | SRE | CD pipeline | Release Manager |
| Production | Live service | SRE + CAB | CD pipeline | CAB |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 4. Danh sách Kiểm tra Trước Triển khai / Pre-Deployment Checklist

<!-- FILL: items verified before starting deployment -->

**What goes here**:
- Code freeze, release tag, release notes approved.
- All tests green in staging (functional / performance / security).
- Change ticket approved by CAB, communication sent, on-call engaged.
- Backups complete, rollback images staged, database migrations dry-run.

**Example structure**:

| # | Checklist Item | Owner | Status |
|---|---|---|---|
| P1 | Release tag cut + notes signed off | Release Manager | ☐ |
| P2 | Staging tests green (SIT / Perf / Sec) | QA Lead | ☐ |
| P3 | CAB approval received | Release Manager | ☐ |
| P4 | DB backup verified (hot + cold) | DBA | ☐ |
| P5 | Rollback image / chart published | SRE | ☐ |
| P6 | Monitoring dashboards ready | SRE | ☐ |
| P7 | On-call roster confirmed | SRE Lead | ☐ |
| P8 | Customer comms sent (if downtime) | Client PM | ☐ |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | ☐ |

<!-- PAGE_BREAK -->

## 5. Các Bước Triển khai / Deployment Steps

<!-- FILL: detailed ordered runbook per service -->

**What goes here**:
- Ordered steps with exact commands / pipeline actions.
- Actor and expected elapsed time per step.
- Verification after each step before proceeding.

**Example structure**:

| # | Step | Command / Action | Actor | ETA | Verify |
|---|---|---|---|---|---|
| D1 | Announce start in war-room | Post in Teams channel | Release Mgr | 2m | Message posted |
| D2 | Put frontend in maintenance mode | `kubectl apply -f maint.yaml` | SRE | 3m | Maintenance banner visible |
| D3 | Run DB migration | `flyway migrate -env=prod` | DBA | 10m | Migration version advanced |
| D4 | Deploy backend v{{facts.doc.version}} (green) | Pipeline run `deploy-green` | SRE | 15m | Green pods ready |
| D5 | Smoke test green stack (internal URL) | `npm run smoke -- --env green` | QA | 5m | All smoke pass |
| D6 | Switch LB weight: 10% green | LB API call | SRE | 2m | Traffic split observed |
| D7 | Monitor error budget 15 min | Grafana + Sentry | SRE | 15m | Error rate < 0.5% |
| D8 | Switch LB weight: 100% green | LB API call | SRE | 2m | 100% green traffic |
| D9 | Remove maintenance mode | Delete maint config | SRE | 2m | Banner removed |
| D10 | Close war-room + announce success | Teams + email | Release Mgr | 2m | Message posted |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 6. Xác minh Sau Triển khai / Post-Deployment Verification

<!-- FILL: validation executed after cutover -->

**What goes here**:
- Synthetic transactions covering critical paths.
- Monitoring checks (error rate, latency, saturation) for at least 30 minutes.
- Business sanity: sample real transaction in controlled manner.
- Sign-off that go-live is stable.

**Example structure**:

| # | Check | Method | Target | Result |
|---|---|---|---|---|
| V1 | Login flow synthetic | Playwright probe | < 2s, 100% pass | <!-- FILL --> |
| V2 | API error rate | Grafana | < 0.5% for 30 min | <!-- FILL --> |
| V3 | P95 latency | Grafana | < SLA threshold | <!-- FILL --> |
| V4 | Batch job midnight run | Log review next day | Success | <!-- FILL --> |
| V5 | Business sanity transaction | Client test user | Expected outcome | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 7. Kế hoạch Rollback / Rollback Plan

<!-- FILL: conditions, steps, validation of rollback -->

**What goes here**:
- Triggers (e.g. error rate > 2%, P1 defect reported, data corruption suspected).
- Rollback steps — should mirror deploy steps in reverse, tested in staging.
- Post-rollback validation and communication.

**Rollback Triggers**:

| # | Trigger | Decision Owner |
|---|---|---|
| T1 | Error rate > 2% for 5 min | SRE On-Call |
| T2 | P1 defect reported during warm-up | Release Manager |
| T3 | DB migration failure | DBA + Release Manager |
| T4 | Client business stop request | Client PM |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

**Rollback Steps**:

| # | Step | Command | ETA |
|---|---|---|---|
| R1 | Switch LB back to blue stack | LB API | 2m |
| R2 | Verify blue stack healthy | Grafana | 3m |
| R3 | Revert DB migration (if safe) | `flyway undo` | 10m |
| R4 | Announce rollback | Teams + email | 2m |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 8. Kế hoạch Giao tiếp / Communication Plan

<!-- FILL: audience × channel × cadence matrix -->

**What goes here**:
- Stakeholder map (executive sponsor, business users, support desk, customers).
- Channel per audience (email, in-app banner, SMS, Teams) and timing.
- Pre / during / post deployment templates.

**Example structure**:

| Audience | Channel | Pre | During | Post |
|---|---|---|---|---|
| Executive sponsors | Email | T-7d | T+0 start | T+1h status |
| Business users | In-app banner + email | T-2d | Banner on | T+0 complete |
| Customers | SMS + app notice | T-3d | N/A | T+0 service restored |
| Support desk | Teams channel + KB update | T-1d | Live updates | T+0 debrief |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 9. Phê duyệt CAB / Change Advisory Board Approval

<!-- FILL: CAB submission summary and decision -->

**What goes here**:
- Change ticket ID, category (standard / normal / emergency), risk class.
- CAB meeting date, attendees, decision, conditions.
- Link to risk assessment and rollback plan.

**Example structure**:

| Field | Value |
|---|---|
| Change Ticket | <!-- FILL: CHG-xxxxx --> |
| Category | Normal |
| Risk Class | Medium |
| CAB Date | <!-- FILL --> |
| Decision | Approved / Conditional / Rejected |
| Conditions | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 10. Điều phối Phụ thuộc / Dependency Coordination

<!-- FILL: upstream / downstream system alignment -->

**What goes here**:
- Upstream systems producing data or events consumed by this release.
- Downstream systems consuming outputs of this release.
- Coordination contacts and freeze windows on dependent systems.

**Example structure**:

| System | Direction | Owner | Freeze Window | Contact |
|---|---|---|---|---|
| Core banking | Upstream | Core team | No change during window | <!-- FILL --> |
| Card switch | Downstream | Card team | Sync schema by T-2d | <!-- FILL --> |
| Regulatory reporting | Downstream | Compliance | Report format frozen | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 11. Ma trận Go / No-Go / Go/No-Go Decision Matrix

<!-- FILL: decision criteria evaluated at the go-live gate meeting -->

**What goes here**:
- Criteria each stakeholder uses to vote Go / No-Go.
- Owner of each criterion and evidence required.
- Meeting cadence (T-24h, T-1h, T+0) and decision record.

**Example structure**:

| # | Criterion | Owner | Evidence | Go/No-Go |
|---|---|---|---|---|
| G1 | All pre-checks green | Release Mgr | Pre-deploy checklist signed | <!-- FILL --> |
| G2 | On-call roster confirmed | SRE Lead | Roster doc | <!-- FILL --> |
| G3 | CAB approval valid | Release Mgr | CAB minutes | <!-- FILL --> |
| G4 | Backups verified | DBA | Backup report | <!-- FILL --> |
| G5 | Client business sign-off | Client PM | Email confirmation | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 12. Cửa sổ Triển khai & Blackout / Deployment Window & Blackout Periods

<!-- FILL: permissible windows and blackout dates -->

**What goes here**:
- Allowed weekly windows (typically off-business hours).
- Blackout periods: payroll days, regulatory cut-off, month-end, Tet holidays.
- Emergency change exception process.

**Example structure**:

| Window | Day | Time (ICT) | Notes |
|---|---|---|---|
| Primary | Saturday | 02:00–05:00 | Standard release window |
| Secondary | Sunday | 03:00–06:00 | Back-up window |
| Blackout | Payroll days | 25th–31st each month | No deployments |
| Blackout | Month-end close | Last 2 biz days of month | No deployments |
| Blackout | Tet holiday | Annual per calendar | No deployments |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
