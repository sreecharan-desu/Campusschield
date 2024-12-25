import React, { useState } from 'react';
import { Menu, X, ChevronRight, Search, Shield, Heart } from 'lucide-react';

const DocsWebsite = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('introduction');

  const navigation = [
    { id: 'introduction', name: 'Introduction' },
    { id: 'features', name: 'Core Features' },
    { id: 'technical', name: 'Technical Architecture' },
    // { id: 'security', name: 'Security & Privacy' },
    // { id: 'api', name: 'API Reference' },
    // { id: 'getting-started', name: 'Getting Started' },
    // { id: 'support', name: 'Support' }
  ];

  const content = {
    introduction: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Welcome to CampusShield</h2>
        <p className="text-gray-600 mb-4">
          CampusShield is a comprehensive campus safety application designed to enhance
          the security of women in educational institutions. Our platform combines
          real-time emergency response capabilities with essential safety resources.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
          <p className="text-blue-700">
            "Empowering campus safety through innovative technology and immediate response systems."
          </p>
        </div>
      </div>
    ),
    features: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Core Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Emergency Response System</h3>
            <ul className="space-y-2">
              <li>• One-Touch Emergency Button</li>
              <li>• Real-time Location Tracking</li>
              <li>• Instant Alert System</li>
              <li>• Admin Dashboard Integration</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">User Authentication</h3>
            <ul className="space-y-2">
              <li>• College Email Verification</li>
              <li>• Secure Profile Management</li>
              <li>• Password Reset Functionality</li>
              <li>• Emergency Contact Management</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    technical: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Technical Architecture</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Frontend Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow-sm text-center">React.js</div>
            <div className="bg-white p-4 rounded shadow-sm text-center">JavaScript</div>
            <div className="bg-white p-4 rounded shadow-sm text-center">Tailwind CSS</div>
            <div className="bg-white p-4 rounded shadow-sm text-center">Recoil</div>
          </div>
          <h3 className="text-lg font-semibold mt-6 mb-2">Backend Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow-sm text-center">Node.js</div>
            <div className="bg-white p-4 rounded shadow-sm text-center">MongoDB</div>
            <div className="bg-white p-4 rounded shadow-sm text-center">REST APIs</div>
            <div className="bg-white p-4 rounded shadow-sm text-center">Email Service</div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="text-blue-600" size={24} />
              <span className="text-xl font-bold text-gray-900">CampusShield</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search docs..."
                className="w-64 pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar & Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 pt-16 bg-white shadow-sm w-64 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-200 ease-in-out`}
        >
          <nav className="px-4 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                    <ChevronRight
                      size={16}
                      className={activeSection === item.id ? 'text-blue-700' : 'text-gray-400'}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 px-4 py-8 transition-all duration-200 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {content[activeSection] || (
              <div className="text-center text-gray-500">Select a section from the sidebar</div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by</span>
            <span className="font-semibold text-blue-600">Sree Charan</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocsWebsite;