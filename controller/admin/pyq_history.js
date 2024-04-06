const PyqHistory = require('../../models/pyq_history_model');


const getPyqHistory = async (req, res) => {
    try {
        const limit = 10;
        let page = req.query.page;
        if (!page || page < 1) {
            page = 1;
        }
        const projection = {
            _id: 1,
            userId: 1,
            name: 1,
            year: 1,
            shift: 1,            
            time: 1,
            timestamp: 1
        };
        const history = await PyqHistory.find({}, projection).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(history);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const deletePyqHistory = async (req, res) => {
    try {
        const historyId = req.params.id;
        const history = await PyqHistory.findOne({ _id: historyId });
        if (!history) {
            return res.status(404).json({ error: 'History not found' });
        }
        await PyqHistory.deleteOne({_id: historyId});
        res.status(200).json("History deleted successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = { getPyqHistory, deletePyqHistory };