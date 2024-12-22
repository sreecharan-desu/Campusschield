const { userNamePrescence, accountPrescence } = require("./helperfns/helperfunctions");

const AdminPrescence = async(req,res,next)=>{
    const {username,password} = req.body;
    const usernamePresent = await userNamePrescence(username);

    if(usernamePresent){
        const accountPresent = await accountPrescence(username,password);
        if(accountPresent){
            res.json({
                msg : `Hey ${username} how are you! I remember you man Signin Now!`,
                success : true
            })
        }else{
            res.json({msg : `${username} is already taken please Try a newOne!`,success : false})
            
        }
    }else{
        next()
    }
}



module.exports = {
    AdminPrescence
}