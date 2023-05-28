const mongoose = require('mongoose');

const messageAnnonceSchema = mongoose.Schema({
  AnnoncePlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnnoncePlayer', required: true},
  playerClan: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true},
  ClanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clans', required: true},
  message: { type: String, default: ''},
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('messageAnnonce', messageAnnonceSchema);