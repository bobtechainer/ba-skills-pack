<!--
Template: sla — Service Level Agreement / Thỏa thuận Mức độ Dịch vụ
Standard: ITIL 4 Service Level Management
Skill:    banking-docs
Version:  2.0.0
Usage:    node scripts/build_doc.js <folder> --brand <vendor> --client <client>
-->

# Thỏa thuận Mức độ Dịch vụ / Service Level Agreement

**Project**: {{facts.project.name}} — {{facts.project.code}}
**Client**: {{facts.client.name}}
**Vendor**: {{facts.vendor.name}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.doc.classification}}

<!-- PAGE_BREAK -->

## 1. Mô tả Dịch vụ / Service Description

<!-- FILL: 1-2 paragraph describing the scope of the managed service -->

**What goes here**:
- Service name, business function, target users.
- Hosting arrangement (vendor cloud / client DC / hybrid).
- Reference to contract and statement of work.

**Example structure**:

| Attribute | Value |
|---|---|
| Service Name | {{facts.project.name}} managed service |
| Target Users | {{facts.client.name}} business and operations staff |
| Hosting | <!-- FILL: cloud / on-prem / hybrid --> |
| Contract Ref | <!-- FILL --> |
| Effective Date | {{facts.doc.date}} |
| Review Cadence | Quarterly |

<!-- PAGE_BREAK -->

## 2. Phạm vi SLA / Scope of SLA

<!-- FILL: what is covered and explicitly excluded -->

**What goes here**:
- Components covered: application, database, integration, reporting.
- Services included: incident management, problem management, minor enhancements.
- Exclusions: customer hardware, client network, third-party outages, force majeure.

**In Scope**:

| # | Item |
|---|---|
| 1 | Application services operated by {{facts.vendor.name}} |
| 2 | Databases managed by {{facts.vendor.name}} |
| 3 | Monitoring and alerting |
| 4 | Incident / problem / change management |
| 5 | Minor enhancements within agreed budget |

**Out of Scope**:

| # | Item | Rationale |
|---|---|---|
| 1 | Client-operated network | Separate client ownership |
| 2 | Client end-user devices | Not managed |
| 3 | Third-party SaaS outages | Outside vendor control |
| 4 | Force majeure | Per contract clause |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 3. Mức độ Dịch vụ / Service Levels

<!-- FILL: quantitative commitments -->

**What goes here**:
- Availability commitments per service component.
- Performance / latency / throughput commitments.
- Measurement unit (monthly / quarterly / rolling) and calculation method.

**Example structure**:

| Metric | Commitment | Window | Measurement |
|---|---|---|---|
| Overall availability | 99.9% | Calendar month | Uptime / (uptime + downtime) |
| API P95 latency | < 400ms | Rolling 30d | Prometheus histogram |
| Batch completion | 99% on-time | Monthly | Batch run logs |
| Data freshness | < 5 min lag | Rolling 24h | Replication monitor |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 4. Gói Hỗ trợ / Support Tiers

<!-- FILL: three-tier support plan with pricing differentiators -->

**What goes here**:
- Essential / Professional / Enterprise tier definitions.
- Differentiators: hours, channels, response SLA, dedicated resources.
- Selected tier for this client (marked).

**Example structure**:

| Feature | Essential | Professional | Enterprise |
|---|---|---|---|
| Support hours | 9x5 | 16x5 | 24x7 |
| Channels | Email | Email + phone | Email + phone + dedicated Teams |
| Response SLA (P1) | 4 BH | 2 BH | 30 min |
| Named Service Mgr | No | Shared | Dedicated |
| Quarterly review | Email report | On-site meeting | On-site + roadmap |
| Proactive monitoring | Standard | Enhanced | Premium + custom dashboards |
| Selected | ☐ | ☐ | ☐ |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 5. Thời gian Phản hồi theo Mức Ưu tiên / Response Time by Priority

<!-- FILL: priority matrix with response and resolution targets -->

**What goes here**:
- Priority definitions P1..P4 based on business impact.
- Response time = time to acknowledge + assign.
- Resolution / workaround targets per priority.

**Priority Definitions**:

| Priority | Definition | Example |
|---|---|---|
| P1 Critical | Service down, no workaround, revenue impact | All users cannot log in |
| P2 High | Major function impaired, workaround possible | One region slow |
| P3 Medium | Minor function impaired | Report export slow |
| P4 Low | Cosmetic / request | Label change |

**Response & Resolution SLA (Enterprise tier example)**:

| Priority | Response | Workaround | Resolution |
|---|---|---|---|
| P1 | 15 min | 2h | 4h |
| P2 | 30 min | 4h | 8h |
| P3 | 4 BH | 1 BD | 3 BD |
| P4 | 1 BD | n/a | Next release |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

(BH = Business Hour, BD = Business Day)

<!-- PAGE_BREAK -->

## 6. Giờ & Kênh Hỗ trợ / Support Hours & Channels

<!-- FILL: service desk operating hours and preferred channels -->

**What goes here**:
- Business hour definition (timezone, local public holidays).
- Channels per priority: phone for P1, portal for all, email for P3/P4.
- Language support (VI/EN).

**Example structure**:

| Channel | Availability | Use Case | Language |
|---|---|---|---|
| Phone hotline | 24x7 (Enterprise) | P1 / P2 only | VI, EN |
| Service portal | 24x7 | All priorities | VI, EN |
| Dedicated Teams channel | 24x7 (Enterprise) | All incidents | VI, EN |
| Email | 24x7 (best effort) | P3 / P4 | VI, EN |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 7. Phương pháp Đo lường / Measurement Methodology

<!-- FILL: how each SLA metric is calculated and reported -->

**What goes here**:
- Data source per metric (Prometheus, ServiceNow, batch logs).
- Calculation formula and exclusion rules (scheduled maintenance, force majeure).
- Reporting tool / portal used to share results with client.

**Example structure**:

| Metric | Source | Formula | Exclusions |
|---|---|---|---|
| Availability | Synthetic probe + Prom | Uptime minutes / Scheduled minutes | Planned maintenance |
| P95 latency | Prometheus histogram | quantile(0.95, http_latency) | Client-side latency |
| Ticket response | ServiceNow | `first_response_ts − created_ts` | Out-of-scope tickets |
| Batch completion | Airflow logs | On-time runs / total runs | Upstream data delays |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 8. Báo cáo / Reporting

<!-- FILL: reporting package delivered to the client -->

**What goes here**:
- Monthly operations report contents and delivery date.
- Dashboard access (read-only portal) for client.
- Quarterly service review agenda.

**Monthly Report Contents**:

| # | Section | Owner |
|---|---|---|
| 1 | Executive summary + SLA achievement table | Service Mgr |
| 2 | Incidents by priority with RCA summaries | Service Mgr |
| 3 | Change activity + success rate | Release Mgr |
| 4 | Capacity & utilisation trend | SRE Lead |
| 5 | Security events summary | Security Lead |
| 6 | Open risks & issues | Service Mgr |
| 7 | Upcoming maintenance & roadmap | Service Mgr |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 9. Tín dụng Dịch vụ / Service Credits

<!-- FILL: penalty structure for SLA miss -->

**What goes here**:
- Credit formula as % of monthly service fee tied to SLA achievement tiers.
- Claim process: written request within X business days with evidence.
- Maximum monthly credit cap.

**Credit Table (Availability)**:

| Monthly Availability | Credit |
|---|---|
| ≥ 99.9% | 0% |
| 99.5% – < 99.9% | 5% of monthly fee |
| 99.0% – < 99.5% | 10% of monthly fee |
| 98.0% – < 99.0% | 20% of monthly fee |
| < 98.0% | 30% of monthly fee (cap) |

**Credit Table (P1 Response)**:

| P1 Avg Response | Credit |
|---|---|
| ≤ 15 min | 0% |
| 15 – 30 min | 3% |
| 30 – 60 min | 5% |
| > 60 min | 10% |

**Claim Process**:

| # | Step | Timing |
|---|---|---|
| 1 | Client submits claim with evidence | Within 10 BD of month-end |
| 2 | Vendor validates against monitoring data | Within 5 BD |
| 3 | Credit applied on next invoice | Next billing cycle |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 10. Quy trình Leo thang / Escalation Process

<!-- FILL: named contacts at each tier -->

**What goes here**:
- Escalation tiers from service desk → service manager → delivery director → vendor CEO.
- Trigger conditions and SLA per tier.
- Reciprocal client contacts at each tier.

**Example structure**:

| Tier | Vendor Contact | Client Contact | Trigger | SLA |
|---|---|---|---|---|
| T1 | Service Desk | IT Ops Lead | P1 raised | 15 min |
| T2 | Service Manager | IT Service Lead | P1 > 1h | 30 min |
| T3 | Delivery Director | CIO | P1 > 4h | 1h |
| T4 | Vendor Sponsor | CEO Office | P1 > 12h | 2h |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 11. Cửa sổ Bảo trì / Maintenance Windows

<!-- FILL: permitted maintenance windows and blackout calendar -->

**What goes here**:
- Standard weekly / monthly maintenance windows (excluded from availability calculation).
- Blackout periods where no change is permitted.
- Advance notice required per window type.

**Example structure**:

| Window Type | Schedule | Notice | Included in Availability |
|---|---|---|---|
| Weekly minor | Sunday 03:00–05:00 ICT | 3 BD | Excluded |
| Monthly major | 1st Saturday 02:00–06:00 | 10 BD | Excluded |
| Emergency | Any time | 1h if possible | Included |
| Blackout (month-end) | Last 2 BD of month | n/a | n/a |
| Blackout (Tet) | Per annual calendar | n/a | n/a |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 12. Rà soát & Điều chỉnh SLA / SLA Review & Adjustment Process

<!-- FILL: formal review cadence and change process -->

**What goes here**:
- Quarterly review meeting agenda.
- Criteria for adjusting SLA targets (maturing service, new business needs).
- Change control for SLA amendments (signed addendum).

**Example structure**:

| Activity | Cadence | Participants | Output |
|---|---|---|---|
| Monthly service review | Monthly | Service Mgr + Client Ops | Minutes + action log |
| Quarterly business review | Quarterly | Exec sponsors + delivery | SLA trend + roadmap |
| Annual SLA review | Yearly | Sponsors + legal | Signed amendment if needed |
| Ad-hoc adjustment | On-demand | Both PMs | Signed addendum |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 13. Ký xác nhận / Sign-off

<!-- FILL: formal signatures binding both parties -->

**What goes here**:
- Named authorised signatories per party.
- Signature block with date.
- Revision history table for future amendments.

| Role | Name | Signature | Date |
|---|---|---|---|
| Client Authorised Signatory | <!-- FILL --> | _______________ | ____ |
| Client Service Owner | <!-- FILL --> | _______________ | ____ |
| Vendor Delivery Director | <!-- FILL --> | _______________ | ____ |
| Vendor Service Manager | <!-- FILL --> | _______________ | ____ |

**Revision History**:

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | {{facts.doc.date}} | <!-- FILL --> | Initial SLA |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
