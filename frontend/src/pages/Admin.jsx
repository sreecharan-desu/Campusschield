import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  let sirenAudio = new Audio('/public/siren.mp3');

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
      localStorage.setItem('sirenAlerts', JSON.stringify(data.sirens));

      if (data.success) {
        setSirenAlerts(data.sirens);
        if (data.sirens.length > prevAlerts.length) {
          sirenAudio.play();
          sirenAudio.loop = true;
          setTimeout(() => sirenAudio.pause(), 60000);
        }
      }
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
    const sirenInterval = setInterval(fetchSirenAlerts, 2000);
    return () => clearInterval(sirenInterval);
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
      <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg border-b sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <img src="/vite.svg" alt="Logo" className="h-10 w-10" />
        <h1 className="text-2xl font-extrabold text-white">Campus Shield Admin</h1>
        <div className="hidden md:flex space-x-4 ml-8 text-white">
          <div className="text-sm">
            <span className="text-gray-200">Users:</span>
            <span className="ml-1 font-semibold">{stats.totalUsers}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-200">Reports:</span>
            <span className="ml-1 font-semibold">{stats.totalReports}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-200">Active:</span>
            <span className="ml-1 font-semibold">{stats.activeReports}</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Bell 
            className={`h-6 w-6 ${sirenAlerts.length > 0 ? 'text-red-500 animate-bounce' : 'text-white'}`} 
            title={`${sirenAlerts.length} active alerts`} 
          />
          {sirenAlerts.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
              {sirenAlerts.length}
            </span>
          )}
        </div>
        <span className="text-white font-medium">Welcome, {adminData.username}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md transition-transform transform hover:scale-105"
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {getFilteredData(users, 'users').map(user => (
      <div
        key={user._id}
        className="p-4 bg-white shadow rounded-md border"
      >
        <h3 className="text-lg font-semibold text-gray-800">
          {user.Username || "Not Provided"}
        </h3>
        <p className="text-sm text-gray-600">{user.CollegeEmail || "Not Provided"}</p>
        <p className="text-sm text-gray-500">College: {user.College || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Course: {user.Course || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Year: {user.Year || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Personal Email: {user.PersonalEmail || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Phone: {user.Phone || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Address: {user.Address || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Blood Group: {user.BloodGroup || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Medical Conditions: {user.MedicalConditions || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Allergies: {user.Allergies || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Medications: {user.Medications || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Emergency Contact: {user.EmergencyContact || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Created At: {user.createdAt || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Updated At: {user.updatedAt || "Not Provided"}</p>
        <button
          onClick={() => handleDeleteUser(user._id)}
          className="mt-2 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
        >
          Delete User
        </button>
      </div>
    ))}
  </div>
)}{view === 'reports' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {getFilteredData(reports, 'reports').map(report => (
      <div
        key={report._id}
        className="p-4 bg-white shadow rounded-md border"
      >
        <h3 className="text-lg font-semibold text-gray-800">
          {report.Title || "Not Provided"}
        </h3>
        <p className="text-sm text-gray-600">{report.Description || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Status: {report.Status || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Time: {report.Time ? new Date(report.Time).toLocaleString() : "Not Provided"}</p>
        <p className="text-sm text-gray-500">Created: {report.createdAt ? new Date(report.createdAt).toLocaleString() : "Not Provided"}</p>
        <p className="text-sm text-gray-500">
  <a 
    href={`https://www.google.com/maps?q=${report.Location.latitude},${report.Location.longitude}`} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-blue-500 underline"
  >
    Location: {report.Location.latitude}, {report.Location.longitude}
  </a>
</p>        <p className="text-sm text-gray-500">Harasser Details: {report.HarasserDetails || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Video: {report.VideoLink || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Image: {report.ImageLink || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Audio: {report.AudioLink || "Not Provided"}</p>
        <p className="text-sm text-gray-500">Report To: {report.WhomToReport || "Not Provided"}</p>
        <p className="text-sm text-gray-500">User ID: {report.userId || "Not Provided"}</p>
        
        <div className="flex space-x-2 mt-2">
          {report.Status !== 'Resolved' ? <>
            <button
            onClick={() => handleStatusChange(report._id, 'Resolved')}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
          >
            Mark Resolved
          </button>
          </> : <>
          <p className='text-green font-bold italic'>Resolved</p>
          </>}
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
)}{view === 'sirens' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sirenAlerts.length === 0 ? <>
      <p className='text-gray font-bold text-center'> No Sirens found.</p>
    </> : <></>}
    {sirenAlerts.map(alert => (
      <div
        key={alert._id}
        className="p-4 bg-white shadow rounded-md border"
      >
        <h3 className="text-lg font-semibold text-gray-800">
          {alert.Title}
        </h3>
        <p className="text-sm text-gray-600">{alert.Description}</p>
        <p className="text-sm text-gray-500">
  <a 
    href={`https://www.google.com/maps?q=${alert.Location.latitude},${alert.Location.longitude}`} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-blue-500 underline"
  >
    Location: {alert.Location.latitude}, {alert.Location.longitude}
  </a>
</p>
        <p className="text-sm text-gray-500">
          Time: {new Date(alert.Time).toLocaleString()}
        </p>
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

                