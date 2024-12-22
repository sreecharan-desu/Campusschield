const jwt  = require('jsonwebtoken');
const {JWT_KEY} = require('./JWT/generate-auth-key');
const { User } = require('../../../db/db');

const auth_user = (req,res,next)=>{
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];  // removing the Bearer

    try{
        jwt.verify(token,JWT_KEY);
        next();
    }
    catch(e){
        res.json({
            msg : 'Auth Failed (Invalid Token)'
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