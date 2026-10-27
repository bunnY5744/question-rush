const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');
async function req(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}
export const api = {
  health: () => req('/api/health'),
  questions: (category) => req(`/api/questions${category ? `?category=${category}` : ''}`),
  leaderboard: () => req('/api/leaderboard'),
  startQuiz: (category, length) => req('/api/quiz/start', { method: 'POST', body: JSON.stringify({ category, length }) }),
  answer: (sessionId, questionId, answerId) => req('/api/quiz/answer', { method: 'POST', body: JSON.stringify({ sessionId, questionId, answerId }) }),
  finish: (sessionId, playerName) => req('/api/quiz/finish', { method: 'POST', body: JSON.stringify({ sessionId, playerName }) }),
};
export { API_URL };
