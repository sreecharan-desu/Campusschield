const { z } = require('zod');

const profileSchema = z.object({
    username: z.string().min(3).max(50).optional(),
    password: z.string().min(6).max(100).optional(),
    personal_email: z.string().email().optional(),
    college_email: z.string().email().includes('rgukt').optional(),
    phone: z.string().regex(/^\+?[1-9]\d{9,11}$/).optional(),
    address: z.string().min(5).max(200).optional(),
    college_name: z.string().min(2).max(100).optional(),
    course: z.string().min(2).max(100).optional(),
    year: z.string().min(1).max(6).optional(),
    blood_group: z.enum([
        'A+', 'A-', 
        'B+', 'B-', 
        'O+', 'O-', 
        'AB+', 'AB-'
    ]).optional(),
    medical_conditions: z.string().max(500).optional(),
    allergies: z.string().max(500).optional(),
    medications: z.string().max(500).optional(),
    emergency_contacts: z.array(
        z.object({
            name: z.string().min(2).max(100),
            phone: z.string().regex(/^\d{10,12}$/),
            relation: z.string().min(2).max(50)
        })
    ).optional(),
    authorities_details: z.object({
        name: z.string().min(2).max(100),
        phone: z.string().regex(/^\d{10,12}$/),
        address: z.string().min(5).max(200),
        email: z.string().email(),
        type: z.string().min(2).max(50)
    }).optional()
});

const profileValidation = (req, res, next) => {
    try {
        const validation = profileSchema.safeParse(req.body);
        
        if (validation.success) {
            req.validatedData = validation.data;
            next();
        } else {
            const err = validation.error.issues.map(err => 
                err.path[0] + " " + err.message
            );
            const sentence = err.join(", ");
            return res.status(400).json({ 
                msg: sentence, 
                success: false 
            });
        }
    } catch (error) {
        res.status(400).json({ 
            msg: error.toString(), 
            success: false 
        });
    }
};

module.exports = profileValidation;