const express = require('express');
const crypto = require('crypto');
const { questions, publicQuestion } = require('../data/questions');
const { sessions, memoryLeaderboard } = require('../store');
const { dbState } = require('../db');

const router = express.Router();
const CATEGORIES = ['math','sequences','logic','patterns','arithmetic','mixed'];
const POINTS = 10;

function fail(res, status, msg) { return res.status(status).json({ error: msg }); }

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'question-rush-api', timestamp: new Date().toISOString(), database: dbState(), questions: questions.length, environment: process.env.NODE_ENV || 'development' });
});

router.get('/questions', (req, res) => {
  const { category } = req.query;
  let list = questions;
  if (category) {
    if (!CATEGORIES.includes(category)) return fail(res, 400, 'Invalid category');
    if (category !== 'mixed') list = questions.filter(q => q.category === category);
  }
  res.json({ count: list.length, questions: list.map(publicQuestion) });
});

router.get('/questions/:id', (req, res) => {
  const q = questions.find(x => x.id === req.params.id);
  if (!q) return fail(res, 404, 'Question not found');
  res.json(publicQuestion(q));
});

router.post('/quiz/start', (req, res) => {
  const { category = 'mixed', length = 10 } = req.body || {};
  if (!CATEGORIES.includes(category)) return fail(res, 400, 'Invalid category');
  const len = Number(length);
  if (!Number.isInteger(len) || len < 1 || len > 50) return fail(res, 400, 'length must be an integer between 1 and 50');
  let pool = category === 'mixed' ? [...questions] : questions.filter(q => q.category === category);
  // Deterministic-ish shuffle (Fisher-Yates with crypto randomness)
  for (let i = pool.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const selected = pool.slice(0, Math.min(len, pool.length));
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { id: sessionId, category, questionIds: selected.map(q => q.id), answers: new Map(), finished: false, createdAt: Date.now() });
  res.status(201).json({ sessionId, category, total: selected.length, timeLimitSeconds: selected.length * 30, questions: selected.map(publicQuestion) });
});

router.post('/quiz/answer', (req, res) => {
  const { sessionId, questionId, answerId } = req.body || {};
  if (typeof sessionId !== 'string' || typeof questionId !== 'string' || typeof answerId !== 'string') return fail(res, 400, 'sessionId, questionId and answerId are required strings');
  const session = sessions.get(sessionId);
  if (!session) return fail(res, 404, 'Quiz session not found');
  if (session.finished) return fail(res, 409, 'Quiz session already finished');
  if (!session.questionIds.includes(questionId)) return fail(res, 400, 'questionId does not belong to this session');
  if (session.answers.has(questionId)) return fail(res, 409, 'Question already answered - duplicate submissions are not allowed');
  const q = questions.find(x => x.id === questionId);
  if (!q.options.some(o => o.id === answerId)) return fail(res, 400, 'Invalid answerId for this question');
  const correct = answerId === q.correctOptionId;
  session.answers.set(questionId, { answerId, correct });
  const answered = session.answers.size;
  const correctSoFar = [...session.answers.values()].filter(a => a.correct).length;
  res.json({ correct, correctOptionId: q.correctOptionId, explanation: q.explanation, answered, total: session.questionIds.length, score: correctSoFar * POINTS, correctSoFar });
});

router.post('/quiz/finish', async (req, res) => {
  const { sessionId, playerName } = req.body || {};
  if (typeof sessionId !== 'string') return fail(res, 400, 'sessionId is required');
  if (playerName !== undefined && (typeof playerName !== 'string' || playerName.length > 40)) return fail(res, 400, 'playerName must be a string of at most 40 characters');
  const session = sessions.get(sessionId);
  if (!session) return fail(res, 404, 'Quiz session not found');
  if (session.finished) return fail(res, 409, 'Quiz session already finished');
  session.finished = true;
  const total = session.questionIds.length;
  const review = session.questionIds.map(qid => {
    const q = questions.find(x => x.id === qid);
    const a = session.answers.get(qid);
    return { questionId: qid, question: q.question, category: q.category, yourAnswerId: a ? a.answerId : null, correctOptionId: q.correctOptionId, correct: a ? a.correct : false, explanation: q.explanation, options: q.options };
  });
  const correct = review.filter(r => r.correct).length;
  const score = correct * POINTS;
  const accuracy = total ? Math.round((correct / total) * 10000) / 100 : 0;
  const entry = { playerName: (playerName || 'Anonymous').trim() || 'Anonymous', score, correct, total, accuracy, category: session.category, createdAt: new Date().toISOString() };
  let saved = false; let message = null;
  if (dbState() === 'connected') {
    try {
      const Score = require('../models/Score');
      await Score.create(entry); saved = true;
    } catch (e) { console.error('[db] save failed', e.message); message = 'Database save failed: ' + e.message; }
  } else {
    memoryLeaderboard.push({ ...entry, id: crypto.randomUUID() });
    message = 'Database is not configured (MONGODB_URI missing), so this result was kept only in server memory and will not persist after a restart.';
  }
  res.json({ sessionId, score, correct, total, accuracy, answered: session.answers.size, saved, persisted: saved, message, review });
});

router.get('/leaderboard', async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  if (dbState() === 'connected') {
    try {
      const Score = require('../models/Score');
      const rows = await Score.find().sort({ score: -1, createdAt: 1 }).limit(limit).lean();
      return res.json({ source: 'database', count: rows.length, entries: rows.map(r => ({ playerName: r.playerName, score: r.score, correct: r.correct, total: r.total, accuracy: r.accuracy, category: r.category, createdAt: r.createdAt })) });
    } catch (e) { console.error('[db] leaderboard failed', e.message); }
  }
  const entries = [...memoryLeaderboard].sort((a, b) => b.score - a.score).slice(0, limit);
  res.json({ source: 'memory', databaseConfigured: false, count: entries.length, entries });
});

module.exports = router;
