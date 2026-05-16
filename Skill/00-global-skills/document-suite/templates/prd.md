---
name: Product Requirements Document
audience: Engineering, Product, Design
typical-length: 8-15 pages
format-options: [docx, md, pdf]
tokens: [PROJECT_NAME, CLIENT_NAME, AUTHOR, DATE_ISO, VERSION]
---

# {{PROJECT_NAME}} — Product Requirements Document

**Version**: {{VERSION}}
**Date**: {{DATE_ISO}}
**Author**: {{AUTHOR}}
**Client**: {{CLIENT_NAME}}

---

## 1. Overview

<!-- 2-3 paragraphs. What is this product/feature? Why build it? -->

## 2. Problem Statement

<!-- Specific user/business problems. Data-backed where possible. -->
<!-- Format: "Today, [who] struggles with [what], causing [impact]" -->

## 3. Goals & Success Metrics

| Goal | Metric | Target | Measurement Method |
|------|--------|--------|-------------------|
| {goal} | {KPI} | {number} | {how to measure} |

## 4. User Stories

<!-- As a [role], I want [capability], so that [benefit] -->

| ID | Story | Priority | Sprint |
|----|-------|----------|--------|
| US-001 | As a [role], I want [action], so that [benefit] | P0 | M1 |

## 5. Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria | Dependencies |
|----|------------|----------|-------------------|-------------|
| FR-001 | {description} | P0 | {criteria} | |
| FR-002 | {description} | P1 | {criteria} | FR-001 |

## 6. Non-Functional Requirements

| Category | Requirement | Target |
|----------|------------|--------|
| Performance | {description} | {e.g., p99 < 500ms} |
| Scale | {description} | {e.g., 10K concurrent users} |
| Security | {description} | {e.g., OWASP compliant} |
| Reliability | {description} | {e.g., 99.9% uptime} |

## 7. Design & UX

<!-- Wireframe references, key UX flows, design principles -->
<!-- Link to Figma/design files if available -->

## 8. Technical Approach

<!-- High-level architecture decisions -->
<!-- API design considerations -->
<!-- Data model overview -->

## 9. Release Plan

| Phase | Scope | Timeline | Dependencies |
|-------|-------|----------|-------------|
| Alpha | {features} | {date} | |
| Beta | {features} | {date} | Alpha feedback |
| GA | {features} | {date} | Beta metrics |

## 10. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| {risk} | High/Med/Low | High/Med/Low | {action} |

## 11. Open Questions

<!-- Unresolved decisions that need stakeholder input -->

## 12. Appendix

<!-- Supporting data, research, competitive analysis -->
