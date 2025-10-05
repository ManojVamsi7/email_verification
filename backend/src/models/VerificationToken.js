const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String }, // for link
  otp: { type: String },   // for otp
  type: { type: String, enum: ['link','otp'], default: 'link' },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

TokenSchema.index({ token: 1 }, { unique: false, sparse: true });
TokenSchema.index({ otp: 1 }, { unique: false, sparse: true });

module.exports = mongoose.model('VerificationToken', TokenSchema);
