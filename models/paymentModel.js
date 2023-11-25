
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true
  },
    orderId: {
        type: String,
        required: true
    },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
    // required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    status: {
        type: String,
        required: true
    },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema, 'Payment History');

module.exports = Payment;
