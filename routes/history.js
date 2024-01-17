const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const QuizAttempt = require('../models/testHistory');
const SeriesHistory = require('../models/seriesHistory');
const PyqHistory = require('../models/pyqHistory');
const Quizes = require("../models/quizes");

const submitRouter = express.Router();
submitRouter.use(bodyParser.json());


submitRouter.route('/chapterTest/:subjectName')
    .post(async (req, res) => {
        const subjectName = req.params.subjectName;
        const { token, chapterName, questions, selectedAnswer, visited, time } = req.body;
        // const verified = jwt.verify(token, process.env.JWT_SECRET);
        const userId = req.session.userId;
        // console.log(token, userId, chapterId, questions, selectedAnswer, visited, time);
        // console.log(subjectName, token, questions, selectedAnswer);
        try {
            const quesData = [];
            for (const questionData of questions) {
                const { question, correctAnswer, answers, explanation,quesImage } = questionData;

                const questionObject = {
                    question,
                    answer: correctAnswer,
                    answers: answers,
                    explanation,
                    quesImage
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
                time: time
            });

            await quizAttempt.save();
            console.log('Quiz attempt inserted:');
            res.status(200);
        }
        catch (err) {
            console.log("Failed in Saving", err);
        }

    });

//saving history of test series

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
            console.log('Series history inserted:');
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
        console.log('PyQ attempt inserted:');
        res.status(200);
    }
    catch (err) {
        console.log("Failed in Saving", err);
        res.status(500).json({ msg: "Error in saving history" });
    }

});



module.exports = submitRouter;