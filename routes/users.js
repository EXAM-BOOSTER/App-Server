const {signUp, logIn} = require('../controller/auth');
const express = require('express');
const router = express.Router();
const passport = require('passport');


router.use(passport.initialize());
router.use(passport.session());
const {googleSignIn} = require('../controller/passport');

/* GET users listing. */
router.post('/signup', signUp);
router.post('/login', logIn);

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


module.exports = router;
