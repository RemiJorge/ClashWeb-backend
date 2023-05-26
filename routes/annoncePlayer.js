const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const annoncePlayerCtrl = require('../controllers/annoncePlayer');

router.get('/', auth.verifyToken, annoncePlayerCtrl.getAllAnnoncePlayer);
router.get('/player', auth.verifyToken, annoncePlayerCtrl.getAnnoncePlayer);
router.post('/', auth.verifyToken, annoncePlayerCtrl.createAnnoncePlayer);
router.put('/', auth.verifyToken, annoncePlayerCtrl.updateAnnoncePlayer);
router.delete('/', auth.verifyToken, annoncePlayerCtrl.deleteAnnoncePlayer);
module.exports = router;