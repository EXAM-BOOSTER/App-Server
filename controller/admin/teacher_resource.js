const Teacher = require("../../models/teacher_model");


const getTeacherResources = async (req, res) => {
    try {
        const limit = 10;
        let page = req.query.page;
        if (!page || page < 1) {
            page = 1;
        }
        const projection = {
            _id: 1,
            name: 1,
            email: 1,
            profession: 1,
            MOT: 1,
        };
        const user = await Teacher.find({}, projection).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const deleteTeacherResource = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Teacher.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        await Teacher.deleteOne({ _id: userId });
        res.status(200).json("Teacher deleted successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = { getTeacherResources, deleteTeacherResource};
