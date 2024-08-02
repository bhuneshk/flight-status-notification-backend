const User = require('../models/userModel');
const FlightStatus = require('../models/flightStatusModel');
const admin = require('../config/firebase');
const { broadcastFlightStatusUpdate } = require('../config/socket');

exports.getFlights = async (req, res) => {
    try {
        const flights = await FlightStatus.find({});
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bookFlight = async (req, res) => {
    const { flightNumber, userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.bookedFlights.push({ flightNumber, status: 'Booked' });
        await user.save();

        res.status(200).json({ message: 'Flight booked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFlightStatus = async (req, res) => {
    const { flightNumber, status } = req.body;

    try {
        await FlightStatus.updateOne({ flightNumber }, { status });

        const users = await User.find({ 'bookedFlights.flightNumber': flightNumber });

        users.forEach(user => {
            user.bookedFlights.forEach(flight => {
                if (flight.flightNumber === flightNumber) {
                    flight.status = status;
                }
            });
            user.save();

            const registrationTokens = user.registrationTokens;
            registrationTokens.forEach(token => {
                admin.messaging().send({
                    token,
                    notification: {
                        title: 'Flight Status Update',
                        body: `Your flight ${flightNumber} status is now ${status}`
                    }
                });
            });
        });

        broadcastFlightStatusUpdate(flightNumber, status);

        res.status(200).json({ message: 'Flight status updated and notifications sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
