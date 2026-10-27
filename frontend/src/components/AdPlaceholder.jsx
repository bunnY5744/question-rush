export default function AdPlaceholder({ slot = 'home', label = 'Advertisement' }) {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const enabled = import.meta.env.PROD && import.meta.env.VITE_ENABLE_ADS === 'true' && clientId;
  if (!enabled) {
    return (<aside className="ad-placeholder" data-slot={slot} aria-label={label}>
      <span className="ad-label">{label}</span>
      <p>Ad space reserved. Ads will appear here only after Google AdSense approval and configuration.</p>
    </aside>);
  }
  return (<aside className="ad-placeholder ad-live" data-slot={slot} aria-label={label}>
    <span className="ad-label">{label}</span>
    {/* Approved publishers: load the AdSense script in index.html and place an
        <ins className="adsbygoogle"> unit here using VITE_ADSENSE_SLOT_* IDs. */}
    <p className="muted">Ad unit: {slot}</p>
  </aside>);
}
