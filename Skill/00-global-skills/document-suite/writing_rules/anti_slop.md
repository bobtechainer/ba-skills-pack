# Anti-Slop Rules for Banking Documentation

Banking auditors, regulators, and engineers can smell AI-generated filler from a mile away. If your doc has any of the following, **delete and rewrite**.

## Banned phrases (hard delete)

Remove any sentence containing:

- "In today's fast-paced world" / "trong thế giới số hóa ngày nay"
- "Leveraging cutting-edge technology" / "tận dụng công nghệ tiên tiến"
- "Industry-leading solution" / "giải pháp hàng đầu"
- "Robust and scalable" / "mạnh mẽ và có khả năng mở rộng" (say **what** scales, by how much)
- "Best-in-class" / "tốt nhất trong ngành"
- "Seamless integration" / "tích hợp liền mạch" (say **which systems**, **via what protocol**)
- "User-friendly interface" / "giao diện thân thiện" (say **what interaction**, **what accessibility level**)
- "Comprehensive solution" / "giải pháp toàn diện"
- "Empower our customers" / "trao quyền cho khách hàng"
- "Mission-critical" (without defining criticality tier)
- "Best practices" (without citing which practice and which source)
- "Future-proof" / "đón đầu tương lai"
- "Synergy" / "synergize" / "cộng hưởng"
- "Ecosystem" when you mean "integration" or "dependency graph"
- "Holistic" — in 99% of cases means nothing
- "Next-generation" / "thế hệ mới"
- "Journey" / "hành trình" — only if literal (customer onboarding journey is OK; "journey of transformation" is not)
- "Unlock value" / "mở khóa giá trị"
- "Deliver impact" without a measured metric
- "At the heart of" / "core to our DNA"

## Banned patterns

### Vague quantifiers

❌ "The system will be highly scalable"
✅ "The system must sustain 50,000 concurrent users and 2,000 TPS at p99 < 2s"

❌ "Significant improvement in performance"
✅ "Response time reduced from 4.2s to 1.8s (57% improvement) on the GET /wallet endpoint"

❌ "A large number of transactions"
✅ "3.2 million transactions per day, peak 120 TPS"

### Capability claims without evidence

❌ "The vendor has extensive experience in banking"
✅ "The vendor has delivered 3 digital banking projects for Tier-1 Vietnamese banks (2023–2025), with aggregate uptime of 99.94%"

### Flabby openers

Delete these sentence starters:
- "It is important to note that..."
- "In order to ensure that..."
- "This document serves to describe..."
- "The purpose of this document is to..." (rewrite as bold declarative statement)

### Redundant pairs

Pick one, not both:
- "Safe and secure" → "secure"
- "Full and complete" → "complete"
- "Each and every" → "every"
- "Terms and conditions" → keep (legal term of art)
- "Null and void" → keep (legal term of art)

## Claim → Evidence discipline

Every non-trivial claim in a doc must cite:
1. A standard (RFC 2119, IEEE 830, ISO 27001 control A.x.x.x, Thông tư 09/2020 Điều x)
2. A measurement (SLA threshold, test case ID, metric name)
3. A source document (BRD §X, SRS §Y, prior incident postmortem)
4. A decision record (ADR-xxx, meeting minute MoM-xxx)

If you can't cite, the claim is opinion, not requirement.

## "So what" test

After writing each paragraph, ask: **"If I delete this, does the reader lose information needed to act?"**

If the answer is no, delete it.

## Quality checklist (pre-submit)

Before handing a doc to client review:

- [ ] No banned phrases (grep for "cutting-edge", "leverage", "best-in-class", "seamless", "robust", "holistic", "ecosystem", "journey")
- [ ] Every number has a unit and a source
- [ ] Every requirement has an ID and testable criterion
- [ ] Every table has explicit header row and at least one data row (no empty tables)
- [ ] Every diagram has a caption and is referenced in the prose
- [ ] No "TBD" in the final version (if TBD, make it `TODO [owner:X, due:YYYY-MM-DD]`)
- [ ] Spell check VI + EN
- [ ] Page count reasonable for doc type (Charter 5–10 pages, BRD 20–40, SRS 30–60, HLD 20–40)
- [ ] Cross-references to other docs work (RTM generated without orphans)
- [ ] Cover + approval page + footer classification all present

If any checkbox fails, the doc is a **draft**, not a delivery.
