// In-memory session + leaderboard store. Sessions are always server-side so
// scores are never trusted from the client. Leaderboard entries here are only
// real finished games from this process lifetime.
const sessions = new Map();
const memoryLeaderboard = [];
module.exports = { sessions, memoryLeaderboard };
