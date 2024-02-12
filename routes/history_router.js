const express = require('express');
const bodyParser = require('body-parser');
const QuizAttempt = require('../models/test_history_model');
const SeriesHistory = require('../models/series_history_model');
const PyqHistory = require('../models/pyq_history_model');


const submitRouter = express.Router();
submitRouter.use(bodyParser.json());


submitRouter.route('/chapterTest/:subjectName')
    .post(async (req, res) => {
        const subjectName = req.params.subjectName;
        const { chapterName, questions, selectedAnswer, visited, time } = req.body;       
        const userId = req.session.userId;

        try {
            const quesData = [];
            for (const questionData of questions) {
                const { question, correctAnswer, answers, explanation,quesImage, explanationImage } = questionData;                
                const questionObject = {
                    question,
                    answer: correctAnswer,
                    answers: answers,
                    explanation,
                    quesImage,
                    explanationImage
                };

                quesData.push(questionObject);
            }

            // Create a new QuizAttempt object
            const quizAttempt = new QuizAttempt({
                user: userId,
                subject: subjectName,
                chapter: chapterName,
                question: quesData,
                selectedAnswer: selectedAnswer,
                visited: visited,
                time: time,                
            });

            await quizAttempt.save();            
            res.status(200);
        }
        catch (err) {
            console.log("Failed in Saving", err);
        }

    });


submitRouter.route('/series/testSeries/')
    .post(async (req, res, next) => {
        try {
            const { seriesName, seriesId, selectedAnswer, visited,time } = req.body;            
        
            const userId = req.session.userId;

            const seriesHistory = new SeriesHistory({
                userId: userId,
                seriesName: seriesName,
                testId: seriesId,
                selectedAnswer: selectedAnswer,
                visited: visited,
                time: time
            });
            await seriesHistory.save();            
            res.status(200);
        }
        catch (err) {
            console.log("Failed in Saving", err);
        }

    })

submitRouter.route('/pyq/:name/:year/:shift')
.post(async (req, res) => {
    const { selectedAnswer, visited, time } = req.body;
    const userId = req.session.userId;
    const { name, year, shift } = req.params;
    try {        

        // Create a new QuizAttempt object
        const history = new PyqHistory({
            userId: userId,     
            name: name,       
            year: year,
            shift: shift,
            selectedAnswer: selectedAnswer,
            visited: visited,
            time: time
        });

        await history.save();        
        res.status(200);
    }
    catch (err) {
        console.log("Failed in Saving", err);
        res.status(500).json({ msg: "Error in saving history" });
    }

});



module.exports = submitRouter;