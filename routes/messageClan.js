const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');


const messageClanCtrl = require('../controllers/messageClan');

router.post('/', auth.verifyToken, messageClanCtrl.createMessageClan);
router.get('/', auth.verifyToken, messageClanCtrl.getMessagesByClan);
router.delete('/:id', auth.verifyToken, messageClanCtrl.deleteMessageClan);

module.exports = router;