export const sections = [
  { id: 1, title: 'Tài liệu và luồng thông tin' },
  { id: 2, title: 'Nhịp làm việc hằng ngày' },
  { id: 3, title: 'Quản lý thay đổi, rủi ro và giao tiếp' },
  { id: 4, title: 'Đánh giá tổng thể' },
];

export const questions = [
  // ─── Phần 1 — Tài liệu và luồng thông tin ───
  {
    id: '1.1',
    section: 1,
    text: 'Nếu bạn vắng mặt đột xuất, đồng nghiệp cùng chuyên môn sẽ cần khoảng bao nhiêu thời gian đọc tài liệu dự án hiện tại để có thể duy trì công việc thay bạn?',
    type: 'single-range',
    options: ['Dưới 2 giờ', 'Nửa ngày', '1 ngày', '2 - 3 ngày', 'Hơn 1 tuần (hoặc không thể)'],
  },
  {
    id: '1.2',
    section: 1,
    text: 'Khoảng bao nhiêu % các quyết định thay đổi quan trọng (scope, requirement) được cập nhật vào tài liệu chính thức, thay vì chỉ trôi nổi trong tin nhắn/email?',
    type: 'single-range',
    options: ['Dưới 20%', '20 - 50%', '50 - 80%', 'Trên 80%', 'Gần như 100%'],
  },
  {
    id: '1.3',
    section: 1,
    text: 'Trung bình, một người mới (có chuyên môn) vào dự án sẽ mất bao lâu để tự tìm thấy các tài liệu quy trình và thông tin cần thiết dựa vào cấu trúc thư mục hiện tại?',
    type: 'single-range',
    options: ['Vài chục phút', '1 - 2 giờ', 'Nửa ngày', '1 ngày', 'Nhiều ngày (phải hỏi liên tục)'],
  },
  {
    id: '1.4',
    section: 1,
    text: 'Trong số 10 quyết định thiết kế/nghiệp vụ quan trọng gần nhất của dự án, có bao nhiêu quyết định được ghi lại lý do (why) thay vì chỉ ghi kết quả (what)?',
    type: 'single-range',
    options: ['0 - 2 quyết định', '3 - 4 quyết định', '5 - 6 quyết định', '7 - 8 quyết định', '9 - 10 quyết định'],
  },

  // ─── Phần 2 — Nhịp làm việc hằng ngày ───
  {
    id: '2.1',
    section: 2,
    text: 'Bạn thường dành bao nhiêu % thời gian làm việc trong ngày cho các công việc lặp lại (gom nhặt status, nhắc nhở task, báo cáo)?',
    type: 'single-range',
    options: ['Dưới 10%', '10 - 20%', '20 - 40%', '40 - 60%', 'Trên 60%'],
  },
  {
    id: '2.2',
    section: 2,
    text: 'Trong một tuần, có khoảng bao nhiêu issue/vướng mắc lắt nhắt (firefighting) phát sinh cần bạn phải trực tiếp đứng ra điều phối?',
    type: 'single-range',
    options: ['1 - 2 sự việc', '3 - 5 sự việc', '6 - 10 sự việc', 'Trên 10 sự việc', 'Xảy ra liên tục mỗi ngày'],
  },
  {
    id: '2.3',
    section: 2,
    text: 'Giả sử team vừa hoàn thành một milestone, thời gian bạn mất để tổng hợp báo cáo và cập nhật tình hình cho các bên liên quan là bao lâu?',
    type: 'single-choice',
    options: [
      'Gần như tức thì (dưới 15 phút) nhờ tool tự động.',
      'Khoảng 15 - 30 phút (dùng template có sẵn).',
      'Khoảng 1 - 2 tiếng (phải gom nhặt thông tin từ nhiều nguồn).',
      'Hơn nửa ngày làm việc.',
    ],
  },

  // ─── Phần 3 — Quản lý thay đổi, rủi ro và giao tiếp ───
  {
    id: '3.1',
    section: 3,
    text: 'Bao nhiêu % thông tin/quy ước vận hành dự án nằm ở dạng "hiểu ngầm" (tribal knowledge) giữa các thành viên cốt cán, chưa được văn bản hóa?',
    type: 'single-range',
    options: ['Dưới 10%', '10 - 30%', '30 - 50%', '50 - 70%', 'Trên 70%'],
  },
  {
    id: '3.2',
    section: 3,
    text: 'Trong 10 rủi ro/issue gần nhất phát sinh trong dự án, có bao nhiêu cái đã được dự đoán hoặc cảnh báo từ trước?',
    type: 'single-range',
    options: ['0 - 2 cái', '3 - 4 cái', '5 - 6 cái', '7 - 8 cái', '9 - 10 cái'],
  },
  {
    id: '3.3',
    section: 3,
    text: 'Trung bình một tuần, dự án của bạn có bao nhiêu yêu cầu thay đổi (CR) đột xuất từ phía khách hàng làm ảnh hưởng đến tiến độ/kiến trúc?',
    type: 'single-range',
    options: ['Không có', '1 - 2 yêu cầu', '3 - 5 yêu cầu', '6 - 10 yêu cầu', 'Hơn 10 yêu cầu'],
  },
  {
    id: '3.4',
    section: 3,
    text: 'Trong quá trình giao tiếp hằng ngày với khách hàng, trung bình họ mất bao lâu để phản hồi một câu hỏi làm rõ nghiệp vụ (clarification)?',
    type: 'single-range',
    options: ['Dưới 1 giờ', 'Vài giờ', 'Trong ngày', '1 - 2 ngày', 'Hơn 2 ngày (phải nhắc liên tục)'],
  },
  {
    id: '3.5',
    section: 3,
    text: 'Khi có thay đổi nhân sự (dev/QA mới vào), tiến độ chung của team thường bị sụt giảm trong khoảng thời gian bao lâu?',
    type: 'single-range',
    options: ['Dưới 3 ngày', '1 tuần', '2 tuần (1 sprint)', '1 tháng (2 sprints)', 'Hơn 1 tháng'],
  },

  // ─── Phần 4 — Đánh giá tổng thể ───
  {
    id: '4.1',
    section: 4,
    text: 'Bạn tự đánh giá % mức độ dự án hiện tại đang "phụ thuộc sống còn" vào năng lực xử lý tình huống và kinh nghiệm cá nhân của riêng bạn là bao nhiêu?',
    type: 'single-range',
    options: ['Dưới 20% (Quy trình làm thay tôi)', '20 - 40%', '40 - 60%', '60 - 80%', 'Trên 80% (Tôi nghỉ là dự án toang)'],
  },
  {
    id: '4.2',
    section: 4,
    text: 'Giả sử dự án cần chuyển giao lại cho một quản lý khác trong nội bộ, bạn ước tính thời gian tối thiểu để người đó có thể "cầm trịch" dự án độc lập là bao lâu?',
    type: 'single-range',
    options: [
      'Dưới 1 tuần (Quy trình chuẩn chỉnh)',
      '1 - 2 tuần (Cần làm quen ngữ cảnh)',
      '3 - 4 tuần (Logic phức tạp)',
      '1 - 2 tháng',
      'Hơn 2 tháng'
    ],
  },
  {
    id: '4.3',
    section: 4,
    text: 'Nếu có công cụ AI giúp giảm tải 10-15 giờ làm việc mỗi tuần, bạn muốn nó giúp bạn xử lý loại công việc nào tốn nhiều effort nhất?',
    type: 'single-choice',
    options: [
      'Đọc, phân tích và tóm tắt các tài liệu requirement/history (tiết kiệm 2-3h/tuần).',
      'Gom dữ liệu từ Jira/Trello để sinh báo cáo, draft email (tiết kiệm 3-5h/tuần).',
      'Rà soát sự sai lệch giữa URD, Mockup và SRS (tiết kiệm 5-7h/tuần).',
      'Dự đoán và cảnh báo rủi ro (tiết kiệm thời gian xử lý sự cố).',
      'Khác',
    ],
  },
];
