const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const flightRoutes = require('./routes/flightRoutes');
const authRoutes = require('./routes/authRoutes');
const fcmRoutes=require('./routes/fcmTokenRoutes');
const cors = require('cors');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
initSocket(server);

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/flights', flightRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fcmtoken', fcmRoutes);

const PORT = process.env.NODE_ENV === 'production' ? process.env.PROD_PORT : process.env.DEV_PORT;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
