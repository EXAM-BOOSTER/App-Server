const User = require("../../models/user_model");


const getStudentResources = async (req, res) => {
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
            enrolledFor: 1,
            purchasedSeries: 1,

        };
        const user = await User.find({}, projection).sort({_id:-1}).skip((page - 1) * limit).limit(limit);
        res.status(200).json(user).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const deleteUserResource = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await User.deleteOne({ _id: userId });
        res.status(200).json("User deleted successfully").send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

module.exports = {getStudentResources, deleteUserResource};
        