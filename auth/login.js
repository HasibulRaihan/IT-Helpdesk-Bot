const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save code + expiry
    user.twoFactorCode = code;
    user.twoFactorExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    await user.save();

    // ✅ Email the code
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"IT Helpdesk Bot" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Verification Code',
      html: `<p>Your 2FA code is: <b>${code}</b><br>This code will expire in 5 minutes.</p>`
    });

    res.json({ message: 'Verification code sent to email' });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login error' });
  }
});

module.exports = router;


