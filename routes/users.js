const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')

/* GET users listing. */
router.get('/', userController.getUsers)
router.post('/register', userController.createUser)
router.post('/login', userController.login)
router.put('/:userId', userController.updateUser)
router.delete('/:userId', userController.deleteUser)

module.exports = router;
