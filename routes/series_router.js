const express = require('express');
const bodyParser = require('body-parser');
const TestSeries = require('../models/test_series_model');
const User = require('../models/user_model');

const seriesRouter = express.Router();
seriesRouter.use(bodyParser.json());

seriesRouter.route('/')
    .get(async (req, res) => {
        try {
            const user = await User.findById(req.session.userId);
            let series = null;
            if(user.enrolledFor === 'JEE'){                
                series = await TestSeries.find({isEnabled: true,type: 'PCM'});
            }
            else if(user.enrolledFor === 'NEET'){
                series = await TestSeries.find({isEnabled: true,type: 'PCB'});
            }
            else{
                series = await TestSeries.find({isEnabled: true});
            }
            if (series == null)
                return res.status(404).json({ msg: "No Series is Found!" });            
            const data = series.map(function (item) {
                return { name: item.name, id: item._id , price: item.price, type: item.type, about:item.about};
            });
            res.status(200).json(data);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Error in fetching Test Series" });
        }
    });

seriesRouter.route('/:seriesId')
    .get(async (req, res) => {
        try {
            const series = await TestSeries.findById(req.params.seriesId);
            if (series == null)
                return res.status(404).json({ msg: "No Series is Found!" });
            const data = series.testSeries
                .filter((item) => item.isEnabled)
                .map(function (item) {
                    return { name: item.seriesName, id: item._id };
                });
            res.status(200).json(data);
        }
        catch (err) {
            res.status(500).json({ msg: "Error in fetching Series" });
        }
    });

seriesRouter.route('/:seriesId/:id')
    .get(async (req, res) => {
        try {
            const series = await TestSeries.findById(req.params.seriesId);
            // console.log(req.params.id, req.params.seriesId);
            const listSeries = await series.testSeries.id(req.params.id);
            if (series == null)
                return res.status(404).json({ msg: "No Series is Found!" });
            const data = listSeries.subjects.map(function (item) {
                return { name: item.subjectName, questions: item.questions };
            });
            res.status(200).json(data);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Error in fetching Questions" });
        }
    });



module.exports = seriesRouter;