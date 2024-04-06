const PaymentHistory = require('../../models/payment_model');


const getPaymentHistory = async (req, res) => {
    try {
        const limit = 10;
        let page = req.query.page;
        if (!page || page < 1) {
            page = 1;
        }
        const projection = {
            _id: 1,
            userId: 1,
            contactNo: 1,
            paymentId: 1,
            orderId: 1,
            amount: 1,
            currency: 1,
            status: 1,
            paymentFor: 1,
            createdAt: 1
        };
        const history = await PaymentHistory.find({}, projection).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(history);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const deletePaymentHistory = async (req, res) => {
    try {
        const historyId = req.params.id;
        const history = await PaymentHistory.findOne({ _id: historyId });
        if (!history) {
            return res.status(404).json({ error: 'History not found' });
        }
        await PaymentHistory.deleteOne({ _id: historyId });
        res.status(200).json("History deleted successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = { getPaymentHistory, deletePaymentHistory };