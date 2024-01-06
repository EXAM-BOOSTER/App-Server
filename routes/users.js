const {signUp, logIn, teacherLogIn, teacherSignUp} = require('../controller/auth');
const express = require('express');
const router = express.Router();
const passport = require('passport');


router.use(passport.initialize());
router.use(passport.session());
const {googleSignIn} = require('../controller/passport');

/* GET users listing. */
router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/teacher/signup', teacherSignUp);
router.post('/teacher/login', teacherLogIn);
// Google Sign-In Route
router.post('/google',googleSignIn );

// Google Callback Route
// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/login', // Redirect on failure
//   }),
//   (req, res) => {
//     // Redirect to a success route or send a response with an authentication token.
//     console.log('hi nishant');
//     res.send({ message: 'Authentication successful', user: req.user });
//   }
// );
router.get('/logout', (req, res) => {    
    req.session.destroy();
    res.status(200).send();
    });


module.exports = router;
