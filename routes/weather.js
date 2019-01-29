const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController.js')
const auth = require('../middlewares/auth');

router.get('/', auth.isLogin,  weatherController.getWeatherData);
router.get('/now', auth.isLogin,  weatherController.getWeatherNow);


module.exports = router
