const jwt = require('jsonwebtoken');

const JWT_KEY = 'f98c623121d9';

const generate_JWT_key = (username)=>{
    const key  =  jwt.sign(username,JWT_KEY);
    return key;
}

module.exports = {
    generate_JWT_key,
    JWT_KEY
}