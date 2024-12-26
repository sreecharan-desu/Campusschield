const zod = require('zod');
// Schemas with error messages
const inputSchemaSignup = zod.object({
    username: zod
        .string()
        .min(8, 'Username must contain 8-16 characters')
        .max(16, 'Username must contain 8-16 characters'),
    password: zod
        .string()
        .min(10, 'Password must contain 10-12 characters')
        .max(12, 'Password must contain 10-12 characters'),
    college_email : zod.string().email()
});

const inputSchemaSignin = zod.object({
    username: zod
        .string()
        .min(8, 'Username must contain 8-16 characters')
        .max(16, 'Username must contain 8-16 characters'),
    password: zod
        .string()
        .min(10, 'Password must contain 10-12 characters')
        .max(12, 'Password must contain 10-12 characters'),
});

const validateInputsSIgnup = async (req, res, next) => {
    try {
        // Validate inputs
        const result = inputSchemaSignup.safeParse(req.body);
        if (result.success) {
            return next();
        }

        const errorMessages = result.error.errors.map(error => error.message);
        return res.status(400).json({
            msg: "Validation failed",
            success: false,
            errors: errorMessages,
        });
    } catch (error) {
        console.error("Error in validateInputs:", error);
        return res.status(500).json({
            msg: "Internal server error",
            success: false,
        });
    }
};


const validateInputsSIgnin = async (req, res, next) => {
    try {
        // Validate inputs
        const result = inputSchemaSignin.safeParse(req.body);
        if (result.success) {
            return next();
        }

        const errorMessages = result.error.errors.map(error => error.message);
        return res.status(400).json({
            msg: "Validation failed",
            success: false,
            errors: errorMessages,
        });
    } catch (error) {
        console.error("Error in validateInputs:", error);
        return res.status(500).json({
            msg: "Internal server error",
            success: false,
        });
    }
};

module.exports = {
    validateInputsSIgnin,
    validateInputsSIgnup
};
