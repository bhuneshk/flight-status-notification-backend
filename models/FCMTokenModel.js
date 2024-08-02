const mongoose = require('mongoose');

const FCMTokenSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fcmToken: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('FCMToken', FCMTokenSchema);
