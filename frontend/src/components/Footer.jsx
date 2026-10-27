import { Link } from 'react-router-dom';
export default function Footer() {
  return (<footer className="footer"><div className="footer-inner">
    <p><strong>Question Rush</strong> - quick math and logic puzzles, free to play.</p>
    <nav aria-label="Legal">
      <Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms and Conditions</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link>
    </nav>
    <p className="muted">© {new Date().getFullYear()} Question Rush. All questions are original content created for this site.</p>
  </div></footer>);
}
