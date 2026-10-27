import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import AdPlaceholder from '../components/AdPlaceholder';
export default function Leaderboard() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.leaderboard().then(setData).catch(e => setError(e.message)); }, []);
  const [name, setName] = useState(() => localStorage.getItem('qr-name') || '');
  function saveName() { localStorage.setItem('qr-name', name.trim() || 'Anonymous'); sessionStorage.setItem('qr-name', name.trim() || 'Anonymous'); }
  return (<section className="section">
    <h1>Leaderboard</h1>
    <p>Only real finished games appear here. No entries are ever fabricated.</p>
    <label className="field">Your display name for future games
      <span className="row"><input value={name} maxLength={40} onChange={e => setName(e.target.value)} placeholder="Anonymous" aria-label="Display name" />
      <button className="btn btn-primary" onClick={saveName}>Save Name</button></span>
    </label>
    {error && <p className="error" role="alert">Could not load the leaderboard: {error}</p>}
    {!data && !error && <p>Loading…</p>}
    {data && data.entries.length === 0 && <div className="card"><p>No scores yet. Be the first to finish a quiz!</p><Link className="btn btn-primary" to="/categories">Start Playing</Link></div>}
    {data && data.entries.length > 0 && (<table className="table"><thead><tr><th>#</th><th>Player</th><th>Score</th><th>Correct</th><th>Accuracy</th><th>Category</th></tr></thead>
      <tbody>{data.entries.map((e, i) => (<tr key={i}><td>{i + 1}</td><td>{e.playerName}</td><td>{e.score}</td><td>{e.correct}/{e.total}</td><td>{e.accuracy}%</td><td>{e.category}</td></tr>))}</tbody></table>)}
    {data && data.source === 'memory' && <p className="muted">Showing scores held in server memory. Connect MongoDB Atlas (MONGODB_URI) to persist the leaderboard permanently.</p>}
    <AdPlaceholder slot="leaderboard" />
  </section>);
}
