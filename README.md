# Repository Documentation

## Repository Architecture

```mermaid
graph TB
    A[Repository] --> B[Modules: 1]
    A --> C[Sections: 4]
    B --> D[Core Components]
    B --> E[UI Components]
    B --> F[Utilities]
    C --> G[API Documentation]
    C --> H[Implementation Guides]
    C --> I[Code Examples]
    
    style A fill:#10b981,stroke:#059669,color:#ffffff
    style B fill:#3b82f6,stroke:#2563eb,color:#ffffff
    style C fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
```

## Table of Contents

### 1. Core Functionality & Utilities

No description available

**Sections:**


**1.** [Code Implementation: db.js](#section-link-module-module_miscellaneous_utilities-section-optimized_code_implementation:_db.js)

**2.** [Code Implementation: Support.jsx](#section-link-module-module_miscellaneous_utilities-section-optimized_code_implementation:_support.jsx)

**3.** [Secure Password Management: Hashing and Comparison with Bcrypt](#section-link-module-module_miscellaneous_utilities-section-optimized_secure_password_management:_hashing_and_comparison_with_bcrypt)

**4.** [Validate Report Data: Zod Middleware for Robust API Input](#section-link-module-module_miscellaneous_utilities-section-optimized_validate_report_data:_zod_middleware_for_robust_api_input)

---



## Navigation Guide

- **Modules**: Browse through organized code modules in the left sidebar
- **Sections**: Each module contains multiple documentation sections
- **Search**: Use the search bar to quickly find specific content
- **Headings**: Use the right sidebar to navigate within long documents
- **Actions**: Copy or download any section content using the toolbar buttons


## CampusShield API Database Schema Documentation

This document details the database schema used by the CampusShield API, implemented using Mongoose with MongoDB. It outlines the structure of each collection, the data types of the fields, and their purpose within the application.

### 1. Database Connection

The `db.js` file establishes a connection to the MongoDB Atlas cluster using the Mongoose library.

```javascript
const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://srecharandesu:charan%402006@cluster0.a9berin.mongodb.net/CampusSchieldAPI');
```

**Connection String:** The connection string includes the username (`srecharandesu`), password (`charan%402006`), cluster address (`cluster0.a9berin.mongodb.net`), and database name (`CampusSchieldAPI`).  **Note:** In a production environment, sensitive information like the password should be managed using environment variables or a secrets management system.

### 2. User Schema

The `userSchema` defines the structure for storing user information.

```javascript
const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        enum: ['student', 'faculty', 'staff'],
        default: 'student'
    },
    profilePicture: {
        type: String, // URL or path to the image
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        unique: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
```

**Fields:**

*   `Username`:  String, required, unique.  The user's login username.
*   `Password`: String, required.  The user's password (should be hashed before storing).
*   `Email`: String, required, unique. The user's email address.
*   `PhoneNumber`: String, required. The user's phone number.
*   `Address`: String, required. The user's address.
*   `Role`: String, enum.  The user's role within the campus ('student', 'faculty', 'staff'). Defaults to 'student'.
*   `profilePicture`: String. URL or path to the user's profile picture.
*   `isVerified`: Boolean. Indicates if the user's email is verified. Defaults to `false`.
*   `verificationToken`: String, unique. Token used for email verification.
*   `resetPasswordToken`: String. Token used for password reset.
*   `resetPasswordExpires`: Date. Expiration date for the password reset token.
*   `createdAt`: Date. Timestamp of when the user was created.
*   `updatedAt`: Date. Timestamp of when the user was last updated.

**Usage:**  This schema is used to store and retrieve user data from the `User` collection.  User authentication and authorization logic relies heavily on this schema.

### 3. Emergency Contact Schema

The `emergencyContactSchema` stores information about a user's emergency contacts.

```javascript
const emergencyContactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    Name: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    Relationship: {
        type: String,
        required: true
    }
});
```

**Fields:**

*   `userId`:  ObjectId, required, ref: 'User'.  A reference to the `_id` of the user in the `User` collection. Establishes a relationship between the emergency contact and the user.
*   `Name`: String, required. The name of the emergency contact.
*   `PhoneNumber`: String, required. The phone number of the emergency contact.
*   `Relationship`: String, required. The relationship of the contact to the user (e.g., "Parent", "Spouse", "Friend").

**Relationship:** The `userId` field establishes a foreign key relationship with the `User` collection. This allows efficient retrieval of a user's emergency contacts.

**Usage:** When a user registers or updates their profile, they can add emergency contact information. This information is crucial in case of emergencies on campus.

### 4. Authorities Details Schema

The `AuthoritiesDetails` schema stores information about campus authorities (e.g., security personnel, administrators).

```javascript
const AuthoritiesDetails = new mongoose.Schema({    
    Name: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Department: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    }
});
```

**Fields:**

*   `Name`: String, required. The name of the authority.
*   `PhoneNumber`: String, required. The phone number of the authority.
*   `Email`: String, required. The email address of the authority.
*   `Department`: String, required. The department the authority belongs to (e.g., "Campus Security", "Administration").
*   `Location`: String, required. The location where the authority is typically stationed.

**Usage:** This schema is used to store and retrieve information about campus authorities. This information can be used to display a directory of authorities or to notify the appropriate authorities in case of an emergency.

### 5. Admin Schema

The `adminSchema` defines the structure for storing administrator credentials.

```javascript
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
```

**Fields:**

*   `Username`: String, required. The administrator's login username.
*   `Password`: String, required. The administrator's password (should be hashed before storing).
*   `Email`: String, required. The administrator's email address.

**Security:**  It is crucial to hash the `Password` field before storing it in the database.  Use a strong hashing algorithm like bcrypt.

**Usage:** This schema is used for administrator authentication and authorization.  Only administrators can access certain features of the application.

### 6. Reports Schema

The `reportsSchema` stores information about reported incidents.

```javascript
const reportsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    ReportType: {
        type: String,
        required: true,
        enum: ['accident', 'theft', 'harassment', 'other']
    },
    Description: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Time: {
        type: Date,
        default: Date.now
    },
    Status: {
        type: String,
        enum: ['pending', 'investigating', 'resolved', 'closed'],
        default: 'pending'
    },
    Images: {
        type: [String], // Array of URLs or paths to images
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
```

**Fields:**

*   `userId`: ObjectId, required, ref: 'User'. A reference to the `_id` of the user who submitted the report.
*   `ReportType`: String, required, enum. The type of report ('accident', 'theft', 'harassment', 'other').
*   `Description`: String, required. A detailed description of the incident.
*   `Location`: String, required. The location where the incident occurred.
*   `Time`: Date. The time the incident occurred. Defaults to the current time.
*   `Status`: String, enum. The status of the report ('pending', 'investigating', 'resolved', 'closed'). Defaults to 'pending'.
*   `Images`: Array of Strings. An array of URLs or paths to images related to the report.
*   `createdAt`: Date. Timestamp of when the report was created.
*   `updatedAt`: Date. Timestamp of when the report was last updated.

**Workflow:**

```mermaid
graph LR
    A[User submits report] --> B(API receives report data);
    B --> C{Validate report data};
    C -- Valid --> D[Create new report document];
    C -- Invalid --> E[Return error to user];
    D --> F(Save report to database);
    F --> G[Report saved successfully];
    G --> H(Notify relevant authorities);
```

**Explanation:** This diagram illustrates the workflow of submitting a report. The user submits a report, the API validates the data, creates a new report document, saves it to the database, and notifies the relevant authorities.

**Usage:** Users can submit reports through the application. Administrators can then review and manage these reports.

### 7. Siren Alert Schema

The `sirenAlertSchema` stores information about siren alerts triggered by users.

```javascript
const sirenAlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    Location: {
        type: String,
        required: true
    },
    Time: {
        type: Date,
        default: Date.now
    },
    Description: {
        type: String
    },
    Status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
```

**Fields:**

*   `userId`: ObjectId, required, ref: 'User'. A reference to the `_id` of the user who triggered the alert.
*   `Location`: String, required. The location where the alert was triggered.
*   `Time`: Date. The time the alert was triggered. Defaults to the current time.
*   `Description`: String. An optional description of the situation.
*   `Status`: String, enum. The status of the alert ('active', 'resolved'). Defaults to 'active'.
*   `createdAt`: Date. Timestamp of when the alert was created.
*   `updatedAt`: Date. Timestamp of when the alert was last updated.

**Usage:** When a user feels unsafe, they can trigger a siren alert. This alert is then broadcast to nearby users and authorities.

### 8. Mongoose Models

The following Mongoose models are created based on the schemas:

```javascript
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Report = mongoose.model('Report', reportsSchema);
const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);
const SirenAlert = mongoose.model('SirenAlert', sirenAlertSchema);
const Authorities = mongoose.model('Authorities', AuthoritiesDetails);
```

These models are used to interact with the corresponding collections in the MongoDB database.

### 9. Module Exports

The `db.js` file exports the Mongoose models, making them available for use in other parts of the application.

```javascript
module.exports = {
    User,
    Admin,
    Report,
    EmergencyContact,
    SirenAlert,
    Authorities
};
```

**Usage Example:**

```javascript
const { User, Report } = require('./db');

// Create a new user
const newUser = new User({
    Username: 'testuser',
    Password: 'password123', // Remember to hash the password!
    Email: 'test@example.com',
    PhoneNumber: '123-456-7890',
    Address: '123 Main St'
});

newUser.save()
    .then(user => console.log('User created:', user))
    .catch(err => console.error('Error creating user:', err));

// Find all reports
Report.find({})
    .then(reports => console.log('All reports:', reports))
    .catch(err => console.error('Error fetching reports:', err));
```

This example demonstrates how to import the `User` and `Report` models and use them to create a new user and retrieve all reports from the database.  Remember to handle errors appropriately in a production environment. Also, always hash passwords before saving them to the database.

## Campus Shield Frontend: Technical Documentation

This document provides a comprehensive overview of the Campus Shield frontend, a React-based application designed to enhance safety and security on college campuses. It covers the application's architecture, key components, workflows, and implementation details.

### 1. Overview

The Campus Shield frontend provides a user-friendly interface for students and administrators to report incidents, access support resources, and manage safety alerts. The application is built using React, leveraging libraries like `axios` for API communication, `zod` for schema validation, `lucide-react` for icons, `framer-motion` for animations, and `recoil` for state management. The frontend interacts with a backend API (hosted at `https://campus-schield-backend-api.vercel.app/`) to persist data, handle authentication, and manage user accounts.

### 2. Technical Architecture

The frontend application follows a component-based architecture, with reusable components organized into directories such as `components` and `pages`.

**Key Directories:**

*   **`frontend/src/components`**: Contains reusable UI components like `BottomNavbar` and `ui/card.jsx`.
*   **`frontend/src/pages`**: Contains page-level components representing different application routes, such as `Signin.jsx`, `Signup.jsx`, `Homepage.jsx`, `Profile.jsx`, `Report.jsx`, `Support.jsx`, `Admin.jsx`, `AdminSIgnin.jsx`, and `Docs.jsx`.
*   **`frontend/src`**: Contains core application files like `App.jsx`, `main.jsx`, `store.js`, and `index.css`.

**Component Relationships:**

*   `App.jsx` acts as the root component, defining the application's routing structure using `BrowserRouter` and `Routes` from `react-router-dom`.
*   Page components (e.g., `Signin.jsx`, `Signup.jsx`, `Homepage.jsx`) are rendered based on the current route.
*   `BottomNavbar.jsx` is a reusable component included in most page components, providing navigation links.
*   `ui/card.jsx` provides basic card components for structuring content.
*   `store.js` defines Recoil atoms for managing global application state, such as admin authentication status and siren alerts.

**Data Flow:**

Data flows through the application primarily through user interactions, API calls, and state updates managed by Recoil. For example, when a user submits a report, the `Report.jsx` component captures the form data, makes an API call to the backend, and displays a success or error message based on the response.

### 3. Main Workflows and Data Flows

#### 3.1. User Authentication (Signup and Signin)

**Workflow:**

1.  The user navigates to the `/signup` or `/signin` route.
2.  The corresponding page component (`Signup.jsx` or `Signin.jsx`) is rendered.
3.  The user enters their credentials (username, password, college email).
4.  The component validates the input using `zod` schemas (`signUpSchema` or `signInSchema`).
5.  Upon successful validation, the component makes an API call to the backend (`/api/v1/user/signup` or `/api/v1/user/signin`) using `axios`.
6.  The backend authenticates the user and returns a token (for signin) or success message (for signup).
7.  If the authentication is successful, the token and user data are stored in `localStorage`, and the user is redirected to the `/profile` route.
8.  If authentication fails, an error message is displayed to the user.

**Data Flow:**

```mermaid
sequenceDiagram
    participant User
    participant Signup/Signin Component
    participant Backend API
    participant localStorage

    User->>Signup/Signin Component: Enters credentials
    Signup/Signin Component->>Signup/Signin Component: Validates input (zod)
    alt Validation Success
        Signup/Signin Component->>Backend API: Sends credentials (axios)
        Backend API->>Signup/Signin Component: Returns token and user data (Signin) or success message (Signup)
        alt Signin Success
            Signup/Signin Component->>localStorage: Stores token and user data
            Signup/Signin Component->>User: Redirects to /profile
        else Signin Failure
            Signup/Signin Component->>User: Displays error message
        end
    else Validation Failure
        Signup/Signin Component->>User: Displays validation errors
    end
```

**Code Example (Signin.jsx):**

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError('');

    try {
        const validatedData = signInSchema.parse(formData);
        
        const response = await axios.post('https://campus-schield-backend-api.vercel.app/api/v1/user/signin', validatedData);
        
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/profile');
        } else {
            setApiError(response.data.msg || 'Sign in failed. Please try again.');
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = {};
            error.errors.forEach(err => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
        } else {
            setApiError(error.response?.data?.msg || 'Sign in failed. Please try again.');
        }
    } finally {
        setIsLoading(false);
    }
};
```

#### 3.2. Report Submission

**Workflow:**

1.  The user navigates to the `/report` route.
2.  The `Report.jsx` component is rendered.
3.  The user fills out the report form with details such as title, description, location, and harasser information.
4.  The user can optionally use the "Detect Location" feature, which fetches the user's current location using the `ipapi.co` API.
5.  Upon submission, the component transforms the location data and makes an API call to the backend (`/api/v1/user/createreport`) using `axios`.
6.  The backend processes the report and returns a success or error message.
7.  The component displays a popup message to the user indicating the success or failure of the report submission.

**Data Flow:**

```mermaid
sequenceDiagram
    participant User
    participant Report Component
    participant Backend API
    participant ipapi.co

    User->>Report Component: Fills out report form
    alt Detect Location
        Report Component->>ipapi.co: Fetches location data
        ipapi.co->>Report Component: Returns location data
    end
    Report Component->>Backend API: Sends report data (axios)
    Backend API->>Report Component: Returns success or error message
    Report Component->>User: Displays popup message
```

**Code Example (Report.jsx):**

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const transformLocation = (locationStr) => {
            const [latitude, longitude] = locationStr.split(',').map((coord) => parseFloat(coord).toFixed(2));
            return {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            };
        };

        const newObject = {
            ...formData,
            location: transformLocation(formData.location),
            username: JSON.parse(localStorage.getItem('user'))?.username || 'Anonymous',
        };

        const response = await fetch('https://campus-schield-backend-api.vercel.app/api/v1/user/createreport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newObject),
        });

        if (response.ok) {
            setPopupMessage('Report submitted successfully.');
            setPopupType('success');
            setPopupVisible(true);
            setFormData({
                title: '',
                description: '',
                location: '',
                h_location: '',
                dateTime: '',
                harasser: '',
                whom_to_report: '',
            });
        } else {
            throw new Error('Failed to submit report.');
        }
    } catch (error) {
        console.error('Error:', error);
        setPopupMessage('Failed to submit report. Please try again.');
        setPopupType('error');
        setPopupVisible(true);
    }
};
```

#### 3.3. Emergency Siren Alert

**Workflow:**

1.  The user clicks the "Siren" button on the `Homepage.jsx`.
2.  The `SirenButton` component is triggered.
3.  The component fetches the user's current location using the `ipapi.co` API.
4.  The component makes an API call to the backend (`/api/v1/user/sendsiren`) using `axios`, sending the location data and an emergency alert message.
5.  The backend processes the alert and notifies relevant authorities.
6.  The component displays a success or error message to the user.
7.  The component plays a siren sound to alert nearby users.

**Data Flow:**

```mermaid
sequenceDiagram
    participant User
    participant SirenButton Component
    participant Backend API
    participant ipapi.co

    User->>SirenButton Component: Clicks Siren button
    SirenButton Component->>ipapi.co: Fetches location data
    ipapi.co->>SirenButton Component: Returns location data
    SirenButton Component->>Backend API: Sends alert data (axios)
    Backend API->>SirenButton Component: Returns success or error message
    SirenButton Component->>User: Displays message and plays siren sound
```

**Code Example (Homepage.jsx):**

```javascript
const SirenButton = () => {
  // ... (state and ref declarations) ...

  const handleSiren = async () => {
    try {
      const location = await fetch('https://ipapi.co/json/');
      console.log(location)
      if (!location.ok) {
          throw new Error('Failed to fetch location data');
      }
      const loc_data = await location.json();
      const { latitude, longitude } = loc_data;
      console.log(latitude, longitude)
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://campus-schield-backend-api.vercel.app/api/v1/user/sendsiren",        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : null,
          },
          body: JSON.stringify({
            title: "Emergency Alert",
            description: "Emergency assistance needed",
            location: {
              latitude: latitude,
              longitude: longitude,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send emergency alert");

      const data = await response.json();
      if (data.success) {
        setDispersing(true);
        setTimeout(() => {
          setShowPopup(false);
          setDispersing(false);
          toast.success("Emergency alert sent successfully");
        }, 1000); // Match dispersing animation duration
      }
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      toast.error("Failed to send emergency alert. Please try again.");
    }
  };

  // ... (return statement) ...
};
```

#### 3.4. Admin Dashboard

**Workflow:**

1.  The admin navigates to the `/admin/signin` route.
2.  The `AdminSIgnin.jsx` component is rendered.
3.  The admin enters their credentials (username and password).
4.  The component makes an API call to the backend (`/api/v1/admin/signin`) using `axios`.
5.  The backend authenticates the admin and returns a token and admin data.
6.  The token is stored in `localStorage` and admin data is stored in recoil state.
7.  The admin is redirected to the `/admin/dashboard` route.
8.  The `Admin.jsx` component is rendered.
9.  The component fetches users, reports, and siren alerts from the backend using API calls.
10. The admin can manage users, reports, and siren alerts through the dashboard interface.

**Data Flow:**

```mermaid
sequenceDiagram
    participant Admin
    participant AdminSignIn Component
    participant Backend API
    participant AdminDashboard Component

    Admin->>AdminSignIn Component: Enters credentials
    AdminSignIn Component->>Backend API: Sends credentials
    Backend API->>AdminSignIn Component: Returns token and admin data
    AdminSignIn Component->>AdminDashboard Component: Redirects to /admin/dashboard
    AdminDashboard Component->>Backend API: Fetches users, reports, and siren alerts
    Backend API->>AdminDashboard Component: Returns data
    AdminDashboard Component->>Admin: Displays data and provides management interface
```

**Code Example (Admin.jsx):**

```javascript
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [sirenAlerts, setSirenAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [view, setView] = useState('users');
  const [dateRange, setDateRange] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  const [adminData, setAdminData] = useRecoilState(adminDataState);
  const API_BASE_URL = 'https://campus-schield-backend-api.vercel.app/api/v1/admin';
  let sirenAudio = new Audio('/siren.mp3');
  const token = localStorage.getItem("adminToken");

  const fetchData = async () => {
    try {
      const [usersResponse, reportsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/getusers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!usersResponse.ok || !reportsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const usersData = await usersResponse.json();
      const reportsData = await reportsResponse.json();

      if (usersData.success && reportsData.success) {
        setUsers(usersData.users);
        setReports(reportsData.reports);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
```

### 4. Real Code Examples

#### 4.1. BottomNavbar Component

The `BottomNavbar` component provides navigation links for the application.

```javascript
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token && token !== '' && token !== 'undefined' && token !== null;
    };

    const getButtonStyle = (path) => {
        return location.pathname === path
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg transform scale-105 px-3 py-2 rounded-t-lg' // Active styles with curved top edges
            : 'bg-white text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-t-lg'; // Default styles with curved top edges
    };

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
            <div className="max-w-screen-md mx-auto flex justify-around items-center">
                <button onClick={() => handleNavigation('/')} className={getButtonStyle('/')}>
                    Home
                </button>
                {isAuthenticated() && (
                    <>
                        <button onClick={() => handleNavigation('/report')} className={getButtonStyle('/report')}>
                            Report
                        </button>
                        <button onClick={() => handleNavigation('/profile')} className={getButtonStyle('/profile')}>
                            Profile
                        </button>
                    </>
                )}
                <button onClick={() => handleNavigation('/support')} className={getButtonStyle('/support')}>
                    Support
                </button>
            </div>
        </nav>
    );
}
```

#### 4.2. Profile Component

The `Profile` component displays user information and allows users to update their profile.

```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Edit2, Save, X, User, Heart, Building,
    UserPlus, Shield,
    PhoneIcon,
    LogOutIcon
} from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';

const MobileDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    const initializeEditData = (user) => ({
      username: user.username || '',
      password: '',
      college_email: user.college_email || '',
      college_name: user.college_name || '',
      course: user.course || '',
      year: user.year || '',
      emergency_contacts: user.emergency_contacts || []
  });
    // Fetch user data
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            navigate('/signin');
            return;
        }

        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setEditedData(initializeEditData(parsedUser));
        fetchReports(parsedUser.username, token);
        setLoading(false);
    }, [navigate]);

  const fetchReports = async (username, token) => {
        try {
            const response = await fetch(
                'https://campus-schield-backend-api.vercel.app/api/v1/user/getreports',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setReports(data.reports);
            } else {
                console.error('Failed to fetch reports');
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedData(initializeEditData(userData));
        setUpdateStatus({ type: '', message: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const displayStatusMessage = (type, message) => {
        setUpdateStatus({ type, message });
        setTimeout(() => setUpdateStatus({ type: '', message: '' }), 3000);
    };

    // Profile Update Handler
    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('https://campus-schield-backend-api.vercel.app/api/v1/user/updateuser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editedData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.updatedUser));
                setUserData(data.updatedUser);
                setEditedData(initializeEditData(data.updatedUser));
                displayStatusMessage('success', 'Profile updated successfully!');
            } else {
                displayStatusMessage('error', data.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            displayStatusMessage('error', 'Failed to update profile. Please try again.');
        } finally {
            setIsEditing(false);
        }
    };

    // Emergency Contact Handlers
    const handleAddEmergencyContact = () => {
        setEditedData({
            ...editedData,
            emergency_contacts: [
                ...editedData.emergency_contacts,
                { name: '', phone: '', relation: '' }
            ]
        });
    };

    const handleEmergencyContactChange = (index, field, value) => {
        const newContacts = editedData.emergency_contacts.map((contact, i) => 
            i === index ? { ...contact, [field]: value } : contact
        );
        setEditedData({ ...editedData, emergency_contacts: newContacts });
    };

    const handleRemoveEmergencyContact = (index) => {
        setEditedData({
            ...editedData,
            emergency_contacts: editedData.emergency_contacts.filter((_, i) => i !== index)
        });
    };

    // Authentication Handlers
    const handleLogout = () => {
        localStorage.clear();
        navigate('/signin');
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/signin');
        }
    }, []);

    const computeStats = () => ({
        totalReports: reports.length,
        pendingReports: reports.filter((r) => r.Status === 'Pending').length,
        resolvedReports: reports.filter((r) => r.Status === 'Resolved').length,
    });

    // UI Components
    const renderProfileSection = () => (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-b-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    {greeting}, {userData?.username}
                </h1>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    <LogOutIcon className="inline-block mr-2" size={16} />
                    Logout
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Reports" value={computeStats().totalReports} bg="bg-purple-400" textColor="text-white" />
                <StatCard label="Pending Reports" value={computeStats().pendingReports} bg="bg-yellow-400" textColor="text-gray-800" />
                <StatCard label="Resolved Reports" value={computeStats().resolvedReports} bg="bg-green-400" textColor="text-gray-800" />
            </div>
        </div>
    );

    const renderInputField = (label, name, icon, type = 'text') => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {icon}
                </div>
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={editedData[name] || ''}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                    disabled={!isEditing}
                />
            </div>
        </div>
    );

    const renderSection = (title, icon, fields, color) => (
        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
                {icon}
                <h3 className={`text-lg font-semibold text-${color}-600`}>{title}</h3>
            </div>
            {fields}
        </div>
    );

    const renderEmergencyContacts = () => (
        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-600">Emergency Contacts</h3>
                {isEditing && (
                    <button onClick={handleAddEmergencyContact} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Add Contact
                    </button>
                )}
            </div>
            {editedData.emergency_contacts?.map((contact, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor={`name-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input
                                type="text"
                                id={`name-${index}`}
                                value={contact.name}
                                onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label htmlFor={`phone-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                            <input
                                type="text"
                                id={`phone-${index}`}
                                value={contact.phone}
                                onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label htmlFor={`relation-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Relation</label>
                            <input
                                type="text"
                                id={`relation-${index}`}
                                value={contact.relation}
                                onChange={(e) => handleEmergencyContactChange(index, 'relation', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                    {isEditing && (
                        <button onClick={() => handleRemoveEmergencyContact(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
                            Remove
                        </button>
                    )}
                </div>
            ))}
        </div>
    );

    const renderAuthoritiesDetails = () => (
      <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-600">Authorities Details</h3>
          </div>
          <p><strong>Police:</strong> Dial 100 for immediate assistance.</p>
          <p><strong>Women Helpline:</strong> 1091</p>
      </div>
  );

// StatCard Component
// eslint-disable-next-line react/prop-types
const StatCard = ({ label, value, bg, textColor }) => (
    <div className={`p-4 rounded-lg shadow-sm ${bg}  text-center`}>
        <div className="flex items-center justify-center">
            <div className={`text-sm font-medium ${textColor}`}>{label}</div>
        </div>
        <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    </div>
);

    return (
        
            {loading ? (
                
                    Loading...
                
            ) : (
                <>
                    {renderProfileSection()}
                    
                        
                            {isEditing ? (
                                
                                    
                                        
                                            Cancel
                                        
                                        
                                            Save
                                        
                                    
                                ) : (
                                    
                                        Edit Profile
                                    
                                )}
                            
                            {updateStatus.message && (
                                
                                    {updateStatus.message}
                                
                            )}
                            {renderSection("Personal Information", <User className="w-6 h-6 text-purple-600" />,
                                <>
                                    {renderInputField("Username", "username", <User className="w-4 h-4 text-gray-500" />)}
                                    {renderInputField("College Email", "college_email", <Heart className="w-4 h-4 text-gray-500" />, 'email')}
                                </>,"purple")}
                            {renderSection("College Details", <Building className="w-6 h-6 text-indigo-600" />,
                                <>
                                    {renderInputField("College Name", "college_name", <Building className="w-4 h-4 text-gray-500" />)}
                                    {renderInputField("Course", "course", <UserPlus className="w-4 h-4 text-gray-500" />)}
                                    {renderInputField("Year", "year", <Shield className="w-4 h-4 text-gray-500" />)}
                                </>,"indigo")}
                            {renderEmergencyContacts()}
                            {renderAuthoritiesDetails()}
                        
                    
                </>
            )}
            
        
    );
};

export default MobileDashboard;
```

### 5. How Developers Would Use This In Practice

Developers working on the Campus Shield frontend would typically follow these steps:

1.  **Set up the development environment:** Ensure Node.js and npm are installed. Clone the repository and run `npm install` to install dependencies.
2.  **Configure API endpoints:** Update the API base URL in relevant components (e.g., `Report.jsx`, `Signin.jsx`) to point to the local backend server or a development environment.
3.  **Implement new features:** Create new components or modify existing ones to add functionality. Follow the existing component structure and data flow patterns.
4.  **Test thoroughly:** Test all changes to ensure they function correctly and do not introduce regressions.
5.  **Submit pull requests:** Submit pull requests for code review and integration into the main branch.

### 6. Important Implementation Details and Gotchas

*   **Authentication:** The frontend relies on `localStorage` to store the user token. Ensure proper security measures are in place to protect the token from unauthorized access. Consider using more secure storage options like cookies with `httpOnly` flag.
*   **API Communication:** The frontend uses `axios` for making API calls. Handle errors gracefully and display informative messages to the user.
*   **State Management:** Recoil is used for managing global application state. Use Recoil atoms to store data that needs to be shared across multiple components.
*   **Form Validation:** `zod` is used for validating form inputs. Define schemas for all forms to ensure data integrity.
*   **Location Detection:** The `ipapi.co` API is used for detecting the user's location. Be aware of the API's usage limits and potential errors.
*   **Siren Alerts:** The siren alert functionality relies on playing an audio file. Ensure the audio file is properly loaded and handled across different browsers and devices.

### 7. Common Issues and Troubleshooting

*   **API calls failing:** Check the API base URL and ensure the backend server is running.
*   **Authentication issues:** Verify that the user token is present in `localStorage` and is valid.
*   **Component rendering errors:** Inspect the browser console for JavaScript errors and debug accordingly.
*   **State update issues:** Use the Recoil DevTools to inspect the application state and identify any issues with state updates.
*   **Location detection errors:** Check the `ipapi.co` API status and ensure the user has granted location permissions.

### 8. Advanced Configuration and Customization Options

*   **Theming:** Customize the application's appearance by modifying the CSS styles in `index.css` or by using a CSS-in-JS library like `styled-components`.
*   **Routing:** Add new routes to the application by modifying the `Routes` component in `App.jsx`.
*   **API Endpoints:** Configure the API base URL in relevant components to point to different backend environments.
*   **Recoil State:** Add new Recoil atoms to manage additional application state.

### 9. Performance Considerations and Optimization Strategies

*   **Code Splitting:** Implement code splitting to reduce the initial load time of the application.
*   **Lazy Loading:** Use lazy loading for components that are not immediately visible on the screen.
*   **Memoization:** Use `React.memo` to memoize components and prevent unnecessary re-renders.
*   **Image Optimization:** Optimize images to reduce their file size and improve loading performance.
*   **Caching:** Implement caching for API responses to reduce the number of API calls.

### 10. Security Implications and Best Practices

*   **Protect User Data:** Implement proper security measures to protect user data, such as encrypting sensitive

information and using secure communication protocols (HTTPS).
*   **Prevent Cross-Site Scripting (XSS):** Sanitize user inputs to prevent XSS attacks.
*   **Prevent Cross-Site Request Forgery (CSRF):** Implement CSRF protection to prevent unauthorized requests.
*   **Authentication and Authorization:** Use secure authentication and authorization mechanisms to protect access to sensitive resources.
*   **Regular Security Audits:** Conduct regular security audits to identify and address potential vulnerabilities.

### 11. Troubleshooting Common Issues

*   **Component Not Rendering:** Check for errors in the component's code, ensure that the component is being rendered correctly, and verify that the necessary data is being passed to the component.
*   **API Request Failing:** Check the API endpoint, verify the request headers and body, and ensure that the server is running and accessible.
*   **State Not Updating:** Check for errors in the state update logic, ensure that the state is being updated correctly, and verify that the component is re-rendering after the state update.
*   **Performance Issues:** Use the React Profiler to identify performance bottlenecks and implement optimization strategies.
*   **Unexpected Behavior:** Use the browser's developer tools to debug the code and identify the root cause of the issue.

### 12. Future Enhancements and Roadmap

*   **Improved User Interface:** Enhance the user interface with new features and improved design.
*   **Enhanced Functionality:** Add new features to the application to improve its functionality and usability.
*   **Improved Performance:** Optimize the application's performance to improve its speed and responsiveness.
*   **Improved Security:** Implement additional security measures to protect user data and prevent security vulnerabilities.
*   **Integration with Other Services:** Integrate the application with other services to provide a more comprehensive user experience.

### 13. Contributing to the Project

*   **Fork the Repository:** Fork the repository on GitHub to create your own copy of the project.
*   **Create a Branch:** Create a new branch for your changes.
*   **Make Changes:** Make your changes to the code.
*   **Test Your Changes:** Test your changes thoroughly.
*   **Commit Your Changes:** Commit your changes with a clear and concise message.
*   **Push Your Changes:** Push your changes to your forked repository.
*   **Submit a Pull Request:** Submit a pull request to the main repository.

### 14. License Information

This project is licensed under the [MIT License](LICENSE).

### 15. Contact Information

For questions or support, please contact [support@example.com](mailto:support@example.com).

```jsx
import React from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';
import ContactForm from './ContactForm';
import FaqSection from './FaqSection';

const Support = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Support
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <ContactForm />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <FaqSection />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Support;
```


## Authentication and Authorization System Documentation

This document details the authentication and authorization system implemented in the backend, focusing on user and admin roles. The system utilizes JSON Web Tokens (JWT) for authentication and `bcrypt` for password hashing.

### 1. Overview

The system provides secure authentication and authorization mechanisms for both users and administrators. It ensures that only authenticated users can access protected resources and that administrators have the necessary privileges to manage the system. Key components include password hashing, JWT generation and verification, and middleware for protecting routes.

### 2. Technical Architecture

The system comprises the following modules:

*   **`hash-password.js`**: Handles password hashing and comparison using `bcrypt`.
*   **`secrets.py`**: Generates a random secret key (although this is not directly used in the JavaScript code provided, it hints at a potential need for secret key management).
*   **`generate-auth-key.js`**: Generates JWT keys for user authentication.
*   **`auth-middleware.js` (user)**: Middleware for authenticating user requests using JWTs.
*   **`auth-middleware.js` (admin)**: Middleware for authenticating admin requests using JWTs.

The following diagram illustrates the high-level architecture:

```mermaid
graph LR
    A[Client] --> B{Authentication Request};
    B --> C[Authentication Server];
    C --> D{Verify Credentials};
    D --> E{Generate JWT};
    E --> A{JWT Token};
    A --> F{Protected Resource Request};
    F --> G[Authorization Server];
    G --> H{Verify JWT};
    H --> I{Access Granted/Denied};
    I --> F;
```

This diagram shows the general flow of authentication and authorization. The client requests authentication, the server verifies credentials and generates a JWT. The client then uses the JWT to access protected resources, which are verified by the authorization server.

### 3. Detailed Component Analysis

#### 3.1. `hash-password.js`

This module provides functions for securely handling user passwords.

*   **`generate_hashed_password(password)`**:  Asynchronously hashes a given password using `bcrypt`.

    ```javascript
    const bcrypt = require('bcrypt');

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
    ```

    **Explanation:**

    *   It uses `bcrypt.hash()` to generate a hash with a salt factor of 4.
    *   Returns an object containing the `hashed_password` and a `success` flag.
    *   Handles potential errors during the hashing process.

*   **`compare_password_with_hash(password, hash)`**: Asynchronously compares a given password with a stored hash using `bcrypt`.

    ```javascript
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
    ```

    **Explanation:**

    *   It uses `bcrypt.compare()` to compare the password with the hash.
    *   Returns `true` if the password matches the hash, `false` otherwise.
    *   Handles potential errors during the comparison process.

#### 3.2. `secrets.py`

This Python script generates a random hexadecimal token using the `secrets` module. While not directly used in the provided JavaScript code, it suggests a mechanism for generating secure secrets, which could be used for JWT signing or other security-sensitive operations.

```python
import secrets
print(secrets.token_hex(16))
```

**Explanation:**

*   `secrets.token_hex(16)` generates a 32-character (16 * 2) hexadecimal string suitable for use as a secret key.

#### 3.3. `generate-auth-key.js`

This module is responsible for generating JWTs.

```javascript
const jwt = require('jsonwebtoken');

const JWT_KEY = 'f98c623121d9';

const generate_JWT_key = (username)=>{
    const key  =  jwt.sign(username,JWT_KEY);
    return key;
}
```

**Explanation:**

*   It imports the `jsonwebtoken` library.
*   It defines a `JWT_KEY` which is used to sign the JWT. **Important Security Note:**  This key should be stored securely (e.g., in an environment variable) and should be complex and randomly generated.  **Hardcoding the key is a major security vulnerability.**
*   `generate_JWT_key(username)` generates a JWT for a given username. The username is used as the payload of the JWT.

#### 3.4. `auth-middleware.js` (user)

This middleware authenticates user requests by verifying the JWT in the `Authorization` header.

```javascript
const jwt  = require('jsonwebtoken');
const {JWT_KEY} = require('./JWT/generate-auth-key');
const { User } = require('../../../db/db');

const auth_user = async(req,res,next)=>{

    const authorization = req.headers.authorization;

    if(!authorization){
        return res.json({
            msg : 'Auth Failed (No Token Provided)',
            success : false
        })
    }

    try{
        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];  // removing the Bearer
        const Username = jwt.verify(token, JWT_KEY);
        const Current_user = await current_user(Username)
        next();
    }
    catch(e){
        res.json({
            msg : 'Auth Failed (Invalid Token)',
            success : false
        })
    }
}


const current_user = async(username)=>{
    const current_user = await User.findOne({
        Username : username
    })
}
```

**Explanation:**

*   It retrieves the `Authorization` header from the request.
*   It checks if the header exists. If not, it returns an error.
*   It extracts the JWT from the header (assuming the format "Bearer <token>").
*   It verifies the JWT using `jwt.verify()` and the `JWT_KEY`.
*   It calls `current_user` to find the user in the database.
*   If the JWT is valid, it calls `next()` to proceed to the next middleware or route handler.
*   If the JWT is invalid, it returns an error.

#### 3.5. `auth-middleware.js` (admin)

This middleware authenticates admin requests by verifying the JWT in the `Authorization` header.

```javascript
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../usermiddlewares/JWT/generate-auth-key');


const auth_admin = (req,res,next)=>{
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];

    try{
        const username = jwt.verify(token,JWT_KEY);
        next();
    }catch(e){
        res.json({
            msg : 'Authorization failed (Invalid token)'
        })
    }
}
```

**Explanation:**

*   It retrieves the `Authorization` header from the request.
*   It extracts the JWT from the header (assuming the format "Bearer <token>").
*   It verifies the JWT using `jwt.verify()` and the `JWT_KEY`.
*   If the JWT is valid, it calls `next()` to proceed to the next middleware or route handler.
*   If the JWT is invalid, it returns an error.

### 4. Main Workflows and Data Flows

#### 4.1. User Authentication Workflow

This workflow describes the steps involved in authenticating a user.

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Server
    User->>Client: Enters credentials
    Client->>Server: Sends credentials (username/password)
    Server->>Server: Authenticates user (checks credentials)
    alt Authentication successful
        Server->>Server: Generates JWT
        Server->>Client: Sends JWT
        Client->>User: Stores JWT
    else Authentication failed
        Server->>Client: Sends error message
        Client->>User: Displays error message
    end
```

**Explanation:**

1.  The user enters their credentials (username and password) into the client application.
2.  The client sends the credentials to the server.
3.  The server authenticates the user by checking the credentials against a database or other authentication provider.
4.  If authentication is successful, the server generates a JWT and sends it back to the client.
5.  The client stores the JWT for future use.
6.  If authentication fails, the server sends an error message to the client, which displays it to the user.

#### 4.2. Protected Resource Access Workflow

This workflow describes how a user accesses a protected resource using a JWT.

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Server
    User->>Client: Requests protected resource
    Client->>Server: Sends request with JWT in Authorization header
    Server->>Server: Verifies JWT
    alt JWT is valid
        Server->>Server: Authorizes user (checks permissions)
        alt Authorization successful
            Server->>Client: Sends requested resource
            Client->>User: Displays resource
        else Authorization failed
            Server->>Client: Sends error message (Unauthorized)
            Client->>User: Displays error message
        end
    else JWT is invalid
        Server->>Client: Sends error message (Invalid token)
        Client->>User: Displays error message
    end
```

**Explanation:**

1.  The user requests a protected resource from the client application.
2.  The client sends the request to the server, including the JWT in the `Authorization` header.
3.  The server verifies the JWT using the secret key.
4.  If the JWT is valid, the server authorizes the user by checking their permissions.
5.  If authorization is successful, the server sends the requested resource back to the client.
6.  The client displays the resource to the user.
7.  If the JWT is invalid or authorization fails, the server sends an error message to the client, which displays it to the user.

### 5. Usage Guide

#### 5.1. Hashing a Password

```javascript
const { generate_hashed_password } = require('./hash-password');

async function hashMyPassword(password) {
  const result = await generate_hashed_password(password);
  if (result.success) {
    console.log('Hashed password:', result.hashed_password);
  } else {
    console.error('Password hashing failed.');
  }
}

hashMyPassword('mySecretPassword');
```

#### 5.2. Comparing a Password with a Hash

```javascript
const { compare_password_with_hash } = require('./hash-password');

async function verifyPassword(password, hash) {
  const match = await compare_password_with_hash(password, hash);
  if (match) {
    console.log('Password matches!');
  } else {
    console.log('Password does not match.');
  }
}

verifyPassword('mySecretPassword', '$2b$04$someFakeHash'); // Replace with a real hash
```

#### 5.3. Generating a JWT

```javascript
const { generate_JWT_key } = require('./generate-auth-key');

function generateToken(username) {
  const token = generate_JWT_key(username);
  console.log('Generated JWT:', token);
  return token;
}

generateToken('testuser');
```

#### 5.4. Protecting a Route with User Authentication

```javascript
const express = require('express');
const { auth_user } = require('./auth-middleware');

const app = express();

app.get('/protected', auth_user, (req, res) => {
  res.json({ message: 'You have access to this protected resource!' });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
```

#### 5.5. Protecting a Route with Admin Authentication

```javascript
const express = require('express');
const { auth_admin } = require('./adminmiddlewares/auth-middleware');

const app = express();

app.get('/admin', auth_admin, (req, res) => {
  res.json({ message: 'You have access to this admin resource!' });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
```

### 6. Implementation Details and Gotchas

*   **JWT Key Security:** The `JWT_KEY` in `generate-auth-key.js` is currently hardcoded. This is a major security vulnerability.  It **must** be moved to an environment variable or a secure configuration management system.  A strong, randomly generated key should be used.
*   **Salt Rounds:** The number of salt rounds in `hash-password.js` (currently 4) affects the time it takes to hash a password.  Higher values increase security but also increase processing time.  A value of 10-12 is generally recommended for modern systems.
*   **Error Handling:** The error handling in the provided code is basic.  More robust error logging and reporting should be implemented.
*   **Token Expiration:** JWTs should have an expiration time to limit their validity.  This can be configured when generating the JWT using the `expiresIn` option in `jsonwebtoken`.
*   **Refresh Tokens:** For a better user experience, consider implementing refresh tokens to allow users to stay logged in for longer periods without having to re-authenticate.

### 7. Common Issues and Troubleshooting

*   **Invalid Token:** If a user receives an "Invalid Token" error, it could be due to:
    *   An expired token.
    *   A token that has been tampered with.
    *   An incorrect `JWT_KEY` being used for verification.
*   **Authentication Failed (No Token Provided):** This error indicates that the client did not include the `Authorization` header in the request.
*   **Password Comparison Fails:** This could be due to:
    *   An incorrect password being entered.
    *   A corrupted password hash in the database.
    *   Inconsistent salting during hashing.

### 8. Advanced Configuration and Customization Options

*   **Custom JWT Claims:** You can add custom claims to the JWT payload, such as user roles or permissions.
*   **Different Hashing Algorithms:** While `bcrypt` is recommended, you could use other hashing algorithms if necessary.
*   **Key Rotation:** Implement a key rotation strategy to periodically change the `JWT_KEY` to improve security.
*   **Multi-Factor Authentication (MFA):** Integrate MFA to add an extra layer of security.

### 9. Performance Considerations and Optimization Strategies

*   **Caching:** Cache frequently accessed user data to reduce database load.
*   **Database Optimization:** Optimize database queries to improve authentication and authorization performance.
*   **Load Balancing:** Use load balancing to distribute traffic across multiple servers.

### 10. Security Implications and Best Practices

*   **Never store passwords in plain text.** Always hash them using a strong hashing algorithm like `bcrypt`.
*   **Use a strong, randomly generated `JWT_KEY` and store it securely.**
*   **Implement proper input validation to prevent injection attacks.**
*   **Protect against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) attacks.**
*   **Regularly update dependencies to patch security vulnerabilities.**
*   **Enforce strong password policies.**
*   **Monitor for suspicious activity and implement intrusion detection systems.**

This documentation provides a comprehensive overview of the authentication and authorization system. By following the guidelines and best practices outlined in this document, developers can build secure and reliable applications.


## CampusShield Backend: Route Middleware and Input Validation Documentation

This document provides a comprehensive overview of the route middleware and input validation system within the CampusShield backend. This system is crucial for ensuring data integrity, security, and proper application behavior by validating user inputs and controlling access to various routes.

### I. Overview

The CampusShield backend employs a layered approach to route handling and data validation. This involves using Express.js routers to define API endpoints and middleware functions to intercept and process requests before they reach the route handlers. Zod, a TypeScript-first schema declaration and validation library, is used extensively for input validation.  User authentication and authorization are handled by dedicated middleware functions.

### II. Technical Architecture

The system is structured around the following key components:

1.  **Routers:**  `user.js`, `admin.js`, and `mainRoute.js` define the API endpoints for user and admin functionalities.
2.  **Zod Validation Middleware:** `reportValidation.js`, `profileValidation.js`, and `inputValidation.js` contain Zod schemas and middleware functions for validating request bodies.
3.  **User Authentication Middleware:** `auth-middleware.js` (auth\_user, current\_user), `signin-middleware.js` (fecthUserDB), and `signup-middleware.js` (verifyUserExistence) handle user authentication and authorization.
4.  **Admin Authentication Middleware:** `auth-middleware.js` (auth\_admin), `signin-middleware.js` (fetchDB), and `signup-middleware.js` (AdminPrescence) handle admin authentication and authorization.
5.  **Helper Functions:** `helper_functions.js` and `getReports.js` provide utility functions for user authentication and report retrieval. `helperfunctions.js` provides utility functions for admin authentication.
6.  **Database Interaction:** The system interacts with the database (defined in `db/db.js`, though not directly provided in the context, it's implied) to store and retrieve user and report data.

**Component Relationships:**

*   `mainRoute.js` imports and uses `user.js` and `admin.js` to define the main routes.
*   `user.js` imports Zod validation middleware (`inputValidation.js`, `reportValidation.js`, `profileValidation.js`), user authentication middleware (`auth-middleware.js`, `signin-middleware.js`, `signup-middleware.js`), helper functions (`helper_functions.js`, `getReports.js`), and the database models (`db/db.js`).
*   `admin.js` imports Zod validation middleware (`inputValidation.js`), admin authentication middleware (`auth-middleware.js`, `signin-middleware.js`, `signup-middleware.js`), helper functions (`helperfunctions.js`), and the database models (`db/db.js`).
*   The Zod validation middleware uses the `zod` library to define schemas and validate request bodies.
*   The authentication middleware uses helper functions and database models to authenticate and authorize users and admins.

### III. Main Workflows and Data Flows

#### A. User Signup Workflow

This workflow describes the steps involved when a user attempts to sign up.

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Server
    participant Database

    User->>Client: Enters signup details
    Client->>Server: POST /user/signup with user data
    Server->>Server: validateInputsSIgnup (Zod validation)
    alt Validation fails
        Server->>Client: 400 Validation error
        Client->>User: Displays error message
    else Validation succeeds
        Server->>Server: verifyUserExistence (Check username and email)
        alt Username or email exists
            Server->>Client: 400 Username/email already taken
            Client->>User: Displays error message
        else Username and email are unique
            Server->>Server: generate_hashed_password (Hash password)
            Server->>Database: Create new user record
            Database->>Server: User ID
            Server->>Server: Send confirmation email
            Server->>Client: 201 Account created successfully
            Client->>User: Displays success message
        end
    end
```

**Explanation:**

1.  The user enters their signup details on the client-side.
2.  The client sends a POST request to the `/user/signup` endpoint with the user data.
3.  The `validateInputsSIgnup` middleware validates the request body using the `inputSchemaSignup` Zod schema.
4.  If validation fails, an error response is sent back to the client.
5.  If validation succeeds, the `verifyUserExistence` middleware checks if the username or college email already exists in the database.
6.  If the username or email exists, an error response is sent back to the client.
7.  If the username and email are unique, the `generate_hashed_password` function hashes the password.
8.  A new user record is created in the database.
9.  A confirmation email is sent to the user's college email address.
10. A success response is sent back to the client.

#### B. User Signin Workflow

This workflow describes the steps involved when a user attempts to sign in.

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Server
    participant Database

    User->>Client: Enters signin details
    Client->>Server: POST /user/signin with user data
    Server->>Server: validateInputsSIgnin (Zod validation)
    alt Validation fails
        Server->>Client: 400 Validation error
        Client->>User: Displays error message
    else Validation succeeds
        Server->>Server: fecthUserDB (Check username and password)
        Server->>Database: Retrieve user record by username
        Database->>Server: User data or null
        alt User not found or password incorrect
            Server->>Client: 401 Invalid username or password
            Client->>User: Displays error message
        else User found and password correct
            Server->>Server: generate_JWT_key (Generate JWT token)
            Server->>Server: Send new login alert email
            Server->>Client: 200 Authentication successful, JWT token
            Client->>User: Grants access
        end
    end
```

**Explanation:**

1.  The user enters their sign-in details on the client-side.
2.  The client sends a POST request to the `/user/signin` endpoint with the user data.
3.  The `validateInputsSIgnin` middleware validates the request body using the `inputSchemaSignin` Zod schema.
4.  If validation fails, an error response is sent back to the client.
5.  If validation succeeds, the `fecthUserDB` middleware checks if the username and password match a record in the database.
6.  If the user is not found or the password is incorrect, an error response is sent back to the client.
7.  If the user is found and the password is correct, the `generate_JWT_key` function generates a JSON Web Token (JWT).
8.  A new login alert email is sent to the user's college email address.
9.  A success response containing the JWT is sent back to the client.

#### C. Report Submission Workflow

This workflow describes the steps involved when a user submits a report.

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Server
    participant Database
    participant Police
    participant WomenOrg

    User->>Client: Fills out report form
    Client->>Server: POST /user/report with report data
    Server->>Server: auth_user (Authentication)
    Server->>Server: validateReport (Zod validation)
    alt Validation fails
        Server->>Client: 400 Validation error
        Client->>User: Displays error message
    else Validation succeeds
        Server->>Database: Create new report record
        Database->>Server: Report ID
        Server->>Server: Send report submission email to user
        Server->>Server: Determine whom to report (Police/WomenOrg)
        alt Report to Police
            Server->>Police: Send report details
        else Report to WomenOrg
            Server->>WomenOrg: Send report details
        end
        Server->>Client: 201 Report submitted successfully
        Client->>User: Displays success message
    end
```

**Explanation:**

1.  The user fills out the report form on the client-side.
2.  The client sends a POST request to the `/user/report` endpoint with the report data.
3.  The `auth_user` middleware authenticates the user using the JWT.
4.  The `validateReport` middleware validates the request body using the `reportValidationSchema` Zod schema.
5.  If validation fails, an error response is sent back to the client.
6.  If validation succeeds, a new report record is created in the database.
7.  A report submission email is sent to the user.
8.  The system determines whom to report to (Police or Women's Organization) based on the report details.
9.  The report details are sent to the appropriate organization.
10. A success response is sent back to the client.

#### D. Admin Signin Workflow

```mermaid
sequenceDiagram
    participant Admin
    participant Client
    participant Server
    participant Database

    Admin->>Client: Enters signin details
    Client->>Server: POST /admin/signin with admin data
    Server->>Server: validateInputsSIgnin (Zod validation)
    alt Validation fails
        Server->>Client: 400 Validation error
        Client->>Admin: Displays error message
    else Validation succeeds
        Server->>Server: fetchDB (Check username and password)
        Server->>Database: Retrieve admin record by username
        Database->>Server: Admin data or null
        alt Admin not found or password incorrect
            Server->>Client: 401 Invalid username or password
            Client->>Admin: Displays error message
        else Admin found and password correct
            Server->>Server: generate_JWT_key (Generate JWT token)
            Server->>Client: 200 Authentication successful, JWT token, admin details
            Client->>Admin: Grants access
        end
    end
```

**Explanation:**

1.  The admin enters their sign-in details on the client-side.
2.  The client sends a POST request to the `/admin/signin` endpoint with the admin data.
3.  The `validateInputsSIgnin` middleware validates the request body using the `inputSchemaSignin` Zod schema.
4.  If validation fails, an error response is sent back to the client.
5.  If validation succeeds, the `fetchDB` middleware checks if the username and password match a record in the database.
6.  If the admin is not found or the password is incorrect, an error response is sent back to the client.
7.  If the admin is found and the password is correct, the `generate_JWT_key` function generates a JSON Web Token (JWT).
8.  A success response containing the JWT and admin details is sent back to the client.

### IV. Code Examples

#### A. Report Validation Middleware

```javascript
// backend/routes/middlewares/zod/reportValidation.js
const { z } = require('zod');

const reportValidationSchema = z.object({
    title: z.string().nonempty({ message: 'Title is required' }),
    description: z.string().nonempty({ message: 'Description is required' }),
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
```

**Explanation:**

*   This code defines a Zod schema `reportValidationSchema` for validating report data.
*   The `validateReport` middleware function uses this schema to validate the request body.
*   If validation succeeds, the `next()` function is called to pass control to the next middleware or route handler.
*   If validation fails, an error response is sent back to the client with a list of validation errors.

#### B. User Signup Validation Middleware

```javascript
// backend/routes/middlewares/zod/inputValidation.js
const zod = require('zod');

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

const validateInputsSIgnup = async (req, res, next) => {
    try {
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

module.exports = { validateInputsSIgnup };
```

**Explanation:**

*   This code defines a Zod schema `inputSchemaSignup` for validating user signup data.
*   The `validateInputsSIgnup` middleware function uses this schema to validate the request body.
*   If validation succeeds, the `next()` function is called to pass control to the next middleware or route handler.
*   If validation fails, an error response is sent back to the client with a list of validation errors.

#### C. User Authentication Middleware

```javascript
// backend/routes/middlewares/usermiddlewares/auth-middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../../../db/db');
const { JWT_KEY } = require('./JWT/generate-auth-key');

const auth_user = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({ msg: 'Unauthorized: Missing or invalid token', success: false });
        }

        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_KEY);
        const user = await User.findOne({ Username: decoded.username });

        if (!user) {
            return res.status(401).json({ msg: 'Unauthorized: Invalid user', success: false });
        }

        req.user = user; // Attach user object to request
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ msg: 'Forbidden: Invalid token', success: false });
    }
};

const current_user = async (username) => {
    const user = await User.findOne({
        Username: username
    });
    return user;
};

module.exports = { auth_user, current_user };
```

**Explanation:**

*   The `auth_user` middleware function authenticates the user using the JWT.
*   It extracts the JWT from the `Authorization` header.
*   It verifies the JWT using the `JWT_KEY`.
*   If the JWT is valid, it retrieves the user from the database using the username stored in the JWT.
*   The user object is attached to the request object for use in subsequent middleware or route handlers.
*   The `current_user` function retrieves a user from the database by username.

### V. Usage Guide

#### A. Implementing Zod Validation

1.  **Define a Zod schema:** Create a Zod schema that defines the expected structure and data types of the request body.
2.  **Create a middleware function:** Create a middleware function that uses the Zod schema to validate the request body.
3.  **Apply the middleware to a route:** Apply the middleware function to the route that you want to protect.

#### B. Implementing Authentication

1.  **Create authentication middleware:** Create a middleware function that authenticates the user using a JWT or other authentication mechanism.
2.  **Apply the middleware to a route:** Apply the middleware function to the route that you want to protect.

### VI. Implementation Details and Gotchas

*   **Zod `safeParse` vs. `parse`:** Use `safeParse` for middleware to handle validation failures gracefully.  `parse` will throw an error, which requires a different error handling approach.
*   **JWT Secret Key:**  Store the `JWT_KEY` securely and rotate it periodically.
*   **Error Handling:**  Ensure comprehensive error handling in all middleware functions to prevent unexpected application behavior.
*   **Asynchronous Operations:**  Use `async/await` for asynchronous operations within middleware functions to avoid blocking the event loop.

### VII. Common Issues and Troubleshooting

*   **Validation Errors:**  Check the Zod schema and request body for discrepancies.
*   **Authentication Failures:**  Verify the JWT, secret key, and user credentials.
*   **Database Connection Errors:**  Ensure the database connection is configured correctly and the database server is running.
*   **Middleware Execution Order:**  Pay close attention to the order in which middleware functions are applied to routes.

### VIII. Advanced Configuration and Customization Options

*   **Custom Zod Schemas:**  Create custom Zod schemas to validate complex data structures.
*   **Custom Authentication Strategies:**  Implement custom authentication strategies using Passport.js or other authentication libraries.
*   **Role-Based Access Control:**  Implement role-based access control using middleware to restrict access to certain routes based on user roles.

### IX. Performance Considerations and Optimization Strategies

*   **Middleware Overhead:**  Minimize the number of middleware functions applied to each route to reduce overhead.
*   **Database Queries:**  Optimize database queries to improve performance.
*   **Caching:**  Implement caching to reduce the number of database queries.

### X. Security Implications and Best Practices

*   **Input Validation:**  Always validate user inputs to prevent injection attacks.
*   **Authentication and Authorization:**  Implement robust authentication and authorization mechanisms to protect sensitive data.
*   **Data Encryption:**  Encrypt sensitive data at rest and in transit.
*   **Regular Security Audits:**  Conduct regular security audits to identify and address vulnerabilities.
