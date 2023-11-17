const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const auth = require("../middleware/auth");

exports.signUp = async (req, res) => {
    try {    
        let { name, email, password, enrollment} = req.body;
     
        const existingUser = await User.findOne({ email: email });        
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "Email already exists!" });

        // if (!displayName) displayName = email;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash,
            enrolledFor:enrollment
        });
        const savedUser = await newUser.save();        
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
        res.setHeader("Access-Control-Expose-Headers", "*");
        
        res.header('Authorization', `Bearer ${token}`);
        res.json({
            'name': savedUser.name,
            'email': savedUser.email,            
        });
    } catch (err) {
        console.log("error happened", err);
        res.status(500).json({ error: err.message });
    }
};

exports.logIn = async (req, res) => {
    try {
        let { email, password } = req.body;

        // validate
        // if (!email || !password)
        //   return res.status(400).json({ msg: "Not all fields have been entered." });

        const existingUser = await User.findOne({ email: email });
        if (!existingUser)
            return res
                .status(400)
                .json({ msg: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
        // Set the expiration time (in seconds from the current time)
        const expirationTimeInSeconds = 1800; // 30 min
        const expirationTime = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;
        const token = jwt.sign({ id: existingUser._id, exp: expirationTime }, process.env.JWT_SECRET);
        res.setHeader("Access-Control-Expose-Headers", "*");
        // res.cookie('token', token, { path: '/', domain: 'localhost', httpOnly: true, maxAge: 1800000 });
        res.header('Authorization', `Bearer ${token}`);
        return res.json({
            existingUser,            
        });
    } catch (err) {
        console.log('there is error in catch block');
        res.status(500).json({ error: err.message });
    }
};

exports.logOut = (req, res) => {
    // res.cookie('authToken', '', {path: '/', domain: 'localhost', httpOnly: true, maxAge: -1});
    // res.cookie('mess', '', {maxAge: -1});
    res.clearCookie('authToken');
    res.status(200).json({ message: "User logged out." });
};
