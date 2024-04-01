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
        res.status(200).json(series);
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

const putSeries = async (req, res) => {
    try {
        const { _id, name, type, price, isEnabled, about } = req.body;
        if (!_id) {
            const series = new TestSeries({ name, type, price, isEnabled, about });
            await series.save();
            return res.status(201).json(series).send();
        }
        const filter = _id ;
        const update = { name, type, price, isEnabled, about };
        const series = await TestSeries.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true,
        });
        res.status(201).json(series);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const putSeriesTest = async (req, res) => {
    try {
        const { seriesId } = req.params;
        const {_id, seriesName, isEnabled } = req.body;
        const series = await TestSeries.findOne({ _id: seriesId });
        if (!series) {
            return res.status(404).json({ error: 'Series not found' });
        }
        if(!_id) {            
        series.testSeries.push({ seriesName, isEnabled });
        const test = series.testSeries[series.testSeries.length - 1]; // Get the newly created test
        await series.save();
        res.status(201).json(test).send(); // Send only the newly created test in the response
        }
        else {
            const test = series.testSeries.id(_id);
            if (!test) {
                return res.status(404).json({ error: 'Test not found' });
            }
            test.seriesName = seriesName;
            test.isEnabled = isEnabled;
            await series.save();
            res.status(201).json(test).send();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const putSeriesSubject = async (req, res) => {
    try {
        const { seriesId, testId } = req.params;
        const {_id, subject} = req.body;
        const series = await TestSeries.findOne({ _id: seriesId });
        if (!series) {
            return res.status(404).json({ error: 'Series not found' });
        }
        const test = series.testSeries.id(testId);
        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }
        if(!_id) {
        test.subjects.push(subject);
        }
        else {
            const sub = test.subjects.id(_id);
            if (!sub) {
                return res.status(404).json({ error: 'Subject not found' });
            }
            sub.subjectName = subject.subjectName;
            sub.questions = subject.questions;
        }
        const data = await series.save();
        res.status(201).json(data).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}


const deleteSeries = async (req, res) => {
    try {
        const seriesId = req.params.id;
        const series = await TestSeries.findOne({ _id: seriesId });
        if (!series) {
            return res.status(404).json({ error: 'Series not found' });
        }
        await TestSeries.deleteOne({ _id: seriesId });
        res.status(200).json("Series deleted successfully").send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}


const deleteSeriesTest = async (req, res) => {
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
        test.remove();
        await series.save();
        res.status(200).json("Test deleted successfully").send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}


module.exports = { getSeries, getSeriesById, getSeriesSubject, putSeries, putSeriesTest, putSeriesSubject, deleteSeries, deleteSeriesTest };