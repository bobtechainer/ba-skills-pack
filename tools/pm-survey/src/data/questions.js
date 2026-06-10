export const sections = [
  { id: 1, title: 'Tài liệu và luồng thông tin' },
  { id: 2, title: 'Nhịp làm việc hằng ngày' },
  { id: 3, title: 'Quản lý thay đổi, rủi ro và giao tiếp' },
  { id: 4, title: 'Đánh giá tổng thể' },
];

const likertOptions = ['Hoàn toàn không đồng ý', 'Không đồng ý', 'Trung lập', 'Đồng ý', 'Hoàn toàn đồng ý'];

export const questions = [
  // ─── Phần 1 — Tài liệu và luồng thông tin ───
  {
    id: '1.1',
    section: 1,
    text: 'Tôi tự tin rằng nếu tôi vắng mặt đột xuất 1-2 tuần, một đồng nghiệp cùng chuyên môn có thể đọc tài liệu hiện tại và duy trì dự án mà không gặp khó khăn lớn.',
    type: 'single-range',
    options: likertOptions,
  },
  {
    id: '1.2',
    section: 1,
    text: 'Các quyết định thay đổi quan trọng về phạm vi (scope) hoặc yêu cầu (requirement) luôn được cập nhật đầy đủ vào tài liệu chính thức, thay vì chỉ trôi nổi trong tin nhắn/email.',
    type: 'single-range',
    options: likertOptions,
  },
  {
    id: '1.3',
    section: 1,
    text: 'Cấu trúc thư mục và quy tắc lưu trữ của dự án hiện tại đủ rõ ràng để một người mới vào team tự tìm được thông tin cần thiết trong vòng vài giờ.',
    type: 'single-range',
    options: likertOptions,
  },
  {
    id: '1.4',
    section: 1,
    text: 'Phần lớn các quyết định thiết kế hoặc nghiệp vụ quan trọng đều được ghi chép lại lý do tại sao chọn (Why), chứ không chỉ ghi nhận kết quả cuối cùng (What).',
    type: 'single-range',
    options: likertOptions,
  },

  // ─── Phần 2 — Nhịp làm việc hằng ngày ───
  {
    id: '2.1',
    section: 2,
    text: 'Công việc báo cáo tiến độ, tổng hợp status và nhắc nhở task hằng ngày/tuần chiếm quá nhiều thời gian và mang tính lặp đi lặp lại.',
    type: 'single-range',
    options: likertOptions,
  },
  {
    id: '2.2',
    section: 2,
    text: 'Phần lớn thời gian làm việc của tôi đang dành cho việc điều phối lắt nhắt, gỡ vướng mắc (firefighting) thay vì tập trung vào hoạch định tổng thể.',
    type: 'single-range',
    options: likertOptions,
  },
  {
    id: '2.3',
    section: 2,
    text: 'Giả sử team vừa hoàn thành một mốc (milestone) quan trọng, việc cập nhật tình hình cho các bên liên quan thường diễn ra như thế nào?',
    type: 'single-choice',
    options: [
      'Tôi phải tự đi gom nhặt thông tin từ nhiều nguồn (chat, task board) và viết báo cáo thủ công.',
      'Tôi dùng template có sẵn và mất một chút thời gian để điền số liệu/tình trạng.',
      'Tôi có công cụ hoặc quy trình tự động trích xuất đa số dữ liệu, chỉ cần rà soát lại và gửi.',
      'Khác',
    ],
  },

  // ─── Phần 3 — Quản lý thay đổi, rủi ro và giao tiếp ───
  {
    id: '3.1',
    section: 3,
    text: 'Sự hiểu ngầm (tribal knowledge) và thói quen làm việc riêng giữa các thành viên cốt cán đóng vai trò rất lớn trong việc giữ cho dự án chạy trơn tru.',
    type: 'single-range',
    options: likertOptions,
  },
  {
    id: '3.2',
    section: 3,
    text: 'Các rủi ro tiềm ẩn (về kỹ thuật, nhân sự, khách hàng) thường được nhận diện và thảo luận từ sớm, thay vì đợi đến khi thành "cháy nhà" mới xử lý.',
    type: 'single-range',
    options: likertOptions,
  },
  {
    id: '3.3',
    section: 3,
    text: 'Khi có một yêu cầu thay đổi (CR) đột xuất từ khách hàng có khả năng ảnh hưởng đến kiến trúc/tiến độ, bạn thường xử lý thế nào?',
    type: 'single-choice',
    options: [
      'Gọi điện/chat ngay với Tech Lead/Team để tìm cách giải quyết nhanh nhất, chốt xong mới ghi log lại.',
      'Yêu cầu khách hàng mô tả rõ trên ticket/văn bản, sau đó tổ chức họp đánh giá tác động (impact analysis) chính thức.',
      'Tự đánh giá sơ bộ dựa trên kinh nghiệm cá nhân, sau đó giao việc luôn cho team để kịp tiến độ.',
      'Khác',
    ],
  },
  {
    id: '3.4',
    section: 3,
    text: 'Trong quá trình giao tiếp hằng ngày với khách hàng, thách thức lớn nhất làm giảm tốc độ dự án thường là gì?',
    type: 'single-choice',
    options: [
      'Khách hàng thay đổi ý định liên tục nhưng không muốn lùi deadline.',
      'Khách hàng chậm phản hồi các câu hỏi làm rõ nghiệp vụ (clarification).',
      'Khách hàng muốn can thiệp quá sâu vào giải pháp kỹ thuật dù không chuyên.',
      'Bất đồng ngôn ngữ/văn hóa hoặc cách truyền đạt thông tin chưa đồng điệu.',
      'Khác',
    ],
  },
  {
    id: '3.5',
    section: 3,
    text: 'Khi có thay đổi nhân sự trong dự án (dev/QA nghỉ hoặc thêm người mới), tiến độ chung thường bị sụt giảm rõ rệt trong ít nhất 1-2 sprint đầu.',
    type: 'single-range',
    options: likertOptions,
  },

  // ─── Phần 4 — Đánh giá tổng thể ───
  {
    id: '4.1',
    section: 4,
    text: 'Tôi cảm thấy sự thành bại của dự án hiện tại đang bị phụ thuộc quá nhiều vào năng lực xử lý tình huống và kinh nghiệm cá nhân của riêng tôi.',
    type: 'single-range',
    options: likertOptions,
  },
  {
    id: '4.2',
    section: 4,
    text: 'Giả sử (chỉ là giả sử để đánh giá quy trình) dự án cần được chuyển giao lại cho một quản lý khác trong nội bộ, bạn ước tính thời gian tối thiểu để người đó có thể "cầm trịch" dự án độc lập là bao lâu?',
    type: 'single-choice',
    options: [
      'Dưới 1 tuần (Quy trình chuẩn chỉnh, tài liệu đầy đủ).',
      '1 - 2 tuần (Cần thời gian làm quen ngữ cảnh).',
      '3 - 4 tuần (Có nhiều business logic phức tạp cần thẩm thấu).',
      'Hơn 1 tháng (Dự án quá lớn hoặc tài liệu/quy trình chưa sẵn sàng).',
    ],
  },
  {
    id: '4.3',
    section: 4,
    text: 'Nếu có một công cụ hỗ trợ tự động hóa/AI để giảm tải công việc quản lý dự án, bạn mong muốn công cụ đó giúp bạn giải quyết "nỗi đau" nào nhất?',
    type: 'single-choice',
    options: [
      'Tự động đọc, phân tích và tóm tắt các tài liệu requirement/history dài dòng.',
      'Tự động gom dữ liệu từ Jira/Trello để sinh báo cáo tiến độ, draft email update.',
      'Đóng vai trò như một "trợ lý" cảnh báo rủi ro dựa trên lịch sử commit/ticket của dự án.',
      'Hỗ trợ rà soát, so sánh sự sai lệch giữa URD, Mockup và tài liệu SRS.',
      'Khác',
    ],
  },
];
