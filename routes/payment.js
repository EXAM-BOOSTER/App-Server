const crypto = require('crypto');
const axios = require('axios');
const express = require('express');
const paymentRouter = express.Router();
const bodyParser = require('body-parser');
const Payment = require('../models/paymentModel');
const User = require('../models/user');

// POST /success route
paymentRouter.use(bodyParser.json());

paymentRouter.post('/success', async (req, res) => {
    // Handle the response from successful payment here
    const { paymentId, orderId, signature, seriesId } = req.body; // Assuming the payment response is sent in the request body
    const userId = req.session.userId;
    try {
        // Generate the expected signature
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZOR_SECRET)
            .update(orderId + '|' + paymentId)
            .digest('hex');

        if (signature === expectedSignature) {
            // The signature is valid, store the payment details in the database
            const response = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.RAZOR_KEY + ':' + process.env.RAZOR_SECRET).toString('base64')}`
                }
            });

            const paymentDetails = response.data;
            console.log(paymentDetails);

            // Store the payment details in the database
            const payment = new Payment({
                paymentId,
                orderId,
                userId: req.session.userId, // The user ID should come from the session
                amount: paymentDetails.amount,
                currency: paymentDetails.currency,
                status: paymentDetails.status,
                // Add more fields as needed
            });

            payment.save(); 
            await User.findByIdAndUpdate(userId, { $push: { purchasedSeries: seriesId } });               
            // Send a success response back to the Flutter app
            res.status(200).json({ message: 'Payment successful' });

        } else {
            // The signature is not valid, return an error response
            res.status(400).json({ error: 'Invalid payment signature' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error in processing payment' });
    }
});

module.exports = paymentRouter;