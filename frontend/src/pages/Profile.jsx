import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
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
            <BottomNavbar/ >
        </>);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Profile Information</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="font-semibold">Username:</h2>
                        <p>{userData.username}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">College Email:</h2>
                        <p>{userData.college_email}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Personal Email:</h2>
                        <p>{userData.personal_email || 'Not provided'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Phone:</h2>
                        <p>{userData.phone || 'Not provided'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Address:</h2>
                        <p>{userData.address || 'Not provided'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">College:</h2>
                        <p>{userData.college || 'Not provided'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Course:</h2>
                        <p>{userData.course || 'Not provided'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Year:</h2>
                        <p>{userData.year || 'Not provided'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Blood Group:</h2>
                        <p>{userData.blood_group || 'Not provided'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Medical Conditions:</h2>
                        <p>{userData.medical_conditions || 'None'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Allergies:</h2>
                        <p>{userData.allergies || 'None'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Medications:</h2>
                        <p>{userData.medications || 'None'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Emergency Contact:</h2>
                        <p>{userData.emergency_contact || 'Not provided'}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold">Emergency Phone:</h2>
                        <p>{userData.emergency_phone || 'Not provided'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;