const TestSeriesHistory = require('../../models/series_history_model');


const getSeriesHistory = async (req, res) => {
    try {
        const limit = 10;
        let page = req.query.page;
        if(!page || page < 1) {
            page = 1;
        }
        const projection = {
            _id: 1,
            userId: 1,
            seriesName: 1,
            testId: 1,
            time: 1,
            timestamp: 1
        };
        const history = await TestSeriesHistory.find({}, projection).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(history).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}


const deleteSeriesHistory = async (req, res) => {
    try {
        const historyId = req.params.id;
        const history = await TestSeriesHistory.findOne({ _id: historyId });
        if (!history) {
            return res.status(404).json({ error: 'History not found' });
        }
        await TestSeriesHistory.deleteOne({ _id: historyId });
        res.status(200).json("History deleted successfully").send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}


module.exports = { getSeriesHistory, deleteSeriesHistory };
