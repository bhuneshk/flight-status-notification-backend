const admin = require('../config/firebase');

const sendFirebaseNotification = async (registrationToken, payload) => {
    try {
        const response = await admin.messaging().sendToDevice(registrationToken, payload);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

module.exports = { sendFirebaseNotification };
