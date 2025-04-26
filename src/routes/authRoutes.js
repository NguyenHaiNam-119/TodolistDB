const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/authMiddleware');

router.get('/login', redirectIfAuthenticated, authController.renderLogin);
router.post('/login', redirectIfAuthenticated, authController.login);
router.get('/register', redirectIfAuthenticated, authController.renderRegister);
router.post('/register', redirectIfAuthenticated, authController.register);
router.get('/logout', authController.logout);

module.exports = router; 