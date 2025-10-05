const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const { sendVerificationEmail } = require('../utils/email');

// Simple in-memory rate limit (dev). For production, use Redis.
const RATE_LIMIT = {};
const MAX_RESENDS = 3;
const RESEND_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function generateOtp(len = 6) {
  let otp = '';
  for (let i = 0; i < len; i++) otp += Math.floor(Math.random() * 10);
  return otp;
}

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, method } = req.body;
    const sendMethod = method === 'otp' ? 'otp' : 'link';
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed, isVerified: false });

    // remove previous tokens
    await VerificationToken.deleteMany({ userId: user._id });

    const expiresAt = new Date(Date.now() + 45 * 60 * 1000); // 45 minutes
    if (sendMethod === 'link') {
      const token = crypto.randomBytes(32).toString('hex');
      await VerificationToken.create({ userId: user._id, token, type: 'link', expiresAt });
      const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?token=${token}`;
      await sendVerificationEmail(user.email, user.name, link, { type: 'link' });
    } else {
      const otp = generateOtp(6);
      await VerificationToken.create({ userId: user._id, otp, type: 'otp', expiresAt });
      await sendVerificationEmail(user.email, user.name, otp, { type: 'otp' });
    }

    return res.status(201).json({ message: 'User created. Verification email sent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.params;
    const record = await VerificationToken.findOne({ token, type: 'link' });
    if (!record) return res.status(400).send('<h3>Invalid or already used token.</h3>');
    if (record.expiresAt < new Date()) {
      return res.status(400).send('<h3>Token expired. Please request a new verification email.</h3>');
    }
    const user = await User.findById(record.userId);
    if (!user) return res.status(400).send('<h3>User not found</h3>');
    user.isVerified = true;
    await user.save();
    await VerificationToken.deleteOne({ _id: record._id });
    return res.send('<h3>Email verified successfully. You can close this window and login.</h3>');
  } catch (err) {
    console.error(err);
    return res.status(500).send('<h3>Server error</h3>');
  }
};

module.exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const record = await VerificationToken.findOne({ userId: user._id, otp, type: 'otp' });
    if (!record) return res.status(400).json({ message: 'Invalid or already used OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.isVerified = true;
    await user.save();
    await VerificationToken.deleteOne({ _id: record._id });
    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports.resendToken = async (req, res) => {
  try {
    const { email, method } = req.body;
    const sendMethod = method === 'otp' ? 'otp' : 'link';
    if (!email) return res.status(400).json({ message: 'Email required' });

    const now = Date.now();
    const entry = RATE_LIMIT[email] || { count: 0, resetAt: now + RESEND_WINDOW_MS };
    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + RESEND_WINDOW_MS;
    }
    if (entry.count >= MAX_RESENDS) {
      RATE_LIMIT[email] = entry;
      return res.status(429).json({ message: 'Too many resend requests. Try later.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No account with this email' });
    if (user.isVerified) return res.status(400).json({ message: 'Account already verified' });

    await VerificationToken.deleteMany({ userId: user._id });

    const expiresAt = new Date(Date.now() + 45 * 60 * 1000);
    if (sendMethod === 'link') {
      const token = crypto.randomBytes(32).toString('hex');
      await VerificationToken.create({ userId: user._id, token, type: 'link', expiresAt });
      const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?token=${token}`;
      await sendVerificationEmail(user.email, user.name, link, { type: 'link' });
    } else {
      const otp = generateOtp(6);
      await VerificationToken.create({ userId: user._id, otp, type: 'otp', expiresAt });
      await sendVerificationEmail(user.email, user.name, otp, { type: 'otp' });
    }

    entry.count += 1;
    RATE_LIMIT[email] = entry;

    return res.json({ message: 'Verification email resent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
