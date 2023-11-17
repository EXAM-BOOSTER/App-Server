const User = require('../models/user');
const jwt = require('jsonwebtoken');
exports.googleSignIn = async (req, res) => {
    try {
        let { name, email } = req.body;
        const existingUser = await User.findOne({ email: email });
        res.setHeader("Access-Control-Expose-Headers", "*");

        if (!existingUser) {
            // Create a new user
            const newUser = new User({
                name: name,
                email: email,
            });
            const user = await newUser.save();
            const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
            res.header('Authorization', `Bearer ${token}`);
            return res.json({
                'name' : user.name,
                'email': user.email
            });
        }       
        const token = jwt.sign({ id: existingUser._id}, process.env.JWT_SECRET);
        // res.setHeader("Access-Control-Expose-Headers", "*");

        res.header('Authorization', `Bearer ${token}`);
        return res.json({
            'name': existingUser.name,
            'email': existingUser.email,
            'enrollment': existingUser.enrolledFor
        });
    }
    catch (err) {
        console.log('error in google login', err);
        res.status(500).json({ error: err.message });
    }

}

