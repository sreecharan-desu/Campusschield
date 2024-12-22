const zod = require('zod');

//schemas
const usernameSchema = zod.string().min(8).max(16);
const passwordSchema = zod.string().min(10).max(12);
const emailSchema = zod.string().email();
//error messages
const usernameError = 'Username must contain 8-16 characters'
const passwordError = 'Password must contain 10-12 characters'
const emailError = 'Invalid email address'

const checkInputs = (username,password,email)=>{
    const usernameCheck = usernameSchema.safeParse(username).success;
    const passwordCheck = passwordSchema.safeParse(password).success;
    const emailCheck = emailSchema.safeParse(email).success;

    if(usernameCheck && passwordCheck && emailCheck)
        return 0;
    else if(usernameCheck && !passwordCheck && emailCheck)
        return 11;
    else if(!usernameCheck && passwordCheck && emailCheck)
        return 21;
    else if(!usernameCheck && !passwordCheck && emailCheck) 
        return 2;
    else if(usernameCheck && !passwordCheck && !emailCheck)
        return 12;
    else if(!usernameCheck && passwordCheck && !emailCheck)
        return 22;
    else if(!usernameCheck && !passwordCheck && !emailCheck)
        return 3;
    else if(usernameCheck && passwordCheck && !emailCheck)
        return 13;
    else if(usernameCheck && !passwordCheck && emailCheck)
        return 23;
    else if(!usernameCheck && passwordCheck && emailCheck)
        return 33;
}


const getErrorMessage = (validationCode)=>{
    if(validationCode === 11)
        return passwordError
    else if(validationCode === 21)
        return usernameError
    else if(validationCode === 2)
        return usernameError+' and '+passwordError
    else if(validationCode === 12)
        return passwordError+' and '+emailError
    else if(validationCode === 22)
        return usernameError+' and '+emailError
    else if(validationCode === 3)
        return usernameError+', '+passwordError+' and '+emailError
    else if(validationCode === 13)
        return emailError
    else if(validationCode === 23)
        return passwordError
    else if(validationCode === 33)
        return usernameError
}

const validateInputs = (req,res,next)=>{
    const {username,college_email,password} =  req.body;
    const validationInfo = checkInputs(username,password,college_email);
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