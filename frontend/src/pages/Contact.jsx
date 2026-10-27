import { useState } from 'react';
export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  function submit(e) {
    e.preventDefault();
    // No mail backend is configured by default, so we open the visitor's own
    // mail client with the message pre-filled instead of pretending it was sent.
    const subject = encodeURIComponent('Question Rush - contact from ' + (form.name || 'visitor'));
    const body = encodeURIComponent(form.message + '\n\nFrom: ' + form.name + ' <' + form.email + '>');
    window.location.href = `mailto:hello@questionrush.example?subject=${subject}&body=${body}`;
    setSent(true);
  }
  return (<section className="section prose">
    <h1>Contact</h1>
    <p>Found a wrong answer, have a question suggestion, or a privacy request? Send us a message.</p>
    <p className="muted">Site owner: replace the placeholder address <code>hello@questionrush.example</code> in this page with your real contact email before launch, or connect a form service.</p>
    <form className="form" onSubmit={submit}>
      <label className="field">Your name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
      <label className="field">Your email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
      <label className="field">Message<textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></label>
      <button className="btn btn-primary" type="submit">Send via Email App</button>
    </form>
    {sent && <p role="status">Your email app should have opened with your message ready to send.</p>}
  </section>);
}
