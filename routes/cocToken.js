const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const cocTokenCtrl = require('../controllers/cocToken');

router.post('/verifyToken', auth.verifyToken, cocTokenCtrl.verifyToken);
router.get('/player/:id', auth.verifyToken, cocTokenCtrl.getPlayerByTag);
router.get('/player', auth.verifyToken, cocTokenCtrl.getPlayer);
router.delete('/player', auth.verifyToken, cocTokenCtrl.deletePlayer);

module.exports = router;