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
            : 'bg-white text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition duration-300 px-3 py-2 rounded-t-lg';  // Default styles with curved top edges
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
            <div className="flex justify-around items-center h-14">  {/* Reduced height */}
                <button
                    onClick={() => handleNavigation('/')}
                    className={`flex flex-col items-center justify-center w-1/4 ${getButtonStyle('/')}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-xs mt-1">Home</span>
                </button>

                {isAuthenticated() && (
                    <button
                        onClick={() => handleNavigation('/create-report')}
                        className={`flex flex-col items-center justify-center w-1/4 ${getButtonStyle('/create-report')}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs mt-1">Create Report</span>
                    </button>
                )}

                <button
                    onClick={() => handleNavigation('/support')}
                    className={`flex flex-col items-center justify-center w-1/4 ${getButtonStyle('/support')}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-xs mt-1">Support</span>
                </button>

                <button
                    onClick={() => handleNavigation('/profile')}
                    className={`flex flex-col items-center justify-center w-1/4 ${getButtonStyle('/profile')}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-xs mt-1">Profile</span>
                </button>
            </div>
        </div>
    );
}
