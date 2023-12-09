const User = require('../models/user');
const jwt = require('jsonwebtoken');
exports.googleSignIn = async (req, res) => {
    try {
        let { name, email ,enrollment} = req.body;
        const existingUser = await User.findOne({ email: email });
        res.setHeader("Access-Control-Expose-Headers", "*");

        if (!existingUser) {
            // Create a new user
            const newUser = new User({
                name: name,
                email: email,
                enrolledFor: enrollment
            });
            const user = await newUser.save();
            const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
            req.session.userId = existingUser._id; // Save the user's ID in the session
            res.header('Authorization', `Bearer ${token}`);
            return res.json({
                'name' : user.name,
                'email': user.email,
                'enrollment': user.enrolledFor,
                'purchasedSeries':user.purchasedSeries
            });
        }       
        const token = jwt.sign({ id: existingUser._id}, process.env.JWT_SECRET);
        // res.setHeader("Access-Control-Expose-Headers", "*");
        req.session.userId = existingUser._id; // Save the user's ID in the session
        res.header('Authorization', `Bearer ${token}`);
        return res.json({
            'name': existingUser.name,
            'email': existingUser.email,
            'enrollment': existingUser.enrolledFor,
            'purchasedSeries':existingUser.purchasedSeries
        });
    }
    catch (err) {
        console.log('error in google login', err);
        res.status(500).json({ error: err.message });
    }

}

