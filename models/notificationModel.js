const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    }
});

const Notification = mongoose.model('Notification', notificationSchema, 'Notification');

module.exports = Notification;
