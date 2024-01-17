const express = require('express');
const router = express.Router();
const {signUp, logIn, teacherLogIn, teacherSignUp} = require('../controller/auth');
const {googleSignIn, googleSignInTeacher,googleSignUp,googleSignUpTeacher} = require('../controller/google_auth');

/* GET users listing. */
router.post('/student/signup', signUp);
router.post('/student/login', logIn);
router.post('/teacher/signup', teacherSignUp);
router.post('/teacher/login', teacherLogIn);

// Google Sign-In Route
router.post('/student/google/login',googleSignIn );
router.post('/student/google/signup',googleSignUp );
router.post('/teacher/google/login',googleSignInTeacher );
router.post('/teacher/google/signup',googleSignUpTeacher );

router.get('/logout', (req, res) => {    
    req.session.destroy();
    res.status(200).send();
    });


module.exports = router;
