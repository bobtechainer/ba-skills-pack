# PM Outsource Survey Web — Design

Ngày: 2026-06-10

## 1. Bối cảnh

Hiện repository đã có web khảo sát BA tại `tools/ba-survey/`. App này dùng React + Vite, có landing page, survey page, sidebar, progress bar, nhiều loại câu hỏi, phần ghi thêm, submit fallback vào localStorage và dashboard tổng hợp/từng người.

Nhu cầu mới: làm một web khảo sát tương tự cho PM công ty outsource. PM được khảo sát là vai trò lai giữa Product Manager và Project Manager. Mục tiêu không chỉ là thu ý kiến, mà là lấy đủ yêu cầu/cách làm việc để chuẩn hóa thành skill hỗ trợ PM mới tiếp quản dự án khi PM cũ nghỉ.

## 2. Mục tiêu

Web khảo sát PM cần thu được dữ liệu để tạo các artifact sau:

1. **PM Operating Manual**: cách PM outsource vận hành dự án, bao gồm lifecycle, meeting cadence, stakeholder map, report flow, escalation flow, decision rights và delivery checklist.
2. **PM Skill Knowledge Base**: project types, template tài liệu, recurring tasks, risk patterns, client behavior patterns, rules of thumb và tình huống mẫu.
3. **PM Prompt/Command Map**: danh sách lệnh skill nên hỗ trợ như `/pm-handover`, `/pm-weekly-report`, `/pm-risk-check`, `/pm-change-request`, `/pm-client-update`, `/pm-sprint-check`, `/pm-onboarding`, `/pm-escalation-advisor`.
4. **Artifact Library**: danh sách tài liệu cần xin PM để train/thiết kế skill.
5. **PM Replacement Pack**: checklist để PM mới đọc trong 1-2 ngày đầu: đọc gì trước, ai là ai, dự án đang cháy ở đâu, việc lặp lại hằng tuần, quyết định pending và điều không được làm sai.

## 3. Phạm vi

### Làm trong phiên bản đầu

- Tạo app mới tại `tools/pm-survey/` bằng cách clone cấu trúc `tools/ba-survey/`.
- Giữ React + Vite.
- Giữ các loại câu hỏi hiện có:
  - `single-range`
  - `single-choice`
  - `multi-check`
  - `matrix`
- Giữ landing page, survey page, thank-you page, dashboard, password gate.
- Giữ optional follow-up text: `+ Ghi thêm (nếu muốn)`.
- Giữ cơ chế submit: gửi `/api/submit`, nếu fail thì fallback vào localStorage.
- Đổi toàn bộ wording từ BA sang PM outsource.
- Thay bộ câu hỏi thành 42 câu chia 10 phần.

### Không làm trong phiên bản đầu

- Không tạo backend thật.
- Không làm upload artifact trong survey.
- Không export Excel/CSV.
- Không thêm AI analysis trong dashboard.
- Không login phức tạp.
- Không refactor lớn app BA.

Lý do: mục tiêu là tái sử dụng nhanh, chạy được ngay, giống BA survey, ít rủi ro.

## 4. Kiến trúc reuse

Tạo mới:

```text
tools/pm-survey/
```

Nguồn clone:

```text
tools/ba-survey/
```

Các file chính cần sửa:

| File trong app PM | Thay đổi |
|---|---|
| `index.html` | Đổi title/meta thành khảo sát PM outsource |
| `package.json` | Đổi package name nếu cần |
| `src/pages/LandingPage.jsx` | Đổi tiêu đề, mô tả, placeholder tên |
| `src/pages/SurveyPage.jsx` | Đổi storage key và wording nếu có |
| `src/pages/DashboardPage.jsx` | Đổi title dashboard, storage key, auth key |
| `src/data/questions.js` | Thay toàn bộ sections/questions |

Storage key mới:

| Mục | Key BA | Key PM |
|---|---|---|
| Tên respondent | `ba-survey-name` | `pm-survey-name` |
| Responses fallback | `ba-survey-responses` | `pm-survey-responses` |
| Dashboard auth | `ba-dashboard-auth` | `pm-dashboard-auth` |

## 5. Cấu trúc khảo sát

Tổng: 42 câu, 10 phần.

1. Bối cảnh PM và loại dự án
2. Nhận dự án, handover, kickoff
3. Scope, requirement, change request
4. Planning, estimation, timeline, resource
5. Delivery routine hằng ngày/tuần
6. Client/stakeholder communication
7. Risk, issue, escalation
8. Quality, acceptance, release
9. Reporting, governance, finance/margin
10. Handover, onboarding PM mới, skill hóa

Mỗi câu hỏi phục vụ trực tiếp cho việc xây skill. Survey web thu dữ liệu đóng; buổi interview sau survey khai thác ví dụ và artifact thật.

## 6. Bộ câu hỏi web survey

### Phần 1 — Bối cảnh PM và loại dự án

#### 1.1 PM trong công ty anh/chị thường chịu trách nhiệm đến đâu?

Type: `multi-check`

Options:

- Quản lý timeline / milestone / delivery plan
- Quản lý scope và change request
- Làm việc trực tiếp với client
- Quản lý resource / allocation team
- Quản lý backlog / requirement / priority
- Theo dõi budget / cost / margin
- Báo cáo nội bộ cho manager/director
- Hỗ trợ presale / estimation trước khi ký dự án

Dùng cho skill: xác định PM là Project-heavy, Product-heavy hay hybrid.

#### 1.2 Dự án anh/chị quản lý thường thuộc mô hình nào?

Type: `multi-check`

Options:

- Fixed-price
- Time & Materials
- Dedicated team / ODC
- Maintenance / support
- Product development dài hạn
- Short-term MVP / POC
- Staff augmentation
- Khác

Dùng cho skill: chọn workflow phù hợp khi gen plan/report/risk.

#### 1.3 Một PM thường quản lý bao nhiêu dự án/team cùng lúc?

Type: `single-range`

Options:

- 1 dự án
- 2 dự án
- 3 - 4 dự án
- Trên 4 dự án
- Tùy giai đoạn, thay đổi liên tục

Dùng cho skill: thiết kế dashboard workload và nhắc việc.

#### 1.4 Team dự án outsource thường có những vai trò nào?

Type: `matrix`

Rows:

- PM
- BA
- Tech Lead
- Developer
- QA/QC
- Designer
- DevOps
- Client PO/Product Owner
- Client technical contact
- Account/Sales

Columns:

- Luôn có
- Thường có
- Thỉnh thoảng có
- Hiếm khi có
- Không có

Dùng cho skill: tạo stakeholder/team map.

### Phần 2 — Nhận dự án, handover, kickoff

#### 2.1 Khi nhận một dự án mới, anh/chị thường có sẵn những tài liệu nào?

Type: `matrix`

Rows:

- Contract / SOW
- Proposal / estimation file
- Project charter
- Requirement / BRD / user story
- Wireframe / Figma
- Technical proposal / architecture
- Timeline / milestone plan
- Resource plan
- Communication plan
- Risk/issue log từ giai đoạn trước
- Meeting notes / email trao đổi cũ

Columns:

- Có đầy đủ
- Có nhưng thiếu/cũ
- Có nhưng khó hiểu
- Không có
- Không áp dụng

Dùng cho skill: `/pm-onboarding` biết cần xin gì trước.

#### 2.2 Khi PM mới nhận handover, phần nào khó nắm nhất?

Type: `multi-check`

Options:

- Bối cảnh client và kỳ vọng thật sự
- Scope cam kết trong hợp đồng
- Những phần đã làm xong/chưa xong
- Các vấn đề đang cháy
- Lịch sử change request
- Stakeholder nào có quyền quyết định
- Team member nào mạnh/yếu phần nào
- Cách báo cáo nội bộ
- Budget/cost/margin
- Technical debt hoặc constraint kỹ thuật

Dùng cho skill: PM Replacement Pack.

#### 2.3 Trong kickoff dự án, PM thường phải chốt những nội dung nào?

Type: `multi-check`

Options:

- Scope
- Timeline / milestone
- Deliverables
- Team roles
- Communication channel
- Meeting cadence
- Reporting format
- Acceptance criteria
- Risk ban đầu
- Change request process
- Escalation path
- Definition of Done

Dùng cho skill: `/pm-kickoff-checklist`.

#### 2.4 Nếu thiếu tài liệu quan trọng khi nhận dự án, anh/chị thường xử lý thế nào?

Type: `single-choice`

Options:

- Vẫn nhận dự án, vừa làm vừa hỏi bổ sung
- Tạo danh sách missing information rồi yêu cầu bổ sung trước kickoff
- Họp với sales/account/PM cũ để lấy context miệng
- Tự tổng hợp từ email/chat/tài liệu rời rạc
- Escalate vì chưa đủ điều kiện nhận bàn giao

Dùng cho skill: rule xử lý missing input.

### Phần 3 — Scope, requirement, change request

#### 3.1 Scope dự án outsource thường được mô tả rõ đến mức nào trước khi bắt đầu?

Type: `single-range`

Options:

- Rất rõ, ít phải hỏi lại
- Khá rõ, chỉ thiếu chi tiết nhỏ
- Có scope tổng quan nhưng thiếu nhiều detail
- Mơ hồ, phải làm rõ liên tục
- Thường thay đổi ngay sau kickoff

Dùng cho skill: risk detection khi đọc SOW/requirement.

#### 3.2 Change request thường phát sinh vì lý do gì?

Type: `multi-check`

Options:

- Client nghĩ phần đó đã nằm trong scope
- Requirement ban đầu thiếu chi tiết
- User feedback sau demo/UAT
- Designer/BA đổi luồng
- Technical constraint mới phát hiện
- Integration/API bên thứ ba thay đổi
- Business priority của client thay đổi
- Estimate ban đầu sai
- Team hiểu sai requirement

Dùng cho skill: `/pm-change-request` phân loại nguyên nhân.

#### 3.3 Khi client yêu cầu thêm việc ngoài scope, anh/chị thường làm gì đầu tiên?

Type: `single-choice`

Options:

- Từ chối ngay vì ngoài scope
- Ghi nhận rồi phân tích impact trước
- Cho team làm nếu effort nhỏ
- Hỏi account/sales/manager trước khi phản hồi
- Tách thành change request chính thức

Dùng cho skill: decision tree xử lý scope creep.

#### 3.4 Một change request cần có những thông tin nào trước khi PM đồng ý đưa vào plan?

Type: `multi-check`

Options:

- Mô tả thay đổi
- Lý do business
- Mức độ ưu tiên
- Impact đến scope
- Impact đến timeline
- Impact đến cost/budget
- Impact đến resource
- Impact đến technical design
- Acceptance criteria
- Người approve phía client
- Người approve nội bộ

Dùng cho skill: template CR.

#### 3.5 Trong dự án, requirement thường được quản lý ở đâu?

Type: `multi-check`

Options:

- Jira
- Trello/ClickUp/Asana
- Excel/Google Sheet
- Confluence/Notion
- Word/PDF
- Figma comment
- Email/chat
- Không có nơi cố định

Dùng cho skill: connector/file checklist.

### Phần 4 — Planning, estimation, timeline, resource

#### 4.1 PM thường lập plan ở mức chi tiết nào?

Type: `single-choice`

Options:

- Milestone-level: chỉ mốc lớn
- Sprint-level: theo sprint/iteration
- Task-level: từng task trong board
- Person-day/resource-level
- Tùy loại dự án

Dùng cho skill: chọn template plan.

#### 4.2 Khi estimate dự án, input nào ảnh hưởng nhiều nhất?

Type: `multi-check`

Options:

- Requirement detail
- Complexity kỹ thuật
- Integration/API bên thứ ba
- Năng lực team hiện tại
- Availability của resource
- Kinh nghiệm dự án tương tự
- Deadline client yêu cầu
- Buffer/risk
- Non-functional requirements
- Review/approval cycle của client

Dùng cho skill: estimation assistant.

#### 4.3 PM thường theo dõi resource bằng cách nào?

Type: `single-choice`

Options:

- Theo từng người và % allocation
- Theo role/team capacity
- Theo sprint velocity
- Theo timesheet thực tế
- Không theo dõi chi tiết, chỉ nhìn tiến độ task

Dùng cho skill: resource tracking model.

#### 4.4 Tình huống nào hay làm timeline bị trễ nhất?

Type: `multi-check`

Options:

- Requirement đổi
- Client phản hồi chậm
- Dev estimate thiếu
- Bug nhiều hơn dự kiến
- Thiếu resource
- Member nghỉ/đổi người
- Phụ thuộc API/bên thứ ba
- UAT kéo dài
- Deploy/release gặp lỗi
- Technical debt

Dùng cho skill: `/pm-risk-check`.

#### 4.5 Khi biết dự án có khả năng trễ, PM thường làm gì trước?

Type: `single-choice`

Options:

- Báo client ngay
- Báo nội bộ trước, thống nhất phương án rồi báo client
- Yêu cầu team OT để giữ timeline
- Cắt scope / dời scope sang phase sau
- Re-plan và trình nhiều option

Dùng cho skill: escalation advisor.

### Phần 5 — Delivery routine hằng ngày/tuần

#### 5.1 Các hoạt động nào PM làm hằng ngày?

Type: `multi-check`

Options:

- Check board/task status
- Hỏi blocker của team
- Follow up client
- Check bug/issue mới
- Update timeline
- Update risk/issue log
- Join daily meeting
- Review output của BA/QA/dev
- Trả lời chat/email
- Báo cáo nhanh cho manager

Dùng cho skill: daily checklist.

#### 5.2 Các hoạt động nào PM làm hằng tuần?

Type: `multi-check`

Options:

- Weekly report cho client
- Weekly report nội bộ
- Sprint planning
- Sprint review/demo
- Retrospective
- Resource planning
- Risk review
- Budget/burn check
- Backlog grooming
- Stakeholder sync

Dùng cho skill: weekly operating rhythm.

#### 5.3 PM thường biết task đang lệch plan bằng dấu hiệu nào?

Type: `multi-check`

Options:

- Task quá hạn trên board
- Dev báo blocker
- QA phát hiện bug nhiều
- Daily update không rõ ràng
- Client hỏi nhiều lần
- Velocity giảm
- Estimate remaining tăng
- Pull request/review bị nghẽn
- Không có demo được sau sprint
- Cảm giác từ kinh nghiệm

Dùng cho skill: early warning detector.

#### 5.4 Nếu một task bị kẹt 2-3 ngày không tiến triển, PM thường xử lý thế nào?

Type: `single-choice`

Options:

- Hỏi trực tiếp người phụ trách
- Kéo Tech Lead vào phân tích
- Đổi người xử lý
- Tách task nhỏ hơn
- Escalate với manager
- Báo client nếu ảnh hưởng timeline

Dùng cho skill: blocker handling playbook.

### Phần 6 — Client/stakeholder communication

#### 6.1 PM giao tiếp với client chủ yếu qua kênh nào?

Type: `multi-check`

Options:

- Email
- Slack/Teams
- Zalo/Telegram
- Jira comment
- Meeting online
- Meeting onsite
- Weekly report document
- Dashboard/project board

Dùng cho skill: communication context.

#### 6.2 Loại thông tin nào bắt buộc phải xác nhận bằng văn bản?

Type: `multi-check`

Options:

- Scope change
- Timeline change
- Cost/budget change
- Acceptance/UAT result
- Production release approval
- Major bug/incident
- Requirement clarification
- Resource change
- Out-of-scope rejection
- Risk acceptance

Dùng cho skill: written confirmation rule.

#### 6.3 Client/stakeholder khó thường có hành vi nào?

Type: `multi-check`

Options:

- Đổi ý liên tục
- Không phản hồi đúng hạn
- Không đọc tài liệu nhưng vẫn comment
- Muốn thêm scope miễn phí
- Escalate trực tiếp lên management
- Yêu cầu deadline không thực tế
- Không thống nhất giữa các bên client
- Feedback mơ hồ
- Chỉ báo lỗi qua chat, không tạo ticket

Dùng cho skill: stakeholder risk pattern.

#### 6.4 Khi client phản ứng tiêu cực về tiến độ/chất lượng, PM thường phản hồi thế nào?

Type: `single-choice`

Options:

- Xin lỗi và cam kết fix ngay
- Giải thích nguyên nhân + đưa action plan
- Họp khẩn với client
- Báo nội bộ trước rồi mới phản hồi
- Gửi report dữ liệu để làm rõ tình hình

Dùng cho skill: client response generator.

### Phần 7 — Risk, issue, escalation

#### 7.1 PM thường quản lý risk/issue ở đâu?

Type: `single-choice`

Options:

- File RAID log riêng
- Jira/board
- Weekly report
- Meeting notes
- Chat/email
- Trong đầu PM, chưa có file cố định

Dùng cho skill: nếu chưa có RAID log thì skill phải tạo.

#### 7.2 Những risk nào outsource project hay gặp nhất?

Type: `multi-check`

Options:

- Scope creep
- Requirement không rõ
- Client phản hồi chậm
- Estimate sai
- Resource thiếu/đổi người
- Quality thấp/bug nhiều
- Technical dependency
- Integration chậm
- UAT kéo dài
- Payment/billing issue
- Timezone/language/culture issue
- Security/compliance requirement phát sinh

Dùng cho skill: risk library.

#### 7.3 Khi nào PM phải escalate nội bộ?

Type: `multi-check`

Options:

- Timeline có nguy cơ trễ
- Client yêu cầu ngoài scope
- Team thiếu resource
- Member performance kém
- Bug nghiêm trọng
- Conflict với client
- Cost vượt estimate
- Requirement không thể chốt
- Production incident
- Client không thanh toán/khó billing

Dùng cho skill: escalation rules.

#### 7.4 Escalation nội bộ thường cần chuẩn bị gì?

Type: `multi-check`

Options:

- Mô tả vấn đề
- Timeline sự kiện
- Impact
- Root cause sơ bộ
- Options xử lý
- Recommendation của PM
- Người cần quyết định
- Deadline cần quyết định
- Evidence/link/ticket
- Risk nếu không xử lý

Dùng cho skill: escalation brief generator.

### Phần 8 — Quality, acceptance, release

#### 8.1 Definition of Done của dự án thường bao gồm gì?

Type: `multi-check`

Options:

- Code hoàn thành
- Dev self-test
- QA pass
- Bug critical/high đã fix
- Client review/demo
- UAT pass
- Document update
- Release note
- Deployment done
- Monitoring sau release

Dùng cho skill: DoD checklist.

#### 8.2 PM tham gia bug triage ở mức nào?

Type: `single-choice`

Options:

- Không tham gia, QA/Tech Lead tự xử lý
- Chỉ theo dõi bug critical/high
- Tham gia ưu tiên bug theo impact
- Tham gia daily trong giai đoạn UAT/release
- PM là người điều phối chính bug triage

Dùng cho skill: bug triage workflow.

#### 8.3 Khi client báo bug nhưng team nghĩ đó là change request, PM xử lý thế nào?

Type: `single-choice`

Options:

- Theo client, coi là bug
- Theo team, coi là CR
- So lại scope/requirement/acceptance criteria
- Tổ chức meeting 3 bên để chốt
- Tạm fix trước rồi xử lý scope sau

Dùng cho skill: bug-vs-CR decision tree.

#### 8.4 Trước release, PM cần kiểm tra những gì?

Type: `multi-check`

Options:

- Scope release
- Bug còn mở
- UAT approval
- Release note
- Deployment plan
- Rollback plan
- Client confirmation
- Internal approval
- Support plan sau release
- Communication cho users/stakeholders

Dùng cho skill: release readiness checklist.

### Phần 9 — Reporting, governance, finance/margin

#### 9.1 PM thường phải gửi những report nào?

Type: `multi-check`

Options:

- Daily status
- Weekly report cho client
- Weekly report nội bộ
- Sprint report
- Risk/issue report
- Resource utilization report
- Budget/burn report
- Change request report
- Release report
- Project closure report

Dùng cho skill: report generator map.

#### 9.2 Weekly report thường có những phần nào?

Type: `multi-check`

Options:

- Tổng quan trạng thái
- Việc đã hoàn thành
- Việc tuần tới
- Timeline/milestone
- Risk/issue
- Blocker cần client xử lý
- Change request
- Bug/quality status
- Resource status
- Decision needed
- Budget/cost nếu có

Dùng cho skill: `/pm-weekly-report`.

#### 9.3 PM có cần theo dõi budget/cost/margin không?

Type: `single-choice`

Options:

- Có, PM theo dõi trực tiếp
- Có theo dõi nhưng manager/account chịu chính
- Chỉ theo dõi effort/burn, không biết margin
- Không theo dõi
- Tùy dự án

Dùng cho skill: bật/tắt finance module.

#### 9.4 Dữ liệu nào thường dùng để biết dự án đang lỗ hoặc vượt effort?

Type: `multi-check`

Options:

- Timesheet
- Estimate vs actual
- Burn rate
- Resource allocation
- Number of CR miễn phí
- Bug/rework effort
- Delay cost
- Invoice/payment milestone
- Manager/account báo lại
- Không có dữ liệu rõ

Dùng cho skill: margin risk warning.

### Phần 10 — Handover, onboarding PM mới, skill hóa

#### 10.1 Nếu ngày mai PM mới vào thay anh/chị, họ cần đọc gì đầu tiên?

Type: `matrix`

Rows:

- Contract/SOW
- Project plan/timeline
- Latest weekly report
- Risk/issue log
- Change request log
- Stakeholder list
- Meeting notes gần nhất
- Jira/project board
- Resource plan
- UAT/release status
- Budget/burn status
- Client communication history

Columns:

- Bắt buộc đọc ngày đầu
- Đọc trong tuần đầu
- Có thì tốt
- Không cần
- Không có tài liệu này

Dùng cho skill: PM replacement reading path.

#### 10.2 PM mới dễ mắc lỗi gì nhất khi nhận lại dự án?

Type: `multi-check`

Options:

- Không hiểu expectation thật của client
- Không biết scope nào đã cam kết
- Không biết vấn đề đang cháy
- Không biết ai là người quyết định
- Không biết lịch report/meeting
- Không biết rule escalation
- Không biết team member nào đang quá tải
- Không biết CR nào đang pending
- Không biết deadline/milestone quan trọng
- Không biết lịch sử conflict với client

Dùng cho skill: onboarding risk checklist.

#### 10.3 Nếu có một AI PM assistant, anh/chị muốn nó hỗ trợ việc gì nhất?

Type: `multi-check`

Options:

- Tạo weekly report
- Tạo meeting agenda/minutes
- Tạo risk/issue summary
- Nhắc việc hằng ngày/tuần
- Phân tích change request
- Tạo escalation brief
- Tạo handover document
- Kiểm tra dự án có risk gì
- Tóm tắt client communication
- Tạo release checklist
- Tạo onboarding guide cho PM mới
- Hỏi đáp về tình trạng dự án

Dùng cho skill: command priority.

#### 10.4 Những quyết định nào PM được tự quyết, không cần hỏi manager/client?

Type: `multi-check`

Options:

- Điều chỉnh task nội bộ
- Đổi người xử lý task nhỏ
- Re-prioritize bug nhỏ
- Dời task trong sprint nếu không ảnh hưởng milestone
- Từ chối request nhỏ ngoài scope
- Gửi report/status thông thường
- Đề xuất CR
- Chốt release/UAT
- Điều chỉnh timeline
- Cam kết thêm effort/cost

Dùng cho skill: decision rights map.

#### 10.5 Điều gì PM mới tuyệt đối không được làm sai trong dự án outsource?

Type: `multi-check`

Options:

- Cam kết scope/timeline khi chưa confirm nội bộ
- Làm thêm ngoài scope mà không ghi nhận CR
- Báo trễ quá muộn
- Không lưu xác nhận bằng văn bản
- Bỏ qua stakeholder quan trọng
- Không update risk/issue
- Không theo dõi effort thực tế
- Không báo manager khi client escalate
- Release khi chưa có approval
- Để client hiểu sai trạng thái dự án

Dùng cho skill: hard rules / guardrails.

#### 10.6 Artifact nào anh/chị có thể cung cấp bản mẫu/ẩn thông tin nhạy cảm để train skill?

Type: `multi-check`

Options:

- SOW/contract scope
- Project plan
- Weekly report
- Risk/issue log
- Change request log
- Meeting minutes
- Timeline/roadmap
- Resource plan
- Estimate file
- Sprint board screenshot
- Release checklist
- UAT/acceptance document
- Handover note
- Client email/chat mẫu

Dùng cho skill: artifact collection checklist.

## 7. Interview sâu sau survey

Các câu này dùng cho buổi call sau khi PM điền survey. Không đưa vào web ở phiên bản đầu.

1. Kể lại lần gần nhất anh/chị nhận một dự án outsource mới. Lúc đó anh/chị có tài liệu gì, thiếu gì, mất bao lâu để hiểu dự án?
2. Nếu phải handover dự án hiện tại trong 2 ngày, anh/chị sẽ bàn giao theo thứ tự nào?
3. Có stakeholder/client nào mà PM mới bắt buộc phải hiểu “tính cách làm việc” không? Người đó thường gây ảnh hưởng thế nào?
4. Một change request khó nhất anh/chị từng xử lý là gì? Vì sao khó? Cuối cùng chốt thế nào?
5. Lần gần nhất dự án có nguy cơ trễ, anh/chị phát hiện bằng dấu hiệu gì trước khi nó thành vấn đề lớn?
6. Có rule ngầm nào trong công ty mà PM mới không đọc tài liệu sẽ không biết không?
7. Report nào PM phải làm đều đặn nhưng tốn thời gian nhất? Vì sao tốn?
8. Có loại meeting nào nếu PM chuẩn bị kém thì dễ hỏng không? Cần chuẩn bị gì?
9. Khi client đòi thêm scope miễn phí, anh/chị thường dùng câu chữ/logic nào để phản hồi?
10. PM mới thường cần hỏi ai trong tuần đầu? Hỏi về cái gì?
11. Nếu AI đọc toàn bộ folder dự án, anh/chị muốn nó tự phát hiện những vấn đề gì?
12. Nếu biến công việc của anh/chị thành skill, 5 lệnh quan trọng nhất nên là gì?

## 8. Artifact cần xin PM

Bắt buộc xin ít nhất 5 loại:

1. Weekly report mẫu.
2. Project plan/timeline mẫu.
3. Risk/issue log hoặc ví dụ issue list.
4. Change request mẫu hoặc case CR đã xử lý.
5. Handover note hoặc folder structure dự án.

Nếu được thêm:

6. SOW/scope đã ẩn thông tin.
7. Meeting minutes.
8. Sprint board screenshot.
9. Release/UAT checklist.
10. Resource/budget tracking.

## 9. Dashboard

Dashboard giữ chức năng hiện có của BA survey:

- Password gate.
- Tổng số phản hồi.
- Tab tổng hợp theo từng section/câu hỏi.
- Chart cho single-choice, single-range, multi-check.
- Matrix summary cho matrix questions.
- Tab xem từng người, bao gồm answer và follow-up.

Tên dashboard mới: **Dashboard khảo sát PM**.

## 10. Acceptance criteria

App PM survey được coi là đạt khi:

1. `tools/pm-survey/` chạy được độc lập bằng `npm install` và `npm run dev`.
2. Landing page hiển thị đúng “Khảo sát quy trình làm việc của PM Outsource”.
3. Survey có 42 câu, chia 10 phần đúng như thiết kế.
4. Tất cả question type render đúng.
5. Progress, sidebar, next/back hoạt động.
6. `+ Ghi thêm` lưu theo từng câu.
7. Submit fallback lưu vào `localStorage` key `pm-survey-responses`.
8. Dashboard đọc từ `pm-survey-responses`.
9. Dashboard auth dùng key `pm-dashboard-auth`.
10. Không còn text chính nào nói “BA” trong app PM, trừ khi nằm trong option team role “BA”.
11. Không sửa app BA hiện có ngoài trường hợp cần tham khảo.

## 11. Rủi ro và cách giảm

| Rủi ro | Cách giảm |
|---|---|
| Bộ câu hỏi dài khiến PM bỏ giữa chừng | Giữ UI từng câu một, progress rõ, câu hỏi phần lớn chọn đáp án nhanh |
| Câu trả lời survey chưa đủ để skill hóa | Dùng interview sâu + artifact checklist sau survey |
| Clone app gây nhầm storage với BA survey | Đổi toàn bộ storage key sang `pm-*` |
| Dashboard chưa có export | Chấp nhận ở v1; nếu cần sẽ thêm sau |
| Một PM đầu tiên không đại diện cho tất cả PM | Thiết kế câu hỏi theo outsource workflow chung, sau này dùng nhiều PM khác để so sánh |

## 12. Kế hoạch triển khai cấp cao

1. Copy `tools/ba-survey/` sang `tools/pm-survey/`.
2. Đổi metadata và package name.
3. Thay `src/data/questions.js` bằng 10 sections và 42 questions.
4. Đổi storage/auth keys trong landing/survey/dashboard.
5. Đổi UI wording từ BA sang PM.
6. Chạy install/build hoặc kiểm tra lint/build nếu dependency có sẵn.
7. Kiểm tra thủ công luồng survey → submit fallback → dashboard.

