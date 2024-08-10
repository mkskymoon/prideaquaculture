const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/signup'); // Adjust the path as needed
require('dotenv').config();

// Route to render the "Forgot Password" page
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



// Define route handler for POST requests to /forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process:\n\n
               http://${req.headers.host}/reset-password/${token}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).send({ error: 'Error sending email' });
            }
            res.status(200).send({ message: 'Password reset email sent successfully' });
        });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Route to render the "Reset Password" page
router.get('/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired');
        }

        res.render('reset-password', { token: req.params.token });
    } catch (err) {
        res.status(500).send('Error rendering reset password page');
    }
});

// Route to handle "Reset Password" form submission
router.post('/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send('Password has been reset');
    } catch (err) {
        res.status(500).send('Error resetting password');
    }
});

module.exports = router;
