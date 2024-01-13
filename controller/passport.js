const User = require('../models/user');
exports.googleSignIn = async (req, res) => {
    try {
        let { name, email ,enrollment, profession} = req.body;
        const existingUser = await User.findOne({ email: email });        

        if (!existingUser) {
            // Create a new user
            const newUser = new User({
                name: name,
                email: email,
                enrolledFor: enrollment,
                profession: profession,
            });
            const user = await newUser.save();            
            req.session.userId = existingUser._id; // Save the user's ID in the session            
            return res.json({
                'name' : user.name,
                'email': user.email,
                'enrollment': user.enrolledFor,
                'purchasedSeries':user.purchasedSeries,
                profession: user.profession,
            });
        }               
        req.session.userId = existingUser._id; // Save the user's ID in the session
        return res.json({
            'name': existingUser.name,
            'email': existingUser.email,
            'enrollment': existingUser.enrolledFor,
            'purchasedSeries':existingUser.purchasedSeries,
            profession: existingUser.profession,
        });
    }
    catch (err) {
        console.log('error in google login', err);
        res.status(500).json({ error: err.message });
    }

}

