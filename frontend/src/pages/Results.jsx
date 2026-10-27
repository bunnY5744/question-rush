import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gradeFor } from '../utils/format';
export default function Results() {
  const navigate = useNavigate();
  const [result] = useState(() => { try { return JSON.parse(sessionStorage.getItem('qr-result')); } catch { return null; } });
  if (!result) return (<section className="section"><h1>No results yet</h1><p>Finish a quiz to see your results here.</p><Link className="btn btn-primary" to="/categories">Start Playing</Link></section>);
  return (<section className="section">
    <h1>Your Results</h1>
    <div className="card highlight center">
      <p className="big-score">{result.score} points</p>
      <p>{result.correct} of {result.total} correct - Accuracy: <strong>{result.accuracy}%</strong></p>
      <p className="grade">{gradeFor(result.accuracy)}</p>
      {result.saved
        ? <p className="muted">Your score was saved to the leaderboard.</p>
        : <p className="muted" role="note">{result.message || 'This result was not saved to a database.'}</p>}
      <div className="row center">
        <button className="btn btn-primary" onClick={() => navigate('/categories')}>Replay</button>
        <Link className="btn btn-ghost" to="/leaderboard">Leaderboard</Link>
        <Link className="btn btn-ghost" to="/">Home</Link>
      </div>
    </div>
    <h2>Review</h2>
    {result.review?.map(r => (
      <article className="card" key={r.questionId}>
        <h3>{r.question}</h3>
        <p className={r.correct ? 'ok-text' : 'bad-text'}>{r.correct ? 'You got this right.' : 'You got this one wrong.'}</p>
        <p>Correct answer: <strong>{r.options.find(o => o.id === r.correctOptionId)?.text}</strong></p>
        <p className="muted">{r.explanation}</p>
      </article>
    ))}
  </section>);
}
