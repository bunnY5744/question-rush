import { Link, useNavigate } from 'react-router-dom';
import AdPlaceholder from '../components/AdPlaceholder';
import { CATEGORIES } from '../utils/format';

function dailySeed() { const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
export default function Home() {
  const navigate = useNavigate();
  const dailyCategory = CATEGORIES[1 + (dailySeed() % (CATEGORIES.length - 1))];
  return (<>
    <section className="hero">
      <p className="eyebrow">Free daily brain training</p>
      <h1>Challenge Your Brain</h1>
      <p className="subtitle">Play quick math and logic puzzles every day.</p>
      <div className="row center">
        <Link className="btn btn-big btn-primary" to="/categories">Start Playing</Link>
        <Link className="btn btn-big btn-ghost" to="/leaderboard">View Leaderboard</Link>
      </div>
      <p className="muted">60 original questions - no sign-up needed - scores checked on the server</p>
    </section>
    <section className="section">
      <h2>Choose your rush</h2>
      <div className="grid">
        {CATEGORIES.filter(c => c.id === 'math' || c.id === 'logic').map(c => (
          <article className="card" key={c.id}>
            <div className="card-icon" aria-hidden="true">{c.icon}</div>
            <h3>{c.name}</h3><p>{c.desc}</p>
            <button className="btn btn-primary" onClick={() => navigate('/categories', { state: { category: c.id } })}>Play {c.name}</button>
          </article>
        ))}
      </div>
      <p className="center"><Link to="/categories">See all categories →</Link></p>
    </section>
    <section className="section alt">
      <h2>How It Works</h2>
      <div className="grid three">
        <div className="card"><h3>1. Pick a category</h3><p>Math, sequences, logic, patterns or arithmetic puzzles - or go Mixed Rush.</p></div>
        <div className="card"><h3>2. Beat the clock</h3><p>You get 30 seconds per question. Answer carefully: each question can only be submitted once.</p></div>
        <div className="card"><h3>3. See your real score</h3><p>Every answer is validated on the server, with an explanation for each question at the end.</p></div>
      </div>
    </section>
    <section className="section">
      <h2>Daily Challenge</h2>
      <div className="card highlight">
        <h3>{dailyCategory.icon} Today's challenge: {dailyCategory.name}</h3>
        <p>A fresh 5-question {dailyCategory.name.toLowerCase()} set for {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Come back tomorrow for a different category.</p>
        <button className="btn btn-primary" onClick={() => navigate('/categories', { state: { category: dailyCategory.id, length: 5 } })}>Play Daily Challenge</button>
      </div>
    </section>
    <AdPlaceholder slot="home" />
  </>);
}
