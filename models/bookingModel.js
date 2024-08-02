const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    flightNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    source: {
        type: String,
        required: true,
        unique: true,
    },
    destination: {
        type: String,
        required: true,
        unique: true,
    },
    
});

module.exports = mongoose.model('BookingDetails', BookingSchema);
