const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pseudo: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: 'user' },
    gold: { type: Number, required: true, default: 0 },
    level: { type: Number, required: true, default: 1 },
    lastConnection: { type: Date, required: true, default: Date.now },
    timePassed: { type: Number, required: true, default: 0 }
});


module.exports = mongoose.model('User', userSchema);