import React from 'react';
import BottomNavbar from '../components/BottomNavbar';

const SirenButton = () => {
    const [showPopup, setShowPopup] = React.useState(false);
    const [location, setLocation] = React.useState(null);

    const handleSiren = async () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const payload = {
                    title: "Emergency Alert",
                    description: "Emergency assistance needed",
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                };

                try {
                    const response = await fetch('http://localhost:5000/api/v1/user/sendsiren', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : null
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    if (data.success) {
                        alert('Emergency alert sent successfully!');
                    }
                } catch (error) {
                    console.error('Error sending alert:', error);
                }
            });
        }
        setShowPopup(false);
    };

    return (
        <>
            <button
                onClick={() => setShowPopup(true)}
                className="fixed bottom-24 right-4 w-16 h-16 bg-red-600 rounded-full animate-pulse hover:animate-none hover:scale-110 transition-transform duration-300 flex items-center justify-center shadow-lg"
            >
                <span className="text-white text-2xl">🚨</span>
            </button>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Confirm Emergency Alert</h2>
                        <p className="mb-6">Are you sure you want to send an emergency alert?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSiren}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Confirm
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

        React.useEffect(() => {
                const token = localStorage.getItem('token');
                setIsAuth(!!token);
        }, []);

        return (
                <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 relative">
                        <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-16">
                                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 sm:mb-8 tracking-tight text-center">
                                        Welcome to CampusSchield
                                </h1>
                                <p className="text-xl sm:text-2xl md:text-3xl text-blue-50 mb-8 sm:mb-10 px-4 leading-relaxed text-center">
                                        Ensuring safety and security across your campus community
                                </p>
                                <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
                                        <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105">
                                                Create Report
                                        </button>
                                        <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105">
                                                Learn More
                                        </button>
                                </div>
                        </div>
                        <SirenButton />
                        <BottomNavbar />
                </div>
        );
};

export default Homepage;