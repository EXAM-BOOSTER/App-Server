const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const optionSchema = new Schema({
    option: {
      type: String,
      required: true
    },
    optImage: {
      type: String,
      default: "",
  },
  });
  
  const questionSchema = new Schema({
    question: {
      type: String,
      required: true
    },
    quesImage: {
      type: String,
      default: ""
    },
    answers: [optionSchema],
  
    correctAnswer: {
      type: Number,
      required: true
    },
    explanation: {
      type: String,
      default: ""
    },
    explanationImage: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      required: true,
      enum: ['SCQ', 'NUM']
    }
  });

const subjectSchema = new Schema({
    subjectName: {type: String, required: true, unique: true},
    questions: [questionSchema]
})

const SeriesSchema = new Schema({
    seriesName:{type: String, required: true, unique: true},
    isEnabled: {
        type: Boolean,
        default: false
      },
    subjects: [subjectSchema]
});

const testSeries = new Schema({
    name:{type: String, required: true, unique: true},
    testSeries: [SeriesSchema], 
    price: {
        type: Number,
        required: true,
        default: 0
      },
    type: {
        type: String,
        required: true,  
        enum: ['PCM', 'PCB']      
      },
      about: {
        type: String,
        required: true,
      },  
      isEnabled: {
        type: Boolean,
        default: false
      },

});

const TestSeries = mongoose.model('testSeries', testSeries, 'TestSeriess');

module.exports = TestSeries;