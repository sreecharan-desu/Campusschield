import React, { useEffect, useState } from 'react';import toast from 'react-hot-toast';
import BottomNavbar from '../components/BottomNavbar';
import { Navigate, useNavigate } from 'react-router-dom';

const SirenButton = () => {
    const [showPopup, setShowPopup] = React.useState(false);
    const handleSiren = async () => {
        try {
            // Get current location
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const token = localStorage.getItem('token');
            const response = await fetch('https://campus-schield-backend-api.vercel.app/api/v1/user/sendsiren', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : null
                },
                body: JSON.stringify({
                    title: 'Emergency Alert',
                    description: 'Emergency assistance needed',
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    video_link: '',
                    image_link: '',
                    audio_link: ''
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send emergency alert');
            }

            const data = await response.json();
            if (data.success) {
                setShowPopup(false);
                toast.success('Emergency alert sent successfully');
            }
        } catch (error) {
            console.error('Error sending emergency alert:', error);
            toast.error('Failed to send emergency alert. Please try again.');
        }
    };

    return (
        <>
            <button
                onClick={() => setShowPopup(true)}
                className="fixed left-1/2 -translate-x-1/2 bottom-24 w-24 h-24 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full 
                animate-[pulse_1.5s_ease-in-out_infinite] hover:animate-none hover:scale-115 transition-all duration-300 
                flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] border-4 border-white 
                group hover:from-red-600 hover:via-red-700 hover:to-red-800"
                aria-label="Emergency Alert Button"
            >
                <div className="absolute -inset-1 bg-red-500 rounded-full opacity-30 animate-ping"></div>
                <span className="text-white text-4xl transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">🚨</span>
            </button>

            {showPopup && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white/95 p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 transform scale-100 transition-all duration-300
                    animate-[slideUp_0.3s_ease-out]">
                        <h2 className="text-4xl font-bold mb-6 text-red-600 flex items-center justify-center">
                            <span className="mr-3 animate-bounce">🚨</span> 
                            Emergency Alert
                        </h2>
                        <p className="mb-8 text-gray-700 text-xl text-center leading-relaxed">
                            Are you sure you want to send an emergency alert? This will notify campus security immediately.
                        </p>
                        <div className="flex flex-col space-y-4">
                            <button
                                onClick={handleSiren}
                                className="w-full py-4 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl
                                hover:from-red-600 hover:to-red-800 transform hover:scale-105 transition-all duration-300 
                                font-bold text-xl shadow-lg flex items-center justify-center space-x-2"
                            >
                                <span>🚨</span>
                                <span>Confirm Emergency</span>
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 
                                transition-all duration-300 font-semibold text-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


const Homepage = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user')); // Ensure proper parsing of stored user data
    
        setIsAuth(!!token);
    
        if (token && user) {
            fetch('http://localhost:5000/api/v1/user/getreports', {
                method: 'POST', // Explicit POST request
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Specify JSON content type
                },
                body: JSON.stringify({ username: user.username }), // Correctly serialize the username
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setReports(data.reports); // Update state with fetched reports
                    } else {
                        console.error('Failed to fetch reports:', data.msg);
                    }
                })
                .catch(error => console.error('Error fetching reports:', error));
        }
    }, []);
    
    const handleNavigate = (route) => {
        if (isAuth) {
            navigate(route);
        } else {
            navigate('/signin');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-700 to-blue-500 relative overflow-hidden">
            {/* Background noise and overlay */}
            <div className="absolute inset-0 bg-[url('/path/to/noise-pattern.png')] opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

            <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-16 relative">
                {isAuth ? (
                    <div className="w-full max-w-5xl mx-auto animate-[fadeIn_0.8s_ease-out]">
                        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight text-center 
                        [text-shadow:_0_5px_25px_rgba(0,0,0,0.7)]">
                            Welcome Back, <span className="text-yellow-300">John!</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-10 text-center leading-relaxed max-w-3xl mx-auto">
                            Stay updated and explore your campus safety dashboard.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {reports.map((report, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-transform transform hover:scale-105">
                                    <h3 className="text-xl font-semibold text-indigo-700 mb-4">{report.title}</h3>
                                    <p className="text-gray-600">{report.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center space-x-6">
                            <button
                                onClick={() => handleNavigate('/create-report')}
                                className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-bold py-4 px-8 rounded-lg 
                                shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 text-lg"
                            >
                                Create Report
                            </button>
                            <button
                                onClick={() => handleNavigate('/notifications')}
                                className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-lg 
                                shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 text-lg"
                            >
                                View Notifications
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-[fadeIn_0.8s_ease-out]">
                        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8 tracking-tight text-center 
                        [text-shadow:_0_5px_25px_rgba(0,0,0,0.7)]">
                            Welcome to CampusSchield
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed text-center max-w-3xl mx-auto">
                            Ensuring safety and security across your campus community.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <button
                                onClick={() => handleNavigate('/create-report')}
                                className="bg-white text-indigo-700 font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl 
                                transition-transform transform hover:scale-105 text-lg"
                            >
                                Create Report
                            </button>
                            <button
                                className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl 
                                transition-transform transform hover:scale-105 text-lg hover:bg-white/10"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <SirenButton />
            <BottomNavbar />
        </div>
    );
};

export default Homepage;