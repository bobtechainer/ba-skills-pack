# IEEE 829-2008 — Software Test Documentation

Practical cheat sheet for Test Plan, Test Cases, Defect Reports, UAT, following IEEE 829-2008 (renamed ISO/IEC/IEEE 29119-3).

## Test Plan — Master Document

### Purpose

The Master Test Plan answers: **"Which levels of testing will we do, what is in scope, what are entry/exit criteria, who does what, and what is the schedule?"**

Audience: QA team, dev team, PM, product owner, client QA lead.

### Standard sections (IEEE 829)

1. **Test Plan Identifier** — e.g., `TP-[PROJECT]-v1.0`
2. **Introduction** — Purpose, scope, references (SRS, HLD, LLD)
3. **Test Items** — Modules, components, features being tested + build/version
4. **Features to be Tested** — Functional + NFR, with reference to FR/NFR IDs
5. **Features NOT to be Tested** — Out of scope + justification
6. **Approach** — Testing levels (unit, integration, system, UAT), types (functional, perf, security, regression), techniques (black-box, white-box, boundary, equivalence)
7. **Entry Criteria** — When each test level can start
8. **Exit Criteria** — When each test level is considered done
9. **Suspension & Resumption** — When to stop testing, when to resume
10. **Item Pass/Fail Criteria** — Per feature
11. **Test Deliverables** — Test cases, results, defect reports, summary reports
12. **Testing Tasks & Schedule** — Timeline with milestones
13. **Environmental Needs** — Hardware, software, test data, access
14. **Staffing & Training Needs** — Team structure, skill requirements
15. **Responsibilities** — RACI for test activities
16. **Risks & Contingencies** — Test risks (flaky env, data issues, tight timelines)
17. **Approvals & Sign-off**

### Testing levels hierarchy (banking project)

```
Unit Testing      → Dev team, pytest/jest, ≥80% coverage, runs in CI
Integration Test  → Dev+QA, tests across modules within same service
SIT (System Integration Testing) → QA, tests across services, uses [Client] sandbox
System Testing    → QA, end-to-end functional + NFR on staging
UAT (User Acceptance) → Business users ([Client]), tests real scenarios
Performance Test  → Perf team, k6/JMeter, load/stress/endurance/spike
Security Test     → Security team, SAST + DAST + pentest
Regression Test   → QA, automated suite run before each release
```

### Entry/Exit criteria example

**Entry criteria for SIT:**
- Unit test coverage ≥ 80% for all modules in scope
- All FR-XXX in SRS are coded and marked "Ready for SIT"
- [Client] sandbox environment available and seeded with test data
- API contracts with [Client] signed off and stable

**Exit criteria for SIT:**
- 100% of SIT test cases executed
- 0 Critical / 0 High severity defects open
- < 5 Medium severity defects open, each with mitigation plan
- Performance baseline measurements collected
- Regression suite green

## Test Case — IEEE 829 format

```
Test Case ID: TC-012
Title: Customer earns 2 rounds after opening 5M VND FD
Priority: High
Type: Functional
Feature under test: FR-042
Related BR: BR-015

Preconditions:
  - Customer account exists and is in ACTIVE state
  - Customer wallet exists with current round count = 5
  - [Client App] is logged in

Test data:
  - customer_id: C-12345
  - fd_amount: 5,000,000 VND
  - fd_term: 6 months

Test steps:
  1. Navigate to FD open screen
     Expected: Form is displayed
  2. Enter amount 5,000,000 VND, term 6 months
     Expected: Form accepts input, summary shows correct amount
  3. Tap "Confirm & Open FD"
     Expected: Transaction confirmation modal appears
  4. Confirm with OTP
     Expected: Success message, redirect to FD list
  5. Wait 2 seconds, navigate to /wallet
     Expected: Round count = 5 + 2 = 7

Expected final state:
  - wallet.round_count == 7
  - transaction_ledger has entry for FD open
  - audit_log has entry for round_awarded event

Postconditions:
  - Reset customer wallet to 5 rounds for next test run

Status: [Pass | Fail | Blocked]
Actual result: [filled during execution]
Defect reference: [BUG-XXX if fail]
Executed by: _________ Date: _________
```

## Defect Report format

```
Bug ID: BUG-001
Title: Wallet round count does not update after FD open
Severity: High
Priority: High
Status: Open
Assignee: [dev name]
Reporter: [qa name]
Environment: SIT env, build 1.0.3
Date reported: 2026-04-15

Description:
After completing an FD open transaction of 10M VND, the wallet /wallet/{id}
endpoint returns round_count=5 (unchanged) instead of round_count=9 (5+4).

Steps to reproduce:
  [same as TC-012 steps]

Expected: round_count = 9 (per FR-042)
Actual: round_count = 5 (no change)

Attachments:
  - Screenshot: wallet_screen.png
  - API response: /wallet response body
  - Server log excerpt: rule_engine.log line 4321-4367

Root cause (filled by dev):
  [after investigation]

Resolution:
  [code change, PR link]

Verification:
  [re-run TC-012, status, verified by]
```

## Severity vs Priority

- **Severity** = technical impact (Critical / High / Medium / Low). Assigned by QA.
- **Priority** = business urgency (P0 / P1 / P2 / P3). Assigned by PM or Product.

A Low-severity bug can be P0 if it blocks the launch press release. A Critical-severity bug can be P3 if it's in a feature flagged off.

## UAT (User Acceptance Testing)

UAT differs from system testing:

| Aspect | System Testing | UAT |
|---|---|---|
| Who | QA team | Business users ([Client] staff + sample customers) |
| Focus | FR/NFR per spec | Real business scenarios end-to-end |
| Pass criterion | No critical defects | Business stakeholder sign-off |
| Environment | Staging | UAT env (as-close-to-prod as possible) |
| Test data | Synthetic | Realistic (masked prod copy if allowed) |

### UAT entry criteria
- All SRS requirements implemented
- System testing complete with exit criteria met
- UAT env provisioned and stable ≥ 48h
- UAT test scenarios documented and approved by business owner
- UAT participants trained

### UAT exit criteria
- 100% UAT scenarios executed
- 0 P0 / P1 defects open
- Business owner sign-off obtained
- Pending defects tracked with go/no-go decision

## Requirements Traceability Matrix (RTM)

RTM is a deliverable, not optional. It must link:

```
BR-015 → FR-042 → HLD §6.3 (Rule Engine component) → LLD §3.2 (award_rounds function)
      → TC-012, TC-013, TC-014 → Defects: (none)
```

Generate, never hand-write. Orphans = problem.

## References

- ISO/IEC/IEEE 29119-3:2013 — Test documentation (replaces IEEE 829-2008)
- ISTQB Foundation Level Syllabus (2023)
- James Bach & Michael Bolton, "Rapid Software Testing" (exploratory complement)
