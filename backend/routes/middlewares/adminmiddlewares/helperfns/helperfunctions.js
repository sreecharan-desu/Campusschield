const { Admin } = require("../../../../db/db");
const bcrypt = require('bcrypt');


const current_admin = async(username)=>{
    const admin = await Admin.findOne({
        Username : username
    })

    return admin;
}

const userNamePrescence = async(username)=>{
    const admin = await current_admin(username);
    if(admin == null){
        return false
    }else{
        return true
    }
}


const accountPrescence = async(username,password)=>{
    const admin = await current_admin(username);
    const match = await bcrypt.compare(password,admin.Password);
    if(match){
        return true
    }else{
        return false
    }
}



module.exports = {
    userNamePrescence,
    accountPrescence,
    current_admin
}