const mongoose = require('mongoose');
let state = 'not-configured';
async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { state = 'not-configured'; console.log('[db] MONGODB_URI not set - running without database (in-memory sessions, results will not be persisted)'); return false; }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    state = 'connected'; console.log('[db] Connected to MongoDB'); return true;
  } catch (e) {
    state = 'disconnected'; console.error('[db] MongoDB connection failed:', e.message); return false;
  }
}
function dbState() { return state; }
module.exports = { connectDb, dbState };
