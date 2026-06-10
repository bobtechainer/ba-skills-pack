# PM Survey Redesign — Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Ngày: 2026-06-10

**Spec nguồn:** [docs/superpowers/specs/2026-06-10-pm-outsourcing-survey-redesign.md](../specs/2026-06-10-pm-outsourcing-survey-redesign.md)

**Goal:** Áp dụng bản redesign (23 câu / 6 phần, tiếng Việt only, bám research) vào web app PM survey hiện có tại `tools/pm-survey/`, rồi deploy lại Vercel project `pm-survey`. Không tạo app mới, không đổi cấu trúc.

**Architecture:** App là React + Vite, hoàn toàn data-driven. `SurveyPage`, `DashboardPage`, `Sidebar` render động từ `src/data/questions.js` (`sections` + `questions`). Vì vậy phần lớn redesign chỉ là thay nội dung `questions.js`, cộng vài câu copy hiển thị (landing, index.html, thank-you, dashboard title, thời lượng). Storage keys (`pm-survey-name`, `pm-survey-responses`, `pm-dashboard-auth`), password dashboard, API submit/responses/clear, Vercel routing giữ nguyên.

**Tech Stack:** React 19, Vite 8, React Router, Recharts, localStorage fallback + Vercel KV API. Không thêm dependency.

---

## Branch & worktree

- App `tools/pm-survey/` tồn tại trên branch **`pm-survey-web`** (worktree `.worktrees/pm-survey-web`), đã link với Vercel project `pm-survey` (`prj_IpGaQHPRAjpBGfp3ICFZDSX7IufI`).
- Spec + plan redesign nằm trên branch hiện tại **`pm-survey-design`**.
- **Quyết định triển khai:** thực thi các thay đổi code trong worktree `.worktrees/pm-survey-web` (nơi app + Vercel link tồn tại), commit lên branch `pm-survey-web`. Plan/spec doc giữ trên `pm-survey-design`.
- Mọi đường dẫn lệnh bên dưới chạy từ root worktree: `c:/Working/Techainer/BA Skills/.worktrees/pm-survey-web`.

---

## File Structure

### Modified (trong `tools/pm-survey/` của worktree pm-survey-web)

- `src/data/questions.js` — thay toàn bộ: 6 sections, 23 câu, tiếng Việt only.
- `src/pages/LandingPage.jsx` — đổi tiêu đề, mô tả, thời lượng `~15` → `~8–10`.
- `index.html` — đổi `<title>` và meta description theo định vị bàn giao.
- `src/pages/ThankYouPage.jsx` — đổi câu copy sang định vị bàn giao.
- `src/pages/DashboardPage.jsx` — đổi tiêu đề dashboard sang `Kết quả khảo sát PM`.

### Not modified

- `src/pages/SurveyPage.jsx` — đã data-driven, không cần đổi.
- Toàn bộ logic render, chart, matrix, sidebar, progress.
- Storage keys, password dashboard, `api/*`, `vercel.json`.
- `tools/ba-survey/` (không đụng tới).

---

## Task 1: Thay bộ câu hỏi sang 23 câu / 6 phần tiếng Việt

**Files:**
- Modify: `tools/pm-survey/src/data/questions.js`

- [ ] **Step 1: Viết validation cho bộ câu hỏi mới (chạy trước → FAIL)**

Chạy từ root worktree:

```bash
node --input-type=module <<'NODE'
const mod = await import('./tools/pm-survey/src/data/questions.js');
const { sections, questions } = mod;
if (sections.length !== 6) throw new Error(`expected 6 sections, got ${sections.length}`);
if (questions.length !== 23) throw new Error(`expected 23 questions, got ${questions.length}`);
const expectedTitles = [
  'Thông tin dự án và trách nhiệm PM',
  'Tài liệu và nguồn thông tin khi nhận bàn giao',
  'Công việc lặp lại hằng ngày/hằng tuần',
  'Thay đổi, rủi ro và vấn đề đang cháy',
  'Giao tiếp, người cần hỏi và quy ước ngầm',
  'PM mới và skill AI cần hỗ trợ',
];
for (const [i, title] of expectedTitles.entries()) {
  const s = sections[i];
  if (!s) throw new Error(`missing section ${i + 1}`);
  if (s.id !== i + 1) throw new Error(`section ${i + 1} id mismatch: ${s.id}`);
  if (s.title !== title) throw new Error(`section ${i + 1} title mismatch: ${s.title}`);
}
const perSection = { 1: 3, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4 };
for (const [sid, n] of Object.entries(perSection)) {
  const c = questions.filter((q) => q.section === Number(sid)).length;
  if (c !== n) throw new Error(`section ${sid} expected ${n} questions, got ${c}`);
}
const ids = new Set();
const allowed = new Set(['single-range', 'single-choice', 'multi-check', 'matrix']);
for (const q of questions) {
  if (ids.has(q.id)) throw new Error(`duplicate id ${q.id}`);
  ids.add(q.id);
  if (!allowed.has(q.type)) throw new Error(`invalid type ${q.type} at ${q.id}`);
  if (!sections.some((s) => s.id === q.section)) throw new Error(`invalid section ${q.section} at ${q.id}`);
  if (!q.text || !q.text.trim()) throw new Error(`empty text at ${q.id}`);
  if (q.type === 'matrix') {
    if (!Array.isArray(q.rows) || !q.rows.length) throw new Error(`matrix ${q.id} missing rows`);
    if (!Array.isArray(q.columns) || !q.columns.length) throw new Error(`matrix ${q.id} missing columns`);
  } else {
    if (!Array.isArray(q.options) || !q.options.length) throw new Error(`question ${q.id} missing options`);
  }
}
for (const id of ['1.1', '2.1', '3.3', '4.2', '5.3', '6.4']) {
  if (!ids.has(id)) throw new Error(`missing expected id ${id}`);
}
console.log('OK', sections.length, 'sections,', questions.length, 'questions');
NODE
```

Kỳ vọng trước khi sửa: FAIL (đang là 10 sections / 42 câu).

- [ ] **Step 2: Thay toàn bộ nội dung `tools/pm-survey/src/data/questions.js`**

Dùng đúng nội dung sau:

```javascript
export const sections = [
  { id: 1, title: 'Thông tin dự án và trách nhiệm PM' },
  { id: 2, title: 'Tài liệu và nguồn thông tin khi nhận bàn giao' },
  { id: 3, title: 'Công việc lặp lại hằng ngày/hằng tuần' },
  { id: 4, title: 'Thay đổi, rủi ro và vấn đề đang cháy' },
  { id: 5, title: 'Giao tiếp, người cần hỏi và quy ước ngầm' },
  { id: 6, title: 'PM mới và skill AI cần hỗ trợ' },
];

export const questions = [
  // ─── Phần 1 — Thông tin dự án và trách nhiệm PM ───
  {
    id: '1.1',
    section: 1,
    text: 'Hiện tại anh/chị đang quản lý loại dự án outsource nào nhiều nhất?',
    type: 'single-choice',
    options: [
      'Dự án làm theo phạm vi cố định',
      'Dự án làm theo thời gian và nhân sự',
      'Đội outsource vận hành dài hạn cho khách hàng',
      'Dự án bảo trì/nâng cấp hệ thống có sẵn',
      'Khác',
    ],
  },
  {
    id: '1.2',
    section: 1,
    text: 'Trong dự án đó, PM thực tế chịu trách nhiệm những phần nào?',
    type: 'multi-check',
    options: [
      'Theo dõi tiến độ và mốc bàn giao',
      'Làm rõ yêu cầu với khách hàng',
      'Quản lý phạm vi và yêu cầu thay đổi',
      'Điều phối công việc của đội dự án',
      'Báo cáo tình trạng dự án cho khách hàng',
      'Báo cáo nội bộ cho quản lý',
      'Theo dõi rủi ro và vấn đề phát sinh',
      'Theo dõi chi phí/effort nếu có',
    ],
  },
  {
    id: '1.3',
    section: 1,
    text: 'Nếu PM mới vào thay anh/chị, phần nào khó nắm nhất trong 1 tuần đầu?',
    type: 'multi-check',
    options: [
      'Dự án đang làm đến đâu',
      'Phạm vi nào đã cam kết với khách hàng',
      'Khách hàng thật sự đang kỳ vọng gì',
      'Việc nào đang trễ hoặc có nguy cơ trễ',
      'Ai là người quyết định ở mỗi bên',
      'Đội dự án đang mạnh/yếu ở đâu',
      'Tài liệu nào mới nhất, tài liệu nào đã cũ',
      'Quy trình báo cáo và họp định kỳ',
    ],
  },

  // ─── Phần 2 — Tài liệu và nguồn thông tin khi nhận bàn giao ───
  {
    id: '2.1',
    section: 2,
    text: 'Khi nhận bàn giao một dự án, anh/chị thường có sẵn những gì?',
    type: 'matrix',
    rows: [
      'Hợp đồng/phạm vi công việc',
      'Kế hoạch dự án hoặc mốc bàn giao',
      'Danh sách nhân sự dự án',
      'Danh sách người liên hệ phía khách hàng',
      'Báo cáo tuần gần nhất',
      'Danh sách rủi ro/vấn đề',
      'Danh sách yêu cầu thay đổi',
      'Biên bản họp hoặc ghi chú trao đổi cũ',
      'Tài liệu yêu cầu hoặc mô tả nghiệp vụ',
      'Link công cụ quản lý task',
    ],
    columns: ['Có và dùng được', 'Có nhưng chưa đủ', 'Có nhưng đã cũ', 'Không có'],
  },
  {
    id: '2.2',
    section: 2,
    text: 'Trong các tài liệu trên, tài liệu nào PM mới bắt buộc phải đọc đầu tiên?',
    type: 'multi-check',
    options: [
      'Hợp đồng/phạm vi công việc',
      'Kế hoạch dự án hoặc mốc bàn giao',
      'Báo cáo tuần gần nhất',
      'Danh sách rủi ro/vấn đề',
      'Danh sách yêu cầu thay đổi',
      'Biên bản họp gần nhất',
      'Công cụ quản lý task',
      'Danh sách người liên hệ',
    ],
  },
  {
    id: '2.3',
    section: 2,
    text: 'Tài liệu dự án hiện tại có hay bị lệch so với thực tế không?',
    type: 'single-range',
    options: [
      'Hiếm khi lệch, tài liệu khá cập nhật',
      'Có lệch nhẹ nhưng vẫn dùng được',
      'Lệch khá nhiều, phải hỏi người đang làm',
      'Lệch rất nhiều, tài liệu chỉ để tham khảo',
      'Không có tài liệu đủ tin cậy',
    ],
  },
  {
    id: '2.4',
    section: 2,
    text: 'Khi tài liệu không đủ, anh/chị thường phải hỏi ai để hiểu đúng tình hình?',
    type: 'multi-check',
    options: [
      'PM cũ',
      'Quản lý trực tiếp',
      'Trưởng nhóm kỹ thuật',
      'BA',
      'QA/QC',
      'Lập trình viên chính',
      'Khách hàng',
      'Sales/account phụ trách khách hàng',
    ],
  },

  // ─── Phần 3 — Công việc lặp lại hằng ngày/hằng tuần ───
  {
    id: '3.1',
    section: 3,
    text: 'Những việc nào PM phải làm lặp lại hằng ngày?',
    type: 'multi-check',
    options: [
      'Kiểm tra trạng thái công việc',
      'Hỏi đội dự án có bị vướng gì không',
      'Nhắc người phụ trách cập nhật tiến độ',
      'Trả lời tin nhắn/email của khách hàng',
      'Kiểm tra lỗi hoặc vấn đề mới phát sinh',
      'Cập nhật kế hoạch hoặc mốc bàn giao',
      'Báo cáo nhanh cho quản lý',
      'Chuẩn bị nội dung cho cuộc họp gần nhất',
    ],
  },
  {
    id: '3.2',
    section: 3,
    text: 'Những việc nào PM phải làm lặp lại hằng tuần?',
    type: 'multi-check',
    options: [
      'Gửi báo cáo tuần cho khách hàng',
      'Gửi báo cáo tuần nội bộ',
      'Họp cập nhật tiến độ với khách hàng',
      'Họp nội bộ với đội dự án',
      'Rà soát rủi ro/vấn đề',
      'Rà soát kế hoạch và mốc bàn giao',
      'Rà soát yêu cầu thay đổi',
      'Chuẩn bị demo hoặc nghiệm thu',
    ],
  },
  {
    id: '3.3',
    section: 3,
    text: 'Việc lặp lại nào tốn thời gian nhất với PM?',
    type: 'single-choice',
    options: [
      'Tổng hợp báo cáo',
      'Theo dõi và nhắc tiến độ',
      'Làm rõ yêu cầu với khách hàng',
      'Xử lý thay đổi phạm vi',
      'Họp và ghi chú sau họp',
      'Theo dõi rủi ro/vấn đề',
      'Khác',
    ],
  },
  {
    id: '3.4',
    section: 3,
    text: 'Báo cáo tuần thường phải lấy thông tin từ đâu?',
    type: 'multi-check',
    options: [
      'Công cụ quản lý công việc',
      'Tin nhắn/email',
      'Biên bản họp',
      'Hỏi trực tiếp từng thành viên',
      'File kế hoạch dự án',
      'Danh sách lỗi/vấn đề',
      'Danh sách yêu cầu thay đổi',
      'Ghi chú riêng của PM',
    ],
  },

  // ─── Phần 4 — Thay đổi, rủi ro và vấn đề đang cháy ───
  {
    id: '4.1',
    section: 4,
    text: 'Dự án outsource thường bị thay đổi vì lý do gì?',
    type: 'multi-check',
    options: [
      'Khách hàng đổi ý hoặc đổi ưu tiên',
      'Yêu cầu ban đầu chưa rõ',
      'Sau khi demo mới phát hiện thiếu',
      'Đội dự án hiểu sai yêu cầu',
      'Phụ thuộc bên thứ ba thay đổi',
      'Ước lượng ban đầu chưa sát',
      'Có vấn đề kỹ thuật mới phát hiện',
      'Có người nghỉ hoặc đổi nhân sự',
    ],
  },
  {
    id: '4.2',
    section: 4,
    text: 'Khi có yêu cầu mới nghi là ngoài phạm vi, PM thường làm gì đầu tiên?',
    type: 'single-choice',
    options: [
      'Ghi nhận rồi phân tích ảnh hưởng trước',
      'Hỏi quản lý/account trước khi phản hồi',
      'Từ chối ngay vì ngoài phạm vi',
      'Cho đội làm nếu thấy nhỏ',
      'Tách thành yêu cầu thay đổi chính thức',
    ],
  },
  {
    id: '4.3',
    section: 4,
    text: 'Dấu hiệu nào cho thấy dự án sắp có vấn đề trước khi nó bùng lên?',
    type: 'multi-check',
    options: [
      'Công việc quá hạn nhưng chưa ai báo',
      'Thành viên trả lời mơ hồ về tiến độ',
      'Khách hàng hỏi lại nhiều lần cùng một vấn đề',
      'Lỗi phát sinh nhiều hơn bình thường',
      'Phần việc phụ thuộc bên khác chưa có phản hồi',
      'Kế hoạch phải dời nhiều lần',
      'Không có bản demo đúng hẹn',
      'Nội bộ và khách hàng hiểu khác nhau',
    ],
  },
  {
    id: '4.4',
    section: 4,
    text: 'Những vấn đề nào PM mới cần biết ngay khi nhận dự án?',
    type: 'multi-check',
    options: [
      'Việc đang trễ',
      'Rủi ro có thể ảnh hưởng mốc bàn giao',
      'Khách hàng đang không hài lòng',
      'Yêu cầu thay đổi đang chờ quyết định',
      'Lỗi nghiêm trọng chưa xử lý xong',
      'Thiếu người hoặc người sắp nghỉ',
      'Phụ thuộc bên ngoài chưa xong',
      'Vấn đề về chi phí/effort nếu có',
    ],
  },

  // ─── Phần 5 — Giao tiếp, người cần hỏi và quy ước ngầm ───
  {
    id: '5.1',
    section: 5,
    text: 'Thông tin nào bắt buộc phải xác nhận bằng văn bản, không chỉ nói miệng?',
    type: 'multi-check',
    options: [
      'Thay đổi phạm vi',
      'Thay đổi kế hoạch hoặc mốc bàn giao',
      'Thay đổi chi phí/effort',
      'Xác nhận nghiệm thu',
      'Xác nhận bàn giao/phát hành',
      'Kết luận sau cuộc họp quan trọng',
      'Khách hàng chấp nhận rủi ro',
      'Từ chối yêu cầu ngoài phạm vi',
    ],
  },
  {
    id: '5.2',
    section: 5,
    text: 'PM mới dễ hiểu sai điều gì nhất khi giao tiếp với khách hàng?',
    type: 'multi-check',
    options: [
      'Ai mới là người có quyền quyết định',
      'Khách hàng nói “gấp” nhưng thực tế mức độ ưu tiên khác',
      'Khách hàng đồng ý miệng nhưng chưa chốt chính thức',
      'Một bên khách hàng đồng ý nhưng bên khác chưa đồng ý',
      'Khách hàng tưởng một việc đã nằm trong phạm vi',
      'Khách hàng dùng từ chuyên môn khác với đội dự án',
      'Khách hàng không nói rõ deadline thật',
    ],
  },
  {
    id: '5.3',
    section: 5,
    text: 'Có quy ước ngầm nào PM mới bắt buộc phải biết không?',
    type: 'single-choice',
    options: [
      'Có nhiều, nếu không biết sẽ dễ làm sai',
      'Có một vài quy ước quan trọng',
      'Ít, chủ yếu đã ghi trong tài liệu',
      'Hầu như không có',
      'Không chắc',
    ],
  },
  {
    id: '5.4',
    section: 5,
    text: 'Nếu có quy ước ngầm, nó thường thuộc nhóm nào?',
    type: 'multi-check',
    options: [
      'Cách phản hồi khách hàng',
      'Cách báo cáo nội bộ',
      'Khi nào phải báo quản lý',
      'Ai cần được hỏi trước khi quyết định',
      'Việc gì không được tự cam kết',
      'Cách xử lý khi khách hàng gây áp lực',
      'Cách ghi nhận thay đổi phạm vi',
      'Cách ưu tiên việc cho đội dự án',
    ],
  },

  // ─── Phần 6 — PM mới và skill AI cần hỗ trợ ───
  {
    id: '6.1',
    section: 6,
    text: 'Nếu PM mới chỉ có 1 ngày đầu để nắm dự án, anh/chị muốn họ đọc/xem gì trước?',
    type: 'multi-check',
    options: [
      'Tóm tắt trạng thái dự án hiện tại',
      'Kế hoạch và mốc bàn giao',
      'Danh sách rủi ro/vấn đề',
      'Danh sách người liên hệ',
      'Báo cáo tuần gần nhất',
      'Yêu cầu thay đổi đang chờ xử lý',
      'Công cụ quản lý công việc',
      'Các quyết định quan trọng đã chốt',
    ],
  },
  {
    id: '6.2',
    section: 6,
    text: 'PM mới thường dễ làm sai việc gì nhất?',
    type: 'multi-check',
    options: [
      'Cam kết với khách hàng khi chưa hỏi nội bộ',
      'Không biết việc nào đang trễ',
      'Không nắm phạm vi đã cam kết',
      'Không lưu xác nhận bằng văn bản',
      'Bỏ sót người cần được thông báo',
      'Không biết lịch họp/báo cáo định kỳ',
      'Không báo sớm khi có rủi ro',
      'Không biết yêu cầu thay đổi nào đang chờ',
    ],
  },
  {
    id: '6.3',
    section: 6,
    text: 'Nếu có skill AI hỗ trợ PM mới, anh/chị muốn ưu tiên việc nào nhất?',
    type: 'multi-check',
    options: [
      'Tạo tài liệu bàn giao dự án',
      'Tóm tắt trạng thái dự án hiện tại',
      'Tạo báo cáo tuần',
      'Liệt kê rủi ro/vấn đề cần chú ý',
      'Tóm tắt yêu cầu thay đổi',
      'Tạo danh sách việc cần làm trong tuần',
      'Soạn nội dung cập nhật cho khách hàng',
      'Gợi ý câu hỏi cần hỏi PM cũ/đội dự án',
    ],
  },
  {
    id: '6.4',
    section: 6,
    text: 'Anh/chị có thể cung cấp bản mẫu/đã ẩn thông tin nhạy cảm của tài liệu nào để thiết kế skill không?',
    type: 'multi-check',
    options: [
      'Báo cáo tuần',
      'Kế hoạch dự án',
      'Danh sách rủi ro/vấn đề',
      'Danh sách yêu cầu thay đổi',
      'Biên bản họp',
      'Tài liệu phạm vi công việc',
      'Tài liệu bàn giao nếu có',
      'Ảnh chụp công cụ quản lý công việc',
    ],
  },
];
```

- [ ] **Step 3: Chạy lại validation ở Step 1 → PASS**

Kỳ vọng: in `OK 6 sections, 23 questions`.

- [ ] **Step 4: Commit bộ câu hỏi**

```bash
git add "tools/pm-survey/src/data/questions.js"
git commit -m "feat: redesign PM survey to 23 Vietnamese questions" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Cập nhật copy landing, index.html, thank-you, dashboard title

**Files:**
- Modify: `tools/pm-survey/src/pages/LandingPage.jsx`
- Modify: `tools/pm-survey/index.html`
- Modify: `tools/pm-survey/src/pages/ThankYouPage.jsx`
- Modify: `tools/pm-survey/src/pages/DashboardPage.jsx`

- [ ] **Step 1: Viết kiểm tra copy (chạy trước → FAIL)**

```bash
node --input-type=module <<'NODE'
import fs from 'node:fs';
const r = (p) => fs.readFileSync(`tools/pm-survey/${p}`, 'utf8');
const landing = r('src/pages/LandingPage.jsx');
const html = r('index.html');
const thanks = r('src/pages/ThankYouPage.jsx');
const dash = r('src/pages/DashboardPage.jsx');
const need = [
  [landing, 'Khảo sát bàn giao công việc PM outsource'],
  [landing, 'thiết kế skill AI hỗ trợ PM mới tiếp quản công việc'],
  [landing, '~8–10'],
  [html, 'Khảo sát bàn giao công việc PM outsource'],
  [thanks, 'bàn giao công việc'],
  [dash, 'Kết quả khảo sát PM'],
];
for (const [text, token] of need) {
  if (!text.includes(token)) throw new Error(`missing required: ${token}`);
}
const forbid = [
  [landing, '~15'],
  [landing, 'quy trình làm việc của PM Outsource'],
];
for (const [text, token] of forbid) {
  if (text.includes(token)) throw new Error(`stale token remains: ${token}`);
}
console.log('OK copy');
NODE
```

Kỳ vọng trước khi sửa: FAIL.

- [ ] **Step 2: `LandingPage.jsx` — đổi tiêu đề, mô tả, thời lượng**

Thay:

```jsx
        <h1>Khảo sát quy trình làm việc của PM Outsource</h1>

        <p className="landing-desc">
          Khảo sát này giúp bọn em hiểu cách anh/chị handover, quản lý dự án, phối hợp client,
          xử lý thay đổi, theo dõi rủi ro và báo cáo trong dự án outsource.
          Anh/chị chọn đáp án gần đúng nhất là được ạ
        </p>
```

bằng:

```jsx
        <h1>Khảo sát bàn giao công việc PM outsource</h1>

        <p className="landing-desc">
          Khảo sát này giúp bọn em hiểu cách anh/chị đang quản lý dự án outsource,
          những tài liệu, routine, rủi ro và quy ước ngầm cần bàn giao, để thiết kế
          skill AI hỗ trợ PM mới tiếp quản công việc nhanh hơn.
          Anh/chị chọn đáp án gần đúng nhất, mỗi câu có thể ghi thêm nếu muốn.
        </p>
```

Và thay thời lượng:

```jsx
            <div className="landing-stat-number">~15</div>
```

bằng:

```jsx
            <div className="landing-stat-number">~8–10</div>
```

- [ ] **Step 3: `index.html` — đổi title (giữ meta description đã hợp lý hoặc đồng bộ)**

Thay:

```html
    <title>Khảo sát PM Outsource Workflow</title>
```

bằng:

```html
    <title>Khảo sát bàn giao công việc PM outsource</title>
```

- [ ] **Step 4: `ThankYouPage.jsx` — đổi câu mô tả sang định vị bàn giao**

Thay:

```jsx
      <p>Bọn em đã nhận được câu trả lời. Thông tin này sẽ giúp thiết kế skill AI phù hợp nhất cho quy trình làm việc của PM outsource.</p>
```

bằng:

```jsx
      <p>Bọn em đã nhận được câu trả lời. Thông tin này sẽ giúp thiết kế skill AI hỗ trợ bàn giao công việc và onboarding PM mới nhanh hơn.</p>
```

- [ ] **Step 5: `DashboardPage.jsx` — đổi tiêu đề trang kết quả**

Thay (trong phần dashboard header, không phải password gate):

```jsx
        <h1>Dashboard khảo sát PM</h1>
```

bằng:

```jsx
        <h1>Kết quả khảo sát PM</h1>
```

> Giữ nguyên password gate title `Dashboard khảo sát PM` ở `PasswordGate` (chỉ đổi tiêu đề trang kết quả). Nếu muốn đồng bộ luôn cả gate, đổi cả 2 — không bắt buộc cho acceptance.

- [ ] **Step 6: Chạy lại kiểm tra copy ở Step 1 → PASS**

- [ ] **Step 7: Commit copy**

```bash
git add "tools/pm-survey/src/pages/LandingPage.jsx" "tools/pm-survey/index.html" "tools/pm-survey/src/pages/ThankYouPage.jsx" "tools/pm-survey/src/pages/DashboardPage.jsx"
git commit -m "feat: update PM survey copy to handover positioning" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Lint, build, smoke test

**Files:**
- Verify: `tools/pm-survey/`

- [ ] **Step 1: Cài deps (nếu chưa có node_modules trong worktree)**

```bash
cd "tools/pm-survey" && npm install
```

- [ ] **Step 2: Lint**

```bash
cd "tools/pm-survey" && npm run lint
```

Kỳ vọng: không có lỗi ESLint.

- [ ] **Step 3: Build**

```bash
cd "tools/pm-survey" && npm run build
```

Kỳ vọng: build pass, Vite ghi `dist/`.

- [ ] **Step 4: Smoke test thủ công**

```bash
cd "tools/pm-survey" && npm run dev
```

Mở URL Vite, kiểm tra:

1. Landing: tiêu đề `Khảo sát bàn giao công việc PM outsource`, thời lượng `~8–10 phút`, `23 câu hỏi`.
2. Nhập tên → bắt đầu. Sidebar hiển thị **6 phần**.
3. Trả lời mỗi loại câu: `multi-check`, `single-range`, `single-choice`, `matrix` (câu 2.1).
4. Thử `+ Ghi thêm` một câu.
5. Gửi khảo sát → trang cảm ơn mới.
6. Mở `/dashboard`, mật khẩu `Nkg@6688` → tiêu đề `Kết quả khảo sát PM`, chart + xem từng người chạy đúng với matrix mới.

---

## Task 4: Xử lý dữ liệu cũ (nếu có) và redeploy Vercel

**Files:**
- Verify/operate: Vercel project `pm-survey`

- [ ] **Step 1: Quyết định về response cũ**

Response cũ (nếu đã thu) lưu theo id bộ 42 câu cũ → không khớp bộ 23 câu mới, dashboard sẽ hiện "Chưa trả lời" cho id mới. Nếu chưa thu data thật:

- Tùy chọn: gọi clear API để dọn KV trước khi thu mới. Endpoint: `POST /api/clear` (xem `tools/pm-survey/api/clear.js` để biết cơ chế/secret nếu có). **Chỉ chạy nếu chắc chắn không cần giữ data cũ.**

- [ ] **Step 2: Bỏ `dist` khỏi commit nếu repo ignore nó (kiểm tra `.gitignore`)**

```bash
git status --short "tools/pm-survey"
```

Không add `node_modules`/`dist` nếu đang được ignore.

- [ ] **Step 3: Redeploy Vercel**

> Bước outward-facing — chỉ chạy sau khi build/lint pass và bạn đã duyệt. Cần đăng nhập Vercel CLI.

```bash
cd "tools/pm-survey" && vercel --prod
```

Hoặc nếu deploy auto theo git: push branch `pm-survey-web` lên remote đã liên kết với Vercel project `pm-survey`.

- [ ] **Step 4: Verify production**

Mở URL production, lặp lại smoke test ở Task 3 Step 4 (ít nhất landing + 1 lần submit + dashboard).

---

## Acceptance criteria (từ spec mục 8)

1. App chỉ còn **23 câu / 6 phần**. ✅ (Task 1 validation)
2. Nội dung hiển thị là tiếng Việt tự nhiên. ✅
3. Landing, thank-you, dashboard dùng định vị "bàn giao công việc PM outsource". ✅ (Task 2)
4. Dashboard hoạt động với question types hiện có (single-choice/single-range/multi-check/matrix). ✅
5. Build/lint pass. ✅ (Task 3)
6. Deploy lại được lên Vercel. ✅ (Task 4)
7. Bộ câu hỏi bám insight `research/`. ✅ (theo spec)

## Ngoài phạm vi

- Không đổi framework, không thêm backend mới, không thêm upload file.
- Không đổi password dashboard.
- Không thêm AI analytics trong dashboard.
