# PM Survey Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone PM outsource survey web app at `tools/pm-survey/` by reusing `tools/ba-survey/` and replacing the BA workflow content with the approved PM survey.

**Architecture:** Clone the existing React + Vite survey app structure and keep the UI/rendering/dashboard logic unchanged where possible. Replace survey data, app metadata, visible wording, and storage/auth keys so the PM survey can run independently from the BA survey.

**Tech Stack:** React 19, Vite 8, React Router, Recharts, localStorage fallback, npm scripts inherited from `tools/ba-survey/`.

---

## File Structure

### Created

- `tools/pm-survey/` — standalone PM survey app cloned from `tools/ba-survey/` without `node_modules` and `dist`.
- `tools/pm-survey/src/data/questions.js` — 10 sections, 42 PM outsource survey questions.

### Modified inside the new app only

- `tools/pm-survey/package.json` — package name becomes `pm-survey`.
- `tools/pm-survey/package-lock.json` — root package name becomes `pm-survey`.
- `tools/pm-survey/index.html` — PM survey title and meta description.
- `tools/pm-survey/src/pages/LandingPage.jsx` — PM landing copy and storage key.
- `tools/pm-survey/src/pages/SurveyPage.jsx` — PM respondent key and PM responses key.
- `tools/pm-survey/src/pages/DashboardPage.jsx` — PM dashboard auth key, localStorage key, dashboard text.
- `tools/pm-survey/src/pages/ThankYouPage.jsx` — PM thank-you copy.

### Not modified

- `tools/ba-survey/` — source app remains untouched.
- No backend/API implementation.
- No export/upload feature.

---

## Task 1: Scaffold `tools/pm-survey/` from `tools/ba-survey/`

**Files:**
- Create: `tools/pm-survey/`
- Copy from: `tools/ba-survey/`

- [ ] **Step 1: Verify source exists and PM app does not exist yet**

Run:

```bash
test -d "tools/ba-survey/src" && test -f "tools/ba-survey/package.json" && test ! -e "tools/pm-survey"
```

Expected: command exits with code 0 and no output.

If `tools/pm-survey` already exists, stop and inspect it before overwriting.

- [ ] **Step 2: Copy only app source/config files**

Run:

```bash
mkdir -p "tools/pm-survey"
cp -R "tools/ba-survey/public" "tools/pm-survey/public"
cp -R "tools/ba-survey/src" "tools/pm-survey/src"
cp "tools/ba-survey/index.html" "tools/pm-survey/index.html"
cp "tools/ba-survey/package.json" "tools/pm-survey/package.json"
cp "tools/ba-survey/package-lock.json" "tools/pm-survey/package-lock.json"
cp "tools/ba-survey/vite.config.js" "tools/pm-survey/vite.config.js"
cp "tools/ba-survey/eslint.config.js" "tools/pm-survey/eslint.config.js"
```

- [ ] **Step 3: Verify copied structure**

Run:

```bash
test -f "tools/pm-survey/src/App.jsx" \
  && test -f "tools/pm-survey/src/data/questions.js" \
  && test -f "tools/pm-survey/src/pages/SurveyPage.jsx" \
  && test -f "tools/pm-survey/src/pages/DashboardPage.jsx" \
  && test ! -e "tools/pm-survey/node_modules" \
  && test ! -e "tools/pm-survey/dist"
```

Expected: command exits with code 0 and no output.

- [ ] **Step 4: Commit scaffold**

```bash
git add "tools/pm-survey"
git commit -m "feat: scaffold PM survey app" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Update metadata for PM survey

**Files:**
- Modify: `tools/pm-survey/package.json`
- Modify: `tools/pm-survey/package-lock.json`
- Modify: `tools/pm-survey/index.html`

- [ ] **Step 1: Write failing metadata check**

Run:

```bash
node --input-type=module <<'NODE'
import fs from 'node:fs';
const pkg = JSON.parse(fs.readFileSync('tools/pm-survey/package.json', 'utf8'));
const lock = JSON.parse(fs.readFileSync('tools/pm-survey/package-lock.json', 'utf8'));
const html = fs.readFileSync('tools/pm-survey/index.html', 'utf8');
if (pkg.name !== 'pm-survey') throw new Error(`package.json name is ${pkg.name}`);
if (lock.name !== 'pm-survey') throw new Error(`package-lock name is ${lock.name}`);
if (lock.packages[''].name !== 'pm-survey') throw new Error(`package-lock root package name is ${lock.packages[''].name}`);
if (!html.includes('Khảo sát PM Outsource Workflow')) throw new Error('index title is not PM survey title');
if (!html.includes('Khảo sát quy trình làm việc của PM outsource')) throw new Error('index meta description is not PM survey description');
NODE
```

Expected before implementation: FAIL with package name still `ba-survey`.

- [ ] **Step 2: Replace `tools/pm-survey/package.json` content**

Use this full content:

```json
{
  "name": "pm-survey",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@upstash/redis": "^1.38.0",
    "@vercel/kv": "^3.0.0",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-router-dom": "^7.15.0",
    "recharts": "^3.8.1",
    "redis": "^5.12.1"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.5.0",
    "vite": "^8.0.10"
  }
}
```

- [ ] **Step 3: Update `tools/pm-survey/package-lock.json` root names**

Apply these exact replacements:

```text
"name": "ba-survey"
```

becomes:

```text
"name": "pm-survey"
```

There are two intended occurrences: top-level `name` and `packages[""].name`.

- [ ] **Step 4: Replace `tools/pm-survey/index.html` content**

Use this full content:

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Khảo sát quy trình làm việc của PM outsource — Thu thập dữ liệu để thiết kế skill AI hỗ trợ handover, vận hành dự án và onboarding PM mới" />
    <title>Khảo sát PM Outsource Workflow</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Run metadata check again**

Run the same command from Step 1.

Expected: PASS with no output.

- [ ] **Step 6: Commit metadata update**

```bash
git add "tools/pm-survey/package.json" "tools/pm-survey/package-lock.json" "tools/pm-survey/index.html"
git commit -m "chore: update PM survey metadata" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Replace survey sections and questions

**Files:**
- Modify: `tools/pm-survey/src/data/questions.js`

- [ ] **Step 1: Write failing question-bank validation**

Run:

```bash
node --input-type=module <<'NODE'
const mod = await import('./tools/pm-survey/src/data/questions.js');
const { sections, questions } = mod;
if (sections.length !== 10) throw new Error(`expected 10 sections, got ${sections.length}`);
if (questions.length !== 44) throw new Error(`expected 44 questions, got ${questions.length}`);
const expectedSectionTitles = [
  'Bối cảnh PM và loại dự án',
  'Nhận dự án, handover, kickoff',
  'Scope, requirement, change request',
  'Planning, estimation, timeline, resource',
  'Delivery routine hằng ngày/tuần',
  'Client/stakeholder communication',
  'Risk, issue, escalation',
  'Quality, acceptance, release',
  'Reporting, governance, finance/margin',
  'Handover, onboarding PM mới, skill hóa',
];
for (const [index, title] of expectedSectionTitles.entries()) {
  const section = sections[index];
  if (!section) throw new Error(`missing section ${index + 1}`);
  if (section.id !== index + 1) throw new Error(`section ${index + 1} id mismatch: ${section.id}`);
  if (section.title !== title) throw new Error(`section ${index + 1} title mismatch: ${section.title}`);
}
const ids = new Set();
const allowedTypes = new Set(['single-range', 'single-choice', 'multi-check', 'matrix']);
for (const question of questions) {
  if (ids.has(question.id)) throw new Error(`duplicate question id ${question.id}`);
  ids.add(question.id);
  if (!allowedTypes.has(question.type)) throw new Error(`invalid type ${question.type} at ${question.id}`);
  if (!sections.some((s) => s.id === question.section)) throw new Error(`invalid section ${question.section} at ${question.id}`);
  if (!question.text || !question.text.trim()) throw new Error(`empty text at ${question.id}`);
  if (question.type === 'matrix') {
    if (!Array.isArray(question.rows) || question.rows.length === 0) throw new Error(`matrix ${question.id} missing rows`);
    if (!Array.isArray(question.columns) || question.columns.length === 0) throw new Error(`matrix ${question.id} missing columns`);
  } else {
    if (!Array.isArray(question.options) || question.options.length === 0) throw new Error(`question ${question.id} missing options`);
  }
}
for (const id of ['1.1', '2.1', '3.5', '4.5', '5.4', '6.4', '7.4', '8.4', '9.4', '10.6']) {
  if (!ids.has(id)) throw new Error(`missing expected id ${id}`);
}
NODE
```

Expected before implementation: FAIL because cloned BA survey has 6 sections and 22 questions.

- [ ] **Step 2: Replace `tools/pm-survey/src/data/questions.js` content**

Use this full content:

```javascript
export const sections = [
  { id: 1, title: 'Bối cảnh PM và loại dự án' },
  { id: 2, title: 'Nhận dự án, handover, kickoff' },
  { id: 3, title: 'Scope, requirement, change request' },
  { id: 4, title: 'Planning, estimation, timeline, resource' },
  { id: 5, title: 'Delivery routine hằng ngày/tuần' },
  { id: 6, title: 'Client/stakeholder communication' },
  { id: 7, title: 'Risk, issue, escalation' },
  { id: 8, title: 'Quality, acceptance, release' },
  { id: 9, title: 'Reporting, governance, finance/margin' },
  { id: 10, title: 'Handover, onboarding PM mới, skill hóa' },
];

export const questions = [
  {
    id: '1.1',
    section: 1,
    text: 'PM trong công ty anh/chị thường chịu trách nhiệm đến đâu?',
    type: 'multi-check',
    options: [
      'Quản lý timeline / milestone / delivery plan',
      'Quản lý scope và change request',
      'Làm việc trực tiếp với client',
      'Quản lý resource / allocation team',
      'Quản lý backlog / requirement / priority',
      'Theo dõi budget / cost / margin',
      'Báo cáo nội bộ cho manager/director',
      'Hỗ trợ presale / estimation trước khi ký dự án',
    ],
  },
  {
    id: '1.2',
    section: 1,
    text: 'Dự án anh/chị quản lý thường thuộc mô hình nào?',
    type: 'multi-check',
    options: [
      'Fixed-price',
      'Time & Materials',
      'Dedicated team / ODC',
      'Maintenance / support',
      'Product development dài hạn',
      'Short-term MVP / POC',
      'Staff augmentation',
      'Khác',
    ],
  },
  {
    id: '1.3',
    section: 1,
    text: 'Một PM thường quản lý bao nhiêu dự án/team cùng lúc?',
    type: 'single-range',
    options: ['1 dự án', '2 dự án', '3 - 4 dự án', 'Trên 4 dự án', 'Tùy giai đoạn, thay đổi liên tục'],
  },
  {
    id: '1.4',
    section: 1,
    text: 'Team dự án outsource thường có những vai trò nào?',
    type: 'matrix',
    rows: [
      'PM',
      'BA',
      'Tech Lead',
      'Developer',
      'QA/QC',
      'Designer',
      'DevOps',
      'Client PO/Product Owner',
      'Client technical contact',
      'Account/Sales',
    ],
    columns: ['Luôn có', 'Thường có', 'Thỉnh thoảng có', 'Hiếm khi có', 'Không có'],
  },
  {
    id: '2.1',
    section: 2,
    text: 'Khi nhận một dự án mới, anh/chị thường có sẵn những tài liệu nào?',
    type: 'matrix',
    rows: [
      'Contract / SOW',
      'Proposal / estimation file',
      'Project charter',
      'Requirement / BRD / user story',
      'Wireframe / Figma',
      'Technical proposal / architecture',
      'Timeline / milestone plan',
      'Resource plan',
      'Communication plan',
      'Risk/issue log từ giai đoạn trước',
      'Meeting notes / email trao đổi cũ',
    ],
    columns: ['Có đầy đủ', 'Có nhưng thiếu/cũ', 'Có nhưng khó hiểu', 'Không có', 'Không áp dụng'],
  },
  {
    id: '2.2',
    section: 2,
    text: 'Khi PM mới nhận handover, phần nào khó nắm nhất?',
    type: 'multi-check',
    options: [
      'Bối cảnh client và kỳ vọng thật sự',
      'Scope cam kết trong hợp đồng',
      'Những phần đã làm xong/chưa xong',
      'Các vấn đề đang cháy',
      'Lịch sử change request',
      'Stakeholder nào có quyền quyết định',
      'Team member nào mạnh/yếu phần nào',
      'Cách báo cáo nội bộ',
      'Budget/cost/margin',
      'Technical debt hoặc constraint kỹ thuật',
    ],
  },
  {
    id: '2.3',
    section: 2,
    text: 'Trong kickoff dự án, PM thường phải chốt những nội dung nào?',
    type: 'multi-check',
    options: [
      'Scope',
      'Timeline / milestone',
      'Deliverables',
      'Team roles',
      'Communication channel',
      'Meeting cadence',
      'Reporting format',
      'Acceptance criteria',
      'Risk ban đầu',
      'Change request process',
      'Escalation path',
      'Definition of Done',
    ],
  },
  {
    id: '2.4',
    section: 2,
    text: 'Nếu thiếu tài liệu quan trọng khi nhận dự án, anh/chị thường xử lý thế nào?',
    type: 'single-choice',
    options: [
      'Vẫn nhận dự án, vừa làm vừa hỏi bổ sung',
      'Tạo danh sách missing information rồi yêu cầu bổ sung trước kickoff',
      'Họp với sales/account/PM cũ để lấy context miệng',
      'Tự tổng hợp từ email/chat/tài liệu rời rạc',
      'Escalate vì chưa đủ điều kiện nhận bàn giao',
    ],
  },
  {
    id: '3.1',
    section: 3,
    text: 'Scope dự án outsource thường được mô tả rõ đến mức nào trước khi bắt đầu?',
    type: 'single-range',
    options: [
      'Rất rõ, ít phải hỏi lại',
      'Khá rõ, chỉ thiếu chi tiết nhỏ',
      'Có scope tổng quan nhưng thiếu nhiều detail',
      'Mơ hồ, phải làm rõ liên tục',
      'Thường thay đổi ngay sau kickoff',
    ],
  },
  {
    id: '3.2',
    section: 3,
    text: 'Change request thường phát sinh vì lý do gì?',
    type: 'multi-check',
    options: [
      'Client nghĩ phần đó đã nằm trong scope',
      'Requirement ban đầu thiếu chi tiết',
      'User feedback sau demo/UAT',
      'Designer/BA đổi luồng',
      'Technical constraint mới phát hiện',
      'Integration/API bên thứ ba thay đổi',
      'Business priority của client thay đổi',
      'Estimate ban đầu sai',
      'Team hiểu sai requirement',
    ],
  },
  {
    id: '3.3',
    section: 3,
    text: 'Khi client yêu cầu thêm việc ngoài scope, anh/chị thường làm gì đầu tiên?',
    type: 'single-choice',
    options: [
      'Từ chối ngay vì ngoài scope',
      'Ghi nhận rồi phân tích impact trước',
      'Cho team làm nếu effort nhỏ',
      'Hỏi account/sales/manager trước khi phản hồi',
      'Tách thành change request chính thức',
    ],
  },
  {
    id: '3.4',
    section: 3,
    text: 'Một change request cần có những thông tin nào trước khi PM đồng ý đưa vào plan?',
    type: 'multi-check',
    options: [
      'Mô tả thay đổi',
      'Lý do business',
      'Mức độ ưu tiên',
      'Impact đến scope',
      'Impact đến timeline',
      'Impact đến cost/budget',
      'Impact đến resource',
      'Impact đến technical design',
      'Acceptance criteria',
      'Người approve phía client',
      'Người approve nội bộ',
    ],
  },
  {
    id: '3.5',
    section: 3,
    text: 'Trong dự án, requirement thường được quản lý ở đâu?',
    type: 'multi-check',
    options: [
      'Jira',
      'Trello/ClickUp/Asana',
      'Excel/Google Sheet',
      'Confluence/Notion',
      'Word/PDF',
      'Figma comment',
      'Email/chat',
      'Không có nơi cố định',
    ],
  },
  {
    id: '4.1',
    section: 4,
    text: 'PM thường lập plan ở mức chi tiết nào?',
    type: 'single-choice',
    options: [
      'Milestone-level: chỉ mốc lớn',
      'Sprint-level: theo sprint/iteration',
      'Task-level: từng task trong board',
      'Person-day/resource-level',
      'Tùy loại dự án',
    ],
  },
  {
    id: '4.2',
    section: 4,
    text: 'Khi estimate dự án, input nào ảnh hưởng nhiều nhất?',
    type: 'multi-check',
    options: [
      'Requirement detail',
      'Complexity kỹ thuật',
      'Integration/API bên thứ ba',
      'Năng lực team hiện tại',
      'Availability của resource',
      'Kinh nghiệm dự án tương tự',
      'Deadline client yêu cầu',
      'Buffer/risk',
      'Non-functional requirements',
      'Review/approval cycle của client',
    ],
  },
  {
    id: '4.3',
    section: 4,
    text: 'PM thường theo dõi resource bằng cách nào?',
    type: 'single-choice',
    options: [
      'Theo từng người và % allocation',
      'Theo role/team capacity',
      'Theo sprint velocity',
      'Theo timesheet thực tế',
      'Không theo dõi chi tiết, chỉ nhìn tiến độ task',
    ],
  },
  {
    id: '4.4',
    section: 4,
    text: 'Tình huống nào hay làm timeline bị trễ nhất?',
    type: 'multi-check',
    options: [
      'Requirement đổi',
      'Client phản hồi chậm',
      'Dev estimate thiếu',
      'Bug nhiều hơn dự kiến',
      'Thiếu resource',
      'Member nghỉ/đổi người',
      'Phụ thuộc API/bên thứ ba',
      'UAT kéo dài',
      'Deploy/release gặp lỗi',
      'Technical debt',
    ],
  },
  {
    id: '4.5',
    section: 4,
    text: 'Khi biết dự án có khả năng trễ, PM thường làm gì trước?',
    type: 'single-choice',
    options: [
      'Báo client ngay',
      'Báo nội bộ trước, thống nhất phương án rồi báo client',
      'Yêu cầu team OT để giữ timeline',
      'Cắt scope / dời scope sang phase sau',
      'Re-plan và trình nhiều option',
    ],
  },
  {
    id: '5.1',
    section: 5,
    text: 'Các hoạt động nào PM làm hằng ngày?',
    type: 'multi-check',
    options: [
      'Check board/task status',
      'Hỏi blocker của team',
      'Follow up client',
      'Check bug/issue mới',
      'Update timeline',
      'Update risk/issue log',
      'Join daily meeting',
      'Review output của BA/QA/dev',
      'Trả lời chat/email',
      'Báo cáo nhanh cho manager',
    ],
  },
  {
    id: '5.2',
    section: 5,
    text: 'Các hoạt động nào PM làm hằng tuần?',
    type: 'multi-check',
    options: [
      'Weekly report cho client',
      'Weekly report nội bộ',
      'Sprint planning',
      'Sprint review/demo',
      'Retrospective',
      'Resource planning',
      'Risk review',
      'Budget/burn check',
      'Backlog grooming',
      'Stakeholder sync',
    ],
  },
  {
    id: '5.3',
    section: 5,
    text: 'PM thường biết task đang lệch plan bằng dấu hiệu nào?',
    type: 'multi-check',
    options: [
      'Task quá hạn trên board',
      'Dev báo blocker',
      'QA phát hiện bug nhiều',
      'Daily update không rõ ràng',
      'Client hỏi nhiều lần',
      'Velocity giảm',
      'Estimate remaining tăng',
      'Pull request/review bị nghẽn',
      'Không có demo được sau sprint',
      'Cảm giác từ kinh nghiệm',
    ],
  },
  {
    id: '5.4',
    section: 5,
    text: 'Nếu một task bị kẹt 2-3 ngày không tiến triển, PM thường xử lý thế nào?',
    type: 'single-choice',
    options: [
      'Hỏi trực tiếp người phụ trách',
      'Kéo Tech Lead vào phân tích',
      'Đổi người xử lý',
      'Tách task nhỏ hơn',
      'Escalate với manager',
      'Báo client nếu ảnh hưởng timeline',
    ],
  },
  {
    id: '6.1',
    section: 6,
    text: 'PM giao tiếp với client chủ yếu qua kênh nào?',
    type: 'multi-check',
    options: [
      'Email',
      'Slack/Teams',
      'Zalo/Telegram',
      'Jira comment',
      'Meeting online',
      'Meeting onsite',
      'Weekly report document',
      'Dashboard/project board',
    ],
  },
  {
    id: '6.2',
    section: 6,
    text: 'Loại thông tin nào bắt buộc phải xác nhận bằng văn bản?',
    type: 'multi-check',
    options: [
      'Scope change',
      'Timeline change',
      'Cost/budget change',
      'Acceptance/UAT result',
      'Production release approval',
      'Major bug/incident',
      'Requirement clarification',
      'Resource change',
      'Out-of-scope rejection',
      'Risk acceptance',
    ],
  },
  {
    id: '6.3',
    section: 6,
    text: 'Client/stakeholder khó thường có hành vi nào?',
    type: 'multi-check',
    options: [
      'Đổi ý liên tục',
      'Không phản hồi đúng hạn',
      'Không đọc tài liệu nhưng vẫn comment',
      'Muốn thêm scope miễn phí',
      'Escalate trực tiếp lên management',
      'Yêu cầu deadline không thực tế',
      'Không thống nhất giữa các bên client',
      'Feedback mơ hồ',
      'Chỉ báo lỗi qua chat, không tạo ticket',
    ],
  },
  {
    id: '6.4',
    section: 6,
    text: 'Khi client phản ứng tiêu cực về tiến độ/chất lượng, PM thường phản hồi thế nào?',
    type: 'single-choice',
    options: [
      'Xin lỗi và cam kết fix ngay',
      'Giải thích nguyên nhân + đưa action plan',
      'Họp khẩn với client',
      'Báo nội bộ trước rồi mới phản hồi',
      'Gửi report dữ liệu để làm rõ tình hình',
    ],
  },
  {
    id: '7.1',
    section: 7,
    text: 'PM thường quản lý risk/issue ở đâu?',
    type: 'single-choice',
    options: [
      'File RAID log riêng',
      'Jira/board',
      'Weekly report',
      'Meeting notes',
      'Chat/email',
      'Trong đầu PM, chưa có file cố định',
    ],
  },
  {
    id: '7.2',
    section: 7,
    text: 'Những risk nào outsource project hay gặp nhất?',
    type: 'multi-check',
    options: [
      'Scope creep',
      'Requirement không rõ',
      'Client phản hồi chậm',
      'Estimate sai',
      'Resource thiếu/đổi người',
      'Quality thấp/bug nhiều',
      'Technical dependency',
      'Integration chậm',
      'UAT kéo dài',
      'Payment/billing issue',
      'Timezone/language/culture issue',
      'Security/compliance requirement phát sinh',
    ],
  },
  {
    id: '7.3',
    section: 7,
    text: 'Khi nào PM phải escalate nội bộ?',
    type: 'multi-check',
    options: [
      'Timeline có nguy cơ trễ',
      'Client yêu cầu ngoài scope',
      'Team thiếu resource',
      'Member performance kém',
      'Bug nghiêm trọng',
      'Conflict với client',
      'Cost vượt estimate',
      'Requirement không thể chốt',
      'Production incident',
      'Client không thanh toán/khó billing',
    ],
  },
  {
    id: '7.4',
    section: 7,
    text: 'Escalation nội bộ thường cần chuẩn bị gì?',
    type: 'multi-check',
    options: [
      'Mô tả vấn đề',
      'Timeline sự kiện',
      'Impact',
      'Root cause sơ bộ',
      'Options xử lý',
      'Recommendation của PM',
      'Người cần quyết định',
      'Deadline cần quyết định',
      'Evidence/link/ticket',
      'Risk nếu không xử lý',
    ],
  },
  {
    id: '8.1',
    section: 8,
    text: 'Definition of Done của dự án thường bao gồm gì?',
    type: 'multi-check',
    options: [
      'Code hoàn thành',
      'Dev self-test',
      'QA pass',
      'Bug critical/high đã fix',
      'Client review/demo',
      'UAT pass',
      'Document update',
      'Release note',
      'Deployment done',
      'Monitoring sau release',
    ],
  },
  {
    id: '8.2',
    section: 8,
    text: 'PM tham gia bug triage ở mức nào?',
    type: 'single-choice',
    options: [
      'Không tham gia, QA/Tech Lead tự xử lý',
      'Chỉ theo dõi bug critical/high',
      'Tham gia ưu tiên bug theo impact',
      'Tham gia daily trong giai đoạn UAT/release',
      'PM là người điều phối chính bug triage',
    ],
  },
  {
    id: '8.3',
    section: 8,
    text: 'Khi client báo bug nhưng team nghĩ đó là change request, PM xử lý thế nào?',
    type: 'single-choice',
    options: [
      'Theo client, coi là bug',
      'Theo team, coi là CR',
      'So lại scope/requirement/acceptance criteria',
      'Tổ chức meeting 3 bên để chốt',
      'Tạm fix trước rồi xử lý scope sau',
    ],
  },
  {
    id: '8.4',
    section: 8,
    text: 'Trước release, PM cần kiểm tra những gì?',
    type: 'multi-check',
    options: [
      'Scope release',
      'Bug còn mở',
      'UAT approval',
      'Release note',
      'Deployment plan',
      'Rollback plan',
      'Client confirmation',
      'Internal approval',
      'Support plan sau release',
      'Communication cho users/stakeholders',
    ],
  },
  {
    id: '9.1',
    section: 9,
    text: 'PM thường phải gửi những report nào?',
    type: 'multi-check',
    options: [
      'Daily status',
      'Weekly report cho client',
      'Weekly report nội bộ',
      'Sprint report',
      'Risk/issue report',
      'Resource utilization report',
      'Budget/burn report',
      'Change request report',
      'Release report',
      'Project closure report',
    ],
  },
  {
    id: '9.2',
    section: 9,
    text: 'Weekly report thường có những phần nào?',
    type: 'multi-check',
    options: [
      'Tổng quan trạng thái',
      'Việc đã hoàn thành',
      'Việc tuần tới',
      'Timeline/milestone',
      'Risk/issue',
      'Blocker cần client xử lý',
      'Change request',
      'Bug/quality status',
      'Resource status',
      'Decision needed',
      'Budget/cost nếu có',
    ],
  },
  {
    id: '9.3',
    section: 9,
    text: 'PM có cần theo dõi budget/cost/margin không?',
    type: 'single-choice',
    options: [
      'Có, PM theo dõi trực tiếp',
      'Có theo dõi nhưng manager/account chịu chính',
      'Chỉ theo dõi effort/burn, không biết margin',
      'Không theo dõi',
      'Tùy dự án',
    ],
  },
  {
    id: '9.4',
    section: 9,
    text: 'Dữ liệu nào thường dùng để biết dự án đang lỗ hoặc vượt effort?',
    type: 'multi-check',
    options: [
      'Timesheet',
      'Estimate vs actual',
      'Burn rate',
      'Resource allocation',
      'Number of CR miễn phí',
      'Bug/rework effort',
      'Delay cost',
      'Invoice/payment milestone',
      'Manager/account báo lại',
      'Không có dữ liệu rõ',
    ],
  },
  {
    id: '10.1',
    section: 10,
    text: 'Nếu ngày mai PM mới vào thay anh/chị, họ cần đọc gì đầu tiên?',
    type: 'matrix',
    rows: [
      'Contract/SOW',
      'Project plan/timeline',
      'Latest weekly report',
      'Risk/issue log',
      'Change request log',
      'Stakeholder list',
      'Meeting notes gần nhất',
      'Jira/project board',
      'Resource plan',
      'UAT/release status',
      'Budget/burn status',
      'Client communication history',
    ],
    columns: ['Bắt buộc đọc ngày đầu', 'Đọc trong tuần đầu', 'Có thì tốt', 'Không cần', 'Không có tài liệu này'],
  },
  {
    id: '10.2',
    section: 10,
    text: 'PM mới dễ mắc lỗi gì nhất khi nhận lại dự án?',
    type: 'multi-check',
    options: [
      'Không hiểu expectation thật của client',
      'Không biết scope nào đã cam kết',
      'Không biết vấn đề đang cháy',
      'Không biết ai là người quyết định',
      'Không biết lịch report/meeting',
      'Không biết rule escalation',
      'Không biết team member nào đang quá tải',
      'Không biết CR nào đang pending',
      'Không biết deadline/milestone quan trọng',
      'Không biết lịch sử conflict với client',
    ],
  },
  {
    id: '10.3',
    section: 10,
    text: 'Nếu có một AI PM assistant, anh/chị muốn nó hỗ trợ việc gì nhất?',
    type: 'multi-check',
    options: [
      'Tạo weekly report',
      'Tạo meeting agenda/minutes',
      'Tạo risk/issue summary',
      'Nhắc việc hằng ngày/tuần',
      'Phân tích change request',
      'Tạo escalation brief',
      'Tạo handover document',
      'Kiểm tra dự án có risk gì',
      'Tóm tắt client communication',
      'Tạo release checklist',
      'Tạo onboarding guide cho PM mới',
      'Hỏi đáp về tình trạng dự án',
    ],
  },
  {
    id: '10.4',
    section: 10,
    text: 'Những quyết định nào PM được tự quyết, không cần hỏi manager/client?',
    type: 'multi-check',
    options: [
      'Điều chỉnh task nội bộ',
      'Đổi người xử lý task nhỏ',
      'Re-prioritize bug nhỏ',
      'Dời task trong sprint nếu không ảnh hưởng milestone',
      'Từ chối request nhỏ ngoài scope',
      'Gửi report/status thông thường',
      'Đề xuất CR',
      'Chốt release/UAT',
      'Điều chỉnh timeline',
      'Cam kết thêm effort/cost',
    ],
  },
  {
    id: '10.5',
    section: 10,
    text: 'Điều gì PM mới tuyệt đối không được làm sai trong dự án outsource?',
    type: 'multi-check',
    options: [
      'Cam kết scope/timeline khi chưa confirm nội bộ',
      'Làm thêm ngoài scope mà không ghi nhận CR',
      'Báo trễ quá muộn',
      'Không lưu xác nhận bằng văn bản',
      'Bỏ qua stakeholder quan trọng',
      'Không update risk/issue',
      'Không theo dõi effort thực tế',
      'Không báo manager khi client escalate',
      'Release khi chưa có approval',
      'Để client hiểu sai trạng thái dự án',
    ],
  },
  {
    id: '10.6',
    section: 10,
    text: 'Artifact nào anh/chị có thể cung cấp bản mẫu/ẩn thông tin nhạy cảm để train skill?',
    type: 'multi-check',
    options: [
      'SOW/contract scope',
      'Project plan',
      'Weekly report',
      'Risk/issue log',
      'Change request log',
      'Meeting minutes',
      'Timeline/roadmap',
      'Resource plan',
      'Estimate file',
      'Sprint board screenshot',
      'Release checklist',
      'UAT/acceptance document',
      'Handover note',
      'Client email/chat mẫu',
    ],
  },
];
```

- [ ] **Step 3: Run question-bank validation again**

Run the command from Step 1.

Expected: PASS with no output.

- [ ] **Step 4: Commit question bank**

```bash
git add "tools/pm-survey/src/data/questions.js"
git commit -m "feat: add PM outsource survey questions" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Update landing and thank-you pages

**Files:**
- Modify: `tools/pm-survey/src/pages/LandingPage.jsx`
- Modify: `tools/pm-survey/src/pages/ThankYouPage.jsx`

- [ ] **Step 1: Write failing copy/storage check**

Run:

```bash
node --input-type=module <<'NODE'
import fs from 'node:fs';
const landing = fs.readFileSync('tools/pm-survey/src/pages/LandingPage.jsx', 'utf8');
const thanks = fs.readFileSync('tools/pm-survey/src/pages/ThankYouPage.jsx', 'utf8');
if (!landing.includes("sessionStorage.setItem('pm-survey-name', trimmed)")) throw new Error('landing does not set pm-survey-name');
if (!landing.includes('Khảo sát quy trình làm việc của PM Outsource')) throw new Error('landing title missing PM Outsource');
if (!landing.includes('handover, quản lý dự án, phối hợp client')) throw new Error('landing description missing PM workflow wording');
if (!thanks.includes('quy trình làm việc của PM outsource')) throw new Error('thank-you page still missing PM copy');
if (landing.includes("ba-survey-name")) throw new Error('landing still contains ba-survey-name');
if (thanks.includes('quy trình làm việc của BA')) throw new Error('thank-you still contains BA wording');
NODE
```

Expected before implementation: FAIL because cloned files still use BA wording/storage.

- [ ] **Step 2: Replace `tools/pm-survey/src/pages/LandingPage.jsx` content**

Use this full content:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';

export default function LandingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Vui lòng nhập tên để bắt đầu');
      return;
    }
    sessionStorage.setItem('pm-survey-name', trimmed);
    navigate('/survey');
  };

  return (
    <div className="landing">
      <div className="landing-card">
        <div className="landing-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>

        <h1>Khảo sát quy trình làm việc của PM Outsource</h1>

        <p className="landing-desc">
          Khảo sát này giúp bọn em hiểu cách anh/chị handover, quản lý dự án, phối hợp client,
          xử lý thay đổi, theo dõi rủi ro và báo cáo trong dự án outsource.
          Anh/chị chọn đáp án gần đúng nhất là được ạ
        </p>

        <div className="landing-stats">
          <div className="landing-stat">
            <div className="landing-stat-number">{questions.length}</div>
            <div className="landing-stat-label">câu hỏi</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-number">~15</div>
            <div className="landing-stat-label">phút</div>
          </div>
        </div>

        <div className="name-input-wrap">
          <label className="name-label" htmlFor="respondent-name">Tên của bạn</label>
          <input
            id="respondent-name"
            className={`name-input${error ? ' has-error' : ''}`}
            type="text"
            placeholder="Ví dụ: Anh/Chị PM dự án outsource"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            autoFocus
          />
          {error && <p className="name-error">{error}</p>}
        </div>

        <button className="landing-cta" onClick={handleStart}>
          Bắt đầu khảo sát
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <p className="landing-footer">Mọi câu trả lời đều được bảo mật</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Replace `tools/pm-survey/src/pages/ThankYouPage.jsx` content**

Use this full content:

```jsx
import { useNavigate } from 'react-router-dom';

export default function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div className="thankyou">
      <div className="thankyou-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1>Cảm ơn anh/chị!</h1>
      <p>Bọn em đã nhận được câu trả lời. Thông tin này sẽ giúp thiết kế skill AI phù hợp nhất cho quy trình làm việc của PM outsource.</p>
      <div style={{ marginTop: 28 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run copy/storage check again**

Run the command from Step 1.

Expected: PASS with no output.

- [ ] **Step 5: Commit landing and thank-you copy**

```bash
git add "tools/pm-survey/src/pages/LandingPage.jsx" "tools/pm-survey/src/pages/ThankYouPage.jsx"
git commit -m "feat: update PM survey landing copy" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Update survey and dashboard storage keys/copy

**Files:**
- Modify: `tools/pm-survey/src/pages/SurveyPage.jsx`
- Modify: `tools/pm-survey/src/pages/DashboardPage.jsx`

- [ ] **Step 1: Write failing PM key/copy check**

Run:

```bash
node --input-type=module <<'NODE'
import fs from 'node:fs';
const survey = fs.readFileSync('tools/pm-survey/src/pages/SurveyPage.jsx', 'utf8');
const dashboard = fs.readFileSync('tools/pm-survey/src/pages/DashboardPage.jsx', 'utf8');
if (!survey.includes("sessionStorage.getItem('pm-survey-name')")) throw new Error('SurveyPage missing pm-survey-name');
if (!survey.includes("localStorage.getItem('pm-survey-responses')")) throw new Error('SurveyPage missing pm-survey-responses get');
if (!survey.includes("localStorage.setItem('pm-survey-responses'")) throw new Error('SurveyPage missing pm-survey-responses set');
if (!dashboard.includes("sessionStorage.getItem('pm-dashboard-auth')")) throw new Error('DashboardPage missing pm-dashboard-auth get');
if (!dashboard.includes("sessionStorage.setItem('pm-dashboard-auth', '1')")) throw new Error('DashboardPage missing pm-dashboard-auth set');
if (!dashboard.includes("localStorage.getItem('pm-survey-responses')")) throw new Error('DashboardPage missing pm-survey-responses fallback');
if (!dashboard.includes('Dashboard khảo sát PM')) throw new Error('dashboard title missing PM wording');
if (!dashboard.includes('Gửi link cho PM để bắt đầu thu thập dữ liệu.')) throw new Error('empty dashboard copy missing PM wording');
for (const forbidden of ['ba-survey-name', 'ba-survey-responses', 'ba-dashboard-auth', 'Dashboard khảo sát BA', 'Gửi link cho BA']) {
  if (survey.includes(forbidden) || dashboard.includes(forbidden)) throw new Error(`forbidden copied BA token remains: ${forbidden}`);
}
NODE
```

Expected before implementation: FAIL because cloned files still use BA storage keys/copy.

- [ ] **Step 2: In `tools/pm-survey/src/pages/SurveyPage.jsx`, replace respondent storage key**

Replace:

```javascript
const respondentName = sessionStorage.getItem('ba-survey-name') || '';
```

with:

```javascript
const respondentName = sessionStorage.getItem('pm-survey-name') || '';
```

- [ ] **Step 3: In `tools/pm-survey/src/pages/SurveyPage.jsx`, replace response fallback storage key**

Replace:

```javascript
const existing = JSON.parse(localStorage.getItem('ba-survey-responses') || '[]');
existing.push(payload);
localStorage.setItem('ba-survey-responses', JSON.stringify(existing));
```

with:

```javascript
const existing = JSON.parse(localStorage.getItem('pm-survey-responses') || '[]');
existing.push(payload);
localStorage.setItem('pm-survey-responses', JSON.stringify(existing));
```

- [ ] **Step 4: In `tools/pm-survey/src/pages/DashboardPage.jsx`, replace dashboard auth key**

Replace:

```javascript
sessionStorage.setItem('ba-dashboard-auth', '1');
```

with:

```javascript
sessionStorage.setItem('pm-dashboard-auth', '1');
```

Replace:

```javascript
const [authed, setAuthed] = useState(() => sessionStorage.getItem('ba-dashboard-auth') === '1');
```

with:

```javascript
const [authed, setAuthed] = useState(() => sessionStorage.getItem('pm-dashboard-auth') === '1');
```

- [ ] **Step 5: In `tools/pm-survey/src/pages/DashboardPage.jsx`, replace response fallback key**

Replace:

```javascript
const local = JSON.parse(localStorage.getItem('ba-survey-responses') || '[]');
```

with:

```javascript
const local = JSON.parse(localStorage.getItem('pm-survey-responses') || '[]');
```

- [ ] **Step 6: In `tools/pm-survey/src/pages/DashboardPage.jsx`, replace visible dashboard wording**

Replace:

```jsx
<h1 style={{ fontSize: 22 }}>Dashboard khảo sát</h1>
```

with:

```jsx
<h1 style={{ fontSize: 22 }}>Dashboard khảo sát PM</h1>
```

Replace:

```jsx
<h1>Dashboard khảo sát BA</h1>
```

with:

```jsx
<h1>Dashboard khảo sát PM</h1>
```

Replace:

```jsx
<p style={{ fontSize: 13, marginTop: 8 }}>Gửi link cho BA để bắt đầu thu thập dữ liệu.</p>
```

with:

```jsx
<p style={{ fontSize: 13, marginTop: 8 }}>Gửi link cho PM để bắt đầu thu thập dữ liệu.</p>
```

- [ ] **Step 7: Run PM key/copy check again**

Run the command from Step 1.

Expected: PASS with no output.

- [ ] **Step 8: Commit survey/dashboard updates**

```bash
git add "tools/pm-survey/src/pages/SurveyPage.jsx" "tools/pm-survey/src/pages/DashboardPage.jsx"
git commit -m "feat: isolate PM survey storage and dashboard" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Validate build, lint, and PM-only wording

**Files:**
- Verify: `tools/pm-survey/`

- [ ] **Step 1: Install dependencies for PM app**

Run:

```bash
cd "tools/pm-survey" && npm install
```

Expected: dependencies install successfully and `package-lock.json` remains valid. If npm updates lockfile metadata, inspect and commit those changes with this task.

- [ ] **Step 2: Run lint**

Run:

```bash
cd "tools/pm-survey" && npm run lint
```

Expected: PASS with no ESLint errors.

- [ ] **Step 3: Run production build**

Run:

```bash
cd "tools/pm-survey" && npm run build
```

Expected: PASS and Vite writes `tools/pm-survey/dist/`.

- [ ] **Step 4: Run final content validation**

Run:

```bash
node --input-type=module <<'NODE'
import fs from 'node:fs';
import path from 'node:path';
const root = 'tools/pm-survey';
const files = [
  'index.html',
  'src/pages/LandingPage.jsx',
  'src/pages/SurveyPage.jsx',
  'src/pages/DashboardPage.jsx',
  'src/pages/ThankYouPage.jsx',
  'src/data/questions.js',
];
const text = files.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
const required = [
  'Khảo sát PM Outsource Workflow',
  'Khảo sát quy trình làm việc của PM Outsource',
  'pm-survey-name',
  'pm-survey-responses',
  'pm-dashboard-auth',
  'Dashboard khảo sát PM',
  'Handover, onboarding PM mới, skill hóa',
];
for (const token of required) {
  if (!text.includes(token)) throw new Error(`missing required token: ${token}`);
}
const forbidden = [
  'ba-survey-name',
  'ba-survey-responses',
  'ba-dashboard-auth',
  'Dashboard khảo sát BA',
  'quy trình làm việc của BA',
  'Gửi link cho BA',
];
for (const token of forbidden) {
  if (text.includes(token)) throw new Error(`forbidden BA token remains: ${token}`);
}
const { sections, questions } = await import('./tools/pm-survey/src/data/questions.js');
if (sections.length !== 10) throw new Error(`expected 10 sections, got ${sections.length}`);
if (questions.length !== 44) throw new Error(`expected 44 questions, got ${questions.length}`);
NODE
```

Expected: PASS with no output.

- [ ] **Step 5: Manual smoke test in browser**

Run:

```bash
cd "tools/pm-survey" && npm run dev
```

Open the local Vite URL. Verify:

1. Landing page title is “Khảo sát quy trình làm việc của PM Outsource”.
2. Enter a name and start survey.
3. Sidebar shows 10 sections.
4. Answer at least one question for each type: `multi-check`, `single-range`, `single-choice`, `matrix`.
5. Add `Ghi thêm` to one question.
6. Submit survey.
7. Open `/dashboard`, enter password `Nkg@6688`.
8. Dashboard title is “Dashboard khảo sát PM”.
9. Dashboard can show aggregated charts and the individual response.

- [ ] **Step 6: Remove generated `dist` before commit unless user wants built assets committed**

Run:

```bash
rm -rf "tools/pm-survey/dist"
```

Expected: `dist` removed. Do not remove `node_modules`; it should remain untracked and should not be committed.

- [ ] **Step 7: Commit validation-related lockfile changes if any**

Run:

```bash
git status --short "tools/pm-survey"
```

If only intended source/config files are changed, commit them. If `node_modules` appears, do not add it.

Use:

```bash
git add "tools/pm-survey"
git reset "tools/pm-survey/node_modules" 2>/dev/null || true
git reset "tools/pm-survey/dist" 2>/dev/null || true
git commit -m "test: validate PM survey app" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

If there are no changes after previous commits and removing `dist`, skip this commit and report that validation passed with no additional files changed.

---

## Task 7: Final repository check

**Files:**
- Verify: `tools/pm-survey/`
- Verify: `tools/ba-survey/`

- [ ] **Step 1: Confirm BA app was not modified**

Run:

```bash
git diff -- "tools/ba-survey"
```

Expected: no diff output.

- [ ] **Step 2: Confirm PM app files are tracked or intentionally untracked before final handoff**

Run:

```bash
git status --short
```

Expected:

- PM app source/config files are committed.
- Existing unrelated untracked paths may remain: `output/`, `raw-inputs.rar`, `raw-inputs/`, `reports/`, `research/`, `tools/ba-survey/`, `tools/extract_pdfs.py`.
- `tools/pm-survey/node_modules/` and `tools/pm-survey/dist/` are not staged.

- [ ] **Step 3: Final handoff summary**

Report:

```text
Done:
- Created tools/pm-survey as standalone React + Vite app.
- Added 42 PM outsource survey questions across 10 sections.
- Updated PM landing, thank-you, survey storage, dashboard storage, and dashboard wording.
- Verified question-bank validation, lint, build, and manual smoke test.

Not included in v1:
- Backend persistence.
- Export Excel/CSV.
- Artifact upload.
- AI analysis in dashboard.
```
