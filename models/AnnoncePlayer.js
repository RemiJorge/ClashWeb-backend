const mongoose = require('mongoose');

const annoncePlayerSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true, unique: true },
  minimumLevel: { type: Number },
  minimumTrophies: { type: Number },
  description: { type: String }
});

module.exports = mongoose.model('AnnoncePlayer', annoncePlayerSchema);