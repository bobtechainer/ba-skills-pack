import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, sections } from '../data/questions';

/* ─── Question type renderers ─── */

function SingleRange({ question, value, onChange }) {
  return (
    <div className="options-grid">
      {question.options.map((opt, i) => (
        <button key={i} className={`option-btn${value === i ? ' selected' : ''}`} onClick={() => onChange(i)}>
          <span className="option-radio" />
          <span>{opt}</span>
        </button>
      ))}
    </div>
  );
}

function SingleChoice({ question, value, onChange }) {
  return (
    <div className="options-grid">
      {question.options.map((opt, i) => (
        <button key={i} className={`option-btn${value === i ? ' selected' : ''}`} onClick={() => onChange(i)}>
          <span className="option-radio" />
          <span>{opt}</span>
        </button>
      ))}
    </div>
  );
}

function MultiCheck({ question, value = [], onChange }) {
  const max = question.maxSelect || Infinity;
  const toggle = (i) => {
    if (value.includes(i)) onChange(value.filter((v) => v !== i));
    else if (value.length < max) onChange([...value, i]);
  };
  return (
    <div className="options-grid">
      {question.options.map((opt, i) => (
        <button key={i} className={`option-btn${value.includes(i) ? ' selected' : ''}`} onClick={() => toggle(i)}>
          <span className="option-check">{value.includes(i) ? '✓' : ''}</span>
          <span>{opt}</span>
        </button>
      ))}
    </div>
  );
}

function Matrix({ question, value = {}, onChange }) {
  const cols = question.columns;
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
      {question.rows.map((row, ri) => (
        <div key={ri} className="matrix-row" style={{ gridTemplateColumns: gridCols }}>
          <div className="matrix-row-label">{row}</div>
          {cols.map((_, ci) => (
            <div key={ci} className="matrix-cell">
              <button
                className={`matrix-dot${value[ri] === ci ? ' selected' : ''}`}
                onClick={() => onChange({ ...value, [ri]: ci })}
                aria-label={`${row}: ${cols[ci]}`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Helper ─── */

function checkAnswer(q, answers) {
  const a = answers[q.id];
  if (a === undefined || a === null) return false;
  if (q.type === 'multi-check') return Array.isArray(a) && a.length > 0;
  if (q.type === 'matrix') return Object.keys(a).length === q.rows.length;
  return true;
}

/* ─── Sidebar ─── */

function Sidebar({ current, answers, onSelect, onClose, open }) {
  const answeredCount = questions.filter((q) => checkAnswer(q, answers)).length;

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Câu hỏi</span>
          <span className="sidebar-progress">{answeredCount}/{questions.length}</span>
          <button className="sidebar-close" onClick={onClose} aria-label="Đóng">✕</button>
        </div>
        <nav className="sidebar-nav">
          {sections.map((sec) => {
            const sqs = questions.filter((q) => q.section === sec.id);
            return (
              <div key={sec.id} className="sidebar-section">
                <div className="sidebar-section-title">{sec.title}</div>
                {sqs.map((q) => {
                  const idx = questions.indexOf(q);
                  const done = checkAnswer(q, answers);
                  const active = idx === current;
                  return (
                    <button
                      key={q.id}
                      className={`sidebar-item${active ? ' active' : ''}${done ? ' done' : ''}`}
                      onClick={() => { onSelect(idx); onClose(); }}
                    >
                      <span className={`sidebar-dot${done ? ' done' : ''}`}>
                        {done ? '✓' : idx + 1}
                      </span>
                      <span className="sidebar-item-text">
                        {q.text.length > 50 ? q.text.slice(0, 50) + '…' : q.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

/* ─── Confirm Modal ─── */

function ConfirmModal({ answered, total, onConfirm, onCancel, submitting }) {
  const allDone = answered === total;
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3 className="modal-title">Xác nhận gửi khảo sát</h3>
        {allDone ? (
          <p className="modal-text">
            Anh/chị đã trả lời đủ <strong>{total}/{total}</strong> câu. Gửi ngay?
          </p>
        ) : (
          <p className="modal-text">
            Anh/chị mới trả lời <strong>{answered}/{total}</strong> câu.
            Có {total - answered} câu chưa làm. Vẫn muốn gửi?
          </p>
        )}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={submitting}>Quay lại làm tiếp</button>
          <button className="btn btn-primary btn-submit" onClick={onConfirm} disabled={submitting}>
            {submitting ? 'Đang gửi...' : 'Gửi khảo sát'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main SurveyPage ─── */

export default function SurveyPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [followUps, setFollowUps] = useState({});
  const [showFollowUp, setShowFollowUp] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const topRef = useRef(null);

  const respondentName = sessionStorage.getItem('ba-survey-name') || '';

  // Redirect if no name
  useEffect(() => {
    if (!respondentName) navigate('/');
  }, [respondentName, navigate]);

  const q = questions[current];
  const section = sections.find((s) => s.id === q.section);
  const answeredCount = questions.filter((qq) => checkAnswer(qq, answers)).length;

  // Auto-scroll to top on question change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [current]);

  const goTo = useCallback((idx) => {
    if (idx >= 0 && idx < questions.length) setCurrent(idx);
  }, []);

  const setAnswer = (val) => {
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      answers,
      followUps,
      name: respondentName,
      submittedAt: new Date().toISOString(),
      id: crypto.randomUUID(),
    };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
    } catch {
      const existing = JSON.parse(localStorage.getItem('ba-survey-responses') || '[]');
      existing.push(payload);
      localStorage.setItem('ba-survey-responses', JSON.stringify(existing));
    }

    navigate('/thankyou');
  };

  return (
    <div className="survey-layout">
      <Sidebar
        current={current}
        answers={answers}
        onSelect={goTo}
        onClose={() => setSidebarOpen(false)}
        open={sidebarOpen}
      />

      <main className="survey-main">
        <div ref={topRef} className="progress-wrap">
          <div className="container" style={{ maxWidth: 720 }}>
            <div className="progress-info">
              <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Mở danh sách câu hỏi">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <span className="progress-label">{section.title}</span>
              <span className="progress-count">{answeredCount}/{questions.length}</span>
              <button
                className="btn-header-submit"
                onClick={() => setShowConfirm(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Gửi đáp án
              </button>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="container" style={{ maxWidth: 720 }}>
          <div className="question-area">
            <div className="section-badge">Phần {q.section} — Câu {current + 1}</div>
            <h2 className="question-text">{q.text}</h2>
            {q.subtitle && <p className="question-subtitle">{q.subtitle}</p>}
            {!q.subtitle && <div style={{ height: 16 }} />}

            {(q.type === 'single-range') && <SingleRange question={q} value={answers[q.id]} onChange={setAnswer} />}
            {(q.type === 'single-choice') && <SingleChoice question={q} value={answers[q.id]} onChange={setAnswer} />}
            {(q.type === 'multi-check') && <MultiCheck question={q} value={answers[q.id]} onChange={setAnswer} />}
            {(q.type === 'matrix') && <Matrix question={q} value={answers[q.id]} onChange={setAnswer} />}

            <div className="followup-wrap">
              {!showFollowUp[q.id] ? (
                <button className="followup-toggle" onClick={() => setShowFollowUp((p) => ({ ...p, [q.id]: true }))}>
                  + Ghi thêm (nếu muốn)
                </button>
              ) : (
                <textarea
                  className="followup-input"
                  placeholder="Ghi thêm nếu muốn..."
                  value={followUps[q.id] || ''}
                  onChange={(e) => setFollowUps((p) => ({ ...p, [q.id]: e.target.value }))}
                  autoFocus
                />
              )}
            </div>

            <div className="nav-bar">
              {current > 0 && (
                <button className="btn btn-secondary" onClick={() => goTo(current - 1)}>← Quay lại</button>
              )}
              <button className="btn btn-primary" onClick={() => goTo(current + 1)} disabled={current >= questions.length - 1}>
                Tiếp →
              </button>
            </div>
          </div>
        </div>
      </main>

      {showConfirm && (
        <ConfirmModal
          answered={answeredCount}
          total={questions.length}
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirm(false)}
          submitting={submitting}
        />
      )}
    </div>
  );
}
