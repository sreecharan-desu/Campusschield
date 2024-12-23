const { User } = require('../../../db/db');
const {fetchAccountsByUsername,accountExistenceCheck} = require('./helperFNs/helper_functions');

const verifyUserExistence = async(req,res,next)=>{
    const {username,password,college_email}  = req.body;

    if(!(await fetchAccountsByUsername(username))){
        const user = await User.findOne({CollegeEmail : college_email});
        if(user){   
            res.json({msg : `Sorry, ${college_email} is already taken please try a newOne!`,success : false})
        }else{
            next()
        }
    }else if(await fetchAccountsByUsername(username)){
        if(await accountExistenceCheck(username,password)){
            res.json({msg : `Sorry, ${username} is already taken please try a newOne!`,success : false})}
    }

}


module.exports = {
    verifyUserExistence,
}