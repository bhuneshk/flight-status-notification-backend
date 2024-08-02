const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    deviceToken: {
        type: String,
        default: null,
    },
    bookings: [
        {
            flightNumber: String,
            source: String,
            destination: String,
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);
