const express = require('express');
const router = express.Router();
const Flight = require('../models/flightModel');
const BookingDetails = require('../models/bookingModel');
const {messaging}=require('../config/firebase');
const User=require('../models/userModel');
const Token=require('../models/FCMTokenModel');
const dotenv = require('dotenv');

dotenv.config();


// Create a new flight
router.post('/create', async (req, res) => {
    const { flightNumber, source, destination, fare, departureTime, arrivalTime, gateNumber } = req.body;
    try {
        const newFlight = new Flight({ flightNumber, source, destination, fare, departureTime, arrivalTime, gateNumber });
        await newFlight.save();
        res.status(201).json(newFlight);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update flight details based on flight number
router.put('/update', async (req, res) => {
    const { flightNumber, gateNumber, status } = req.body;
    try {
        const updateFields = {};
        if (gateNumber) updateFields.gateNumber = gateNumber;
        if (status) updateFields.status = status;

        const updatedFlight = await Flight.findOneAndUpdate(
            { flightNumber },
            updateFields,
            { new: true }
        );

        if (!updatedFlight) return res.status(404).send('Flight not found');

        // Notify users about flight changes
        const users = await BookingDetails.find({flightNumber:flightNumber});
        console.log(users);
        users.forEach(async (obj)=>{
            const token=await Token.findOne({username:obj.username});
            let notificationTitle = 'Flight Update';
            let notificationBody = `Flight ${flightNumber} has been updated.`;

            if (gateNumber) {
                notificationBody += ` New gate number: ${gateNumber}.`;
            }
            if (status) {
                notificationBody += ` Status: ${status}.`;
            }
            console.log("Token :",token);
            const message = {
                notification: {
                    title: notificationTitle,
                    body: notificationBody,
                },
            token: token.fcmToken
            };
            messaging.send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
        })
        res.json(updatedFlight);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get flights based on source and destination
router.get('/search', async (req, res) => {
    const { source, destination } = req.query;
    try {
        const flights = await Flight.find({ source, destination });
        res.json(flights);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Book a flight
router.post('/book', async (req, res) => {
    const { flightNumber, username, source, destination} = req.body;
    try {
        // Find the flight by flight number
        const flight = await Flight.findOne({ flightNumber });
        if (!flight) return res.status(404).send('Flight not found');

        // Find or create the user based on username
        let bookingdetail = await BookingDetails.findOne({ username });
        if (!bookingdetail) {
            bookingdetail = new BookingDetails({ "username":username,
                "flightNumber":flightNumber,
                "source":source,
                "destination":destination

             });
            await bookingdetail.save();
        }

        res.status(200).send('Flight booked successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
module.exports = router;
