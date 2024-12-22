const express = require('express');const userRouter = express.Router();
const { User, Report, SirenAlert, Authorities, EmergencyContact} = require('../db/db');const jwt = require('jsonwebtoken');
const { validateInputs } = require('./middlewares/zod/inputValidation');
const { auth_user, current_user } = require('./middlewares/usermiddlewares/auth-middleware');
const { fecthUserDB } = require('./middlewares/usermiddlewares/signin-middleware');
const {generate_JWT_key, JWT_KEY} = require('./middlewares/usermiddlewares/JWT/generate-auth-key');
const { verifyUserExistence } = require('./middlewares/usermiddlewares/signup-middleware');
const { generate_hashed_password } = require('./middlewares/usermiddlewares/hashfns/hash-password');
const { getReports } = require('./middlewares/usermiddlewares/helperFNs/getReports');
const validateReport = require('./middlewares/zod/reportValidation');
const profileValidation = require('./middlewares/zod/profileValidation');

//routes
userRouter.post('/signup', validateInputs, verifyUserExistence , async (req,res)=>{
    const {username,college_email,password} = req.body;
    try {
        const response = await generate_hashed_password(password);
        if (response.success) {
            const user = await User.create({
                Username: username,
                CollegeEmail : email,
                Password: response.hashed_password
            });
            res.status(201).json({
                msg: `Account created successfully with userId ${user._id},Signin to continue`,
                success : true
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

userRouter.post('/signin', validateInputs, fecthUserDB, async(req,res)=>{
    const {username} = req.body;
    try{
        const auth_token  = await  generate_JWT_key(username); 
        const user = await User.findOne({   
            Username : username
        }); 

        res.json({
            user : {
                id : user._id,
                username : user.Username,
                college_email : user.CollegeEmail,
                personal_email : user.PersonalEmail || null,
                phone : user.Phone || null,
                address : user.Address || null,
                college : user.College  || null,
                course : user.Course || null,
                year : user.Year  || null,                                                                                                                                                                                                               
                blood_group : user.BloodGroup || null,
                medical_conditions : user.MedicalConditions || null,
                allergies : user.Allergies || null,
                medications : user.Medications || null,
                emergency_contact : user.EmergencyContact || null,
                emergency_phone : user.EmergencyPhone || null,
                created_at : user.createdAt
            },
            token : auth_token,
            success : true
        })
    }
    catch(e){
        res.json({
            error : e,
            msg : 'Error while generating auth_token Please Try again!',
            success : false
        })
    }
});

//(get) -end points
userRouter.get('/getreports',auth_user,async(req,res)=>{
    //returns all the reports of the user
    try{
        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];  // removing the Bearer
        const username = jwt.verify(token,JWT_KEY);
        const Current_user  = await current_user(username)
        if(Current_user == null){
            return res.json({
                msg : 'FATAL : User not found',
                success : false
            })
        }else{
            const reports = await getReports(Current_user._id);
            res.json({
                reports,
                success : true
            })
        }
    }
    catch(e){
        res.json({
            msg : 'An error occurred while fetching the reports',
            success : false
        })
    }
});

//(post -endpoints)
userRouter.post('/createreport',validateReport,auth_user,async(req,res)=>{
    const {title,description,location,dateTime,harasser,video_link,image_link,audio_link,whom_to_report} = req.body;

    try{
        const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];  // removing the Bearer
    const username = await jwt.verify(token,JWT_KEY);
    const Current_user  = await current_user(username);

    const report = await Report.create({
        userId : Current_user._id,
        Title : title,
        Description : description,
        Status : 'Pending',
        Time : dateTime,
        Location : {
            latitude : location.latitude,
            longitude : location.longitude
        },
        HarasserDetails : harasser,
        VideoLink : video_link || 'No Video',
        ImageLink : image_link || 'No Image',
        AudioLink : audio_link || 'No Audio',
        WhomToReport : whom_to_report || 'Unknown'
    });

    res.json({
        msg : `Report created successfully with id:${report._id}`,
        success : true
    })
    }
    catch(e){
        res.json({
            msg : 'An error occurred while creating the report',
            success : false
        })
    }
    
});

//unAuth Services
userRouter.post('/sendsiren',async(req,res)=>{
    //sends siren alert to the user
    const {title,description,location,video_link,image_link,audio_link} = req.body;
    if(req.headers.authorization == null){
        const siren = await SirenAlert.create({
            Username :"Anonymous",
            Title : title,
            Description : description,
            Location : {
                latitude : location.latitude,
                longitude : location.longitude
            },
            VideoLink : video_link || 'No Video',
            ImageLink : image_link || 'No Image',
            AudioLink : audio_link || 'No Audio',
            Status : 'Pending'
        });
    
        res.json({
            msg : `Siren Alert sent successfully with id:${siren._id}`,
            success : true
        })
    }else{
        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];  // removing the Bearer
        const username = jwt.verify(token,JWT_KEY);
        const Current_user  = await current_user(username);
        const siren = await SirenAlert.create({
            Username : Current_user.Username ? Current_user.Username : "Anonymous",
            Title : title,
            Description : description,
            Location : {
                latitude : location.latitude,
                longitude : location.longitude
            },
            VideoLink : video_link || 'No Video',
            ImageLink : image_link || 'No Image',
            AudioLink : audio_link || 'No Audio',
            Status : 'Pending'
        });
    
        res.json({
            msg : `Siren Alert sent successfully with id:${siren._id}`,
            success : true
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

        if(authUpdated) {   
            return res.json({
                msg: 'Profile updated successfully. Please signin again for authentication',
                success: true,
            });
        }else{
            res.json({
                msg:'Profile updated successfully',
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