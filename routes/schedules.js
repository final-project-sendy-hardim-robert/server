const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const scheduleController = require('../controllers/scheduleController');

router.post('/', auth.isLogin, scheduleController.create)
router.get('/', auth.isLogin, scheduleController.getScheduleByOwner)
router.post('/start', auth.isLogin, scheduleController.startTask)
router.post('/finish', auth.isLogin, scheduleController.stopTask)

module.exports = router;
