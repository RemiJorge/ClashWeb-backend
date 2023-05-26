const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }],
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null},
    banned: { type: Boolean, default: false }
});


module.exports = mongoose.model('User', userSchema); 