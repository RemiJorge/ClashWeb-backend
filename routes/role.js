const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const roleCtrl = require('../controllers/role');

//router.get('/add', roleCtrl.promoteToAdmin);
router.put('/promote', auth.verifyToken, auth.isAdmin, roleCtrl.promoteToModerator);
router.put('/demote', auth.verifyToken, auth.isAdmin, roleCtrl.demoteToUser);
router.put('/ban', auth.verifyToken, auth.isModerator, roleCtrl.banUser);
router.put('/unban', auth.verifyToken, auth.isModerator, roleCtrl.unbanUser);
module.exports = router;