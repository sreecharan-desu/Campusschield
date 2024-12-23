import React from 'react';import BottomNavbar from '../components/BottomNavbar';
import { PhoneIcon } from '@heroicons/react/24/solid';

const Support = () => {
    const emergencyContacts = [
        {
            name: 'Police Emergency',
            number: '100',
            description: 'For immediate police assistance'
        },
        {
            name: 'Women Helpline',
            number: '1091',
            description: 'National helpline for women in distress'
        },
        {
            name: 'Ambulance',
            number: '102',
            description: 'Medical emergency services'
        },
        {
            name: 'Fire Emergency',
            number: '101',
            description: 'Fire brigade emergency'
        },
        {
            name: 'Student Helpline',
            number: '1098',
            description: 'Child/Student protection helpline'
        },
        {
            name: 'Anti-Ragging Helpline',
            number: '1800-180-5522',
            description: 'National Anti-Ragging Help Line'
        },
        {
            name: 'Mental Health Helpline',
            number: '1800-599-0019',
            description: 'National mental health support'
        },
        {
            name: 'Cyber Crime Helpline',
            number: '1930',
            description: 'Report cyber crimes and online fraud'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-2">
                Emergency Support Services
            </h1>
            <p className="text-lg text-center text-gray-600 mb-8">
                Click on the numbers to directly call emergency services
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {emergencyContacts.map((contact, index) => (
                    <div 
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                        <h2 className="text-xl font-semibold text-blue-600 mb-3">
                            {contact.name}
                        </h2>
                        <div className="flex items-center mb-3">
                            <PhoneIcon className="h-5 w-5 text-green-600 mr-2" />
                            <a 
                                href={`tel:${contact.number}`}
                                className="text-xl font-medium text-green-600 hover:text-green-700 transition-colors"
                            >
                                {contact.number}
                            </a>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {contact.description}
                        </p>
                    </div>
                ))}
            </div>

            <p className="text-center text-gray-700 mt-8">
                In case of any emergency, please don't hesitate to call these numbers.
                <br />
                <span className="font-medium">Your safety is our priority.</span>
            </p>

            <BottomNavbar />
        </div>
    );
};

export default Support;
