# TOGAF + 4+1 View — High Level Design (HLD)

Practical cheat sheet for HLD following TOGAF ADM and Kruchten's 4+1 architectural view model.

## Mục đích HLD

HLD trả lời **"Hệ thống sẽ xây dựng như thế nào về mặt kiến trúc tổng thể?"**. Nó bắc cầu từ SRS (gì phải làm) sang LLD (mỗi module viết như thế nào).

Audience: Solution architects, tech leads, senior developers, client technical review board, security architects.

## Cấu trúc HLD chuẩn

1. **Introduction** — Purpose, scope, audience, references (SRS, BRD).
2. **Architecture Vision & Goals** — What the architecture optimizes for (performance? cost? time-to-market?). Non-goals are as important.
3. **Architecture Principles** — Design principles (stateless services, eventual consistency OK, DB per service, etc.) + constraints from SRS/client.
4. **Context View / Business Architecture** — Actors, external systems, business processes served.
5. **Logical View** (4+1) — Components, modules, subsystems, interfaces. Language-agnostic.
6. **Process View** (4+1) — Concurrency, processes, threads, communication patterns, synchronization.
7. **Physical View / Deployment View** (4+1) — Hardware, cloud zones, network topology, capacity planning.
8. **Scenarios View** (4+1, +1) — Key use case walkthroughs that exercise the architecture.
9. **Technology Stack** — Languages, frameworks, databases, middleware, with rationale.
10. **Integration Architecture** — Upstream/downstream system integrations, APIs, message formats, error handling.
11. **Data Architecture** — High-level data model, data flow, data ownership, data classification.
12. **Security Architecture** — Authn, authz, encryption, network segmentation, threat model summary (full in Security Plan).
13. **Operations & Observability** — Logging, monitoring, alerting, deployment strategy, rollback.
14. **NFR → Design Decisions** — For each NFR in SRS, document which design choice satisfies it.
15. **Risks & Mitigations** — Architectural risks, tech debt accepted, assumptions to validate.
16. **Appendices** — Diagrams (C4, sequence, ER).

## 4+1 View model (Kruchten 1995)

The 4+1 view model structures HLD around five concerns, each answering a different stakeholder question:

| View | Question | Stakeholder | Diagrams |
|---|---|---|---|
| **Logical** | What are the functional components? | Developers | Component, class |
| **Process** | How do components communicate at runtime? | Integrators, perf engineers | Sequence, activity |
| **Physical (Deployment)** | Where does each component run? | Ops, SRE | Deployment, network |
| **Development** | How is code organized? | Devs, build engineers | Package, module |
| **+1: Scenarios** | How do the views hang together for real use cases? | Everyone | Use case, sequence |

## C4 model (recommended concrete technique)

TOGAF/4+1 is abstract. **C4 model** by Simon Brown is the concrete diagramming technique used in practice:

1. **Level 1: System Context** — System box + external actors/systems. 1 diagram total.
2. **Level 2: Containers** — Applications, databases, message brokers inside the system. 1 diagram.
3. **Level 3: Components** — Components inside each container. 1 diagram per container (optional).
4. **Level 4: Code** — Class/sequence diagrams (usually skipped in HLD, covered in LLD).

For banking projects: **always produce at least C1 (Context) and C2 (Containers)**. C3 for complex systems only.

## Diagram conventions (Mermaid / PlantUML)

Store `.mmd` source + `.png` rendered together. Reference in markdown:

```markdown
<!-- DIAGRAM:system_context.png C1 System Context: [Project Name] ↔ [Client] core services -->
<!-- DIAGRAM:containers.png C2 Container view: FastAPI + Next.js + Phaser + Redis + Postgres -->
<!-- DIAGRAM:components.png C3 Component view of the Rule Engine container -->
<!-- DIAGRAM:deployment.png Deployment to [Client] Data Center primary + DR site -->
```

## Technology stack justification — always required

For each technology choice:

```
Technology: FastAPI (Python 3.11)
Rationale: (a) Async I/O matches game event load profile; (b) Type hints via pydantic
           match team's Python skill; (c) OpenAPI generation built-in, simplifies
           API Spec delivery.
Alternatives considered: Go + gin (rejected: team Python-first), Node.js + NestJS
           (rejected: already have Python analysts on team).
Risks: GIL may limit CPU-bound work; mitigation: keep Rule Engine I/O-bound, offload
       heavy computation to background workers.
```

Never just list "We use X". Always X **+ rationale + alternatives + risks**.

## NFR → architecture mapping

One of the most valuable sections in HLD. For each NFR in SRS §5, document the architectural decision:

| NFR | Target | Architectural decision | Verification |
|---|---|---|---|
| NFR-PERF-001 | API p99 < 2s | Redis cache for /wallet reads, async Rule Engine, CDN for static assets | Load test scenario LT-01 |
| NFR-AVAIL-001 | 99.9% uptime | Active-passive HA, 2 app nodes, DB streaming replication, auto-failover < 30s | Chaos test CT-01 |
| NFR-SEC-003 | Audit log retention 1 year | Append-only log table, daily archive to S3, 365-day lifecycle policy | Compliance audit |

## Pitfalls

- **No non-goals** — HLD that doesn't say what the architecture is NOT optimizing for is a wish list, not a design.
- **No decision log** — Architecture changes during build. Without ADRs (Architecture Decision Records) the rationale is lost.
- **C1/C2 missing** — If you can't draw the context and container diagram, you don't have an architecture yet.
- **No mapping to NFRs** — If every NFR isn't tied to an architectural decision, the NFR is either wishful or the architecture is under-designed.
- **Stack without rationale** — "We use Kafka" without justification is cargo-cult architecture.

## References

- TOGAF 9.2 ADM Phase C (Information Systems Architecture)
- Philippe Kruchten, "The 4+1 View Model of Architecture" (IEEE Software, 1995)
- Simon Brown, *Software Architecture for Developers* (C4 model)
- ISO/IEC/IEEE 42010:2011 — Architecture description
- Michael Nygard, *Release It!* (2nd ed., 2018) — for operational concerns
