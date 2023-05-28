const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const annonceClanCtrl = require('../controllers/annonceClan');

router.get('/', auth.verifyToken, annonceClanCtrl.getAllAnnonceClan);
router.get('/clan', auth.verifyToken, annonceClanCtrl.getAnnonceClan);
router.post('/', auth.verifyToken, annonceClanCtrl.createAnnonceClan);
router.put('/', auth.verifyToken, annonceClanCtrl.updateAnnonceClan);
router.delete('/', auth.verifyToken, annonceClanCtrl.deleteAnnonceClan);

module.exports = router;