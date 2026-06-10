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
