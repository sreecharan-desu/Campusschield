import React, { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, UserX, Trash2, MapPin, Filter, Download, Calendar, Search, Bell, Users, FileText, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  // State Management
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [sirenAlerts, setSirenAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [view, setView] = useState('users');
  const [dateRange, setDateRange] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const navigate = useNavigate();
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const token = localStorage.getItem('adminToken');
  const API_BASE_URL = 'https://campus-schield-backend-api.vercel.app/api/v1/admin';
  // const API_BASE_URL = 'http://localhost:5000/api/v1/admin';
  let sirenAudio = new Audio('/siren.mp3');

  // Fetch Data Functions
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
        setUsers(usersData.users);
        setReports(reportsData.reports);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSirenAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getsirens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch sirens');
      }
  
      const data = await response.json();
      const prevAlerts = JSON.parse(localStorage.getItem('sirenAlerts') || '[]');
  
      if (data.success) {
        setSirenAlerts(data.sirens);
  
        if (data.sirens.length > prevAlerts.length) {
          // Play the siren audio
          sirenAudio.loop = true;
  
          sirenAudio.play()
            .then(() => {
              console.log('Siren audio playing...');
            })
            .catch((error) => {
              console.error('Audio playback failed:', error);
              console.log('Audio playback is blocked. Please allow sound or interact with the page.');
            });
  
          // Stop the audio after 10 seconds
          setTimeout(() => {
            if (!sirenAudio.paused) {
              sirenAudio.pause();
              sirenAudio.currentTime = 0; // Reset audio
              console.log('Siren audio paused after 10 seconds');
            }
          }, 10000);
        }
      }
  
      // Update localStorage with a slight delay to avoid conflicts
      setTimeout(() => {
        localStorage.setItem('sirenAlerts', JSON.stringify(data.sirens));
      }, 2000);
  
    } catch (err) {
      console.error('Failed to fetch sirens:', err);
    }
  };  

  // Effect Hooks
  useEffect(() => {
    if (!token) {
      navigate('/admin/signin');
      return;
    }
    fetchData();
    const dataInterval  = setInterval(fetchData,10000);
    const sirenInterval = setInterval(fetchSirenAlerts, 5000);
    return () => {clearInterval(sirenInterval); clearInterval(dataInterval)};
  }, [token, navigate]);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.code === 'Space') {
        sirenAudio.pause();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // Handler Functions
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteuser?userId=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete user');

      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId));
      }
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    console.log(reportId, newStatus);
    try {
      const response = await fetch(`${API_BASE_URL}/changestatus`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: reportId, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const data = await response.json();
      if (data.success) {
        setReports(reports.map((report) =>
          report._id === reportId ? { ...report, Status: newStatus } : report
        ));
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

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

      if (!response.ok) throw new Error('Failed to delete report');

      const data = await response.json();
      if (data.success) {
        setReports(reports.filter((report) => report._id !== reportId));
      }
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/signin');
  };

  // Utility Functions
  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filterByDate = (items) => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return items.filter(item => 
          new Date(item.createdAt).toDateString() === now.toDateString()
        );
      case 'week':
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return items.filter(item => 
          new Date(item.createdAt) > weekAgo
        );
      case 'month':
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        return items.filter(item => 
          new Date(item.createdAt) > monthAgo
        );
      default:
        return items;
    }
  };

  const getFilteredData = (data, type) => {
    let filtered = filterByDate(data);

    if (type === 'users') {
      filtered = filtered.filter(user =>
        (user.Username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.CollegeEmail?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!collegeFilter || user.College === collegeFilter) &&
        (!courseFilter || user.Course === courseFilter) &&
        (!yearFilter || user.Year === yearFilter)
      );
    } else if (type === 'reports') {
      filtered = filtered.filter(report =>
        (report.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         report.Description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterStatus || report.Status === filterStatus)
      );
    }

    return filtered.sort((a, b) => 
      sortBy === 'newest' 
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  };

  // Stats Calculation
  const stats = {
    totalUsers: users.length,
    totalReports: reports.length,
    totalSirens: sirenAlerts.length,
    activeReports: reports.filter(r => r.Status !== 'Resolved').length,
    recentUsers: filterByDate(users).length,
    recentReports: filterByDate(reports).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-black shadow-lg border-b border-gray-800 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <img src="/vite.svg" alt="Logo" className="h-10 w-10 rounded-full shadow-md" />
        <h1 className="text-2xl font-extrabold text-white tracking-wide">
          Campus <span className="text-gray-400">Shield</span> Admin
        </h1>
        <div className="hidden md:flex space-x-6 ml-8">
          <div className="text-sm text-gray-400">
            <span className="text-white">Users:</span>
            <span className="ml-1 font-bold">{stats.totalUsers}</span>
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-white">Reports:</span>
            <span className="ml-1 font-bold">{stats.totalReports}</span>
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-white">Active:</span>
            <span className="ml-1 font-bold">{stats.activeReports}</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Bell
            className={`h-6 w-6 ${
              sirenAlerts.length > 0 ? 'text-red-500 animate-bounce' : 'text-gray-400'
            } transition-colors duration-300`}
            title={`${sirenAlerts.length} active alerts`}
          />
          {sirenAlerts.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse shadow-lg">
              {sirenAlerts.length}
            </span>
          )}
        </div>
        <span className="text-white font-medium bg-gray-800 px-3 py-1 rounded-lg shadow-md transition-transform transform hover:scale-105">
          Welcome, {adminData.username}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>






      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <AlertCircle className="inline mr-2" />
            {error}
          </div>
        )}

        {/* Control Panel */}
        <div className="mb-6 space-y-4">
          {/* View Toggles */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex space-x-2">
              {['users', 'reports', 'sirens'].map((v) => (
                <button
                  key={v}
                  className={`px-4 py-2 rounded-md transition ${
                    view === v 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setView(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-white border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              
              <button
                onClick={() => exportToCSV(
                  view === 'users' ? users : view === 'reports' ? reports : sirenAlerts,
                  view
                )}
                className="p-2 text-gray-600 hover:text-gray-900 bg-white rounded-md shadow-sm"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {view === 'users' && (
              <>
                <select
                  value={collegeFilter}
                  onChange={(e) => setCollegeFilter(e.target.value)}
                  className="px-3 py-2 bg-white border rounded-md"
                >
                  <option value="">All Colleges</option>
                  {[...new Set(users.map(u => u.College))].map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>

                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-2 bg-white border rounded-md"
                >
                  <option value="">All Courses</option>
                  {[...new Set(users.map(u => u.Course))].map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>

                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="px-3 py-2 bg-white border rounded-md"
                >
                  <option value="">All Years</option>
                  {[...new Set(users.map(u => u.Year))].sort().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </>
            )}

            {view === 'reports' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white border rounded-md"
              >
                <option value="">All Statuses</option>
                {[...new Set(reports.map(r => r.Status))].map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Data View */}
        <div className="mt-4">
        {view === 'users' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
    {users.map((user) => (
      <div
        key={user._id}
        className="p-6 bg-white  shadow-md border rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 truncate flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A10.002 10.002 0 0111 2a10.002 10.002 0 016.879 15.804M9 12h6m-3-3v6"
              />
            </svg>
            {user.Username || "No Name"}
          </h3>
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.134 21H7.866a2 2 0 01-1.999-1.858L5 7m5 4v6m4-6v6M9 7h6m-6 0a3 3 0 016 0"
              />
            </svg>
            Delete
          </button>
        </div>
        {/* Information Section */}
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600 flex items-center">
            <strong>ID:</strong> {user._id}
          </p>
          {/* <p className="text-sm text-gray-600 flex items-center">
            <strong>Password Hash:</strong> {user.Password}
          </p> */}
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Personal Email:</strong> {user.PersonalEmail || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>College Email:</strong> {user.CollegeEmail || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Phone:</strong> {user.Phone || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Address:</strong> {user.Address || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>College:</strong> {user.College || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Course:</strong> {user.Course || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Year:</strong> {user.Year || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Blood Group:</strong> {user.BloodGroup || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Medical Conditions:</strong> {user.MedicalConditions || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Allergies:</strong> {user.Allergies || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Medications:</strong> {user.Medications || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Emergency Contact:</strong> {user.EmergencyContact || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString() || "Not Provided"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString() || "Not Provided"}
          </p>
        </div>
      </div>
    ))}
  </div>
        )}




{view === 'reports' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {getFilteredData(reports, 'reports').length === 0 ? (
      <p className="text-gray-500 font-bold text-center">No Reports Found.</p>
    ) : null}
    {getFilteredData(reports, 'reports').map((report) => (
      <div
        key={report._id}
        className="p-6 bg-white shadow-lg border rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
      >
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 truncate flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h1v4H3V9.5L7.5 7 11 9.5V10h1"
            />
          </svg>
          {report.Title || "Not Provided"}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600">{report.Description || "Not Provided"}</p>

        {/* Status Tag */}
        <div className="mt-3">
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
              report.Status === "Resolved"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {report.Status || "Not Provided"}
          </span>
        </div>

        {/* Time */}
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-bold">Time:</span>{" "}
          {report.Time ? new Date(report.Time).toLocaleString() : "Not Provided"}
        </p>

        {/* Created At */}
        <p className="text-sm text-gray-500">
          <span className="font-bold">Created:</span>{" "}
          {report.createdAt ? new Date(report.createdAt).toLocaleString() : "Not Provided"}
        </p>

        {/* Location */}
        <div className="mt-2 flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2C8.686 2 6 4.686 6 8c0 3.886 5.25 8.58 5.25 8.58s5.25-4.694 5.25-8.58c0-3.314-2.686-6-6-6z"
            />
          </svg>
          <a
            href={`https://www.google.com/maps?q=${report.Location.latitude},${report.Location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline ml-2"
          >
            Location: {report.Location.latitude}, {report.Location.longitude}
          </a>
        </div>

        {/* Harasser Details */}
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-bold">Harasser Details:</span> {report.HarasserDetails || "Not Provided"}
        </p>

        {/* Media Links */}
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-500">
            <span className="font-bold">Video:</span> {report.VideoLink || "Not Provided"}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-bold">Image:</span> {report.ImageLink || "Not Provided"}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-bold">Audio:</span> {report.AudioLink || "Not Provided"}
          </p>
        </div>

        {/* Whom To Report */}
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-bold">Report To:</span> {report.WhomToReport || "Not Provided"}
        </p>

        {/* User ID */}
        <p className="text-sm text-gray-500">
          <span className="font-bold">User ID:</span> {report.userId || "Not Provided"}
        </p>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          {report.Status !== "Resolved" ? (
            <button
              onClick={() => handleStatusChange(report._id, "Resolved")}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
            >
              Mark Resolved
            </button>
          ) : (
            <p className="text-green-600 font-bold italic">Resolved</p>
          )}
          <button
            onClick={() => handleDeleteReport(report._id)}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
          >
            Delete Report
          </button>
        </div>
      </div>
    ))}
  </div>
)}



{view === 'sirens' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sirenAlerts.length === 0 ? (
      <p className="text-gray-500 font-bold text-center">No Sirens Found.</p>
    ) : null}
    {sirenAlerts.map((alert) => (
      <div
        key={alert._id}
        className="p-6 bg-white shadow-lg border rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
      >
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 truncate flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 2L14 2M4 5L20 5M5 20H19"
            />
          </svg>
          {alert.Title || "No Title"}
        </h3>

        {/* Description */}
        <div className="mt-2 flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h8m-4 0v6"
            />
          </svg>
          <p className="text-sm text-gray-600 ml-2">{alert.Description || "No Description"}</p>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2C8.686 2 6 4.686 6 8c0 3.886 5.25 8.58 5.25 8.58s5.25-4.694 5.25-8.58c0-3.314-2.686-6-6-6z"
            />
          </svg>
          <a
            href={`https://www.google.com/maps?q=${alert.Location.latitude},${alert.Location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline ml-2"
          >
            Location: {alert.Location.latitude}, {alert.Location.longitude}
          </a>
        </div>

        {/* Time */}
        <div className="mt-2 flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3"
            />
          </svg>
          <p className="text-sm text-gray-500 ml-2">
            Time: {alert.Time ? new Date(alert.Time).toLocaleString() : "No Time Provided"}
          </p>
        </div>
      </div>
    ))}
  </div>
)}



        </div>
      </main>
      
    </div>
  );
};

export default AdminDashboard;

                