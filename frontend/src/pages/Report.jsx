import React, { useState } from 'react';
import BottomNavbar from '../components/BottomNavbar';

const Popup = ({ message, onClose, type }) => {
    const popupStyles = {
        success: 'bg-green-100 text-green-700',
        error: 'bg-red-100 text-red-700',
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`p-6 rounded-lg shadow-lg ${popupStyles[type] || 'bg-gray-100 text-gray-700'}`}>
                <p className="mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const Report = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        dateTime: '',
        harasser: '',
        whom_to_report: '',
    });
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDetectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
                    setFormData((prevState) => ({ ...prevState, location: coords }));
                    setPopupMessage('Location detected successfully!');
                    setPopupType('success');
                    setPopupVisible(true);
                },
                (error) => {
                    let errorMessage = 'Unable to get your location. Please try again.';
                    if (error.code === 1) {
                        errorMessage = 'Location permission denied. Please enable location permissions.';
                    } else if (error.code === 2) {
                        errorMessage = 'Location information is unavailable.';
                    } else if (error.code === 3) {
                        errorMessage = 'Location request timed out.';
                    }
                    setPopupMessage(errorMessage);
                    setPopupType('error');
                    setPopupVisible(true);
                }
            );
        } else {
            setPopupMessage('Geolocation is not supported by your browser.');
            setPopupType('error');
            setPopupVisible(true);
        }
    };

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

            const response = await fetch('http://localhost:5000/api/v1/user/createreport', {
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white mb-10">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
                    Report an Incident
                </h1>

                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter incident title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                rows="4"
                                placeholder="Describe what happened..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location</label>
                            <div className="flex-col gap-2">
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="flex-1 mb-3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                    placeholder="Enter location or use auto-detect"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleDetectLocation}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    Detect
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Date and Time</label>
                            <input
                                type="datetime-local"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Report To</label>
                            <select
                                name="whom_to_report"
                                value={formData.whom_to_report}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                required
                            >
                                <option value="">Select authority</option>
                                <option value="police">Police</option>
                                <option value="women_organization">Women Organization</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Harasser Details</label>
                            <textarea
                                name="harasser"
                                value={formData.harasser}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                rows="3"
                                placeholder="Describe the harasser (appearance, clothing, distinguishing features, etc.)"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Submit Report
                        </button>
                    </form>
                </div>
            </div>

            {isPopupVisible && (
                <Popup
                    message={popupMessage}
                    onClose={() => setPopupVisible(false)}
                    type={popupType}
                />
            )}

            <BottomNavbar />
        </div>
    );
};

export default Report;
