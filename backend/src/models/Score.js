const mongoose = require('mongoose');
const scoreSchema = new mongoose.Schema({
  playerName: { type: String, trim: true, maxlength: 40, default: 'Anonymous' },
  score: { type: Number, required: true, min: 0 },
  correct: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 1 },
  accuracy: { type: Number, required: true, min: 0, max: 100 },
  category: { type: String, default: 'mixed' },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.models.Score || mongoose.model('Score', scoreSchema);
