import { useEffect, useState } from 'react';
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { if (!localStorage.getItem('qr-cookie-consent')) setVisible(true); }, []);
  if (!visible) return null;
  const choose = (v) => { localStorage.setItem('qr-cookie-consent', v); setVisible(false); };
  return (<div className="cookie-banner" role="dialog" aria-label="Cookie consent">
    <p>We use essential storage to run the game. If advertising is enabled in future, advertising cookies will only be used as described in our Privacy Policy.</p>
    <div className="row"><button className="btn btn-primary" onClick={() => choose('accepted')}>Accept</button>
    <button className="btn btn-ghost" onClick={() => choose('declined')}>Decline</button></div>
  </div>);
}
