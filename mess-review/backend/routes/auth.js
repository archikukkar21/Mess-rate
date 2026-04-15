const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @route POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, uid, password, hostel } = req.body;

    if (!fullName || !uid || !password || !hostel) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ uid: uid.toUpperCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'UID already registered' });
    }

    const user = await User.create({ fullName, uid, password, hostel });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: user._id, fullName: user.fullName, uid: user.uid, hostel: user.hostel }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { uid, password } = req.body;

    if (!uid || !password) {
      return res.status(400).json({ success: false, message: 'UID and password are required' });
    }

    const user = await User.findOne({ uid: uid.toUpperCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid UID or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid UID or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, fullName: user.fullName, uid: user.uid, hostel: user.hostel }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
