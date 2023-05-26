const mongoose = require('mongoose');

const clansSchema = mongoose.Schema({
    lastupdate : { type: Date, default: Date.now },
    name : { type: String },
    tag : { type: String, unique: true},
    level: {type: Number},
    description: {type: String},
    clanPoints: {type: Number},
    clanVersusPoints: {type: Number},
    badge: {type: Object},
    type: {type: String},
    members: {type: Number}
});

module.exports = mongoose.model('Clans', clansSchema);