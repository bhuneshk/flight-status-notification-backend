const express = require('express');
const router = express.Router();
const FCMToken = require('../models/FCMTokenModel');

// Save FCM Token
router.post('/save', async (req, res) => {
    const { username, fcmToken } = req.body;
    try {
        let tokenEntry = await FCMToken.findOne({ username });
        if (tokenEntry) {
            tokenEntry.fcmToken = fcmToken;
        } else {
            tokenEntry = new FCMToken({ username, fcmToken });
        }
        await tokenEntry.save();
        res.status(200).send('FCM Token saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get FCM Token by Username
router.post('/fetch', async (req, res) => {
    const { username } = req.body;
    try {
        const tokenEntry = await FCMToken.findOne({ username });
        if (!tokenEntry) return res.status(404).send('FCM Token not found');
        res.json({ fcmToken: tokenEntry.fcmToken });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
