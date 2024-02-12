const express = require('express');
const bodyParser = require('body-parser');
const QuizAttempt = require('../models/test_history_model');
const SeriesHistory = require('../models/series_history_model');
const testSeries = require('../models/test_series_model');
const PyQHistory = require('../models/pyq_history_model');
const PYQ = require('../models/pyq_model');

const Quizes = require("../models/quizes");

const histRouter = express.Router();
histRouter.use(bodyParser.json());


histRouter.route('/chapHistory')
  .post(async (req, res) => {    
    const userId = req.session.userId;
    try {
      const data = await QuizAttempt.find({ user: userId }).sort({ timestamp: -1 });
      const seriesTest = await SeriesHistory.find({ userId: userId }).sort({ timestamp: -1 });
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
            const { answer, explanation, question, answers, quesImage, type } = q;
            return {
              correctAnswer: answer,
              explanation,
              question,
              answers,
              quesImage,
              type
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
          const test = await testSeries.findOne({ name: item.seriesName });
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
              const { correctAnswer, explanation, explanationImage, question, answers, quesImage, type } = q;
              return {
                correctAnswer,
                explanation,
                explanationImage,
                question,
                answers,
                quesImage,
                type
              };
            });
            const subdata = {
              name: subjectName,
              questions: filteredQuestions
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
      console.log('Error in getting history', err);
      res.status(500).json({ msg: 'An error occurred in fetching history' });
    }

  })

histRouter.route('/pyq/:year')
  .post(async (req, res) => {

    const userId = req.session.userId;
    const year = req.params.year;
    try {      
      const pyqHistory = await PyQHistory.find({ userId: userId, year: year }).sort({ timestamp: -1 });      
      if (pyqHistory == null) {
        return res.status(404);
      }
      const history = [];
      if (pyqHistory != null) {
       await Promise.all( pyqHistory.map(async (item) => {
          const {
            name,
            selectedAnswer,
            year,
            shift,
            timestamp,
            visited,
            time
          } = item;         
          const pyq = await PYQ.findOne({
            name: name,
            year: year,
            shift: shift            
          });          
          const subjectData = [];
          pyq.subjects.map((item) => {
            const subjectName = item.name;
            const filteredQuestions = item.questions.map((q) => {
              const { correctAnswer, explanation, question, answers, quesImage, type } = q;
              return {
                correctAnswer,
                explanation,
                question,
                answers,
                quesImage,
                type
              };
            });
            const subdata = {
              name: subjectName,
              questions: filteredQuestions
            }
            subjectData.push(subdata);
          });

          const object = {
            name,
            year,
            shift,
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
      console.log('Error in getting history', err);
      res.status(500).json({ msg: 'An error occurred in fetching history' });
    }
  });


module.exports = histRouter;