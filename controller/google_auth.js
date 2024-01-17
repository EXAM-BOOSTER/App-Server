const User = require('../models/user');
const Teacher = require('../models/teacherModel');
exports.googleSignIn = async (req, res) => {
    try {
        let { name, email} = req.body;
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
          return res.status(400).json({ msg: "Email doesn't exist!" });
        }
        req.session.userId = existingUser._id; // Save the user's ID in the session
        return res.json({
            'name': existingUser.name,
            'email': existingUser.email,
            'enrollment': existingUser.enrolledFor,
            'purchasedSeries': existingUser.purchasedSeries,
            profession: existingUser.profession,
        });
    }
    catch (err) {
        console.log('error in google login', err);
        res.status(500).json({ error: err.message });
    }

}

exports.googleSignUp = async (req, res) => {
    try {
        let { name, email, enrollment } = req.body;
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists!" });
        }

        const newUser = new User({
            name: name,
            email: email,
            enrolledFor: enrollment,
        });
        const user = await newUser.save();
        req.session.userId = user._id; // Save the user's ID in the session
        return res.json({
            'name': user.name,
            'email': user.email,
            'enrollment': user.enrolledFor,
            'purchasedSeries': user.purchasedSeries,
            profession: user.profession,
        });
    }
    catch (err) {
        console.log('Error in google Signup', err);
        res.status(500).json({ error: err.message });
    }

}

exports.googleSignInTeacher = async (req, res) => {
    try {
        let { name, email } = req.body;
        const existingUser = await Teacher.findOne({ email: email });

        if (!existingUser) {
            return res.status(400).json({ msg: "Email doesn't exist!" });
        }
        req.session.userId = existingUser._id; // Save the user's ID in the session
        return res.json({
            'name': existingUser.name,
            'email': existingUser.email,
            profession: existingUser.profession,
            'mot': existingUser.MOT,
        });
    }
    catch (err) {
        console.log('error in google login', err);
        res.status(500).json({ error: err.message });
    }
}

exports.googleSignUpTeacher = async (req, res) => {
    try {
        let { name, email } = req.body;
        const existingUser = await Teacher.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists!" });
        }

        const newUser = new Teacher({
            name: name,
            email: email,

        });
        const user = await newUser.save();
        req.session.userId = user._id; // Save the user's ID in the session
        return res.json({
            'name': user.name,
            'email': user.email,
            profession: user.profession,
            'mot': user.MOT,
        });
    }
    catch (err) {
        console.log('Error in google Signup', err);
        res.status(500).json({ error: err.message });
    }

}