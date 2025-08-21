const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/userAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Registration Route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
    return res.status(400).json({ error: 'Only Gmail addresses are allowed' });
  }

  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return res.status(400).json({ error: 'Password must be 8+ chars, include a number and uppercase letter' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ email: newUser.email });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Serve React Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../my-app/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});