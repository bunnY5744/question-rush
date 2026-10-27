// Question Rush - safe k6 load test.
// Rules: run against a LOCAL or dedicated TEST environment only, with ads
// disabled (VITE_ENABLE_ADS=false). Never run this against ad-supported
// production to generate traffic, and never use it to click ads.
// Start conservative (defaults below), verify, then raise VUs gradually
// via -e VUS=... only if the previous run stayed healthy.
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:4000';
const VUS = Number(__ENV.VUS || 5);
const DURATION = __ENV.DURATION || '30s';

export const options = {
  stages: [
    { duration: '10s', target: VUS },   // ramp up
    { duration: DURATION, target: VUS }, // hold
    { duration: '10s', target: 0 },      // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

export default function () {
  const health = http.get(`${BASE}/api/health`);
  check(health, { 'health 200': r => r.status === 200, 'health ok': r => r.json('status') === 'ok' });

  const start = http.post(`${BASE}/api/quiz/start`, JSON.stringify({ category: 'mixed', length: 3 }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(start, { 'start 201': r => r.status === 201, 'start has session': r => !!r.json('sessionId') });
  if (start.status !== 201) { sleep(1); return; }
  const body = start.json();
  const q = body.questions[0];
  const ans = http.post(`${BASE}/api/quiz/answer`, JSON.stringify({ sessionId: body.sessionId, questionId: q.id, answerId: q.options[0].id }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(ans, { 'answer 200': r => r.status === 200, 'answer has correct flag': r => typeof r.json('correct') === 'boolean' });
  const fin = http.post(`${BASE}/api/quiz/finish`, JSON.stringify({ sessionId: body.sessionId, playerName: 'k6-test' }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(fin, { 'finish 200': r => r.status === 200, 'finish has score': r => typeof r.json('score') === 'number' });
  sleep(1);
}
