import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { formatTime } from '../utils/format';
export default function Quiz() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => { try { return JSON.parse(sessionStorage.getItem('qr-session')); } catch { return null; } });
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(session?.timeLimitSeconds || 0);
  const finishingRef = useRef(false);

  async function finish() {
    if (finishingRef.current || !session) return; finishingRef.current = true;
    try {
      const result = await api.finish(session.sessionId, sessionStorage.getItem('qr-name') || 'Anonymous');
      sessionStorage.setItem('qr-result', JSON.stringify(result));
      sessionStorage.removeItem('qr-session');
      navigate('/results');
    } catch (e) { setError(e.message); finishingRef.current = false; }
  }
  useEffect(() => {
    if (!session) return;
    if (timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, session]); // eslint-disable-line react-hooks/exhaustive-deps

  const question = useMemo(() => session?.questions?.[index], [session, index]);
  if (!session) return (<section className="section"><h1>No active quiz</h1><p>Start a quiz from the categories page.</p><button className="btn btn-primary" onClick={() => navigate('/categories')}>Choose a category</button></section>);
  if (!question) return (<section className="section"><p>Loading questions…</p></section>);

  async function submit() {
    if (!selected || feedback) return;
    setSubmitting(true); setError('');
    try {
      const r = await api.answer(session.sessionId, question.id, selected);
      setFeedback(r); setScore(r.score);
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  }
  function next() {
    setFeedback(null); setSelected(null);
    if (index + 1 >= session.questions.length) finish(); else setIndex(i => i + 1);
  }
  const progress = Math.round(((index) / session.questions.length) * 100);
  return (<section className="section quiz">
    <div className="quiz-head">
      <span>Question {index + 1} of {session.questions.length}</span>
      <span aria-label="Time remaining">⏱ {formatTime(timeLeft)}</span>
      <span>Score: {score}</span>
    </div>
    <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><div style={{ width: `${progress}%` }} /></div>
    <h1 className="q-text">{question.question}</h1>
    <p className="muted">Category: {question.category} - Difficulty: {question.difficulty}</p>
    <div className="options">
      {question.options.map(o => {
        let cls = 'option';
        if (selected === o.id) cls += ' selected';
        if (feedback && o.id === feedback.correctOptionId) cls += ' correct';
        if (feedback && selected === o.id && !feedback.correct) cls += ' wrong';
        return (<button key={o.id} className={cls} disabled={!!feedback || submitting}
          onClick={() => setSelected(o.id)} aria-pressed={selected === o.id}>{o.text}</button>);
      })}
    </div>
    {error && <p className="error" role="alert">{error}</p>}
    {feedback && (<div className={feedback.correct ? 'feedback ok' : 'feedback bad'} role="status">
      <strong>{feedback.correct ? 'Correct! +10 points' : 'Not quite.'}</strong><p>{feedback.explanation}</p>
    </div>)}
    <div className="row">
      {!feedback
        ? <button className="btn btn-primary" disabled={!selected || submitting} onClick={submit}>{submitting ? 'Checking…' : 'Submit Answer'}</button>
        : <button className="btn btn-primary" onClick={next}>{index + 1 >= session.questions.length ? 'See Results' : 'Next Question'}</button>}
      <button className="btn btn-ghost" onClick={finish}>Finish Now</button>
      <button className="btn btn-ghost" onClick={() => { sessionStorage.removeItem('qr-session'); navigate('/categories'); }}>Restart Quiz</button>
    </div>
  </section>);
}
