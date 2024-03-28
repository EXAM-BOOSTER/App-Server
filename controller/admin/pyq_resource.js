const PYQ = require('../../models/pyq_model');


const getPYQ = async (req, res) => {
    try {
        const limit = 10;
        let page = req.query.page;
        if (!page || page < 1) {
            page = 1;
        }
        const projection = {
            _id: 1,
            name: 1,
            shift: 1,
            year: 1,
        };
        const pyq = await PYQ.find({}, projection).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(pyq).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const getPYQSubject = async (req, res) => {
    try {
        const pyqId = req.params.id;
        const projection = { subjects: 1 };
        const series = await PYQ.findOne({ _id: pyqId }, projection);
        if (!series) {
            return res.status(404).json({ error: 'Series not found' });
        }
        res.status(200).json(series).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

module.exports = { getPYQ, getPYQSubject };