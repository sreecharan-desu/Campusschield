import React from 'react';import toast from 'react-hot-toast';
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
    const [isAuth, setIsAuth] = React.useState(false);
    const navigate = useNavigate();
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuth(!!token);
    }, []);

        // Check if user is authenticated
        const isAuthenticated = () => {
            const token = localStorage.getItem('token');
            return token && token !== '' && token !== 'undefined' && token !== null;
        };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-700 to-blue-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/path/to/noise-pattern.png')] opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-16 relative">
                <div className="animate-[fadeIn_1s_ease-out]">
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-8 sm:mb-10 tracking-tight text-center 
                    [text-shadow:_0_4px_20px_rgb(0_0_0_/_40%)] animate-[slideDown_0.5s_ease-out]">
                        Welcome to CampusSchield
                    </h1>
                    <p className="text-2xl sm:text-3xl md:text-4xl text-blue-50 mb-12 sm:mb-14 px-4 leading-relaxed text-center 
                    [text-shadow:_0_2px_10px_rgb(0_0_0_/_30%)] max-w-4xl mx-auto">
                        Ensuring safety and security across your campus community
                    </p>
                    <div className="space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row justify-center">
                        <button className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-5 px-10 rounded-2xl 
                        shadow-2xl transition duration-300 transform hover:scale-105 hover:rotate-1 text-lg" onClick={()=>{if (isAuthenticated()) {navigate('/create-report')} else {navigate('/signin')}}}>
                            Create Report
                        </button>
                        <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold 
                        py-5 px-10 rounded-2xl shadow-2xl transition duration-300 transform hover:scale-105 hover:-rotate-1 text-lg">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
            <SirenButton />
            <BottomNavbar />
        </div>
    );
};

export default Homepage;
