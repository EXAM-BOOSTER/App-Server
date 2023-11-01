const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const jwt = require('jsonwebtoken');
const QuizAttempt = require('../models/testHistory');

const Quizes = require("../models/quizes");

const histRouter = express.Router();
histRouter.use(bodyParser.json());


histRouter.route('/chapHistory')
    .post(async (req, res) => {
        const { token } = req.body;
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const userId = verified.id;
        try {
            const data = await QuizAttempt.find({ user: userId });
            if(data == null){
                return res.status(404);
            }

            const filteredData = data.map((item) => {
                const {
                  selectedAnswer,
                  subject,
                  chapter,
                  question,
                  timestamp,
                } = item;
                
                // Modify the 'question' array to filter out unwanted fields within each question object
                const filteredQuestions = question.map((q) => {
                  const { answer, explanation, question, answers } = q;
                  return {
                    correctAnswer: answer,
                    explanation,
                    question,
                    answers,
                  };
                });
              
                return {
                  selectedAnswer,
                  subject,
                  chapter,
                  question: filteredQuestions,
                  timestamp,
                };
              });
            //   console.log(filteredData);
              // Send the filtered data as a response
              res.status(200).json(filteredData);                        
        }
        catch (err) {
            console.log('Error in getting history');  
            res.status(500).json({msg: 'An error occurred in fetching history'});
        }

    })



module.exports = histRouter;