const express = require('express');
const router = express.Router();
const User = require('../models/user_model');
const bcrypt = require('bcrypt');
const Teacher = require('../models/teacher_model');


router.get('/reset-password', (req, res) => {
    const token = req.query.token;
    const status = req.query.status;
    let users;
    if (status === 'student') {
        users = User;
    }
    else {
        users = Teacher;
    }
    // TODO: Fetch the user associated with the token from your database.
    users.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(400).render('error');
            }
            // Render the reset password form.
            res.render('reset-password', { token, status });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, confirm_password, status } = req.body;
        // res.send('Password reset successful')
        console.log(token, confirm_password, status)

        // TODO: Fetch the user associated with the token from your database.
        let user;
        if (status === 'student') {
            user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        }
        else {
            user = await Teacher.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        }

        // TODO: Verify that the token hasn't expired.
        if (!user) {
            return res.status(400).render('error');
        }
        // TODO: Update the user's password in the database.        
        const saltRounds = 10; // Adjust this number according to your needs
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(confirm_password, salt);

        user.password = passwordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.render('reset_success');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;