const Quiz = require('../../models/quizes');



const getSubjects = async (req, res) => {
    try {
        const projection = {
            _id: 1,
            name: 1
        };
        const subjects = await Quiz.find({}, projection);
        res.status(200).json(subjects);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const getChapters = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const limit = 10;
        let page = req.query.page;
        if (!page || page < 1) {
            page = 1;
        }

        const subjects = await Quiz.findOne({ _id: subjectId }, { chapter: 1 }).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        if (!subjects) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        const chapter = subjects.chapter.map(chapter => ({
            _id: chapter._id,
            chapter: chapter.chapter,
            instructions: chapter.instructions,
            isEnabled: chapter.isEnabled
        }));

        res.status(200).json(chapter);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
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
        res.status(200).json(chapter);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}


const putChapters = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { _id, chapter, instructions, isEnabled } = req.body;
        const subject = await Quiz.findOne({ _id: subjectId });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        if (!_id) {
            const newChapter = {
                chapter,
                instructions,
                isEnabled
            }
            subject.chapter.push(newChapter);
        }
        else {
            const chap = subject.chapter.id(_id);
            if (!chap) {
                return res.status(404).json({ error: 'Chapter not found' });
            }
            chap.chapter = chapter;
            chap.instructions = instructions;
            chap.isEnabled = isEnabled;
        }
        await subject.save();
        res.status(200).json({ success: true, message: "Chapter added successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const putChaptersQuestions = async (req, res) => {
    try {
        const { subjectId, chapterId } = req.params;
        const files = req.files;
        const { questions } = req.body;        
        if (files && files.length > 0) {
            for (let file of files) {
                // Parse the fieldname to get the indices and the key                
                const match = file.fieldname.match(/^questions\[(\d+)\](\[\answers\]\[(\d+)\])?\[(\w+)\]$/);                
                if (match) {
                    const questionIndex = parseInt(match[1]);
                    const answerIndex = match[3] ? parseInt(match[3]) : null;
                    const key = match[4];                    
                    // Replace the corresponding field in questions with the file's location
                    if (questions[questionIndex]) {
                        if (answerIndex !== null && questions[questionIndex].answers && questions[questionIndex].answers[answerIndex]) {                            
                            questions[questionIndex].answers[answerIndex][key] = file.location;
                        } else {
                            questions[questionIndex][key] = file.location;
                        }
                    }
                }
            }
        }
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
        res.status(201).json(subject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
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
        res.status(200).json("Chapter deleted successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}


module.exports = { getSubjects, getChapters, getChaptersSubject, putChapters, putChaptersQuestions, deleteChapter };