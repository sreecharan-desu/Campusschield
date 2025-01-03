import React, { useState } from 'react';
import BottomNavbar from '../components/BottomNavbar';

const Popup = ({ message, onClose, type }) => {
    const popupStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className={`p-6 rounded-lg shadow-lg w-11/12 ${popupStyles[type] || 'bg-gray-700 text-white'}`}>
                <p className="text-center text-lg font-medium mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition"
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
        h_location: '',
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

    const handleDetectLocation = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }
            const data = await response.json();
            const { latitude, longitude } = data;

            if (latitude && longitude) {
                const coords = `${latitude}, ${longitude}`;
                setFormData((prevState) => ({ ...prevState, location: coords }));
                setPopupMessage('Live location detected successfully!');
                setPopupType('success');
                setPopupVisible(true);
            } else {
                throw new Error('Latitude and longitude not available.');
            }
        } catch (error) {
            let errorMessage = 'Unable to get your live location. Please try again.';
            if (error.message) {
                errorMessage = error.message;
            }
            setPopupMessage(errorMessage);
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col justify-between pb-16">
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-6 shadow-lg rounded-b-3xl">
                <div className="flex items-center justify-between">
                    <button className="text-white text-lg focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold tracking-wide text-center">
                        Report Incident
                    </h1>
                    <button className="text-white text-lg focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-white opacity-90 mt-2 text-center">
                    Fill out the form below to report any incident.
                </p>
            </header>

            <main className="flex-1 px-4 py-6">
                <div className="bg-white shadow-md rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter incident title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Describe the incident"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Harassment Location</label>
                            <input
                                type="text"
                                name="h_location"
                                value={formData.h_location}
                                onChange={handleInputChange}
                                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter location of harassment"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Live Location</label>
                            <div className="flex mt-2 gap-2">
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Auto-detect location"
                                    required
                                    readOnly
                                />
                                <button
                                    type="button"
                                    onClick={handleDetectLocation}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Detect
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date and Time</label>
                            <input
                                type="datetime-local"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleInputChange}
                                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Report To</label>
                            <select
                                name="whom_to_report"
                                value={formData.whom_to_report}
                                onChange={handleInputChange}
                                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled>Select authority</option>
                                <option value="police">Police</option>
                                <option value="women_organization">Women Organization</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Harasser Details</label>
                            <textarea
                                name="harasser"
                                value={formData.harasser}
                                onChange={handleInputChange}
                                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                                placeholder="Provide harasser details"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Submit Report
                        </button>
                    </form>
                </div>
            </main>

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
