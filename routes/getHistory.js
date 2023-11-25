const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// var authenticate = require('../authenticate');
// const jwt = require('jsonwebtoken');
const QuizAttempt = require('../models/testHistory');
const SeriesHistory = require('../models/seriesHistory');
const testSeries = require('../models/testSeries');

const Quizes = require("../models/quizes");

const histRouter = express.Router();
histRouter.use(bodyParser.json());


histRouter.route('/chapHistory')
  .post(async (req, res) => {
    // const { token } = req.body;
    // const verified = jwt.verify(token, process.env.JWT_SECRET);
    const userId = req.session.userId;
    try {
      const data = await QuizAttempt.find({ user: userId });
      const seriesTest = await SeriesHistory.find({ userId: userId });
      if (data == null && seriesTest == null) {
        return res.status(404);
      }
      const history = [];
      if (data != null) {
        data.map((item) => {
          const {
            selectedAnswer,
            subject,
            chapter,
            question,
            timestamp,
            visited,
            time
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
          const subjectData = [{
            name: subject,
            questions: filteredQuestions
          }];
          const testName = subject;
          const series = chapter;

          const object = {
            testName,
            series,
            selectedAnswer,
            visited,
            subjectData,
            time,
            timestamp,
          };
          history.push(object);
        });
      }
      if (seriesTest != null) {
        await Promise.all(seriesTest.map(async (item) => {
          // console.log(seriesTest);
          const test = await testSeries.findOne({name : item.seriesName});
          const testData = await test.testSeries.id(item.testId);
          const {
            selectedAnswer,
            visited,
            seriesName,
            time,
            timestamp
          } = item;
          const series = testData.seriesName;
          const subjectData = [];
          testData.subjects.map((item) => {
            const subjectName = item.subjectName;
            const filteredQuestions = item.questions.map((q) => {
              const { correctAnswer, explanation, question, answers } = q;
              return {
                correctAnswer,
                explanation,
                question,
                answers,
              };
            });
            const subdata ={
              name:subjectName,
              questions:filteredQuestions
            }
            subjectData.push(subdata);
          });
          const testName = seriesName;
          const object = {
            testName,
            series,
            selectedAnswer,
            visited,
            subjectData,
            time,
            timestamp,
          };          
          history.push(object);
        }));
      }
        // console.log(history);
      // Send the filtered data as a response
      res.status(200).json(history);
    }
    catch (err) {
      console.log('Error in getting history',err);
      res.status(500).json({ msg: 'An error occurred in fetching history' });
    }

  })



module.exports = histRouter;