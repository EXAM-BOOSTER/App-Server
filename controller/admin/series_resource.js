const TestSeries = require('../../models/test_series_model');


const getSeries = async (req, res) => {
    try {
        const limit = 10;
        let page = req.query.page;
        if (!page || page < 1) {
            page = 1;
        }
        const projection = {
            _id: 1,
            name: 1,
            price: 1,
            type: 1,
            about: 1,
            isEnabled: 1,
        };
        const series = await TestSeries.find({}, projection).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(series).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const getSeriesById = async (req, res) => {
    try {
        const seriesId = req.params.id;
        const projection = { testSeries: 1 };
        const series = await TestSeries.findOne({ _id: seriesId }, projection);
        if (!series) {
            return res.status(404).json({ error: 'Series not found' });
        }
        const tests = series.testSeries.map(test => ({
            _id: test._id,
            seriesName: test.seriesName,
            isEnabled: test.isEnabled
        }));
        res.status(200).json(tests).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const getSeriesSubject = async (req, res) => {
    try {
        const { seriesId, testId } = req.params;
        const series = await TestSeries.findOne({ _id: seriesId });
        if (!series) {
            return res.status(404).json({ error: 'Series not found' });
        }
        const test = series.testSeries.id(testId);
        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }
        res.status(200).json(test).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}



module.exports = { getSeries, getSeriesById, getSeriesSubject };