# IEEE 830 / ISO 29148 — Software Requirements Specification (SRS)

Practical cheat sheet for writing SRS following IEEE 830-1998 (superseded by ISO/IEC/IEEE 29148:2018, structure unchanged).

## Mục đích SRS

SRS trả lời **"Hệ thống PHẢI LÀM GÌ?"**. Nó là blueprint cho dev team, acceptance criteria cho QA, và basis cho cross-doc traceability (BRD → SRS → LLD → Test Cases).

**SRS is NOT** a design document (→ HLD/LLD), a contract (→ SOW), or a user guide (→ User Manual).

Audience: Development team, QA, architects, integrators, product owner, client technical leads.

## Cấu trúc chuẩn IEEE 830

```
1. Introduction
   1.1 Purpose
   1.2 Scope
   1.3 Definitions, Acronyms, Abbreviations
   1.4 References
   1.5 Document Organization
2. Overall Description
   2.1 Product Perspective (context diagram, major interfaces)
   2.2 Product Features (high-level capability summary)
   2.3 User Classes and Characteristics
   2.4 Operating Environment (OS, browser, device, deployment)
   2.5 Design and Implementation Constraints
   2.6 User Documentation
   2.7 Assumptions and Dependencies
3. External Interface Requirements
   3.1 User Interfaces
   3.2 Hardware Interfaces
   3.3 Software Interfaces (upstream/downstream systems)
   3.4 Communication Interfaces (protocols, formats)
4. System Features / Functional Requirements
   4.1 Feature X
       4.1.1 Description and Priority
       4.1.2 Stimulus / Response Sequences
       4.1.3 Functional Requirements (FR-XXX)
5. Non-Functional Requirements
   5.1 Performance
   5.2 Safety
   5.3 Security
   5.4 Software Quality Attributes (Reliability, Maintainability, Portability, Usability)
6. Other Requirements (Legal, Compliance, Internationalization)
Appendix A: Glossary
Appendix B: Issues List
```

## Functional Requirement format — use ONE consistently

### Format 1: IEEE "shall" sentences (recommended for banking)

```
FR-042: The Rule Engine SHALL award game rounds based on transaction
        type and amount according to the Business Rule table in BRD §5.2.

Priority: High
Source: BR-015 (BRD)
Stimulus: transaction.confirmed event from Payment Service
Response: round_awarded event published to Notification Service
           within 2 seconds (NFR-PERF-001)
Preconditions:
  - Customer has active [Client App] account
  - Transaction is flagged valid by Fraud Detection Service
Postconditions:
  - Customer wallet updated with new round count
  - Audit log entry written to transaction_ledger table
Acceptance criteria:
  - GIVEN a confirmed FD open transaction of 10,000,000 VND
    WHEN the event arrives at Rule Engine
    THEN FR-042 SHALL award 4 rounds (10M / 5M × 2)
    AND the round count SHALL be visible in GET /wallet within 2 seconds
```

### Format 2: User stories + Gherkin (alternative for agile projects)

```
FR-042 User Story:
As a customer who has opened a new FD on [Client App],
I want to receive game rounds automatically,
so that I can participate in the [Campaign Name] without manual action.

Acceptance criteria (Gherkin):
  Given a customer has opened an FD of ≥ 5,000,000 VND on [Client App]
  When the transaction is confirmed
  Then the customer wallet shall reflect ((amount / 5000000) * 2) rounds
  And the count shall update within 2 seconds
  And a notification shall be sent via the Notification Service
```

## NFR format

NFRs must be **testable**. "The system shall be user-friendly" is not an NFR — it's a wish.

```
NFR-PERF-001: The /wallet/{customer_id} API endpoint SHALL respond within
              2 seconds at p99 under a load of 2,000 TPS sustained for 10 minutes.

Verification method: Load testing with k6 or JMeter, report available
                     24 hours before UAT starts.
Source: HLD §5.1 Performance design targets
```

Categories to cover:
- **Performance**: latency (p50/p95/p99), throughput (TPS/QPS), concurrency, load spikes.
- **Scalability**: vertical/horizontal, max users, data volume, growth projection.
- **Availability**: SLA (e.g., 99.9% monthly), downtime budget (43.8 min/month @ 99.9%), scheduled maintenance windows.
- **Reliability**: MTBF, MTTR, failure modes, recovery procedures.
- **Security**: authn, authz, encryption at rest / in transit, audit log retention, session management, OWASP Top 10 mitigation, PCI-DSS if applicable.
- **Compliance**: Thông tư 09/2020/TT-NHNN, ISO 27001 controls, GDPR-equivalent if handling EU data.
- **Maintainability**: code standards, test coverage ≥ 80%, deployment frequency, rollback time.
- **Usability**: WCAG 2.1 AA accessibility, mobile responsiveness, internationalization.
- **Observability**: structured logging, distributed tracing, metrics emitted per SRE playbook.

## Requirement ID conventions

- **FR-001** to **FR-999**: Functional requirements (numbered sequentially, no gaps except for deprecated)
- **NFR-CAT-NNN**: e.g. `NFR-PERF-001`, `NFR-SEC-012`, `NFR-AVAIL-003`
- Deprecated requirements: `FR-042 [DEPRECATED v1.1 — superseded by FR-067]`. Do not reuse IDs.

## SRS pitfalls

1. **Mixing requirement levels** — FR-001 = "The system shall let users log in" vs FR-002 = "The login button shall be blue". The second is UI spec, not SRS.
2. **"And" requirements** — `FR-010: The system shall A and B and C`. Split into 3 separate FRs for traceability.
3. **Ambiguous modal verbs** — "may", "should", "could" — reserve for MAY/SHOULD per RFC 2119, everything else is MUST/SHALL.
4. **Missing source** — every FR should trace back to a BR or stakeholder request. If you can't, the FR may be gold-plating.
5. **Wishful thinking NFRs** — "The system shall be fast". Fast how? To whom? Measured when?

## References

- ISO/IEC/IEEE 29148:2018 — Requirements engineering
- IEEE 830-1998 (historical baseline)
- Karl Wiegers, *Software Requirements* (3rd ed., 2013)
- Gojko Adzic, *Specification by Example* (2011) — for Gherkin pattern
