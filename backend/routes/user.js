const express = require('express');const userRouter = express.Router();const jwt = require('jsonwebtoken');
const { User, Report, SirenAlert, Authorities, EmergencyContact } = require('../db/db');
const {  validateInputsSIgnup, validateInputsSIgnin } = require('./middlewares/zod/inputValidation');const nodemailer = require('nodemailer');
const { auth_user, current_user } = require('./middlewares/usermiddlewares/auth-middleware');
const { fecthUserDB } = require('./middlewares/usermiddlewares/signin-middleware');
const { generate_JWT_key, JWT_KEY } = require('./middlewares/usermiddlewares/JWT/generate-auth-key');
const { verifyUserExistence } = require('./middlewares/usermiddlewares/signup-middleware');
const { generate_hashed_password } = require('./middlewares/usermiddlewares/hashfns/hash-password');
const { getReports } = require('./middlewares/usermiddlewares/helperFNs/getReports');
const validateReport = require('./middlewares/zod/reportValidation');
const profileValidation = require('./middlewares/zod/profileValidation');
const zod = require('zod');
const policeEmail = 'publicpolice05@gmail.com';
const womeEmail = 'womenorganization62@gmail.com';
const mailPassword = "trlt vgrs dbyj lzdq";
const mailId = "noreplycampusschield@gmail.com";

//routes
userRouter.post('/signup', validateInputsSIgnup, verifyUserExistence, async (req, res) => {
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
                    user: mailId,
                    pass: mailPassword
                }
            });

            const mailOptions = {
                from: mailId,
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

userRouter.post('/signin', validateInputsSIgnin, fecthUserDB, async (req, res) => {
    const { username } = req.body;
    try {
        const auth_token = await generate_JWT_key(username);
        const user = await User.findOne({
            Username: username
        });


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: mailId,
            pass: mailPassword
        }
        });

        const mailOptions = {
            from: mailId,
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

        if (user == null) {
            return res.json({
                msg: 'FATAL : User not found',
                success: false
            })
        } else {
            const emergencyContacts = await EmergencyContact.find({ userId: user._id });
            const authoritiesDetails = await Authorities.findOne({ userId: user._id });

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
                    emergency_contact: emergencyContacts || null,
                    authorities_detail: authoritiesDetails || null,
                    created_at: user.createdAt
                },
                token : auth_token,
                success: true
            })
        }
    } catch (e) {
        res.json({
            error: e,
            msg: 'Error while generating auth_token Please Try again!',
            success: false
        })
    }
});

userRouter.get('/details', auth_user, async (req, res) => {
    try {
        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];  // removing the Bearer
        const username = jwt.verify(token, JWT_KEY);
        const Current_user = await current_user(username);
        if (Current_user == null) {
            return res.json({
                msg: 'FATAL : User not found',
                success: false
            })
        } else {
            const emergencyContacts = await EmergencyContact.find({ userId: Current_user._id });
            const authoritiesDetails = await Authorities.findOne({ userId: Current_user._id });

            res.json({
                user: {
                    id: Current_user._id,
                    username: Current_user.Username,
                    college_email: Current_user.CollegeEmail,
                    personal_email: Current_user.PersonalEmail || null,
                    phone: Current_user.Phone || null,
                    address: Current_user.Address || null,
                    college: Current_user.College || null,
                    course: Current_user.Course || null,
                    year: Current_user.Year || null,
                    blood_group: Current_user.BloodGroup || null,
                    medical_conditions: Current_user.MedicalConditions || null,
                    allergies: Current_user.Allergies || null,
                    medications: Current_user.Medications || null,
                    emergency_contacts: emergencyContacts || null,
                    authorities_details: authoritiesDetails || null,
                    created_at: Current_user.createdAt
                },
                success: true
            })
        }
    } catch (e) {
        res.json({
            msg: 'An error occurred while fetching the user details',
            success: false
        })
    }
}
);
    

//(get) -end points
userRouter.post('/getreports', auth_user, async (req, res) => {
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
    const { title, description, location,h_location,dateTime, harasser, video_link, image_link, audio_link, whom_to_report } = req.body;

    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                msg: 'Authorization header missing',
                success: false
            });
        }
        const token = authorization.split(' ')[1];  // removing the Bearer
        if (!token) {
            return res.status(401).json({
                msg: 'Token missing',
                success: false
            });
        }
        const username = jwt.verify(token, JWT_KEY);
        const Current_user = await current_user(username);

        const report = await Report.create({
            userId: Current_user._id,
            h_location : h_location,
            Title: title,
            Description: description,
            Status: 'Pending',
            Time: dateTime,
            Location: location,
            HarasserDetails: harasser,
            VideoLink: video_link || 'No Video',
            ImageLink: image_link || 'No Image',
            AudioLink: audio_link || 'No Audio',
            WhomToReport: whom_to_report || 'Unknown'
        });



        // console.log(report)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailId,
                pass: mailPassword
            }
        });

        const userMailOptions = {
            from: mailId,
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
                recipientEmail = policeEmail;
                break;
            case 'women_organization':
                recipientEmail = womeEmail;
                break;
            default:
                recipientEmail = mailId;
                break;
        }

        const authorityMailOptions = {
            from: mailId,
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
                from: mailId,
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
            msg: `An error occurred while creating the report  ${e}`,
            success: false
        })
    }

});

//unAuth Services
userRouter.post('/sendsiren', async (req, res) => {
    //sends siren alert to the user
    const { title, description, location, video_link, image_link, audio_link } = req.body;
    if (!req.headers.authorization.includes("Bearer")) {
        console.log("Sending an anonymus siren")
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

        return res.json({
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
                user: mailId,
                pass: mailPassword
            }
        });

        const mapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

        const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #d32f2f; text-align: center; margin-bottom: 20px;">⚠️ URGENT: Siren Alert</h2>
            <p style="color: #555; text-align: center; margin-bottom: 20px;">
                An emergency alert has been triggered. Please review the details below and take appropriate action immediately.
            </p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Reported by:</strong> ${Current_user ? Current_user.Username : 'Anonymous'}</p>
                <p><strong>Location:</strong> <a href="${mapsLink}" style="color: #0066cc;">View on Google Maps</a></p>
                <p><strong>Coordinates:</strong> Latitude: ${location.latitude}, Longitude: ${location.longitude}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>User Contact:</strong> ${
                  Current_user && Current_user.email ? Current_user.email : 'Not provided'
                }</p>
            </div>
            <p style="color: #d32f2f; font-weight: bold; margin-top: 20px;">Additional Details:</p>
            <ul style="color: #555; margin-left: 20px;">
                <li>This alert was generated using the Campus Shield system.</li>
                <li>Further updates will be provided as more information becomes available.</li>
            </ul>
            <p style="margin-top: 20px; color: #555;">
                For inquiries or further assistance, please contact support at <a href="mailto:support@campusshield.com" style="color: #0066cc;">support@campusshield.com</a>.
            </p>
        </div>`;        
        const mailOptions = {
            from: mailId,
            to: mailId,
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
                from: mailId,
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
userRouter.put('/updateprofile', auth_user, async (req, res) => {
    let authUpdated = false;
    try {
        const {
            username, password, personal_email, college_email, phone, address,
            college_name, course, year, blood_group, medical_conditions,
            allergies, medications, emergency_contacts, authorities_detail
        } = req.body;

        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];
        const old_username = jwt.verify(token, JWT_KEY);

        // Get current user once
        const currentUser = await User.findOne({ Username: old_username });
        if (!currentUser) {
            throw new Error('User not found');
        }

        // Basic user fields update
        let updateFields = {};
        let updatedFields = [];
        const UserwithUsernameExists = await User.findOne({
            Username : username
        })
        if (username && username !== currentUser.Username && UserwithUsernameExists === null) {
            updateFields.Username = username;
            updatedFields.push(`Username: ${username}`);
        }
        if (personal_email && personal_email !== currentUser.PersonalEmail) {
            updateFields.PersonalEmail = personal_email;
            updatedFields.push(`Personal Email: ${personal_email}`);
        }
        if (college_email && college_email !== currentUser.CollegeEmail) {
            updateFields.CollegeEmail = college_email;
            updatedFields.push(`College Email: ${college_email}`);
        }
        if (phone && phone !== currentUser.Phone) {
            updateFields.Phone = phone;
            updatedFields.push(`Phone: ${phone}`);
        }
        if (address && address !== currentUser.Address) {
            updateFields.Address = address;
            updatedFields.push(`Address: ${address}`);
        }
        if (college_name && college_name !== currentUser.College) {
            updateFields.College = college_name;
            updatedFields.push(`College: ${college_name}`);
        }
        if (course && course !== currentUser.Course) {
            updateFields.Course = course;
            updatedFields.push(`Course: ${course}`);
        }
        if (year && year !== currentUser.Year) {
            updateFields.Year = year;
            updatedFields.push(`Year: ${year}`);
        }
        if (blood_group && blood_group !== currentUser.BloodGroup) {
            updateFields.BloodGroup = blood_group;
            updatedFields.push(`Blood Group: ${blood_group}`);
        }
        if (medical_conditions && medical_conditions !== currentUser.MedicalConditions) {
            updateFields.MedicalConditions = medical_conditions;
            updatedFields.push(`Medical Conditions: ${medical_conditions}`);
        }
        if (allergies && allergies !== currentUser.Allergies) {
            updateFields.Allergies = allergies;
            updatedFields.push(`Allergies: ${allergies}`);
        }
        if (medications && medications !== currentUser.Medications) {
            updateFields.Medications = medications;
            updatedFields.push(`Medications: ${medications}`);
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
            updatedFields.push('Emergency Contacts Updated');
        }

        console.log()
        // Update authorities if provided
        if (authorities_detail) {
            await Authorities.updateOne(
                { userId: currentUser._id },
                {
                    userId: currentUser._id,
                    Name: authorities_detail.name,
                    Phone: authorities_detail.phone,
                    Address: authorities_detail.address,
                    Email: authorities_detail.email,
                    Type: authorities_detail.type
                },
                { upsert: true, new: true }
            );
            updatedFields.push('Authority Details Updated');
        }

        // Only hash and update password if it's provided
        if (password) {
            const hashResult = await generate_hashed_password(password);
            if (hashResult.success) {
                updateFields.Password = hashResult.hashed_password;
                authUpdated = true;
                updatedFields.push('Password Updated');
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

        if (updatedFields.length > 0) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: mailId,
                    pass: mailPassword
                }
            });

            const mailOptions = {
                from: mailId,
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
                            ${updatedFields.map(field => `<li>${field}</li>`).join('')}
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
        }

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
                    authorities_detail: authoritiesDetails,
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

//(put) -end points
userRouter.post('/forgotpassword',async (req, res) => {
    try {
        const { college_email } = req.body;

        const emailSchema = zod.object({
            college_email: zod.string().email('Invalid email address')
        });

        const validation = emailSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                msg: 'Validation error',
                errors: validation.error.errors,
                success: false
            });
        }

        const user = await User.findOne({ CollegeEmail: college_email });
        if (!user) {
            return res.status(404).json({
                msg: 'User not found',
                success: false
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await User.updateOne(   
            { CollegeEmail: college_email },
            {
                OTP: otp,
            }
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailId,
                pass: mailPassword
            }
        });

        const mailOptions = {
            from: mailId,
            to: college_email,
            subject: 'Password Reset OTP',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #2196F3; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
                <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${user.Username},</p>
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your password. Use the following OTP to reset your password. This OTP is valid for 1 hour.
                    </p>
                    <p style="color: #333; font-size: 24px; text-align: center; margin: 20px 0;">${otp}</p>
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

        console.log("Don't worry everything is fine Sending OTP to email ...");

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending OTP email:', error);
            } else {
                console.log('OTP email sent:', info.response);
            }
        });

        res.json({
            msg: 'OTP sent to email successfully',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error sending OTP',
            error: error.message,
            success: false
        });
    }
});

userRouter.post('/verifyotp', async (req, res) => {
    try {
        const { college_email, otp } = req.body;

        const otpSchema = zod.object({
            college_email: zod.string().email('Invalid email address'),
            otp: zod.string().length(6, 'OTP must be 6 digits')
        });

        const validation = otpSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                msg: 'Validation error',
                errors: validation.error.errors,
                success: false
            });
        }

        const user = await User.findOne({ CollegeEmail: college_email, OTP: otp });
        if (!user) {
            return res.status(400).json({
                msg: 'Invalid OTP or email',
                success: false
            });
        }

        console.log('User found:', user);

        const auth_token = await generate_JWT_key(user.Username);

        await User.updateOne(
            { CollegeEmail: college_email },
            { OTP: null }
        );

        const emergencyContacts = await EmergencyContact.find({ userId: user._id });
        const authoritiesDetails = await Authorities.findOne({ userId: user._id });

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
                emergency_contact: emergencyContacts || null,
                authorities_detail: authoritiesDetails || null,
                created_at: user.createdAt
            },
            msg: 'OTP verified successfully',
            token : auth_token,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Error verifying OTP',
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
