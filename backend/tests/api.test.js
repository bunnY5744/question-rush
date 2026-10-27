/* globals describe, it, expect - enabled via `vitest run --globals` */
const request = require('supertest');
const app = require('../src/app');

describe('Question Rush API', () => {
  it('GET /api/health is ok', async () => {
    const r = await request(app).get('/api/health');
    expect(r.status).toBe(200); expect(r.body.status).toBe('ok'); expect(r.body.questions).toBeGreaterThanOrEqual(50);
  });
  it('GET /api/questions does not leak answers', async () => {
    const r = await request(app).get('/api/questions');
    expect(r.status).toBe(200); expect(r.body.count).toBeGreaterThanOrEqual(50);
    const s = JSON.stringify(r.body);
    expect(s).not.toContain('correctOptionId'); expect(s).not.toContain('correctIndex'); expect(s).not.toContain('explanation');
  });
  it('GET /api/questions/:id works and 404s', async () => {
    const ok = await request(app).get('/api/questions/q1'); expect(ok.status).toBe(200); expect(ok.body.options).toHaveLength(4);
    const bad = await request(app).get('/api/questions/nope'); expect(bad.status).toBe(404);
  });
  it('rejects invalid category and length', async () => {
    expect((await request(app).post('/api/quiz/start').send({ category: 'nope' })).status).toBe(400);
    expect((await request(app).post('/api/quiz/start').send({ length: 999 })).status).toBe(400);
  });
  it('full flow: scoring is server-side and duplicates are prevented', async () => {
    const start = await request(app).post('/api/quiz/start').send({ category: 'math', length: 3 });
    expect(start.status).toBe(201); const { sessionId, questions } = start.body;
    expect(JSON.stringify(start.body)).not.toContain('correctOptionId');
    const q = questions[0];
    // unknown answerId must be rejected
    expect((await request(app).post('/api/quiz/answer').send({ sessionId, questionId: q.id, answerId: 'bogus' })).status).toBe(400);
    const ans = await request(app).post('/api/quiz/answer').send({ sessionId, questionId: q.id, answerId: q.options[0].id });
    expect(ans.status).toBe(200); expect(typeof ans.body.correct).toBe('boolean');
    const expectedScore = ans.body.correct ? 10 : 0;
    const dup = await request(app).post('/api/quiz/answer').send({ sessionId, questionId: q.id, answerId: q.options[0].id });
    expect(dup.status).toBe(409);
    const fin = await request(app).post('/api/quiz/finish').send({ sessionId, playerName: 'Tester' });
    expect(fin.status).toBe(200); expect(fin.body.total).toBe(3); expect(fin.body.score).toBe(expectedScore);
    expect(fin.body.accuracy).toBe(expectedScore === 10 ? 33.33 : 0);
    expect(fin.body.saved).toBe(false); expect(fin.body.message).toContain('not configured');
    const again = await request(app).post('/api/quiz/finish').send({ sessionId }); expect(again.status).toBe(409);
  });
  it('leaderboard returns real (possibly empty) entries only', async () => {
    const r = await request(app).get('/api/leaderboard'); expect(r.status).toBe(200); expect(Array.isArray(r.body.entries)).toBe(true);
  });
});
