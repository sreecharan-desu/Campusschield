const zod = require('zod');

//schemas
const usernameSchema = zod.string().min(8).max(16);
const passwordSchema = zod.string().min(10).max(12);
//error messages
const usernameError = 'Username must contain 8-16 characters'
const passwordError = 'Password must contain 10-12 characters'

const checkInputs = (username,password)=>{
    const usernameCheck = usernameSchema.safeParse(username).success;
    const passwordCheck = passwordSchema.safeParse(password).success;

    if(usernameCheck && passwordCheck)
        return 0;
    else if(usernameCheck && !passwordCheck)
        return 11;
    else if(!usernameCheck && passwordCheck)
        return 21;
    else if(!usernameCheck && !passwordCheck)
        return 2;
}


const getErrorMessage = (validationCode)=>{
    if(validationCode === 11)
        return passwordError
    else if(validationCode === 21)
        return usernameError
    else if(validationCode === 2)
        return usernameError+' and '+passwordError
}

const validateInputs = (req,res,next)=>{
    const {username,password} =  req.body;
    const validationInfo = checkInputs(username,password);
    if(validationInfo == 0){
        next();
    }
    else{
        const errorMessage = getErrorMessage(validationInfo);
        res.json({
            msg : errorMessage,
            success : false
        })
    }
}


module.exports = {
    validateInputs
}