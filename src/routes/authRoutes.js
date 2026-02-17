const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validate');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected route
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
