const bcrypt = require('bcrypt');



// utils/hashPassword.js (or appropriate path)
const generate_hashed_password = async (password) => {
    const saltRounds = 4;
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return { hashed_password: hash, success: true };
    } catch (err) {
        console.log('Error hashing password', err);
        return { hashed_password: '', success: false };
    }
};


const compare_password_with_hash = async(password,hash)=>{
    try{
        const match = await bcrypt.compare(password,hash)
        if(match)
            return true
        else
            return false
    }
    catch(e){
        return {success : false};
    }
}


module.exports = {
    generate_hashed_password,
    compare_password_with_hash
}