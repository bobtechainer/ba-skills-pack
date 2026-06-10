import { useState, useEffect } from 'react';
import { questions, sections } from '../data/questions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
const DASHBOARD_PASSWORD = 'Nkg@6688';

/* ─── Password Gate ─── */

function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === DASHBOARD_PASSWORD) {
      sessionStorage.setItem('pm-dashboard-auth', '1');
      onUnlock();
    } else {
      setError('Mật khẩu không đúng');
      setPw('');
    }
  };

  return (
    <div className="landing">
      <div className="landing-card" style={{ maxWidth: 400 }}>
        <div className="landing-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 style={{ fontSize: 22 }}>Dashboard khảo sát PM</h1>
        <p className="landing-desc">Nhập mật khẩu để xem kết quả</p>
        <form onSubmit={handleSubmit}>
          <input
            className={`name-input${error ? ' has-error' : ''}`}
            type="password"
            placeholder="Mật khẩu"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(''); }}
            autoFocus
          />
          {error && <p className="name-error">{error}</p>}
          <button className="landing-cta" type="submit" style={{ marginTop: 16, width: '100%' }}>
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Individual Response Viewer ─── */

function ResponseViewer({ response }) {
  const [current, setCurrent] = useState(0);
  const q = questions[current];

  const renderAnswer = () => {
    const ans = response.answers[q.id];
    if (ans === undefined || ans === null) return <div className="rv-empty">Chưa trả lời</div>;

    if (q.type === 'single-range' || q.type === 'single-choice') {
      return (
        <div className="options-grid rv-options">
          {q.options.map((opt, i) => (
            <div key={i} className={`option-btn${ans === i ? ' selected' : ''}`}>
              <span className="option-radio" />
              <span>{opt}</span>
            </div>
          ))}
        </div>
      );
    }

    if (q.type === 'multi-check') {
      const selected = ans || [];
      return (
        <div className="options-grid rv-options">
          {q.options.map((opt, i) => (
            <div key={i} className={`option-btn${selected.includes(i) ? ' selected' : ''}`}>
              <span className="option-check">{selected.includes(i) ? '✓' : ''}</span>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      );
    }

    if (q.type === 'matrix') {
      const cols = q.columns;
      const colCount = cols.length;
      const gridCols = `minmax(120px, 1.5fr) repeat(${colCount}, 1fr)`;
      return (
        <div className="matrix-wrap">
          <div className="matrix-header" style={{ gridTemplateColumns: gridCols }}>
            <div />
            {cols.map((col, i) => (
              <div key={i} className="matrix-col-label">{col}</div>
            ))}
          </div>
          {q.rows.map((row, ri) => (
            <div key={ri} className="matrix-row" style={{ gridTemplateColumns: gridCols }}>
              <div className="matrix-row-label">{row}</div>
              {cols.map((_, ci) => (
                <div key={ci} className="matrix-cell">
                  <div className={`matrix-dot${ans[ri] === ci ? ' selected' : ''}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const followUp = response.followUps && response.followUps[q.id];

  return (
    <div>
      <div className="rv-nav-strip">
        {questions.map((qq, i) => {
          const hasAns = response.answers[qq.id] !== undefined && response.answers[qq.id] !== null;
          return (
            <button
              key={i}
              className={`rv-dot${i === current ? ' active' : ''}${hasAns ? ' done' : ''}`}
              onClick={() => setCurrent(i)}
              title={`Câu ${i + 1}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="rv-question">
        <div className="section-badge">Phần {q.section} — Câu {current + 1}</div>
        <h3 className="question-text" style={{ fontSize: 16 }}>{q.text}</h3>
        {q.subtitle && <p className="question-subtitle">{q.subtitle}</p>}
        <div style={{ height: 12 }} />
        {renderAnswer()}
        {followUp && (
          <div className="rv-followup">
            <strong>Ghi thêm:</strong> {followUp}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Aggregate Chart ─── */

function QuestionChart({ question, responses }) {
  if (question.type === 'matrix') {
    return <MatrixSummary question={question} responses={responses} />;
  }

  const dataMap = {};
  responses.forEach((r) => {
    const ans = r.answers[question.id];
    if (ans === undefined || ans === null) return;
    if (question.type === 'single-range' || question.type === 'single-choice') {
      const label = question.options[ans] || 'N/A';
      dataMap[label] = (dataMap[label] || 0) + 1;
    } else if (question.type === 'multi-check') {
      (ans || []).forEach((i) => {
        const label = question.options[i] || 'N/A';
        dataMap[label] = (dataMap[label] || 0) + 1;
      });
    }
  });

  const data = Object.entries(dataMap).map(([name, count]) => ({ name, count }));
  if (data.length === 0) return <div className="no-data">Chưa có dữ liệu</div>;

  const shortLabels = data.map((d) => ({
    ...d,
    short: d.name.length > 25 ? d.name.slice(0, 25) + '...' : d.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
      <BarChart data={shortLabels} layout="vertical" margin={{ left: 10, right: 20 }}>
        <XAxis type="number" allowDecimals={false} />
        <YAxis type="category" dataKey="short" width={180} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(val) => [`${val} người`, 'Số lượng']}
          labelFormatter={(label) => {
            const full = data.find((d) => d.name.startsWith(label.replace('...', '')));
            return full ? full.name : label;
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {shortLabels.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function MatrixSummary({ question, responses }) {
  const { rows, columns } = question;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '2px solid #e5e7eb' }}></th>
            {columns.map((col, ci) => (
              <th key={ci} style={{ padding: '6px 4px', borderBottom: '2px solid #e5e7eb', fontSize: 11, color: '#6b7280', fontWeight: 600 }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const counts = {};
            responses.forEach((r) => {
              const ans = r.answers[question.id];
              if (ans && ans[ri] !== undefined) counts[ans[ri]] = (counts[ans[ri]] || 0) + 1;
            });
            return (
              <tr key={ri}>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6', fontSize: 12 }}>{row}</td>
                {columns.map((_, ci) => (
                  <td key={ci} style={{ textAlign: 'center', padding: '4px', borderBottom: '1px solid #f3f4f6' }}>
                    {counts[ci] ? (
                      <span style={{ display: 'inline-block', background: COLORS[ci % COLORS.length], color: 'white', borderRadius: 99, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>
                        {counts[ci]}
                      </span>
                    ) : <span style={{ color: '#d1d5db' }}>-</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Dashboard Page ─── */

export default function DashboardPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('pm-dashboard-auth') === '1');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('overview');
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    if (!authed) return;
    async function fetchData() {
      try {
        const res = await fetch('/api/responses');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) { setResponses(data); setLoading(false); return; }
        }
      } catch { /* fallback */ }
      const local = JSON.parse(localStorage.getItem('pm-survey-responses') || '[]');
      setResponses(local);
      setLoading(false);
    }
    fetchData();
  }, [authed]);

  if (!authed) return <PasswordGate onUnlock={() => setAuthed(true)} />;
  if (loading) return <div className="container dashboard"><div className="dashboard-empty">Đang tải...</div></div>;

  const selectedResponse = selectedPerson
    ? responses.find((r) => r.id === selectedPerson)
    : null;

  return (
    <div className="container dashboard" style={{ maxWidth: 960 }}>
      <div className="dashboard-header">
        <h1>Dashboard khảo sát PM</h1>
        <p>{responses.length} phản hồi đã nhận</p>
      </div>

      {responses.length === 0 ? (
        <div className="dashboard-empty">
          <p>Chưa có ai điền khảo sát.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Gửi link cho PM để bắt đầu thu thập dữ liệu.</p>
        </div>
      ) : (
        <>
          <div className="db-tabs">
            <button className={`db-tab${view === 'overview' ? ' active' : ''}`} onClick={() => setView('overview')}>
              Tổng hợp
            </button>
            <button className={`db-tab${view === 'individual' ? ' active' : ''}`} onClick={() => setView('individual')}>
              Từng người
            </button>
          </div>

          {view === 'overview' ? (
            sections.map((section) => {
              const sectionQuestions = questions.filter((q) => q.section === section.id);
              return (
                <div key={section.id} style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#4F46E5' }}>
                    {section.id}. {section.title}
                  </h2>
                  <div className="chart-grid">
                    {sectionQuestions.map((q) => (
                      <div key={q.id} className="chart-card">
                        <h4>Câu {q.id}</h4>
                        <div className="q-text">{q.text}</div>
                        <QuestionChart question={q} responses={responses} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="db-individual">
              <div className="db-person-list">
                <div className="db-person-list-title">Người điền ({responses.length})</div>
                {responses.map((r) => (
                  <button
                    key={r.id}
                    className={`db-person-btn${selectedPerson === r.id ? ' active' : ''}`}
                    onClick={() => setSelectedPerson(r.id)}
                  >
                    <span className="db-person-name">{r.name || 'Ẩn danh'}</span>
                    <span className="db-person-date">
                      {new Date(r.submittedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </button>
                ))}
              </div>

              <div className="db-person-detail">
                {selectedResponse ? (
                  <>
                    <div className="db-person-detail-header">
                      <h3>{selectedResponse.name || 'Ẩn danh'}</h3>
                      <span className="db-person-detail-date">
                        {new Date(selectedResponse.submittedAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <ResponseViewer response={selectedResponse} />
                  </>
                ) : (
                  <div className="db-person-placeholder">
                    ← Chọn một người để xem chi tiết câu trả lời
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
