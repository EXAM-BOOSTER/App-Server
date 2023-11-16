const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const optionSchema = new Schema({
  option: {
    type: String,
    required: true
  },
  // _id: false
},_id=false);

const questionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answers: [optionSchema],

  answer: {
    type: Number,
    required: true
  },

  isEnabled: {
    type: Boolean,
    default: true
  },

  explanation: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
});
const chapterSchema = new Schema({
  chapter: {
    type: String,
    required: true
  },
  questions: [questionSchema],

  duration: {
    hours: {
      type: Number,
      default: 0
    },

    minutes: {
      type: Number,
      default: 0
    },

    seconds: {
      type: Number,
      default: 0
    }

  },
  instructions: {
    type: String,
    required: true
  },
  isEnabled: {
    type: Boolean,
    default: false
  }
});
const quizSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  chapter: [chapterSchema],

});

var Quizes = mongoose.model('Quiz', quizSchema, 'Quizess');

module.exports = Quizes;
