# Document Writing Profiles

Trước khi viết BẤT KỲ tài liệu nào, PHẢI xác định 3 điều:

1. **Ai đọc?** (audience) — Quyết định mức độ kỹ thuật
2. **Để làm gì?** (purpose) — Quyết định nội dung focus vào đâu
3. **Đọc xong thì sao?** (action) — Quyết định tone và call-to-action

## Cách xác định Writing Profile

### Bước 1: Xác định Audience

| Audience | Họ biết gì | Họ KHÔNG biết/quan tâm |
|----------|-----------|----------------------|
| CEO / Board | ROI, strategy, risk, market | Code, algorithm, infrastructure |
| PM / BA | Process, workflow, requirements, timeline | Implementation detail, database schema |
| Client stakeholder | Business impact, timeline, cost | Internal architecture, tool choices |
| Architect | System design, trade-offs, scalability | Business justification, user stories |
| Developer | API, data model, algorithms, libraries | Business context, market positioning |
| QA / Tester | Test cases, acceptance criteria, edge cases | Architecture decisions, business strategy |
| Ops / SRE | Deployment, monitoring, runbooks, SLA | Feature requirements, UX |
| End user | How to use, troubleshooting | Everything technical |

### Bước 2: Chọn Technical Level

| Level | Mô tả | Ví dụ được phép | Ví dụ KHÔNG được |
|-------|--------|----------------|-----------------|
| **0 — Business** | Ngôn ngữ thường ngày. Không thuật ngữ kỹ thuật. | "Hệ thống tìm câu trả lời trong 2 giây" | "pgvector HNSW index ef_search=200" |
| **1 — Conceptual** | Giải thích concept, không nói tool cụ thể. | "Hệ thống dùng AI để tìm câu trả lời liên quan" | "BM25 + vector similarity + graph traversal" |
| **2 — Architectural** | Nói component + giao tiếp, không nói implementation. | "Service A gọi Service B qua REST API" | "mammoth.js parse DOCX heading hierarchy" |
| **3 — Technical** | Full detail: library, config, code snippet. | "pgvector cosine similarity, ef_search=200" | Không giới hạn — nhưng phải clear |

### Bước 3: Chọn Tone

| Tone | Khi nào | Ví dụ |
|------|---------|-------|
| **Storytelling** | Audience không kỹ thuật. BRD, proposal, charter. | "PM Linh quản lý 3 dự án. Mỗi sáng cô mất 2 tiếng chỉ để trả lời câu hỏi lặp đi lặp lại..." |
| **Precise** | Audience kỹ thuật cần spec rõ ràng. SRS, API spec. | "Endpoint SHALL return HTTP 200 with JSON body containing `confidence` field (float, 0.0-1.0)." |
| **Architectural** | Audience cần trade-off decisions. HLD, ADR. | "Chọn pgvector thay vì Pinecone vì: (1) zero infrastructure, (2) đã có Supabase, (3) cost $0." |
| **Instructional** | Audience cần làm theo step-by-step. Runbook, user manual. | "Bước 1: Mở dashboard. Bước 2: Click 'Tạo khóa học'. Bước 3: Upload file PDF." |
| **Contractual** | Audience cần cam kết đo lường. SOW, SLA. | "Vendor cam kết uptime ≥99.9%/tháng. Vi phạm: credit 10% phí tháng đó." |

---

## Profiles cho các loại tài liệu phổ biến (examples — model tự derive cho loại mới)

### BRD — Tài liệu Yêu cầu Nghiệp vụ

```
Audience:    CEO, PM, BA, client stakeholders
Purpose:     Trả lời "Tại sao làm dự án này? Cần đạt gì?"
Action:      Đọc xong → approve/reject dự án, phân bổ ngân sách
Tech Level:  0 (Business) — ZERO kỹ thuật
Tone:        Storytelling — kể vấn đề → giải pháp → kết quả
Must have:   Vấn đề + con số, user stories, success metrics, risks, timeline
Must NOT:    Library names, code blocks, API specs, architecture diagrams
Diagrams:    Business flow, impact chart, timeline Gantt, risk heatmap
Test:        PM đọc mà không cần hỏi dev → đạt
```

### SRS — Đặc tả Yêu cầu Phần mềm

```
Audience:    Developer, QA, architect
Purpose:     Trả lời "Hệ thống phải làm gì cụ thể? Verify bằng cách nào?"
Action:      Đọc xong → dev implement, QA viết test cases
Tech Level:  3 (Technical) — full detail
Tone:        Precise — SHALL/MUST/MAY theo RFC 2119
Must have:   FR-xxx với Gherkin acceptance criteria, data model, API contract, edge cases
Must NOT:    Business justification (đã có ở BRD), marketing language
Diagrams:    Sequence, ER, state machine, API flow
Test:        Dev đọc FR-xxx → implement mà không cần hỏi thêm → đạt
```

### HLD — Thiết kế Cấp cao

```
Audience:    Architect, tech lead, senior dev
Purpose:     Trả lời "Hệ thống được tổ chức như thế nào? Tại sao chọn cách này?"
Action:      Đọc xong → đồng ý kiến trúc, bắt đầu LLD/coding
Tech Level:  2 (Architectural) — components + giao tiếp, không implementation detail
Tone:        Architectural — trade-off analysis, decision rationale
Must have:   C4 diagrams (context, container, component), technology choices with rationale, deployment view, security view
Must NOT:    Code snippets, function-level detail (thuộc LLD), business requirements (thuộc BRD)
Diagrams:    C4 (3 levels), deployment, network, integration
Test:        Architect đọc → hiểu toàn bộ system mà không cần đọc code → đạt
```

### LLD — Thiết kế Chi tiết

```
Audience:    Developer
Purpose:     Trả lời "Implement từng module như thế nào?"
Action:      Đọc xong → code ngay, không cần design thêm
Tech Level:  3 (Technical) — full implementation detail
Tone:        Precise — class diagrams, code snippets, algorithms
Must have:   Class/module design, database schema (DDL), API contracts (OpenAPI), algorithms, error handling
Must NOT:    Business context (thuộc BRD), high-level architecture (thuộc HLD)
Diagrams:    Class, sequence (detailed), ER (physical), state machine
Test:        Junior dev đọc → implement feature mà chỉ cần hỏi clarify, không cần design → đạt
```

### SOW — Phạm vi Công việc

```
Audience:    Client, legal, finance
Purpose:     Trả lời "Vendor cam kết làm gì, bao lâu, bao nhiêu tiền?"
Action:      Đọc xong → ký hợp đồng
Tech Level:  0-1 (Business/Conceptual)
Tone:        Contractual — cam kết rõ ràng, đo lường được
Must have:   Scope (in/out), deliverables, timeline, milestones, payment schedule, acceptance criteria
Must NOT:    Internal architecture, team details, technology choices
Diagrams:    Timeline, milestone chart
Test:        Client legal đọc → hiểu cam kết mà không cần giải thích thêm → đạt
```

### Test Plan — Kế hoạch Kiểm thử

```
Audience:    QA lead, dev, PM
Purpose:     Trả lời "Test cái gì, test như thế nào, khi nào xong?"
Action:      Đọc xong → QA team bắt đầu viết test cases + execute
Tech Level:  2-3 (Architectural to Technical)
Tone:        Precise — test objectives, scope, approach
Must have:   Test scope, test levels (unit/integration/E2E/UAT), entry/exit criteria, test environment, schedule
Must NOT:    Business justification, architecture decisions
Diagrams:    Test flow, environment topology
Test:        QA lead đọc → assign test tasks cho team mà không cần meeting riêng → đạt
```

---

## Cách derive profile cho doc type MỚI

Khi gặp doc type chưa có profile ở trên, model tự derive bằng cách trả lời 3 câu:

1. **Ai sẽ đọc tài liệu này?** → Xác định tech level (0-3) và tone
2. **Đọc xong họ cần làm gì?** → Xác định must-have content
3. **Nếu họ phải Google 1 từ trong doc → từ đó nên ở doc khác** → Xác định must-NOT

Ví dụ: "Viết Incident Report"
1. Audience: Ops team + management → Tech level 1-2, Tone: factual
2. Action: Hiểu incident, prevent recurrence → Must have: timeline, root cause, fix, prevention
3. Management không Google "p99 latency" → Giải thích: "thời gian phản hồi chậm bất thường"

---

## Test chung cho MỌI tài liệu: "Giao cho đúng người"

Sau khi viết xong, tưởng tượng giao tài liệu cho đúng audience:
- **BRD → CEO:** CEO đọc 5 phút, hiểu vấn đề + giải pháp + cost? Nếu không → viết lại.
- **SRS → Junior dev:** Dev đọc FR → implement mà chỉ hỏi clarify, không hỏi "phải làm gì"? Nếu không → thiếu detail.
- **HLD → Architect mới join:** Architect đọc → vẽ lại system diagram mà khớp? Nếu không → thiếu views.
- **SOW → Lawyer:** Lawyer đọc → biết cam kết gì, deadline nào, phạt gì? Nếu không → mơ hồ.
