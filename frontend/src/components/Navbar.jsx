import { Link, NavLink } from 'react-router-dom';
export default function Navbar() {
  return (<header className="nav"><div className="nav-inner">
    <Link to="/" className="logo" aria-label="Question Rush home"><span className="logo-mark">Q?</span> Question <span className="accent">Rush</span></Link>
    <nav aria-label="Main navigation">
      <NavLink to="/">Home</NavLink><NavLink to="/categories">Play</NavLink><NavLink to="/leaderboard">Leaderboard</NavLink><NavLink to="/about">About</NavLink><NavLink to="/contact">Contact</NavLink>
    </nav>
  </div></header>);
}
