<!--
Template: runbook — Operations Runbook / Sổ tay Vận hành
Standard: ITIL 4 Service Operation + Google SRE
Skill:    banking-docs
Version:  2.0.0
Usage:    node scripts/build_doc.js <folder> --brand <vendor> --client <client>
-->

# Sổ tay Vận hành / Operations Runbook

**Project**: {{facts.project.name}} — {{facts.project.code}}
**Client**: {{facts.client.name}}
**Vendor**: {{facts.vendor.name}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.doc.classification}}

<!-- PAGE_BREAK -->

## 1. Tổng quan Hệ thống / System Overview

<!-- FILL: 1-2 paragraph system description targeted at on-call engineers -->

**What goes here**:
- Purpose of the system, main user personas, business criticality tier.
- Hours of operation (24x7 / business hours), service tier classification.
- Pointers to architecture diagrams and SLO dashboard.

**Example structure**:

| Attribute | Value |
|---|---|
| System Name | {{facts.project.name}} |
| Criticality | Tier 1 / Tier 2 / Tier 3 |
| Hours | 24x7 |
| Architecture Diagram | <!-- FILL: link --> |
| SLO Dashboard | <!-- FILL: link --> |

<!-- PAGE_BREAK -->

## 2. Kiến trúc Tham chiếu Nhanh / Architecture Quick Reference

<!-- FILL: compact diagram / table mapping components to hosts, ports, dependencies -->

**What goes here**:
- Service inventory with version, host, port, health URL.
- Key data stores and message brokers.
- External dependencies with endpoints.

**Example structure**:

| Component | Host / Cluster | Port | Health URL | Version |
|---|---|---|---|---|
| API Gateway | prod-gw-01..03 | 8443 | /actuator/health | v{{facts.doc.version}} |
| Onboarding svc | prod-ob-* (k8s) | 8080 | /healthz | v{{facts.doc.version}} |
| KYC worker | prod-kyc-* (k8s) | 8080 | /healthz | v{{facts.doc.version}} |
| Postgres | prod-pg-primary | 5432 | `pg_isready` | 15.x |
| Kafka | prod-kafka-01..05 | 9092 | kafka-topics | 3.7 |
| Redis | prod-redis-ha | 6379 | PING | 7.x |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 3. Vận hành Hàng ngày / Daily Operations

<!-- FILL: recurring daily routine for on-call / ops team -->

**What goes here**:
- Morning health check covering all critical components.
- Backup verification from previous night.
- Log and alert review for silent failures.
- Handover notes from previous shift.

**Example structure**:

| Time | Task | Owner | Expected Output |
|---|---|---|---|
| 08:00 | Platform health check | Ops | All green dashboard |
| 08:15 | Review overnight alerts | Ops | Ticket backlog review |
| 08:30 | Backup verification | DBA | Last 24h backups OK |
| 09:00 | Daily stand-up | All | Handover complete |
| 17:00 | End-of-day summary | Ops Lead | Shift report posted |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 4. Tác vụ Thường gặp / Common Tasks

<!-- FILL: commands to start / stop / restart / scale / reload config -->

**What goes here**:
- Standard operational procedures per service.
- Commands for scale up/down, graceful restart, config reload.
- Pre-checks before and validation after each operation.

**Example structure**:

| Task | Service | Command | Pre-check | Post-check |
|---|---|---|---|---|
| Restart | Onboarding svc | `kubectl rollout restart deploy/onboarding -n prod` | No ongoing batch | Pods Ready |
| Scale out | KYC worker | `kubectl scale deploy/kyc --replicas=10 -n prod` | Queue depth trend | Throughput rises |
| Scale in | KYC worker | `kubectl scale deploy/kyc --replicas=5 -n prod` | Queue depth low | No stuck messages |
| Reload config | API Gateway | `kubectl rollout restart deploy/gateway -n prod` | Config validated | Health URL OK |
| Drain node | K8s node | `kubectl drain <node> --ignore-daemonsets` | Replacement ready | Workloads rescheduled |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 5. Giám sát & Cảnh báo / Monitoring & Alerts

<!-- FILL: dashboards, alert channels, SLO definitions -->

**What goes here**:
- SLI / SLO definitions per service (availability, latency, error rate).
- Dashboard links and key panels.
- Alert routing (PagerDuty / OpsGenie / Teams) and severity mapping.

**SLO Table**:

| Service | SLI | SLO | Measurement Window |
|---|---|---|---|
| API Gateway | Availability | 99.9% | 30d rolling |
| API Gateway | P95 latency | < 400ms | 30d rolling |
| Onboarding svc | Success rate | > 99.5% | 30d rolling |
| KYC worker | Queue latency | < 5 min P95 | 30d rolling |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

**Alert Routing**:

| Severity | Channel | Response SLA |
|---|---|---|
| P0 | PagerDuty + phone call | 15 min |
| P1 | PagerDuty + Teams | 30 min |
| P2 | Teams channel | 2h |
| P3 | Email digest | Next business day |

<!-- PAGE_BREAK -->

## 6. Playbooks Ứng phó Sự cố / Incident Response Playbooks

<!-- FILL: one playbook per severity class -->

**What goes here**:
- Definition of each severity tier with examples.
- First 15 minutes actions (triage, communication, containment).
- Named commander per severity and escalation path.

**Severity Definitions**:

| Severity | Definition | Example |
|---|---|---|
| P0 | Total outage or data loss | Login down for all users |
| P1 | Major degradation, no workaround | Onboarding > 50% failing |
| P2 | Partial degradation, workaround exists | One region slow |
| P3 | Minor issue, no user impact | Log warnings spike |

**P0 Playbook — First 15 Minutes**:

| Min | Action | Owner |
|---|---|---|
| 0 | Acknowledge alert in PagerDuty | On-call |
| 2 | Open war-room Teams channel | On-call |
| 5 | Post status in #status-updates | Incident Commander |
| 10 | Identify change correlation (last deploy?) | On-call + SRE |
| 15 | Decide containment: rollback / failover / scale | Incident Commander |

**P1 Playbook**:

| Min | Action | Owner |
|---|---|---|
| 0 | Acknowledge | On-call |
| 5 | Diagnose impacted service via dashboard | On-call |
| 15 | Mitigation in progress + notify stakeholders | Incident Commander |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 7. Hướng dẫn Khắc phục Sự cố / Troubleshooting Guides

<!-- FILL: catalogue of common failures with resolution steps -->

**What goes here**:
- Symptom → probable cause → diagnostic command → resolution.
- One entry per recurring issue observed in previous quarters.
- Link to Grafana panels / Loki queries that confirm diagnosis.

**Example structure**:

| Symptom | Probable Cause | Diagnostic | Resolution |
|---|---|---|---|
| 5xx spike on gateway | Upstream svc down | Check `onboarding` pods | Restart or scale pods |
| High DB CPU | Missing index on new query | `pg_stat_statements` | Add index, notify dev |
| Kafka consumer lag | Worker crashed / slow | `kafka-consumer-groups describe` | Restart worker, scale out |
| KYC callback timeout | 3rd-party API slow | Check provider status page | Fail over to secondary provider |
| SSO login failing | Token mis-config | Decode JWT, check clock skew | Resync NTP / rotate key |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 8. Ma trận Leo thang / Escalation Matrix

<!-- FILL: on-call rotation and escalation path -->

**What goes here**:
- On-call rotation primary / secondary per tier (L1 / L2 / L3).
- Named managers and directors with response SLA.
- External vendor support hotlines with contract numbers.

**Example structure**:

| Tier | Role | Primary | Secondary | SLA |
|---|---|---|---|---|
| L1 | Ops on-call | <!-- FILL --> | <!-- FILL --> | 15 min |
| L2 | SRE / App on-call | <!-- FILL --> | <!-- FILL --> | 30 min |
| L3 | Engineering Mgr | <!-- FILL --> | <!-- FILL --> | 1h |
| Exec | Director of Tech | <!-- FILL --> | <!-- FILL --> | 2h |
| Vendor | 3rd-party support | Phone + ticket | <!-- FILL --> | Per contract |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 9. Thủ tục Khôi phục Thảm họa / Disaster Recovery Procedures

<!-- FILL: DR objectives, scenarios, and step-by-step recovery -->

**What goes here**:
- RTO / RPO targets per service tier.
- DR scenarios (data-centre loss, database corruption, region failure).
- Step-by-step failover with verification and business sign-off.

**DR Targets**:

| Service Tier | RTO | RPO |
|---|---|---|
| Tier 1 (core) | 1h | 5 min |
| Tier 2 (support) | 4h | 1h |
| Tier 3 (batch) | 8h | 4h |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

**DR Scenario — DB Corruption**:

| # | Step | Owner | ETA |
|---|---|---|---|
| 1 | Declare DR event, notify sponsors | Incident Commander | 5m |
| 2 | Freeze writes / enable maintenance | SRE | 5m |
| 3 | Identify last clean PITR checkpoint | DBA | 15m |
| 4 | Restore from backup to standby | DBA | 45m |
| 5 | Reconcile transactions since checkpoint | DBA + App team | 30m |
| 6 | Resume service + business verification | SRE + Client | 15m |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 10. Lập kế hoạch Dung lượng / Capacity Planning

<!-- FILL: signals and thresholds driving capacity changes -->

**What goes here**:
- Baseline metrics per component (CPU, memory, IOPS, connections).
- Thresholds at which to scale out or upgrade hardware.
- Quarterly capacity review cadence.

**Example structure**:

| Component | Metric | Warn | Critical | Action |
|---|---|---|---|---|
| App pods | CPU utilisation | 65% | 80% | HPA scale out |
| Postgres | Connections | 60% of max | 80% | Add read replica |
| Kafka | Disk usage | 70% | 85% | Increase volume |
| Redis | Memory | 70% | 85% | Scale up tier |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 11. Bảo trì Định kỳ / Scheduled Maintenance

<!-- FILL: recurring maintenance windows and procedures -->

**What goes here**:
- Weekly / monthly / quarterly recurring maintenance tasks.
- Windows, notifications, procedures, verifications.
- Evidence of completion for audit (ticket IDs, logs).

**Example structure**:

| Task | Frequency | Window | Procedure | Evidence |
|---|---|---|---|---|
| OS patching | Monthly | 1st Sunday 02:00 | Rolling node drain + patch | Ticket + patch report |
| DB vacuum / reindex | Weekly | Sunday 03:00 | Standard DB routine | DB report |
| Cert rotation | Quarterly | Per cert expiry | Rotate + deploy + verify | Cert inventory |
| Secret rotation | Quarterly | Planned window | Vault rotation playbook | Vault log |
| DR drill | Bi-annual | Planned window | Full DR scenario | Drill report |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 12. Danh bạ Liên hệ / Contact Directory

<!-- FILL: key contacts on client and vendor side, plus 3rd-party vendors -->

**What goes here**:
- Named individuals with role, email, phone, off-hours contact.
- Update cadence (at least quarterly) and owner of the directory.
- Separate vendor list with contract numbers.

**Example structure**:

| Role | Name | Email | Phone | Off-hours |
|---|---|---|---|---|
| Client Product Owner | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Client IT Ops Lead | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Vendor Service Manager | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Vendor SRE Lead | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| DB Vendor Support | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | 24x7 hotline |
| Cloud Provider TAM | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | 24x7 hotline |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
