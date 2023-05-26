const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    lastupdate : { type: Date, default: Date.now },
    banned: { type: Boolean, default: false }, 
    tag : { type: String, unique: true},
    name : { type: String },
    townHallLevel : { type: Number },
    townHallWeaponLevel : { type: Number },
    expLevel : { type: Number },
    trophies : { type: Number },
    bestTrophies : { type: Number },
    warStars : { type: Number },
    attackWins : { type: Number },
    defenseWins : { type: Number },
    builderHallLevel : { type: Number },
    builderBaseTrophies : { type: Number },
    versusTrophies : { type: Number },
    bestVersusTrophies : { type: Number },
    versusBattleWins : { type: Number },
    role : { type: String },
    donations : { type: Number },
    donationsReceived : { type: Number },
    league : { type: Object },
    clan : { type: mongoose.Schema.Types.ObjectId, ref: 'Clans', default: null}
});

module.exports = mongoose.model('Player', playerSchema);