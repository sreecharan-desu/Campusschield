const { z } = require('zod');

const reportValidationSchema = z.object({
    title: z.string().nonempty({ message: 'Title is required' }),
    description: z.string().nonempty({ message: 'Description is required' }),
    status: z.string().default('Pending'),
    time: z.coerce.date().default(() => new Date()),
    createdAt: z.coerce.date().default(() => new Date()),
    location: z.object({
        latitude: z.number().nonnegative({ message: 'Latitude must be a non-negative number' }),
        longitude: z.number().nonnegative({ message: 'Longitude must be a non-negative number' })
    }),
    harasser: z.string().default('Unknown'),
    video_link: z.string().default('No Video'),
    image_link: z.string().default('No Image'),
    audio_link: z.string().default('No Audio'),
    whom_to_report: z.string().default('Unknown'),
    h_location : z.string().default('unknown')
});

const validateReport = (req, res, next) => {
    const { title, description, location, dateTime, harasser, video_link, image_link, audio_link, whom_to_report,h_location } = req.body;
    
    try {
        const validation = reportValidationSchema.safeParse({
            title,
            description,
            status: 'Pending',
            time: dateTime,
            createdAt: new Date(),
            location,
            harasser,
            video_link,
            image_link,
            audio_link,
            whom_to_report,
            h_location
        });
        if (validation.success) next();
        else {
            const err = (validation.error.issues.map(err => err.path[0] + " " + err.message));
            const sentence = err.map(e => e).join(", ");
            return res.status(400).json({ msg: sentence, success: false });
        };
    } catch (error) {
        res.status(400).json({ msg: error.toString(), success: false });
    }
};

module.exports = validateReport;