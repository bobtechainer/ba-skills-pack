<!--
Template: proposal — Business / Technical Proposal / Đề xuất Kinh doanh & Kỹ thuật
Standard: APMP / Shipley Proposal Guide + B2B enterprise sales convention
Skill:    banking-docs
Version:  2.0.0
Usage:    node scripts/build_doc.js <folder> --brand <vendor> --client <client>
-->

# Đề xuất Giải pháp / Solution Proposal

**Project**: {{facts.project.name}} — {{facts.project.code}}
**Client**: {{facts.client.name}}
**Vendor**: {{facts.vendor.name}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.doc.classification}}

> A Shipley-style proposal is structured to score high on a buyer's evaluation matrix: it answers the RFP, evidences capability, and quantifies value. Lead with the client, prove with the vendor, close with the offer.

<!-- PAGE_BREAK -->

## 1. Tóm tắt Điều hành / Executive Summary

<!-- FILL: One-page max. Write last but place first. Mirror the client's own language from their RFP / public reports. -->

**What goes here**:
- The client's stated objective, in the client's own words
- The headline solution in one sentence (no jargon)
- Three quantified benefits the client will realise
- Total investment and payback at a glance
- Why this vendor, in 2 lines

**At-a-glance summary**:

| Dimension | Offer |
|---|---|
| Solution | <!-- FILL: e.g., "End-to-end eKYC platform" --> |
| Duration | <!-- FILL --> months from kick-off to Go-Live |
| Total Investment (3-yr TCO) | VND <!-- FILL --> |
| Expected Payback | <!-- FILL --> months |
| Headline KPI Lift | <!-- FILL: e.g., "TAT 8 min → 90 sec" --> |

<!-- PAGE_BREAK -->

## 2. Thách thức Khách hàng / Client Challenges

<!-- FILL: Demonstrate understanding. Cite the client's published strategy, recent press, or RFP text verbatim where possible. Earn the right to propose. -->

**What goes here**:
- Market context (segment trends, competitor moves, regulatory shifts)
- The 3-5 specific pain points the client articulated
- The cost of inaction (what happens if status-quo persists 12 months)
- Constraints the client operates under (legacy core, regulatory, talent)

**Pain-point map**:

| # | Challenge (As Stated by Client) | Current Cost / Impact | Root Cause |
|---|---|---|---|
| 1 | <!-- FILL: e.g., "Onboarding TAT exceeds 3 days" --> | <!-- FILL --> | <!-- FILL --> |
| 2 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| 3 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| 4 | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 3. Phương pháp / Our Approach

<!-- FILL: How we will solve the challenges above. Map each pain point to a solution lever. Show the engagement model, not just the technology. -->

**What goes here**:
- Engagement philosophy (e.g., agile pods, design-led, regulator-first)
- The 4-6 phase delivery model
- Pain-to-solution mapping (every challenge in §2 is addressed)
- Risk-adjusted differences vs. typical SI approaches

**Pain-to-solution mapping**:

| Client Challenge (from §2) | Our Lever | Mechanism |
|---|---|---|
| <!-- FILL: challenge from §2 --> | <!-- FILL: solution lever --> | <!-- FILL: mechanism --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

**Delivery phases**:

| Phase | Duration | Key Outputs |
|---|---|---|
| Discovery & Design | <!-- FILL --> wks | BRD, HLD, sprint backlog |
| Build (Sprints) | <!-- FILL --> wks | Working software, demo every 2 wks |
| SIT / UAT | <!-- FILL --> wks | Test reports, defect closure |
| Pilot | <!-- FILL --> wks | KPI evidence, regulator brief |
| Rollout & Hypercare | <!-- FILL --> wks | Production + 30-day support |

<!-- PAGE_BREAK -->

## 4. Kiến trúc Giải pháp / Solution Architecture

<!-- FILL: Show the target-state architecture at a level a CIO can review in 5 minutes. Reference the HLD doc for depth. -->

**What goes here**:
- One target-state diagram (insert mermaid or PNG reference)
- Key components and their role (5-8 bullets)
- Integration touchpoints with the client's core / channels
- Non-functional posture (security, scale, availability targets)

**Component overview**:

| Layer | Component | Purpose | Build / Buy |
|---|---|---|---|
| Channel | Mobile SDK | <!-- FILL: purpose --> | <!-- FILL: build/buy --> |
| API | Identity Orchestrator | Workflow + decisioning | Build on platform |
| Data | Customer Vault | PII at rest, encrypted | Buy (HSM-backed) |
| Integration | Core Banking Adapter | T24 / Flexcube bridge | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

**NFR posture (headline)**:

| NFR | Target |
|---|---|
| Availability | 99.95% per quarter |
| Peak throughput | <!-- FILL --> tps |
| End-to-end latency | < <!-- FILL --> ms p95 |
| Data residency | Onshore VN, primary + DR |

<!-- PAGE_BREAK -->

## 5. Đội ngũ / Team & Qualifications

<!-- FILL: Name the people who will actually deliver. Buyers buy teams, not logos. Include CVs in the appendix and reference here. -->

**What goes here**:
- Org chart (text or diagram) showing roles + reporting lines
- Named key personnel with relevant banking project history
- Bench strength (how we backfill if someone leaves)
- Vendor company credentials: years in market, banking clients, certifications

**Key personnel**:

| Role | Name | Relevant Banking Experience | Allocation |
|---|---|---|---|
| Engagement Director | <!-- FILL --> | <!-- FILL: e.g., "12 yrs, led VPB digital onboarding 2022" --> | 30% |
| Solution Architect | <!-- FILL --> | <!-- FILL --> | 80% |
| Tech Lead | <!-- FILL --> | <!-- FILL --> | 100% |
| BA Lead | <!-- FILL --> | <!-- FILL --> | 100% |
| QA Lead | <!-- FILL --> | <!-- FILL --> | 80% |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

**Vendor credentials**:
- {{facts.vendor.name}} delivered <!-- FILL: # --> banking projects since <!-- FILL: year -->
- Certifications: <!-- FILL: e.g., ISO 27001, SOC 2 Type II, PCI-DSS L1 service provider -->
- Reference clients: <!-- FILL --> (full case studies in Appendix A)

<!-- PAGE_BREAK -->

## 6. Lộ trình / Timeline & Milestones

<!-- FILL: A Gantt-style timeline at milestone resolution. Use weeks-from-kickoff so dates remain valid through negotiation. -->

**Milestone schedule**:

| Week | Milestone | Owner | Gate |
|---|---|---|---|
| W0 | Contract effective + kickoff | Joint | PO issued |
| W4 | BRD baselined | Vendor BA | Client sign-off |
| W8 | HLD + LLD approved | Vendor Arch | IT review board |
| W<!-- FILL --> | First demo | Vendor | Sprint review |
| W<!-- FILL --> | SIT exit | Vendor QA | 0 Sev-1 |
| W<!-- FILL --> | UAT exit | Client | UAT pass |
| W<!-- FILL --> | Pilot Go-Live | Joint | DR drill |
| W<!-- FILL --> | Full rollout | Joint | Pilot KPI met |

> A working Gantt chart is provided as Appendix B.

<!-- PAGE_BREAK -->

## 7. Báo giá / Pricing

<!-- FILL: Transparent, defensible pricing. Break down by category and timing. State currency, taxes, and validity period explicitly. -->

**Commercial summary** (VND, exclusive of VAT):

| Line Item | Unit | Qty | Unit Price | Total |
|---|---|---|---|---|
| Platform licence (annual) | per env | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Implementation services | man-month | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Mobile SDK licence | per app | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |
| Hypercare (3 months) | fixed | 1 | <!-- FILL --> | <!-- FILL --> |
| Training (8 sessions) | fixed | 1 | <!-- FILL --> | <!-- FILL --> |
| **Sub-total** | | | | <!-- FILL --> |
| Optional: AMC (Year 2+, % of licence) | annual | | 18% | <!-- FILL --> |

**Payment milestones**:

| Trigger | % |
|---|---|
| Contract signature | 20% |
| BRD sign-off | 15% |
| UAT entry | 25% |
| Pilot Go-Live | 25% |
| Full rollout + acceptance | 15% |

> Quote validity: 90 days from {{facts.doc.date}}. Currency: VND. Taxes additional per VAS.

<!-- PAGE_BREAK -->

## 8. Giả định & Loại trừ / Assumptions & Exclusions

<!-- FILL: Be explicit. Every assumption you don't write down becomes a change request later (and a margin leak). -->

**Assumptions** (must hold for the price/timeline to stand):
- Client provides <!-- FILL --> SMEs at <!-- FILL -->% allocation throughout build
- Core banking sandbox accessible by W<!-- FILL --> with documented APIs
- Regulatory approvals (SBV) sought by client; vendor supports drafting
- Non-prod environments provisioned by client by W2
- <!-- FILL --> 

**Exclusions** (NOT in the price):
- Hardware procurement (HSM, load balancers)
- Third-party data licences (e.g., national ID lookup fees)
- Production hosting infrastructure costs
- Penetration testing by external auditor (vendor will support)
- <!-- FILL --> 

<!-- PAGE_BREAK -->

## 9. Lý do Chọn / Why Us

<!-- FILL: 4-6 differentiators, each backed by evidence. Avoid generic claims like "we are passionate". -->

**Our differentiators**:

| # | Claim | Evidence |
|---|---|---|
| 1 | <!-- FILL: e.g., "Only vendor with NFC eKYC live in 3 VN banks" --> | <!-- FILL: client names + Go-Live dates --> |
| 2 | <!-- FILL --> | <!-- FILL --> |
| 3 | <!-- FILL --> | <!-- FILL --> |
| 4 | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 10. Bước Tiếp theo / Next Steps

<!-- FILL: Make it easy for the buyer to say yes. Propose the very next meeting with date and attendees. -->

**Proposed next 30 days**:

| Day | Action | Vendor Owner | Client Owner |
|---|---|---|---|
| D+3 | Clarification workshop | Engagement Director | Procurement |
| D+10 | Reference call with <!-- FILL --> | Engagement Director | CIO office |
| D+15 | Commercial negotiation | Account Director | Procurement |
| D+25 | Contract draft circulated | Legal | Legal |
| D+30 | Signature target | All | All |

> Single point of contact: <!-- FILL: name, title, email, phone -->

<!-- PAGE_BREAK -->

## 11. Phụ lục / Appendix

<!-- FILL: List the supporting attachments. Keep the body of the proposal lean; depth lives here. -->

**Appendix index**:

| Ref | Title | Pages |
|---|---|---|
| A | Reference case studies | <!-- FILL --> |
| B | Detailed Gantt chart | <!-- FILL --> |
| C | Key personnel CVs | <!-- FILL --> |
| D | Vendor certifications | <!-- FILL --> |
| E | Sample SLA terms | <!-- FILL --> |
| F | Security & compliance posture | <!-- FILL --> |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

---

**Document Control**

| Version | Date | Author | Change Summary |
|---|---|---|---|
| 0.1 | <!-- FILL --> | <!-- FILL --> | Initial draft |
| 1.0 | {{facts.doc.date}} | {{facts.vendor.name}} | Issued for client review |
