const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const optionSchema = new Schema({
    option: {
      type: String,
      required: true
    }
  });
  
  const questionSchema = new Schema({
    question: {
      type: String,
      required: true
    },
    answers: [optionSchema],
  
    correctAnswer: {
      type: Number,
      required: true
    },
    explanation: {
      type: String,
      default: ""
    }
  });

const subjectSchema = new Schema({
    subjectName: {type: String, required: true},
    questions: [questionSchema]
})

const SeriesSchema = new Schema({
    seriesName:{type: String, required: true},
    isEnabled: {
        type: Boolean,
        default: false
      },
    subjects: [subjectSchema]
});

const testSeries = new Schema({
    name:{type: String, required: true},
    testSeries: [SeriesSchema],  

});

const TestSeries = mongoose.model('testSeries', testSeries, 'TestSeriess');

module.exports = TestSeries;