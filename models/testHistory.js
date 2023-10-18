const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const quizAttemptSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Quiz.chapters', // Reference to the specific chapter within the quiz
    },
    answers: [{ question: String, answer: String , required:true}],
    timestamp: { type: Date, default: Date.now },
});


module.exports = QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema, 'QuizHistory');