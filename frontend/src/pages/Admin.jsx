import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, UserX, Trash2, MapPin } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [reports, setReports] = useState([]); // State to store report data
  const [sirenAlerts, setSirenAlerts] = useState([]); // State to store siren alerts
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(''); // State for error messages
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filterStatus, setFilterStatus] = useState(''); // State for report status filter
  const [view, setView] = useState('users'); // State to toggle between users and reports view

  const navigate = useNavigate();
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}'); // Admin data from localStorage
  const token = localStorage.getItem('adminToken'); // Auth token from localStorage

  const API_BASE_URL = 'https://campus-schield-backend-api.vercel.app/api/v1/admin'; // Base API URL

  let sirenAudio = new Audio('/public/siren.mp3'); // Siren audio file

  // Fetch user and report data from API
  const fetchData = async () => {
    try {
      const [usersResponse, reportsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/getusers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!usersResponse.ok || !reportsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const usersData = await usersResponse.json();
      const reportsData = await reportsResponse.json();

      if (usersData.success && reportsData.success) {
        setUsers(usersData.users); // Update users state
        setReports(reportsData.reports); // Update reports state
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false); // Disable loading indicator
    }
  };

  // Fetch siren alerts from API
  const fetchSirenAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getsirens`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sirens');
      }

      const data = await response.json();
      if (data.success) {
        setSirenAlerts(data.sirens); // Update siren alerts state

        if (data.sirens.length > sirenAlerts.length) {
          sirenAudio.play(); // Play siren audio
          sirenAudio.loop = true; // Enable looping

          setTimeout(() => {
            sirenAudio.pause(); // Pause audio after 1 minute
          }, 60000);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sirens', err);
    }
  };

  // Initial data fetch and siren polling setup
  useEffect(() => {
    if (!token) {
      navigate('/admin/signin'); // Redirect to signin if no token
      return;
    }
    fetchData();

    const sirenInterval = setInterval(fetchSirenAlerts, 2000); // Poll for sirens every 2 seconds
    return () => clearInterval(sirenInterval); // Cleanup interval on unmount
  }, [token, navigate]);

  // Pause siren audio on spacebar press
  const handleKeydown = (e) => {
    if (e.code === 'Space') {
      sirenAudio.pause();
    }
  };

  // Add and remove event listener for keydown
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  // Delete a user by ID
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteuser?userId=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId)); // Update users state
      }
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  // Change the status of a report
  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/changestatus`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: reportId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      if (data.success) {
        setReports(
          reports.map((report) =>
            report._id === reportId ? { ...report, Status: newStatus } : report
          )
        ); // Update reports state
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  // Delete a report by ID
  const handleDeleteReport = async (reportId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deletereport`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: reportId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }

      const data = await response.json();
      if (data.success) {
        setReports(reports.filter((report) => report._id !== reportId)); // Update reports state
      }
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  // Logout admin and clear localStorage
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/signin');
  };

  // Filter reports based on search term and status
  const filteredReports = reports.filter(
    (report) =>
      (!filterStatus || report.Status === filterStatus) &&
      (report.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.Description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.CollegeEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">Campus Shield Admin</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {adminData.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <AlertCircle className="inline mr-2" />
            {error}
          </div>
        )}

        <div className="mb-4 bg-yellow-100 p-4 rounded-md shadow">
          <h2 className="text-lg font-bold">Siren Alerts</h2>
          {sirenAlerts.length === 0 ? (
            <p className="text-sm text-gray-600">No siren alerts at the moment.</p>
          ) : (
            sirenAlerts.map((alert, index) => (
              <p key={index} className="text-sm text-gray-700">
                {alert.message} ({new Date(alert.timestamp).toLocaleString()})
              </p>
            ))
          )}
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div>
            <button
              className={`px-4 py-2 rounded-l-md ${
                view === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setView('users')}
            >
              Users
            </button>
            <button
              className={`px-4 py-2 rounded-r-md ${
                view === 'reports' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setView('reports')}
            >
              Reports
            </button>
          </div>

          <input
            type="text"
            className="border p-2 rounded-md"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {view === 'reports' && (
            <select
              className="border p-2 rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
        </div>

        {view === 'users' ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Users ({filteredUsers.length})</h2>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between border-b pb-4 mb-4"
                  >
                    <div>
                      <p className="font-bold text-gray-700">{user.Username}</p>
                      <p className="text-gray-500">{user.CollegeEmail}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                    >
                      <Trash2 className="inline-block mr-2" />
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Reports ({filteredReports.length})</h2>
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <p className="text-gray-500">No reports found.</p>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report._id}
                    className="flex flex-col border-b pb-4 mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-700">{report.Title}</p>
                        <p className="text-gray-500">{report.Description}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(report.CreatedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={report.Status}
                          onChange={(e) =>
                            handleStatusChange(report._id, e.target.value)
                          }
                          className="border p-2 rounded-md"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => handleDeleteReport(report._id)}
                          className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                        >
                          <Trash2 className="inline-block mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

