const express = require('express');
const router = express.Router();
const { signup, verifyToken, verifyOtp, resendToken } = require('../controllers/authController');

router.post('/signup', signup);
router.get('/verify/:token', verifyToken);
router.post('/verify-otp', verifyOtp);
router.post('/resend', resendToken);

module.exports = router;
