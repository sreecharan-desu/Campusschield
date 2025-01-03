const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://srecharandesu:charan%402006@cluster0.a9berin.mongodb.net/CampusSchieldAPI');

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    PersonalEmail: {
        type: String,
        default : null
    },
    CollegeEmail: {
        type: String,
        required: true,
        unique: true
    },
    Phone: {
        type: Number,
        default : null
    },
    Address: {
        type: String,
        default : null
    },
    College: {
        type: String, 
        default : null
    },
    Course: {
        type: String, 
        default : null
    },
    Year: {
        type: String, 
        default : null
    },
    BloodGroup: {
        type: String, 
        default : null
    },
    MedicalConditions: {
        type: String, 
        default : null
    },
    Allergies: {
        type: String, 
        default : null
    },
    Medications: {
        type: String, 
        default : null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    OTP : {
        type : String
    }
});

const emergencyContactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true
    },
    Relationship: {
        type: String,
        required: true
    }
});

const AuthoritiesDetails = new mongoose.Schema({    
    Name: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Email : {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },    
});

const adminSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    }
});

const reportsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    h_location : String,
    Title: {
        type: String,
        default: 'Title'
    },
    Description: {
        type: String,
        default: 'Description'
    },
    Status: {
        type: String,
        default: 'Pending'
    },
    Time: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    Location: {
        type: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    HarasserDetails: {
        type:String,
        default: 'Unknown'
    },
    VideoLink: {
        type: String,
        default: 'No Video'
    },
    ImageLink: {    
        type: String,
        default: 'No Image'
    },
    AudioLink: {
        type: String,
        default: 'No Audio'
    },
    WhomToReport: {
        type: String,
        default: 'Unknown'
    }
});

const sirenAlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    Username : {
        type: String,
    },
    Title: {
        type: String,
        default: 'Title'
    },
    Description: {
        type: String,
        default: 'Description'
    },
    Status: {
        type: String,
        default: 'Pending'
    },
    Location: {
        type: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    Time: {
        type: Date,
        default: Date.now
    },
    VideoLink : {
        type: String,
        default: 'No Video'
    },
    ImageLink : {
        type: String,
        default: 'No Image'
    },
    AudioLink : {
        type: String,
        default: 'No Audio'
    },
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Report = mongoose.model('Report', reportsSchema);
const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);
const SirenAlert = mongoose.model('SirenAlert', sirenAlertSchema);
const Authorities = mongoose.model('Authorities', AuthoritiesDetails);

module.exports = {
    User,
    Admin,
    Report,
    EmergencyContact,
    SirenAlert,
    Authorities
};
