const { accountExistenceCheck } = require("./helperFNs/helper_functions");


const fecthUserDB = async (req,res,next)=>{
    const {username,password} = req.body; 
    const isPresent = await accountExistenceCheck(username,password);
    
    if(isPresent == false)
        res.json({msg : 'Invalid Credentials Check your username & password and try again!',success : false})
    else
        next()

}


module.exports  = {
    fecthUserDB
}