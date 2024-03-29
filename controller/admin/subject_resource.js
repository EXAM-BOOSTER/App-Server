const Quiz = require('../../models/quizes');



const getSubjects = async (req, res) => {
    try {
        const projection = {
            _id: 1,
            name: 1
        };
        const subjects = await Quiz.find({}, projection);
        res.status(200).json(subjects).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const getChapters = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const projection = {
            _id: 1,
            chapter: 1,
            instructions: 1,
            isEnabled: 1
        }
        const subjects = await Quiz.findOne({ _id: subjectId }, { chapter: 1 });
        if (!subjects) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        const chapter = subjects.chapter.map(chapter => ({
            _id: chapter._id,
            chapter: chapter.chapter,
            instructions: chapter.instructions,
            isEnabled: chapter.isEnabled
        }));

        res.status(200).json(chapter).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const getChaptersSubject = async (req, res) => {
    try {
        const { subjectId, chapterId } = req.params;
        const subject = await Quiz.findOne({ _id: subjectId });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        const chapter = subject.chapter.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        res.status(200).json(chapter).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}


const putChapters = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { chapter, instructions, isEnabled } = req.body;
        const subject = await Quiz.findOne({ _id: subjectId });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        const newChapter = {
            chapter,
            instructions,
            isEnabled
        }
        subject.chapter.push(newChapter);
        await subject.save();
        res.status(200).json({ success: true, message: "Chapter added successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const putChaptersQuestions = async (req, res) => {
    try {
        const { subjectId, chapterId } = req.params;
        const questions = req.body;
        const subject = await Quiz.findOne({ _id: subjectId });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        const chapter = subject.chapter.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        chapter.set('questions', questions); // Update the questions field of the chapter object
        await subject.save(); // Save the changes to the subject
        res.status(201).json(subject).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}


const deleteChapter = async (req, res) => {
    try {
        const { subjectId, chapterId } = req.params;
        const subject = await Quiz.findOne({ _id: subjectId });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        const chapter = subject.chapter.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        await chapter.remove();
        await subject.save();
        res.status(200).json("Chapter deleted successfully").send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}


module.exports = { getSubjects, getChapters, getChaptersSubject, putChapters, putChaptersQuestions, deleteChapter };