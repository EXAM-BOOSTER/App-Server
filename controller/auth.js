const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const Teacher = require("../models/teacher_model");

exports.signUp = async (req, res) => {
    try {    
        let { name, email, password, enrollment} = req.body;        
     
        const existingUser = await User.findOne({ email: email });        
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "Email already exists!" });        

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash,
            enrolledFor:enrollment,            
        });
        const savedUser = await newUser.save();        
        req.session.userId = savedUser._id; // Save the user's ID in the session
        res.json({
            'name': savedUser.name,
            'email': savedUser.email,  
            'enrollment': savedUser.enrolledFor,
            'purchasedSeries':savedUser.purchasedSeries,
            profession: savedUser.profession,          
        });
    } catch (err) {
        console.log("error happened", err);
        res.status(500).json({ error: err.message });
    }
};

exports.logIn = async (req, res) => {
    try {
        let { email, password } = req.body;
        
        const existingUser = await User.findOne({ email: email });
        if (!existingUser)
            return res
                .status(400)
                .json({ msg: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });        
        req.session.userId = existingUser._id; // Save the user's ID in the session
            
        return res.json({
            existingUser,            
        });
    } catch (err) {
        console.log('there is error in catch block');
        res.status(500).json({ error: err.message });
    }
};


exports.teacherSignUp = async (req, res) => {
    try {    
        let { name, email, password} = req.body;        
     
        const existingTeacher = await Teacher.findOne({ email: email });        
        if (existingTeacher)
            return res
                .status(400)
                .json({ msg: "Email already exists!" });        

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new Teacher({
            name,
            email,
            password: passwordHash,                        
        });
        const savedUser = await newUser.save();  
        req.session.userId = savedUser._id; // Save the user's ID in the session                      
        res.json({
            'name': savedUser.name,
            'email': savedUser.email,
            'profession': savedUser.profession,
            'mot': savedUser.MOT,
        });
    } catch (err) {
        console.log("error happened", err);
        res.status(500).json({ error: err.message });
    }
};

exports.teacherLogIn = async (req, res) => {
    try {
        let { email, password } = req.body;
        
        const existingTeacher = await Teacher.findOne({ email: email });
        if (!existingTeacher)
            return res
                .status(400)
                .json({ msg: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, existingTeacher.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });        
        req.session.userId = existingTeacher._id; // Save the user's ID in the session        
        return res.json({
          'name': existingTeacher.name,
          'email': existingTeacher.email,
          'profession': existingTeacher.profession, 
          'mot': existingTeacher.MOT,             
        });
    } catch (err) {
        console.log('there is error in catch block');
        res.status(500).json({ error: err.message });
    }
}

exports.logOut = (req, res) => {    
    res.clearCookie('authToken');
    res.status(200).json({ message: "User logged out." });
};
