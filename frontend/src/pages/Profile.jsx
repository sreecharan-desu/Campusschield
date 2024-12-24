import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch user data from local storage if available
            const user = JSON.parse(localStorage.getItem('user'));
            fetch('https://campus-schield-backend-api.vercel.app/api/v1/user/details', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setUserData(data.user);
                }
            })
            .catch(err => console.error('Error fetching user details:', err));
            setUserData(user);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // If not authenticated, show signin message
    if (!userData) {
        return (<>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg transform transition-all hover:scale-105">
                    <h2 className="text-3xl font-bold text-indigo-600 mb-4">
                        Please Sign In
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Sign in to explore your profile and access all features
                    </p>
                    <a
                        href="/signin"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
                    >
                        Sign In Now
                    </a>
                </div>
            </div>
            <BottomNavbar />
        </>);
    }
    return (
        <div className="container mx-auto p-4 mb-20">
          {/* Background Banner */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-6">
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
              {/* Profile Icon with First Letter */}
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center text-3xl font-semibold text-blue-600">
                {userData.username[0].toUpperCase()}
              </div>
              {/* Full Username */}
              <div className="text-2xl font-semibold text-white">{userData.username}</div>
            </div>
          </div>
      
          {/* Profile Header */}
          <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Profile Information</h1>
      
          {/* Profile Content */}
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
      
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Basic Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Username */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Username:</h3>
                    <p className="text-gray-600 text-sm">{userData.username}</p>
                  </div>
                </div>
      
                {/* College Email */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">College Email:</h3>
                    <p className="text-gray-600 text-sm">{userData.college_email}</p>
                  </div>
                </div>
      
                {/* Personal Email */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-envelope-open-text"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Personal Email:</h3>
                    <p className="text-gray-600 text-sm">{userData.personal_email || 'Not provided'}</p>
                  </div>
                </div>
      
                {/* Phone */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Phone:</h3>
                    <p className="text-gray-600 text-sm">{userData.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
      
            {/* Education Info Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Education Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Address */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-home"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Address:</h3>
                    <p className="text-gray-600 text-sm">{userData.address || 'Not provided'}</p>
                  </div>
                </div>
      
                {/* College */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-university"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">College:</h3>
                    <p className="text-gray-600 text-sm">{userData.college || 'Not provided'}</p>
                  </div>
                </div>
      
                {/* Course */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-book-open"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Course:</h3>
                    <p className="text-gray-600 text-sm">{userData.course || 'Not provided'}</p>
                  </div>
                </div>
      
                {/* Year */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Year:</h3>
                    <p className="text-gray-600 text-sm">{userData.year || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
      
            {/* Medical Info Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Medical Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Blood Group */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-tint"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Blood Group:</h3>
                    <p className="text-gray-600 text-sm">{userData.blood_group || 'Not provided'}</p>
                  </div>
                </div>
      
                {/* Medical Conditions */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Medical Conditions:</h3>
                    <p className="text-gray-600 text-sm">{userData.medical_conditions || 'None'}</p>
                  </div>
                </div>
      
                {/* Allergies */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-allergies"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Allergies:</h3>
                    <p className="text-gray-600 text-sm">{userData.allergies || 'None'}</p>
                  </div>
                </div>
      
                {/* Medications */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-pills"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Medications:</h3>
                    <p className="text-gray-600 text-sm">{userData.medications || 'None'}</p>
                  </div>
                </div>
              </div>
            </div>
      
            {/* Emergency Info Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Emergency Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Emergency Contact */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Emergency Contact:</h3>
                    <p className="text-gray-600 text-sm">{userData.emergency_contact || 'Not provided'}</p>
                  </div>
                </div>
      
                {/* Emergency Phone */}
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                    <i className="fas fa-phone-volume"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Emergency Phone:</h3>
                    <p className="text-gray-600 text-sm">{userData.emergency_phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
            


          {/* Bottom Navbar */}
          <BottomNavbar />
        </div>
      );
      
      
};

export default Profile;


const UpdateProfile = ({ userData, setShowUpdate, refreshData }) => {
    const [formData, setFormData] = useState({ ...userData });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://campus-schield-backend-api.vercel.app/api/v1/user/updateprofile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                if (data.msg.includes('signin again')) {
                    handleLogout();
                } else {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setShowUpdate(false);
                    refreshData();
                }
            }
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
            {Object.keys(userData).map(key => 
                key !== 'college_email' && (
                    <div key={key} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/_/g, ' ')}
                        </label>
                        <input
                            type="text"
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleChange}
                            className="mt-1 p-2 border rounded-md"
                        />
                    </div>
                )
            )}
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => setShowUpdate(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};
