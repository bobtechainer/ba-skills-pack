---
name: User Requirements Document
audience: Product, Engineering, Stakeholders
typical-length: 5-12 pages
format-options: [docx, md, pdf]
tokens: [PROJECT_NAME, CLIENT_NAME, AUTHOR, DATE_ISO, VERSION]
---

# {{PROJECT_NAME}} — User Requirements Document

**Version**: {{VERSION}}
**Date**: {{DATE_ISO}}
**Author**: {{AUTHOR}}
**Client**: {{CLIENT_NAME}}

---

## 1. Introduction

<!-- 2-3 paragraphs: What system/product, why it exists, who it serves -->

### 1.1 Purpose
<!-- What this document describes and why -->

### 1.2 Scope
<!-- What's in scope and what's explicitly out of scope -->

### 1.3 Definitions & Acronyms
<!-- Table of terms used in this document -->

## 2. User Personas

<!-- 2-4 personas. Each: name, role, goals, pain points, technical skill level -->

### Persona 1: {Name}
- **Role**: {role}
- **Goals**: {what they want to achieve}
- **Pain Points**: {current frustrations}
- **Tech Level**: {basic / intermediate / advanced}

## 3. User Stories

<!-- Format: As a [persona], I want [action], so that [benefit] -->
<!-- Priority: P0 (must), P1 (should), P2 (nice), P3 (future) -->

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|-------------------|
| US-001 | As a [persona], I want [action], so that [benefit] | P0 | {measurable criteria} |

## 4. Functional Requirements

<!-- Each requirement: unique ID, description, priority, source -->

| ID | Requirement | Priority | Source | Notes |
|----|------------|----------|--------|-------|
| FR-001 | {description} | P0 | {persona/stakeholder} | |

## 5. Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|------------|--------|
| NFR-001 | Performance | {description} | {e.g., < 200ms response} |
| NFR-002 | Security | {description} | {e.g., AES-256 encryption} |
| NFR-003 | Availability | {description} | {e.g., 99.9% uptime} |

## 6. Constraints & Assumptions

<!-- Technical, business, or regulatory constraints -->
<!-- Assumptions that requirements are based on -->

## 7. Dependencies

<!-- External systems, third-party services, other teams -->

## 8. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| Stakeholder | | | |
