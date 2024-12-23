const express = require('express');const userRouter = express.Router();const jwt = require('jsonwebtoken');
const { User, Report, SirenAlert, Authorities, EmergencyContact } = require('../db/db');
const { validateInputs } = require('./middlewares/zod/inputValidation');const nodemailer = require('nodemailer');
const { auth_user, current_user } = require('./middlewares/usermiddlewares/auth-middleware');
const { fecthUserDB } = require('./middlewares/usermiddlewares/signin-middleware');
const { generate_JWT_key, JWT_KEY } = require('./middlewares/usermiddlewares/JWT/generate-auth-key');
const { verifyUserExistence } = require('./middlewares/usermiddlewares/signup-middleware');
const { generate_hashed_password } = require('./middlewares/usermiddlewares/hashfns/hash-password');
const { getReports } = require('./middlewares/usermiddlewares/helperFNs/getReports');
const validateReport = require('./middlewares/zod/reportValidation');
const profileValidation = require('./middlewares/zod/profileValidation');

//routes
userRouter.post('/signup', validateInputs, verifyUserExistence, async (req, res) => {
    const { username, college_email, password } = req.body;
    try {
        const response = await generate_hashed_password(password);
        if (response.success) {
            const user = await User.create({
                Username: username,
                CollegeEmail: college_email,
                Password: response.hashed_password
            });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'noreplycampusschield@gmail.com',
                    pass: 'ucdb kbwt jsaa okqo'
                }
            });

            const mailOptions = {
                from: 'noreplycampusschield@gmail.com',
                to: college_email,
                subject: 'Welcome to CampusShield!',
                html: `<p>Hello ${username},</p>
                       <p>Welcome to CampusShield! We are thrilled to have you on board. Your account has been created successfully, and you can now sign in to access all the features and services we offer.</p>
                       <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                       <p>Best regards,<br>The CampusShield Team</p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

            res.status(201).json({
                msg: `Account created successfully with userId ${user._id},Signin to continue`,
                success: true
            });
        } else {
            res.status(500).json({
                msg: `An error occurred while hashing the password. Please try again.`,
                success: false
            });
        }
    } catch (error) {
        console.log(error)
    }
});

userRouter.post('/signin', validateInputs, fecthUserDB, async (req, res) => {
    const { username } = req.body;
    try {
        const auth_token = await generate_JWT_key(username);
        const user = await User.findOne({
            Username: username
        });


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'noreplycampusschield@gmail.com',
            pass: 'ucdb kbwt jsaa okqo'
            }
        });

        const mailOptions = {
            from: 'noreplycampusschield@gmail.com',
            to: user.CollegeEmail,
            subject: 'New Login Alert',
            html: `<p>Hello ${user.Username},</p>
               <p>We noticed a new login to your CampusShield account. If this was you, no further action is required. If you did not log in, please secure your account immediately by changing your password.</p>
               <p>Stay safe,<br>The CampusShield Team</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Error sending email:', error);
            } else {
            console.log('Email sent:', info.response);
            }
        });

        res.json({
            user: {
                id: user._id,
                username: user.Username,
                college_email: user.CollegeEmail,
                personal_email: user.PersonalEmail || null,
                phone: user.Phone || null,
                address: user.Address || null,
                college: user.College || null,
                course: user.Course || null,
                year: user.Year || null,
                blood_group: user.BloodGroup || null,
                medical_conditions: user.MedicalConditions || null,
                allergies: user.Allergies || null,
                medications: user.Medications || null,
                emergency_contact: user.EmergencyContact || null,
                emergency_phone: user.EmergencyPhone || null,
                created_at: user.createdAt
            },
            token: auth_token,
            success: true
        })
    } catch (e) {
        res.json({
            error: e,
            msg: 'Error while generating auth_token Please Try again!',
            success: false
        })
    }
});

//(get) -end points
userRouter.get('/getreports', auth_user, async (req, res) => {
    //returns all the reports of the user
    try {
        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];  // removing the Bearer
        const username = jwt.verify(token, JWT_KEY);
        const Current_user = await current_user(username)
        if (Current_user == null) {
            return res.json({
                msg: 'FATAL : User not found',
                success: false
            })
        } else {
            const reports = await getReports(Current_user._id);
            res.json({
                reports,
                success: true
            })
        }
    } catch (e) {
        res.json({
            msg: 'An error occurred while fetching the reports',
            success: false
        })
    }
});

//(post -endpoints)
userRouter.post('/createreport', validateReport, auth_user, async (req, res) => {
    const { title, description, location, dateTime, harasser, video_link, image_link, audio_link, whom_to_report } = req.body;

    try {
        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];  // removing the Bearer
        const username = await jwt.verify(token, JWT_KEY);
        const Current_user = await current_user(username);

        const report = await Report.create({
            userId: Current_user._id,
            Title: title,
            Description: description,
            Status: 'Pending',
            Time: dateTime,
            Location: {
                type: "Point",
                coordinates: [location.longitude, location.latitude]
            },
            HarasserDetails: harasser,
            VideoLink: video_link || 'No Video',
            ImageLink: image_link || 'No Image',
            AudioLink: audio_link || 'No Audio',
            WhomToReport: whom_to_report || 'Unknown'
        });


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreplycampusschield@gmail.com',
                pass: 'ucdb kbwt jsaa okqo'
            }
        });

        const userMailOptions = {
            from: 'noreplycampusschield@gmail.com',
            to: Current_user.CollegeEmail,
            subject: `Report Submitted - We're Taking Action` ,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #d32f2f; text-align: center; margin-bottom: 20px;">Report Submission Confirmed</h2>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${Current_user.Username},</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    We want to assure you that your report has been successfully received and is being treated with utmost priority. Our dedicated team has been notified and will begin investigating immediately.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    You'll receive regular updates both via email and in the app regarding the progress of your report.
                </p>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">Stay safe,</p>
                <p style="color: #d32f2f; font-weight: bold; margin-bottom: 20px;">The CampusShield Team</p>
                <div style="text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 15px;">
                This is an automated message. Please do not reply directly to this email.
                </div>
            </div>
            `
        };

        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email to user:', error);
            } else {
                console.log('Email sent to user:', info.response);
            }
        });

        let recipientEmail;
        switch (whom_to_report) {
            case 'police':
                recipientEmail = 'sreecharan309@gmail.com';
                break;
            case 'women_organization':
                recipientEmail = 'o210008@rguktong.ac.in';
                break;
            default:
                recipientEmail = 'noreply.campusschield@gmail.com';
                break;
        }

        const authorityMailOptions = {
            from: 'noreplycampusschield@gmail.com',
            to: recipientEmail,
            subject: 'Urgent: New Report Requires Investigation',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #d32f2f; text-align: center; margin-bottom: 20px;">Alert: New Report Submitted</h2>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    A new report has been submitted that requires your immediate attention and investigation. 
                    This matter has been flagged as important and needs to be addressed promptly.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Please log in to your dashboard to view the complete details of the report and take necessary action.
                </p>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">Best regards,</p>
                <p style="color: #d32f2f; font-weight: bold; margin-bottom: 20px;">The CampusShield Team</p>
                <div style="text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 15px;">
                This is an automated message. Please do not reply directly to this email.
                </div>
            </div>
            `
        };

        transporter.sendMail(authorityMailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email to authority:', error);
            } else {
                console.log('Email sent to authority:', info.response);
            }
        });

        const collegeAuthorities = await Authorities.findOne({ userId: Current_user._id });
        if (collegeAuthorities) {
            const collegeMailOptions = {
                from: 'noreplycampusschield@gmail.com',
                to: collegeAuthorities.Email,
                subject: 'New Report to Investigate',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                        <h2 style="color: #d32f2f; text-align: center; margin-bottom: 20px;">Alert: New Report Submitted</h2>
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${collegeAuthorities.Name},</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                                A new report has been submitted by <strong>${Current_user.Username}</strong> and requires your immediate attention. 
                                Please investigate the details provided in the report as soon as possible.
                            </p>
                        </div>
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">Stay safe,</p>
                        <p style="color: #d32f2f; font-weight: bold; margin-bottom: 20px;">The CampusShield Team</p>
                        <div style="text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 15px;">
                            This is an automated message. Please do not reply directly to this email.
                        </div>
                    </div>
                `
            };

            transporter.sendMail(collegeMailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email to college authorities:', error);
                } else {
                    console.log('Email sent to college authorities:', info.response);
                }
            });
        }

        res.json({
            msg: `Report created successfully with id:${report._id}`,
            success: true
        })
    } catch (e) {
        res.json({
            msg: 'An error occurred while creating the report',
            success: false
        })
    }

});

//unAuth Services
userRouter.post('/sendsiren', async (req, res) => {
    //sends siren alert to the user
    const { title, description, location, video_link, image_link, audio_link } = req.body;
    if (req.headers.authorization == null) {
        const siren = await SirenAlert.create({
            Username: "Anonymous",
            Title: title,
            Description: description,
            Location: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            VideoLink: video_link || 'No Video',
            ImageLink: image_link || 'No Image',
            AudioLink: audio_link || 'No Audio',
            Status: 'Pending'
        });

        res.json({
            msg: `Siren Alert sent successfully with id:${siren._id}`,
            success: true
        })
    } else {
        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];  // removing the Bearer
        const username = jwt.verify(token, JWT_KEY);
        const Current_user = await current_user(username);
        const siren = await SirenAlert.create({
            Username: Current_user.Username ? Current_user.Username : "Anonymous",
            Title: title,
            Description: description,
            Location: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            VideoLink: video_link || 'No Video',
            ImageLink: image_link || 'No Image',
            AudioLink: audio_link || 'No Audio',
            Status: 'Pending'
        });


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreplycampusschield@gmail.com',
                pass: 'ucdb kbwt jsaa okqo'
            }
        });

        const mapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

        const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #d32f2f; text-align: center; margin-bottom: 20px;">⚠️ URGENT: Siren Alert</h2>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Reported by:</strong> ${Current_user ? Current_user.Username : 'Anonymous'}</p>
                <p><strong>Location:</strong> <a href="${mapsLink}" style="color: #0066cc;">View on Google Maps</a></p>
            </div>
            <p style="color: #d32f2f; font-weight: bold;">Immediate action may be required.</p>
        </div>`;

        const mailOptions = {
            from: 'noreplycampusschield@gmail.com',
            to: 'noreply.campusschield@gmail.com',
            subject: '🚨 EMERGENCY: Siren Alert Triggered',
            html: emailTemplate
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending siren alert email:', error);
            } else {
                console.log('Siren alert email sent:', info.response);
            }
        });

        const collegeAuthorities = await Authorities.findOne({ userId: Current_user._id });
        if (collegeAuthorities && collegeAuthorities.Email) {
            const authorityMailOptions = {
                from: 'noreplycampusschield@gmail.com',
                to: collegeAuthorities.Email,
                subject: '🚨 EMERGENCY: Siren Alert Triggered',
                html: emailTemplate
            };

            transporter.sendMail(authorityMailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending siren alert to authorities:', error);
                } else {
                    console.log('Siren alert sent to authorities:', info.response);
                }
            });
        }

        res.json({
            msg: `Siren Alert sent successfully with id:${siren._id}`,
            success: true
        })
    }

});

//(put) -end points
userRouter.put('/updateprofile', profileValidation, auth_user, async (req, res) => {
    let authUpdated = false;
    try {
        const {
            username, password, personal_email, college_email, phone, address,
            college_name, course, year, blood_group, medical_conditions,
            allergies, medications, emergency_contacts, authorities_details
        } = req.body;

        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];
        const old_username = jwt.verify(token, JWT_KEY);

        // Basic user fields update
        let updateFields = {
            Username: username,
            PersonalEmail: personal_email,
            CollegeEmail: college_email,
            Phone: phone,
            Address: address,
            College: college_name,
            Course: course,
            Year: year,
            BloodGroup: blood_group,
            MedicalConditions: medical_conditions,
            Allergies: allergies,
            Medications: medications
        };

        // Get current user once
        const currentUser = await User.findOne({ Username: old_username });
        if (!currentUser) {
            throw new Error('User not found');
        }

        // Update emergency contacts if provided
        if (Array.isArray(emergency_contacts) && emergency_contacts.length > 0) {
            await EmergencyContact.deleteMany({ userId: currentUser._id });
            await EmergencyContact.insertMany(
                emergency_contacts.map(contact => ({
                    userId: currentUser._id,
                    Name: contact.name,
                    Phone: contact.phone,
                    Relationship: contact.relation
                }))
            );
        }

        // Update authorities if provided
        if (authorities_details) {
            await Authorities.findOneAndUpdate(
                { userId: currentUser._id },
                {
                    userId: currentUser._id,
                    Name: authorities_details.name,
                    Phone: authorities_details.phone,
                    Address: authorities_details.address,
                    Email: authorities_details.email,
                    Type: authorities_details.type
                },
                { upsert: true, new: true }
            );
        }

        // Only hash and update password if it's provided
        if (password) {
            const hashResult = await generate_hashed_password(password);
            if (hashResult.success) {
                updateFields.Password = hashResult.hashed_password;
                authUpdated = true;
            } else {
                return res.status(400).json({
                    msg: 'Error while hashing password',
                    success: false
                });
            }
        }

        const updatedUser = await User.findOneAndUpdate(
            { Username: old_username },
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                msg: 'User not found',
                success: false
            });
        }

        const emergencyContacts = await EmergencyContact.find({ userId: currentUser._id });
        const authoritiesDetails = await Authorities.findOne({ userId: currentUser._id });


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreplycampusschield@gmail.com',
                pass: 'ucdb kbwt jsaa okqo'
            }
        });

        const mailOptions = {
            from: 'noreplycampusschield@gmail.com',
            to: updatedUser.CollegeEmail,
            subject: 'Profile Update Confirmation',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #2196F3; text-align: center; margin-bottom: 20px;">Profile Update Successful</h2>
                <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${updatedUser.Username},</p>
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Your profile has been successfully updated. Here's a summary of what was updated:
                    </p>
                    <ul style="color: #555; font-size: 14px; line-height: 1.8;">
                        ${personal_email ? `<li>Personal Email: ${personal_email}</li>` : ''}
                        ${phone ? `<li>Phone Number: ${phone}</li>` : ''}
                        ${college_name ? `<li>College: ${college_name}</li>` : ''}
                        ${course ? `<li>Course: ${course}</li>` : ''}
                        ${emergency_contacts ? `<li>Emergency Contacts Updated</li>` : ''}
                        ${authorities_details ? `<li>Authority Details Updated</li>` : ''}
                    </ul>
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        You can review these changes by logging into your account.
                    </p>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #666; font-size: 14px;">Stay safe,</p>
                    <p style="color: #2196F3; font-weight: bold;">The CampusShield Team</p>
                </div>
                <div style="text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; margin-top: 20px; padding-top: 15px;">
                    This is an automated message. Please do not reply to this email.
                </div>
            </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending profile update email:', error);
            } else {
                console.log('Profile update email sent:', info.response);
            }
        });

        if (authUpdated) {

            return res.json({
                msg: 'Profile updated successfully. Please signin again for authentication',
                success: true,
            });
        } else {
            res.json({
                msg: 'Profile updated successfully',
                success: true,
                user: {
                    username: updatedUser.Username,
                    college_email: updatedUser.CollegeEmail,
                    personal_email: updatedUser.PersonalEmail,
                    phone: updatedUser.Phone,
                    address: updatedUser.Address,
                    college: updatedUser.College,
                    course: updatedUser.Course,
                    year: updatedUser.Year,
                    blood_group: updatedUser.BloodGroup,
                    medical_conditions: updatedUser.MedicalConditions,
                    allergies: updatedUser.Allergies,
                    medications: updatedUser.Medications,
                    authorities_details: authoritiesDetails,
                    emergency_contacts: emergencyContacts
                }
            });
        }


    } catch (error) {
        res.status(500).json({
            msg: 'Error updating profile',
            error: error.message,
            success: false
        });
    }
});

//error-handling-middleware
userRouter.use((err, req, res, next) => {
    console.error('You have been caught up', err);
    res.status(500).send('Something broke!');
});

module.exports = userRouter;
