const bcryptjs = require('bcryptjs');
const { Admin } = require('../../../db/db');

const fetchDB = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        // Check if the user exists
        const user = await Admin.findOne({ Username: username });
        console.log(user);
        if (!user) {
            return res.status(401).json({ msg: 'Invalid username or password', success: false });
        }

        // Validate the password
        const isPasswordValid = await bcryptjs.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Invalid username or password', success: false });
        }

        // If both username and password are valid, proceed to the next middleware
        next();
    } catch (error) {
        console.error('Error in fetchDB middleware:', error.message);
        res.status(500).json({ msg: 'Internal server error', success: false });
    }
};

module.exports = {
    fetchDB,
};
