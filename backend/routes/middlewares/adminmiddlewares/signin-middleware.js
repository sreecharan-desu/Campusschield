const { accountPrescence, userNamePrescence } = require("./helperfns/helperfunctions")



const fetchDB = async(req,res,next)=>{
    const {username,password} = req.body;
    const isUsernamePresent = await userNamePrescence(username);
    if(isUsernamePresent){
        isPresent = await accountPrescence(username,password);
        if(isPresent)
            next()
    }
    else res.json({  msg : 'Invalid Credentials Check your username & password' , success : false})
}



module.exports = {
    fetchDB
}