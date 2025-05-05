const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const now = new Date();

    if (
      user.twoFactorCode !== code ||
      !user.twoFactorExpire ||
      user.twoFactorExpire < now
    ) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // ✅ Clear the code after successful verification
    user.twoFactorCode = null;
    user.twoFactorExpire = null;
    await user.save();

    // ✅ Updated here to include success field
    res.status(200).json({ success: true, message: 'Verification successful' });

  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

module.exports = router;

