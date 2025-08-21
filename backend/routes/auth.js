const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Gmail-only validation
  if (!email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
    return res.status(400).json({ message: 'Only Gmail addresses allowed.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;