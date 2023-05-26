const mongoose = require('mongoose');

const messageAnnonceSchema = mongoose.Schema({
  AnnonceClanId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnnonceClan', required: true},
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true},
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('messageAnnonce', messageAnnonceSchema);