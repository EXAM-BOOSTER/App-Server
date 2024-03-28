const subjectHistory = require('../../models/test_history_model');


const getSubjectHistory = async (req, res) => {
    try {
        const limit = 10;
        let page = req.query.page;
        if (!page || page < 1) {
            page = 1;
        }
        const projection = {
            _id: 1,
            user: 1,
            subject:1,
            chapter: 1,
            time: 1,
            timestamp: 1
        };
        const history = await subjectHistory.find({}, projection).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(history).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const deleteSubjectHistory = async (req, res) => {
    try {
        const historyId = req.params.id;
        const history = await subjectHistory.findOne({ _id: historyId });
        if (!history) {
            return res.status(404).json({ error: 'History not found' });
        }
        await subjectHistory.deleteOne({ _id: historyId });
        res.status(200).json("History deleted successfully").send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

module.exports = { getSubjectHistory, deleteSubjectHistory };

