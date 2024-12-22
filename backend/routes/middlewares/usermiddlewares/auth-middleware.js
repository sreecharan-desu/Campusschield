const jwt  = require('jsonwebtoken');
const {JWT_KEY} = require('./JWT/generate-auth-key');
const { User } = require('../../../db/db');

const auth_user = (req,res,next)=>{


    const authorization = req.headers.authorization;

    if(!authorization){ 
        return res.json({
            msg : 'Auth Failed (No Token Provided)',
            success : false
        })
    }

    const token = authorization.split(' ')[1];  // removing the Bearer

    try{
        jwt.verify(token,JWT_KEY);
        next();
    }
    catch(e){
        res.json({
            msg : 'Auth Failed (Invalid Token)',
            success : false
        })
    }
}


const current_user = async(username)=>{
    const current_user = await User.findOne({
        Username : username
    })

    return current_user;
}


module.exports = {
    auth_user,
    current_user
}