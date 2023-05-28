const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const messageAnnonceCtrl = require('../controllers/messageAnnonce');

router.post('/', auth.verifyToken, messageAnnonceCtrl.createMessageAnnonce);
router.get('/', auth.verifyToken, messageAnnonceCtrl.getMessagesByAnnonce);
router.delete('/:id', auth.verifyToken, messageAnnonceCtrl.deleteMessage);

module.exports = router;