import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { CATEGORIES } from '../utils/format';
import AdPlaceholder from '../components/AdPlaceholder';
export default function Categories() {
  const location = useLocation();
  const navigate = useNavigate();
  const [length, setLength] = useState(location.state?.length || 10);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');
  async function play(category) {
    setLoadingId(category); setError('');
    try {
      const data = await api.startQuiz(category, length);
      sessionStorage.setItem('qr-session', JSON.stringify(data));
      navigate('/quiz');
    } catch (e) { setError(e.message + ' - is the backend running? See the README for local setup.'); }
    finally { setLoadingId(null); }
  }
  return (<section className="section">
    <h1>Quiz Categories</h1>
    <p>Pick a category to start instantly. Answers are checked on the server - no sign-up needed.</p>
    <label className="field">Quiz length
      <select value={length} onChange={e => setLength(Number(e.target.value))} aria-label="Quiz length">
        <option value={5}>5 questions (quick)</option><option value={10}>10 questions (classic)</option>
        <option value={15}>15 questions (challenge)</option><option value={20}>20 questions (marathon)</option>
      </select>
    </label>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="grid">
      {CATEGORIES.map(c => (
        <article className="card" key={c.id}>
          <div className="card-icon" aria-hidden="true">{c.icon}</div>
          <h2>{c.name}</h2><p>{c.desc}</p>
          <button className="btn btn-primary" disabled={loadingId !== null} onClick={() => play(c.id)}>
            {loadingId === c.id ? 'Starting…' : `Play ${c.name}`}
          </button>
        </article>
      ))}
    </div>
    <AdPlaceholder slot="categories" />
  </section>);
}
