const bcrypt  = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken')
const adminRouter = express.Router();
const { Admin, User } = require('../db/db');
const { validateInputs } = require('./middlewares/zod/inputValidation');
const { fetchDB } = require('./middlewares/adminmiddlewares/signin-middleware');
const { auth_admin } = require('./middlewares/adminmiddlewares/auth-middleware');
const { AdminPrescence } = require('./middlewares/adminmiddlewares/signup-middleware');
const { JWT_KEY, generate_JWT_key } = require('./middlewares/usermiddlewares/JWT/generate-auth-key');


//(post) -end points
adminRouter.post('/signup', validateInputs, AdminPrescence, async(req,res)=>{
    const {username,password} = req.body;
    const saltRounds = 4;
    const hashed_password = await bcrypt.hash(password,saltRounds);

    const admin = await Admin.create({
        Username : username,
        Password : hashed_password
    })

    res.json({
        msg : `Admin account with id : ${admin._id} created succesfully..`,
        success : true
    })
});

adminRouter.post('/signin', validateInputs, fetchDB,(req,res)=>{
    const {username} = req.body;
    const token = generate_JWT_key(username); 

    res.json({
        token
    })
});

//(get) -end points
adminRouter.get('/details',auth_admin,async(req,res)=>{
    //gets the admin details
    const authorization = req.headers.authorization;    
    const token = authorization.split(' ')[1];
    const username = jwt.verify(token,JWT_KEY);

    res.json({
        username
    })
});


adminRouter.get('/getusers',auth_admin,async(req,res)=>{
    //gets the admin details
    const users = await User.find();

    res.json({
        users
    })
});


//(delete) -end points
adminRouter.delete('/deleteuser', auth_admin,async(req,res)=>{
    //deletes particular user
    const userId = req.query.userId;

    await User.deleteOne({
        _id : userId
    })

    res.json({
        msg : `User with user_id : ${userId} deleted successfully`,
        success : true
    })
});


//(put) -end points
adminRouter.put('/update', validateInputs, auth_admin, async(req,res)=>{
    //updates the admin details

    const authorization = req.headers.authorization;    
    const token = authorization.split(' ')[1];
    const old_username = jwt.verify(token,JWT_KEY);

    const {username,password} = req.body;
    const hashed_password = await bcrypt.hash(password,4);

    await Admin.updateOne({
        Username : old_username
    },{
        Username : username,
        Password : hashed_password
    })
    
    res.json({
        msg : 'Account details updated successfully Please Signin again for authentication',
        success : true
    })
});


module.exports = adminRouter;