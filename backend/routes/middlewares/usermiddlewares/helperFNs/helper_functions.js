const { User } = require("../../../../db/db")
const { compare_password_with_hash } = require("../hashfns/hash-password")

const fetchAccountsByUsername = async(username)=>{
    const user = await User.findOne({
        Username : username
    })  //returns `null` if there is no user associated with this username

    if(user == null)
        return false
    else
        return true
}

const accountExistenceCheck = async(username,password)=>{
    const user = await User.findOne({
        Username : username
    })

    if(user == null){
        return false
    }
    else{
        const match = await compare_password_with_hash(password,user.Password);
        if(match == false)
            return false
        else
            return true  
    }  
}


module.exports = {
    fetchAccountsByUsername,
    accountExistenceCheck
}