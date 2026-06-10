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
      <p>Bọn em đã nhận được câu trả lời. Thông tin này sẽ giúp thiết kế công cụ AI phù hợp nhất cho quy trình làm việc của BA.</p>
      <div style={{ marginTop: 28 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
