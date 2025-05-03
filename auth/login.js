const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', email); // DEBUG

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('❌ Incorrect password');
      return res.status(400).json({ message: 'Invalid password' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.twoFactorCode = code;
    user.twoFactorExpire = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    console.log('✅ 2FA code generated:', code);

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

    console.log('📧 Verification email sent');

    return res.status(200).json({ message: 'Verification code sent to email' });

  } catch (err) {
    console.error('❌ Login error:', err);
    // This makes sure a valid JSON is always returned
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;



