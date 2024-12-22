const zod = require('zod');

// Schemas with error messages
const inputSchema = zod.object({
    username: zod
        .string()
        .min(8, 'Username must contain 8-16 characters')
        .max(16, 'Username must contain 8-16 characters'),
    password: zod
        .string()
        .min(10, 'Password must contain 10-12 characters')
        .max(12, 'Password must contain 10-12 characters'),
    college_email: zod
        .string()
        .email('Invalid email address')
});

const validateInputs = (req, res, next) => {
    const result = inputSchema.safeParse(req.body);
    
    if (result.success) {
        next();
    } else {
        const errors = result.error.errors;
        const errorMessage = errors
            .map(error => error.message)
            .join(' and ');

        res.json({
            msg: errorMessage,
            success: false
        });
    }
};

module.exports = {
    validateInputs
};
