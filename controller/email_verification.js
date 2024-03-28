const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const generateOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = crypto.randomInt(100000, 1000000);
        req.session.otp = {
            value: otp,
            expires: Date.now() + 5 * 60 * 1000
        };

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Email Verification',
            text: `Your OTP is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send({ message: 'An error occurred while processing your request.' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send({ message: 'OTP sent successfully' });
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'An error occurred while processing your request.' });

    }

};

const verifyOTP = (req, res, otp) => {
    try {
        const sessionOTP = req.session.otp;
        if (!sessionOTP || sessionOTP.expires < Date.now() || sessionOTP.value !== otp) {
            res.session.otp = null;
            return res.status(400).send({ message: 'Invalid OTP' });
        }
        req.session.otp = null;
        return res.status(200).send({ message: 'OTP verified successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'An error occurred while processing your request.' });
    }
};

module.exports = {
    generateOTP,
    verifyOTP
};
