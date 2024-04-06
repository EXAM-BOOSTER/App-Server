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
        res.status(200).json(pyq);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
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
        res.status(200).json(series);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const putPYQ = async (req, res) => {
    try {
        const { _id, name, shift, year } = req.body;
        if (!_id) {
            const pyq = new PYQ({ name, shift, year }, { _id: 1, name: 1, shift: 1, year: 1 });
            await pyq.save();
            return res.status(201).json(pyq);
        }
        const pyq = await PYQ.findOne({ _id });
        if (!pyq) {
            return res.status(404).json({ error: 'PYQ not found' });
        }
        pyq.name = name;
        pyq.shift = shift;
        pyq.year = year;
        await pyq.save();
        res.status(201).json(pyq);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const putPYQSubject = async (req, res) => {
    try {
        const pyqId = req.params.id;
        const files = req.files;
        const { name, questions } = req.body;
        if (files && files.length > 0) {
            for (let file of files) {
                // Parse the fieldname to get the indices and the key
                const match = file.fieldname.match(/^questions\[(\d+)\](answers\[(\d+)\])?\[(\w+)\]$/);
                if (match) {
                    const questionIndex = parseInt(match[1]);
                    const answerIndex = match[3] ? parseInt(match[3]) : null;
                    const key = match[4];

                    // Replace the corresponding field in questions with the file's location
                    if (questions[questionIndex]) {
                        if (answerIndex !== null && questions[questionIndex].answers && questions[questionIndex].answers[answerIndex]) {
                            questions[questionIndex].answers[answerIndex][key] = file.location;
                        } else {
                            questions[questionIndex][key] = file.location;
                        }
                    }
                }
            }
        }
        const pyq = await PYQ.findOne({ _id: pyqId });
        if (!pyq) {
            return res.status(404).json({ error: 'PYQ not found' });
        }
        const sub = pyq.subjects.filter(sub => sub.name === name)[0];
        if (!sub) {
            pyq.subjects.push({ name, questions });
        }
        else {
            sub.name = subject.name;
            sub.questions = subject.questions;
        }

        const data = await pyq.save();
        res.status(201).json(data.subjects);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const deletePYQ = async (req, res) => {
    try {
        const pyqId = req.params.id;
        const pyq = await PYQ.findOne({ _id: pyqId });
        if (!pyq) {
            return res.status(404).json({ error: 'PYQ not found' });
        }
        await pyq.delete();
        res.status(200).send('Deleted Successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = { getPYQ, getPYQSubject, putPYQ, putPYQSubject, deletePYQ };