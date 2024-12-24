import React from 'react';
import BottomNavbar from '../components/BottomNavbar';
import { PhoneIcon } from '@heroicons/react/24/solid';

const Support = () => {
    const emergencyContacts = [
        {
            name: 'Police Emergency',
            number: '100',
            description: 'For immediate police assistance',
        },
        {
            name: 'Women Helpline',
            number: '1091',
            description: 'National helpline for women in distress',
        },
        {
            name: 'Ambulance',
            number: '102',
            description: 'Medical emergency services',
        },
        {
            name: 'Fire Emergency',
            number: '101',
            description: 'Fire brigade emergency',
        },
        {
            name: 'Student Helpline',
            number: '1098',
            description: 'Child/Student protection helpline',
        },
        {
            name: 'Anti-Ragging Helpline',
            number: '1800-180-5522',
            description: 'National Anti-Ragging Help Line',
        },
        {
            name: 'Mental Health Helpline',
            number: '1800-599-0019',
            description: 'National mental health support',
        },
        {
            name: 'Cyber Crime Helpline',
            number: '1930',
            description: 'Report cyber crimes and online fraud',
        },
    ];

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col mb-20">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-6 shadow-lg rounded-b-3xl">
                <h1 className="text-4xl font-extrabold text-center mb-2">Emergency Support</h1>
                <p className="text-center text-lg opacity-90">Tap on the phone numbers below to call</p>
            </header>

            {/* Emergency Contacts */}
            <main className="flex-1 px-4 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {emergencyContacts.map((contact, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center"
                        >
                            {/* Call Button */}
                            <a
                                href={`tel:${contact.number}`}
                                className="flex items-center justify-center bg-green-500 text-white rounded-full w-14 h-14 mb-4 shadow-md hover:bg-green-600 transition"
                            >
                                <PhoneIcon className="h-6 w-6" />
                            </a>
                            {/* Contact Name */}
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{contact.name}</h2>
                            {/* Phone Number */}
                            <a
                                href={`tel:${contact.number}`}
                                className="text-green-600 text-lg font-medium hover:text-green-700 transition-colors mb-2"
                            >
                                {contact.number}
                            </a>
                            {/* Description */}
                            <p className="text-sm text-gray-600">{contact.description}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer Note */}
            <footer className="text-center text-gray-600 px-4 pb-6 mt-8">
                <p>
                    In case of any emergency, please don't hesitate to call these numbers.
                    <br />
                    <span className="font-medium text-gray-800">Your safety is our priority.</span>
                </p>
            </footer>

            <BottomNavbar />
        </div>
    );
};

export default Support;
