export default function Privacy() {
  return (<section className="section prose">
    <h1>Privacy Policy</h1>
    <p>Last updated: 2026-10-27. This policy describes what Question Rush ("we", "the site") collects and why.</p>
    <h2>What we collect</h2>
    <ul>
      <li><strong>Gameplay data:</strong> your answers are sent to our server to validate scores. Quiz sessions are held in server memory and are not linked to an identity.</li>
      <li><strong>Leaderboard name:</strong> only if you choose to enter a display name. It is stored with your score if a database is configured.</li>
      <li><strong>Local storage:</strong> your display name, cookie-consent choice and in-progress game state are stored in your own browser.</li>
      <li><strong>Server logs:</strong> standard request logs (time, path, status) used for security and debugging.</li>
    </ul>
    <h2>Cookies and advertising</h2>
    <p>Question Rush is prepared for Google AdSense, but advertisements are only shown after legitimate AdSense approval and configuration by the site owner. If ads are enabled, Google and its partners may use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalised advertising at Google Ads Settings (adssettings.google.com) and learn more at policies.google.com/technologies/ads.</p>
    <p>We never encourage visitors to click advertisements, never click ads ourselves, and never place ads where they could be mistaken for quiz answers or navigation.</p>
    <h2>Data sharing</h2>
    <p>We do not sell personal data. Data is shared only with service providers needed to run the site (hosting and, if configured, MongoDB Atlas and Google AdSense).</p>
    <h2>Your choices</h2>
    <p>You can decline non-essential cookies in the consent banner, clear your browser storage at any time, and contact us via the Contact page to ask about data held under your display name.</p>
    <h2>Children</h2>
    <p>The site is a general-audience puzzle game and does not knowingly collect personal information from children.</p>
    <h2>Changes</h2>
    <p>Material changes to this policy will be posted on this page with a new "last updated" date.</p>
  </section>);
}
