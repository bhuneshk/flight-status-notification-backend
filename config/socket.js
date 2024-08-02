const socketIo = require('socket.io');
let io;

const initSocket = (server) => {
    io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('subscribeToFlight', (flightNumber) => {
            console.log(`Client ${socket.id} subscribed to flight ${flightNumber}`);
            socket.join(flightNumber);
        });

        socket.on('unsubscribeFromFlight', (flightNumber) => {
            console.log(`Client ${socket.id} unsubscribed from flight ${flightNumber}`);
            socket.leave(flightNumber);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

const broadcastFlightStatusUpdate = (flightNumber, status) => {
    if (io) {
        io.to(flightNumber).emit('flightStatusUpdate', { flightNumber, status });
    }
};

module.exports = { initSocket, broadcastFlightStatusUpdate };
