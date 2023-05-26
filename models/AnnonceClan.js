const mongoose = require('mongoose');

const annonceClanSchema = mongoose.Schema({
  clanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clan', required: true, unique: true },
  minimumTh: { type: Number },
  minimumTrophies: { type: Number },
  description: { type: String }
});

module.exports = mongoose.model('AnnoncePlayer', annonceClanSchema);