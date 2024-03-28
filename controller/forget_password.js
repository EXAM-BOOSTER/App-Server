const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user_model');
const Teacher = require('../models/teacher_model');

const forgetPassword = async (req, res) => {
    try {
        const {email, profession} = req.body;
        let status;
        // TODO: Fetch the user with the given email from your database.
        let user;
        if(profession)
            user = await User.findOne({ email: email });
        else
            user = await Teacher.findOne({ email: email });

        if (!user) {
            return res.status(400).send({message: 'No account with that email address exists'});
        }

        // Generate a cryptographically secure random token
        const token = crypto.randomBytes(32).toString('hex');

        // TODO: Store the token in your database, associated with the user's account.
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 600000; // 5 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });        
        if(profession){
            status = 'student';
        }
        else{
            status = 'teacher';
        }
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Reset your password',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://192.168.43.213:3000/reset/reset-password?status=${status}&token=${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);

        res.send({message:'Password reset email sent'});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'An error occurred while processing your request.'});
    }
}

module.exports = forgetPassword;