const express = require('express');
const bodyParser = require('body-parser');
const Quizes = require("../models/quizes");

const quizRouter = express.Router();
quizRouter.use(bodyParser.json());

quizRouter.route('/')
    .get((req, res, next) => {
        Quizes.find({ isEnabled: true })
            .then((quizes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); // Set the content type to JSON
                var quizData = quizes.map(function (quiz) {
                    return { name: quiz.name, id: quiz._id };
                });
                res.end(JSON.stringify(quizData));
            }, (err) => next(err))
            .catch((err) => next(err));
    })

/*___________________________________________________*/
/*___________________________________________________*/
/*___________________________________________________*/

quizRouter.route('/:quizName')
    .get((req, res, next) => {        
        Quizes.findOne({ name: req.params.quizName })
            .then((quiz) => {            
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                const chapters = quiz.chapter
                    .filter((chapter) => chapter.isEnabled) // Filter out disabled chapters
                    .map((chapter) => ({
                        name: chapter.chapter,
                        id: chapter._id,
                    }));
                res.end(JSON.stringify(chapters));
            }, (err) => next(err)).catch((err) => next(err));
    })
    
/*___________________________________________________*/
/*___________________________________________________*/
/*___________________________________________________*/

quizRouter.route('/:quizName/:chapterId')
    .get(async (req, res) => {
        try {
            const quizName = req.params.quizName;
            const chapterId = req.params.chapterId;

            const quiz = await Quizes.findOne({ name: quizName });
            if (!quiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            const chapter = quiz.chapter.id(chapterId);
            if (!chapter) {
                return res.status(404).json({ error: 'Chapter not found' });
            }            

            const questions = chapter.questions.map((question) => ({
                question: question.question,
                // id: question._id,
                correctAnswer: question.answer,
                answers: question.answers.map((answer) => ({
                    option: answer.option,
                    optImage: answer.optImage,
                })),
                explanation: question.explanation,
                quesImage: question.quesImage,
            }));

            res.json(questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            res.status(500).json({ error: 'An error occurred while fetching questions' });
        }
    });

/*___________________________________________________*/
/*___________________________________________________*/
/*___________________________________________________*/

quizRouter.route('/:quizId/questions')
    .get((req, res, next) => {
        Quizes.findById(req.params.quizId)
            .then((quiz) => {
                if (quiz != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(quiz.questions);
                }
                else {
                    err = new Error('Quiz ' + req.params.quizId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })

/*___________________________________________________*/
/*___________________________________________________*/
/*___________________________________________________*/

quizRouter.route('/:quizId/questions/:questionId')
    .get((req, res, next) => {
        Quizes.findById(req.params.quizId)
            .then((quiz) => {
                if (quiz != null && quiz.questions.id(req.params.questionId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(quiz.questions.id(req.params.questionId));
                }
                else if (quiz == null) {
                    err = new Error('Quiz ' + req.params.quizId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
                else {
                    err = new Error('Question ' + req.params.questionId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })   


module.exports = quizRouter;
