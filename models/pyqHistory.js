const mongoose = require('mongoose');

const pyqHistorySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    shift: {
        type: String,
        required: true
    },
    selectedAnswer: {
        type: [Number],
        required: true
    },
    visited: {
        type: [Boolean],
        required: true
    },
    time: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const PyqHistory = mongoose.model('PyqHistory', pyqHistorySchema, 'PyQHistory');

module.exports = PyqHistory;
