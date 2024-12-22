const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../usermiddlewares/JWT/generate-auth-key');


const auth_admin = (req,res,next)=>{
    const authorization = req.headers.authorization;    
    const token = authorization.split(' ')[1];

    try{
        const username = jwt.verify(token,JWT_KEY);
        next();
    }catch(e){
        res.json({
            msg : 'Authorization failed (Invalid token)'
        })
    }
}


module.exports = {
    auth_admin
}