const mongoose = require("mongoose");

// Define the PYQ schema
// interface Subjects

const optionSchema = new mongoose.Schema(
    {
        option: {
            type: String,
            required: true,
        },
        optImage: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    quesImage: {
        type: String,
        default: "",
    },
    answers: [optionSchema],
    correctAnswer: {
        type: Number,
        required: true,
    },
    explanation: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        required: true,
        default: "SCQ",
    },
},{ _id: false });

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        questions: [questionSchema],
    },
    { _id: false }
);

const pyqSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    PYQs: [
        {
            shift: {
                type: String,
                required: true,
            },
            year: {
                type: Number,
                required: true,
            },
            subjects: [subjectSchema],
        },
    ],
});

// Create and export the PYQ model
module.exports = PYQ = mongoose.model("PYQ", pyqSchema, "PYQs");
