const express = require('express');
const bodyParser = require('body-parser');

const pyqRouter = express.Router();
pyqRouter.use(bodyParser.json());
// Import the PyQ model
const PyQ = require('../models/pyq_model');

// Route to fetch data from PyQ model
pyqRouter.route('/:name')
    .get(async (req, res) => {
        try {
            const name = req.params.name;

            // Fetch data from PyQ model using the name
            const pyq = await PyQ.find({ name: name });
            const latestYear = pyq.reduce((latest, item) => {
                if (item.year > latest) {
                    return item.year;
                }
                return latest;
            }, 0);

            const data = pyq.
                filter((item) => item.year === latestYear)
                .map((item) => {
                    const { year, shift } = item;
                    return {
                        year,
                        shift
                    };
                });

            res.json(data);
        } catch (error) {
            console.log(error);
            // Handle any errors that occur during the process
            res.status(500).json({ error: 'Internal Server Error,' });
        }
    });

pyqRouter.route('/:name/:year/')
.get(async (req, res) => {
    try{
        const name = req.params.name;
        const year = req.params.year;
        const pyq = await PyQ.find({name: name,year: year});
        const data = pyq.map((item) => {
            const { year, shift } = item;
            return {
                year,
                shift
            };
        });
        res.json(data);
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

pyqRouter.route('/:name/:year/:shift')
.get(async (req, res) => {
    try{
        const name = req.params.name;
        const year = req.params.year;
        const shift = req.params.shift;
        const pyq = await PyQ.findOne({name: name,year: year,shift: shift});
        // const data = pyq.PYQs.filter((item) => item.year == year && item.shift == shift);
        res.json(pyq.subjects);
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = pyqRouter;
