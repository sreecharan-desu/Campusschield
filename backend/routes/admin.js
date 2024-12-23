const bcrypt = require('bcrypt');const express = require('express');const jwt = require('jsonwebtoken');
const adminRouter = express.Router();const { Admin, User } = require('../db/db');const nodemailer = require('nodemailer');
const { validateInputs } = require('./middlewares/zod/inputValidation');const { fetchDB } = require('./middlewares/adminmiddlewares/signin-middleware');
const { auth_admin } = require('./middlewares/adminmiddlewares/auth-middleware');
const { AdminPrescence } = require('./middlewares/adminmiddlewares/signup-middleware');
const { JWT_KEY, generate_JWT_key } = require('./middlewares/usermiddlewares/JWT/generate-auth-key');

adminRouter.post('/signup', validateInputs, AdminPrescence, async (req, res) => {
    const { username, password } = req.body;
    const saltRounds = 4;
    const hashed_password = await bcrypt.hash(password, saltRounds);

    const admin = await Admin.create({
        Username: username,
        Password: hashed_password,
        Email: '',
    });

    res.json({
        msg: `Admin account with id : ${admin._id} created succesfully..`,
        success: true
    });
});

adminRouter.post('/signin', validateInputs, fetchDB, (req, res) => {
    const { username } = req.body;
    const token = generate_JWT_key(username);

    res.json({
        token
    });
});

adminRouter.get('/details', auth_admin, async (req, res) => {
    // gets the admin details
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    const username = jwt.verify(token, JWT_KEY);

    res.json({
        username
    });
});

adminRouter.get('/getusers', auth_admin, async (req, res) => {
    // gets the admin details
    const users = await User.find();

    res.json({
        users
    });
});

adminRouter.delete('/deleteuser', auth_admin, async (req, res) => {
    // deletes particular user
    const userId = req.query.userId;

    await User.deleteOne({
        _id: userId
    });

    res.json({
        msg: `User with user_id : ${userId} deleted successfully`,
        success: true
    });
});

adminRouter.put('/update', validateInputs, auth_admin, async (req, res) => {
    // updates the admin details
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    const old_username = jwt.verify(token, JWT_KEY);

    const { username, password } = req.body;
    const hashed_password = await bcrypt.hash(password, 4);

    await Admin.updateOne({
        Username: old_username
    }, {
        Username: username,
        Password: hashed_password
    });

    res.json({
        msg: 'Account details updated successfully Please Signin again for authentication',
        success: true
    });
});

adminRouter.get('/reports', auth_admin, async (req, res) => {
    // gets all the reports
    try{
        const reports = await Report.find();
        res.json({
            reports,
            success : true
        });
    }
    catch(err){
        res.json({
            msg : err.toString(),
            success : false
        });
    }
});

adminRouter.put('/changestatus', auth_admin, async (req, res) => {
    try {
        const {id,status} = req.body;
        const report = await Report.updateOne({
            _id: id
        }, {
            status
        });

        const user = await User.findOne({ _id : report.userId });

        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #444;">Campus Shield Report Update</h2>
                <p>Dear User,</p>
                <p>Your report status has been updated to: <strong>${status}</strong></p>
                <p>Report ID: ${id}</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
                <hr style="border: 1px solid #eee;">
                <p style="color: #666; font-size: 12px;">This is an automated message from Campus Shield.</p>
            </div>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'noreplycampusschield@gmail.com',
            pass: 'ucdb kbwt jsaa okqo'
            }
        });

        await transporter.sendMail({
            from: '"Campus Shield" <noreply@campusshield.com>',
            to: user.CollegeEmail,
            subject: 'Report Status Update',
            html: emailContent
        });


        const mailOptions = {
            from: 'noreplycampusschield@gmail.com',
            to: user.CollegeEmail,
            subject: 'Report Status Update',
            html: emailContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Error sending report status update email:', error);
            } else {
            console.log('Report status update email sent:', info.response);
            }
        });
        res.json({
            msg: `Report with id : ${id} status changed to ${status}`,
            success: true
        });
    } catch (err) {
        res.json({
            msg: err.toString(),
            success: false
        });
    }
});

adminRouter.delete('/deletereport', auth_admin, async (req, res) => {
    try {
        const {id} = req.body;
        const report = await Report.deleteOne({
            _id: id
        });

        const user = await User.findOne({ _id : report.userId });
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #444;">Campus Shield Report Deletion Notice</h2>
            <p>Dear User,</p>
            <p>We regret to inform you that your report with ID: <strong>${id}</strong> has been deleted from our system.</p>
            <p>If you have any questions or believe this was a mistake, please contact our support team immediately.</p>
            <hr style="border: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">This is an automated message from Campus Shield.</p>
            </div>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'noreplycampusschield@gmail.com',
            pass: 'ucdb kbwt jsaa okqo'
            }
        });

        const mailOptions = {
            from: '"Campus Shield" <noreply@campusshield.com>',
            to: user.CollegeEmail,
            subject: 'Report Deletion Notice',
            html: emailContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Error sending report deletion email:', error);
            } else {
            console.log('Report deletion email sent:', info.response);
            }
        });

        res.json({
            msg: `Report with id : ${id} deleted successfully`,
            success: true
        });
    } catch (err) {
        res.json({
            msg: err.toString(),
            success: false
        });
    }
});
module.exports = adminRouter;
