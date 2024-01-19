const express = require('express');
const bodyParser = require('body-parser');
const Quizes = require("../models/quizes");
const katex = require('katex');
const Teacher = require("../models/teacher_model");
const MOT = require("../models/mot_model");
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const mjAPI = require('mathjax-node');
const fs = require('fs');
const sharp = require('sharp');
mjAPI.start();
mjAPI.config({
    MathJax: {
        SVG: {
            font: 'STIX-Web',
            linebreaks: { automatic: true },
        },
    },
});

const teacherRouter = express.Router();
teacherRouter.use(bodyParser.json());
// Define the route for /make_test
teacherRouter.route('/make_test')
    .get(async (req, res) => {

        try {
            const teacher = await Teacher.findById(req.session.userId);
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

            const pdfDoc = await PDFDocument.create();

            for (const subject of testQuestions) {
                const page = pdfDoc.addPage();
                const { width, height } = page.getSize();

                let yPosition = height - 50;

                const subjectText = subject.subject;
                const subjectTextWidth = (await pdfDoc.embedFont(StandardFonts.Helvetica)).widthOfTextAtSize(subjectText, 12);
                const subjectTextX = (width - subjectTextWidth) / 2;

                page.drawText(subjectText, {
                    x: subjectTextX,
                    y: yPosition,
                    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                    color: rgb(0, 0, 0),
                });

                yPosition -= 50;
                let questionNumber = 1;

                for (const question of subject.selectedQuestions) {
                    // Add question number and question text
                    const extractedContent = question.question.replace(/([^$]*)(\$[^$]*\$)?/g, function(_, text, math) {
                        if (text.trim() !== '') {
                          text = '\\text{' + text + '}';
                        }
                        if (math) {
                          math = math.replace(/\$/g, '');
                        }
                        return text + (math || '');
                      });
                    const svgImage = await renderLatexToImage(extractedContent);
                    const questionText = `Question ${questionNumber}:`;
                    page.drawText(questionText, {
                        x: 50,
                        y: yPosition,
                        size: 12,
                    });
                    yPosition -= 8;

                    if (svgImage) {
                        const pngImage = await convertSvgToPng(svgImage);
                        const image = await pdfDoc.embedPng(pngImage);
                        const imageDims = image.scale(0.2);
                        const imageWidth = imageDims.width;
                        const imageHeight = imageDims.height;

                        page.drawImage(image, {
                            x: 50,
                            y: yPosition - imageHeight,
                            width: imageWidth,
                            height: imageHeight,
                        });

                        yPosition -= imageHeight + 20;
                    }

                    // Add options with prefixes
                    const options = ['a', 'b', 'c', 'd']; // Modify as needed
                    for (const [index, option] of question.answers.entries()) {
                        const replacedOption = option.option.replace(/([^$]*)(\$[^$]*\$)?/g, function(_, text, math) {
                            if (text.trim() !== '') {
                              text = '\\text{' + text + '}';
                            }
                            if (math) {
                              math = math.replace(/\$/g, '');
                            }
                            return text + (math || '');
                          });
                        const img = await renderLatexToImage(replacedOption);
                        if (img) {
                            const pngImg = await convertSvgToPng(img);
                            const image = await pdfDoc.embedPng(pngImg);
                            const imageDims = image.scale(0.2);
                            const imageWidth = imageDims.width;
                            const imageHeight = imageDims.height;

                            if (yPosition < imageHeight) {
                                // If it does, adjust the yPosition
                                yPosition -= 20; // Adjust this value as needed
                            }

                            page.drawText(`${options[index]}.`, { // Add the letter before the option image
                                x: 30,
                                y: yPosition - imageHeight / 4,
                                size: 12,
                            });

                            page.drawImage(image, {
                                x: 50,
                                y: yPosition - imageHeight / 2,
                                width: imageWidth,
                                height: imageHeight,
                            });

                            yPosition -= imageHeight + 5;
                        }
                    }
                    yPosition -= 20;
                    questionNumber += 1;
                }
            }
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();

            let yPosition = height - 50;

            page.drawText("Correct Answers", {
                x: width / 2 - 50, // Adjust the x-coordinate to center the text
                y: yPosition,
                font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
                size: 20,
                color: rgb(0, 0, 0),
                anchor: 'center',
            });
            yPosition -= 30;

            let j = 1;
            let xPosition = 50;
            const lineHeight = 16;
            const maxLineWidth = 500;

            for (const subject of testQuestions) {
                for (const question of subject.selectedQuestions) {
                    const answerIndex = correctAnswerIndex(question);
                    const answerLetter = String.fromCharCode(answerIndex + 97);

                    page.drawText(`${j} ${answerLetter}`, {
                        x: xPosition,
                        y: yPosition,
                        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                        size: 16,
                        color: rgb(0, 0, 0),
                    });

                    xPosition += 30; // Adjust the spacing as needed

                    if (xPosition > maxLineWidth) {
                        xPosition = 50; // Reset xPosition to start a new line
                        yPosition -= lineHeight;
                    }

                    j++;
                }
            }

            const pdfBytes = await pdfDoc.save();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('X-MOT', mot);
            res.send(pdfBytes);

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


async function renderLatexToImage(latexCode) {
    return new Promise((resolve, reject) => {
        mjAPI.typeset({
            math: latexCode,
            format: 'TeX',
            svg: true,
        }, (data) => {
            if (!data.errors) {
                resolve(data.svg);
            } else {
                console.error(data.errors);
                reject('Error rendering LaTeX');
            }
        });
    });
}

async function convertSvgToPng(svgImage) {
    return sharp(Buffer.from(svgImage), { density: 300 })
        .png()
        .toBuffer();
}


function correctAnswerIndex(que) {
    for (let i = 0; i < que.answers.length; i++) {
        if (que.answers[i].option === que.answers[que.correctAnswer - 1].option) {
            return i;
        }
    }
    return 0;
}


module.exports = teacherRouter;
