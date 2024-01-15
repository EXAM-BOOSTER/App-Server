const express = require('express');
const bodyParser = require('body-parser');
const Quizes = require("../models/quizes");
const katex = require('katex');
const Teacher = require("../models/teacherModel");
const MOT = require("../models/motModel");

const teacherRouter = express.Router();
teacherRouter.use(bodyParser.json());
// Define the route for /make_test
teacherRouter.route('/make_test')
    .get(async (req, res) => {

        try {
            const teacher = await Teacher.findById(req.session.userId);
            console.log(teacher);
            if (teacher.MOT < 1) {
                return res.status(400).json({ message: "You have used all your MOTs" });
            }
            // Array of subjects with chapters and number of questions
            let { subjects, numQues } = req.body;
            subjects = JSON.parse(subjects);
            // console.log(subjects, numQues);

            const questionsPerSubject = Math.floor(numQues / subjects.length);
            // console.log(questionsPerSubject);
            // Generate the test questions
            const testQuestions = [];
            let quiz;
            for (let i = 0; i < subjects.length; i++) {
                // console.log(subjects[i]);
                if (subjects[i].subject == "Mathematics") {

                    quiz = await Quizes.findOne({ name: "Math" });
                }
                else
                    quiz = await Quizes.findOne({ name: subjects[i].subject });
                const chapters = quiz.chapter;
                let selectedQuestions = selectQuestions(chapters, questionsPerSubject, subjects[i].chapters);
                selectedQuestions = selectedQuestions.map(question => {
                    return {
                        question: question.question,
                        answers: question.answers,
                        correctAnswer: question.answer,
                        explanation: question.explanation
                    }
                });
                testQuestions.push({ subject: subjects[i].subject, selectedQuestions });
                // testQuestions.push({ subject: element.subject, selectedQuestions });
            }
            //decrease the MOT from the teacher
            const TeacherData = await Teacher.findByIdAndUpdate(req.session.userId, { $inc: { MOT: -1 } }, { new: true });
            const mot = TeacherData.MOT;
            // Send the test questions as the response
            res.json({ "testQuestions": testQuestions, "mot": mot });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
    );

// Helper function to get random questions from a chapter
// async function getRandomQuestionsFromChapter(subject, chapter, numQuestions) {

//     const quiz = await Quizes.findOne({ name: subject });
//     const questions = quiz.chapter.id(chapter).questions;
//     // For demonstration purposes, let's assume we have a function called `getQuestionsFromChapter`
//     // that returns an array of questions from the given chapter
//     // const questions = getQuestionsFromChapter(chapter);
//     const randomQuestions = [];

//     while (randomQuestions.length < numQuestions && questions.length > 0) {
//         const randomIndex = Math.floor(Math.random() * questions.length);
//         randomQuestions.push(questions.splice(randomIndex, 1)[0]);
//     }

//     return randomQuestions;
// }


function selectQuestions(chapters, k, chapterIds) {
    try {
        // Check if valid k value
        if (k < 1 || k > chapters.length) {
            console.log(k, chapters.length);
            // throw new Error("Invalid k value");
        }

        // Initialize variables
        let selectedQuestions = [];
        // Filter chapters based on provided IDs    
        chapters = chapters.filter(chapter => chapterIds.includes(chapter._id.toString()));
        const questionCount = chapters.reduce((acc, chapter) => acc + chapter.questions.length, 0);

        // Handle edge cases
        // if (k === 1) {
        //     // Select one random question from any chapter
        //     const randomChapterIndex = Math.floor(Math.random() * chapters.length);
        //     const randomQuestionIndex = Math.floor(Math.random() * chapters[randomChapterIndex].questions.length);
        //     selectedQuestions.push(chapters[randomChapterIndex].questions[randomQuestionIndex]);
        //     return selectedQuestions;
        // } else if (k === chapters.length) {
        //     // Select all questions
        //     for (const chapter of chapters) {
        //         selectedQuestions.push(...chapter.questions);
        //     }
        //     return selectedQuestions;
        // }


        // Calculate maximum questions per chapter
        const maxQuestionsPerChapter = Math.floor(questionCount / chapters.length);

        // Select questions proportionally from each chapter
        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            const numQuestions = Math.min(maxQuestionsPerChapter, chapter.questions.length);
            const selectedChapterQuestions = [];

            // Randomly select questions from the chapter
            const selectedQuestionIndexes = new Set();
            const filteredQuestions = chapter.questions.filter(
                (question, index) => !selectedQuestionIndexes.has(index)
            );
            shuffle(filteredQuestions);
            selectedChapterQuestions.push(...filteredQuestions.slice(0, numQuestions));


            selectedQuestions.push(...selectedChapterQuestions);
        }
        // Shuffle the selected questions
        selectedQuestions = shuffle(selectedQuestions).slice(0, k);
        return selectedQuestions;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}

// Fisher-Yates shuffle algorithm: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

teacherRouter.route('/mot')
    .get(async (req, res) => {
        try {
            const mot = await MOT.find({});

            const data = mot.map(function (item) {
                return { description: item.description, price: item.price, motNumber: item.motNumber };
            });
            res.status(200).json(data);
        }
        catch (err) {
            if (err instanceof NotFoundError)
                return res.status(400).json({ message: "No MOTs found" });
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    });

module.exports = teacherRouter;
