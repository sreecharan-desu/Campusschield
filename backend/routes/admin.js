const bcrypt = require('bcrypt');const express = require('express');const jwt = require('jsonwebtoken');
const adminRouter = express.Router();const { Admin, User,Report, SirenAlert,EmergencyContact,Authorities } = require('../db/db');const nodemailer = require('nodemailer');
const { validateInputsSIgnin } = require('./middlewares/zod/inputValidation');const { fetchDB } = require('./middlewares/adminmiddlewares/signin-middleware');
const { auth_admin } = require('./middlewares/adminmiddlewares/auth-middleware');
const { AdminPrescence } = require('./middlewares/adminmiddlewares/signup-middleware');
const { JWT_KEY, generate_JWT_key } = require('./middlewares/usermiddlewares/JWT/generate-auth-key');
const mailPassword = "trlt vgrs dbyj lzdq";
const mailId = "noreplycampusschield@gmail.com";

// adminRouter.post('/signup', validateInputs, AdminPrescence, async (req, res) => {
//     const { username, password } = req.body;
//     const saltRounds = 4;
//     const hashed_password = await bcrypt.hash(password, saltRounds);

//     const admin = await Admin.create({
//         Username: username,
//         Password: hashed_password,
//         Email: mailId,
//     });

//     res.json({
//         msg: `Admin account with id : ${admin._id} created succesfully..`,
//         success: true
//     });
// });

adminRouter.get('/getsirens', auth_admin, async (req, res) => {


        // gets all the sirens

// await User.deleteMany();
// await Report.deleteMany();
// await SirenAlert.deleteMany();
// console.log("Deleted all sirens");
// await EmergencyContact.deleteMany();
// await Authorities.deleteMany();
// await Admin.deleteMany();

// console.log("Deleted all data");


// await Admin.create({
//     Email: "mailId",
//     Password: "admin@campus",
//     Username: "SreeCharan"
// });


// console.log(`Admin Created with default credentials of Email: "mailId",
// Password: " admin@campus", Username: " SreeCharan"`);

    
    try {
        const sirens = await SirenAlert.find();
        res.json({
            sirens,
            success: true
        });
    }
    catch (err) {
        res.json({
            msg: err.toString(),
            success: false
        });
    }
});

adminRouter.post('/signin', fetchDB, async(req, res) => {
    const { username } = req.body;
    const token = generate_JWT_key(username);
    const admin = await Admin.findOne({ Username: username });
    res.json({
        admin : {
            id : admin._id,
            username : admin.Username,
            email : admin.Email
        },token,success: true
    });
});

adminRouter.get('/getusers', auth_admin, async (req, res) => {
    // gets the admin details
    const users = await User.find();

    res.json({
        users,success : true,usercount : users.length
    });
});

adminRouter.delete('/deleteuser', auth_admin, async (req, res) => {
    // deletes particular user
    const userId = req.query.userId;

    await Report.deleteMany({
        userId : userId
    })

    await SirenAlert.deleteMany({
        userId : userId
    })

    await User.deleteOne({
        _id: userId
    });

    res.json({
        msg: `User with user_id : ${userId} deleted successfully`,
        success: true
    });
});

// adminRouter.put('/update', validateInputs, auth_admin, async (req, res) => {
//     // updates the admin details
//     const authorization = req.headers.authorization;
//     const token = authorization.split(' ')[1];
//     const old_username = jwt.verify(token, JWT_KEY);

//     const { username, password } = req.body;
//     const hashed_password = await bcrypt.hash(password, 4);

//     await Admin.updateOne({
//         Username: old_username
//     }, {
//         Username: username,
//         Password: hashed_password
//     });

//     res.json({
//         msg: 'Account details updated successfully Please Signin again for authentication',
//         success: true
//     });
// });

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
        console.log(id,status);
        const report = await Report.findOne({
            _id: id
        });
        console.log(report);

        if(report){
            const newReport = await Report.updateOne({
                _id: report._id
            }, {
                Status: status
            }); 
            const user = await User.findOne({ _id : report.userId });

            console.log(newReport);

            const emailContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <h2 style="color: #2c3e50; text-align: center;">Campus Shield Report Update</h2>
            <p style="color: #34495e; font-size: 16px;">Hello ${user.Username},</p>
            <p style="color: #34495e; font-size: 16px;">We wanted to let you know that the status of your report has been updated to: <strong style="color: #e74c3c;">${status}</strong></p>
            <p style="color: #34495e; font-size: 16px;">Report ID: <strong>${id}</strong></p>
            <p style="color: #34495e; font-size: 16px;">If you have any questions or need further assistance, please feel free to reach out to our support team.</p>
            <p style="color: #34495e; font-size: 16px;">Thank you for using Campus Shield!</p>
            <hr style="border: 1px solid #ecf0f1;">
            <p style="color: #95a5a6; font-size: 12px; text-align: center;">This is an automated message from Campus Shield. Please do not reply to this email.</p>
            </div>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: mailId,
    pass: mailPassword            }
        });

        await transporter.sendMail({
            from: '"Campus Shield" <noreply@campusshield.com>',
            to: user.CollegeEmail,
            subject: 'Report Status Update',
            html: emailContent
        });


        const mailOptions = {
            from: mailId,
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
    
        }else{
            res.json({
                msg: `Report with id : ${id} not found`,
                success: false
            });
        }
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
        const report = await Report.findByIdAndDelete({
            _id: id
        });

        console.log(report);

        const user = await User.findOne({ _id : report.userId });
        const emailContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <h2 style="color: #2c3e50; text-align: center;">Campus Shield Report Deletion Notice</h2>
            <p style="color: #34495e; font-size: 16px;">Hello ${user.Username},</p>
            <p style="color: #34495e; font-size: 16px;">We regret to inform you that your report with ID: <strong style="color: #e74c3c;">${id}</strong> has been deleted from our system.</p>
            <p style="color: #34495e; font-size: 16px;">If you have any questions or believe this was a mistake, please contact our support team immediately.</p>
            <hr style="border: 1px solid #ecf0f1;">
            <p style="color: #95a5a6; font-size: 12px; text-align: center;">This is an automated message from Campus Shield. Please do not reply to this email.</p>
            </div>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: mailId,
pass: mailPassword            }
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
