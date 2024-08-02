const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id },'jwtSecret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Save device token endpoint
router.post('/save-device-token', async (req, res) => {
    const { username, deviceToken } = req.body;
    try {
        const user = await User.findOneAndUpdate({ username }, { deviceToken }, { new: true });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.status(200).send('Device token saved');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
