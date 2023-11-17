
const mongoose = require('mongoose');

const seriesHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seriesName: {
        type: String,
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'testSeries.seriesName',
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
    time: { type: String, required: true },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SeriesHistory = mongoose.model('SeriesHistory', seriesHistorySchema, 'SeriesHistory');

module.exports = SeriesHistory;
