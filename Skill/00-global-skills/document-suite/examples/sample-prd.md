# Sample PRD — Task Management System

> This is an example output from docs-pro using the PRD template.

---

# Product Requirements Document: TaskFlow

**Version:** 1.0
**Date:** 2025-04-06
**Author:** Product Team
**Status:** Draft

---

## 1. Problem Statement

Development teams at Techainer currently use a combination of spreadsheets, chat threads, and sticky notes to track project tasks. This leads to:
- Lost context when handoffs occur between shifts
- No single source of truth for task status
- Difficulty tracking time spent per client project for billing

**Target users:** Project managers and team leads at Techainer (internal tool first).

---

## 2. User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|-----------|----------|
| US-01 | Project Manager | Create tasks with assignee, deadline, priority | Team knows what to do | P0 |
| US-02 | Team Lead | See all tasks in a Kanban board | I can track progress visually | P0 |
| US-03 | Developer | Update task status via drag-and-drop | Minimal friction in reporting | P0 |
| US-04 | PM | Filter tasks by project, assignee, status | I can focus on what matters | P1 |
| US-05 | PM | Export task report as PDF | I can share with clients | P1 |
| US-06 | Admin | Set up project templates | New projects start fast | P2 |

---

## 3. Functional Requirements

### FR-01: Task CRUD
- Create, read, update, delete tasks
- Fields: title, description, assignee, deadline, priority (P0-P3), status (Todo/In Progress/Review/Done)
- Required: title, assignee
- Auto-generated: ID, created_at, updated_at

### FR-02: Kanban Board
- 4 columns matching status values
- Drag-and-drop to change status
- Real-time update (WebSocket)
- Max 100 tasks per board view

### FR-03: Filtering & Search
- Filter by: project, assignee, priority, status, deadline range
- Full-text search on title and description
- Save filter presets

### FR-04: PDF Export
- Export current filtered view as PDF
- Include: task table, summary stats, date range
- Format: A4, landscape, branded header

---

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Page load time | < 2 seconds (P95) |
| NFR-02 | Concurrent users | 50 (internal tool) |
| NFR-03 | Availability | 99.5% (business hours) |
| NFR-04 | Data retention | 3 years |
| NFR-05 | Authentication | OAuth 2.0 via Google (internal) |

---

## 5. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Adoption rate | 80% of PMs within 30 days | Active user logins |
| Task completion visibility | 95% of tasks have status updated within 24h | Status update timestamps |
| Time to create task | < 30 seconds | Time from "new task" to save |
| PDF exports per week | > 10 | Export event tracking |

---

## 6. Out of Scope (v1)

- Mobile native app (responsive web only)
- Time tracking / timesheets
- Client portal access
- Integration with external tools (Jira, Slack)
- Automated task assignment (AI-based)
