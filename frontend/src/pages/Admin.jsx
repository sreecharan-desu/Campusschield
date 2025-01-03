import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Bell, Download, Search, Trash2, MapPin, BarChart2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { adminTokenState, adminDataState, sirenAlertsState } from '../store';
import { useRecoilState } from 'recoil';

// Skeleton Components
const UserSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-6 w-32 bg-gray-200 rounded"></div>
      <div className="h-5 w-5 bg-gray-200 rounded"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="pt-4">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="space-y-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 w-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ReportSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="h-16 w-full bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between pt-4">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SirenSkeleton = () => (
  <Card className="animate-pulse border-red-200">
    <CardHeader>
      <div className="h-6 w-48 bg-gray-200 rounded"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-16 w-full bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
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
  const [adminData, setAdminData] = useRecoilState(adminDataState);
  const API_BASE_URL = 'https://campus-schield-backend-api.vercel.app/api/v1/admin';
  let sirenAudio = new Audio('/siren.mp3');
  const token = localStorage.getItem("adminToken");

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
  
      if (data.success) {
        // Retrieve the previous alert count from localStorage
        const previousAlertCount = parseInt(localStorage.getItem('sirenAlertCount'), 10) || 0;
  
        // Get the current alert count from the fetched data
        const currentAlertCount = data.sirens.length;
  
        // Check if there are new alerts
        if (currentAlertCount > previousAlertCount) {
          // Play sound only if the alert count has increased
          sirenAudio.loop = true;
          sirenAudio.play()
            .catch((error) => {
              console.error('Audio playback failed:', error);
            });
  
          setTimeout(() => {
            if (!sirenAudio.paused) {
              sirenAudio.pause();
              sirenAudio.currentTime = 0;
            }
          }, 10000);
        }
  
        // Update the alert count in localStorage
        localStorage.setItem('sirenAlertCount', currentAlertCount);
  
        // Update the alerts in state
        setSirenAlerts(data.sirens);
      }
    } catch (err) {
      console.error('Failed to fetch sirens:', err);
    }
  };
  


  useEffect(() => {
    if (!token) {
      navigate('/admin/signin');
      return;
    }
    fetchData();
    const dataInterval = setInterval(fetchData, 10000);
    const sirenInterval = setInterval(fetchSirenAlerts, 5000);
    return () => {
      clearInterval(sirenInterval);
      clearInterval(dataInterval);
    };
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
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAdminData({});
    navigate('/admin/signin');
  };

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
          user.CollegeEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user._id?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!collegeFilter || user.College === collegeFilter) &&
        (!courseFilter || user.Course === courseFilter) &&
        (!yearFilter || user.Year === yearFilter)
      );
    } else if (type === 'reports') {
      filtered = filtered.filter(report =>
        (report.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.userId?.toLowerCase().includes(searchTerm.toLowerCase())
        ) &&
        (!filterStatus || report.Status === filterStatus)
      );
    } else if (type === 'sirens') {
      filtered = filtered.filter(alert =>
        (
          alert.Username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.Description?.toLowerCase().includes(searchTerm.toLowerCase())
        ) &&
        (!filterStatus || alert.Status === filterStatus)
      );
    }

    return filtered.sort((a, b) =>
      sortBy === 'newest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  };

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
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 shadow-lg border-b border-indigo-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 w-24 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                {view === 'users' && <UserSkeleton />}
                {view === 'reports' && <ReportSkeleton />}
                {view === 'sirens' && <SirenSkeleton />}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 shadow-lg border-b border-indigo-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="/vite.svg"
                alt="Logo"
                className="h-10 w-10"
              />
              <h1 className="text-2xl font-bold text-white">
                Campus Shield <sup className='bg-white px-2 py-0.5 text-black rounded-full'>{adminData.username}</sup>
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="text-white underline text-white bold pointer" style={{cursor : "pointer"}} onClick={()=>navigate('/docs')}>
                  <b className='text-sm italic bold'>View our Docs</b>
                </div>
                <span className="text-white">Users: {stats.totalUsers}</span>
                <span className="text-white">Reports: {getFilteredData(
                  reports.filter(
                    report =>
                      report.WhomToReport ===
                      (adminData.username === "Police" ? "police" : "women_organization")
                  ),
                  'reports'
                ).length}</span>
                <span className="text-white">Active: {stats.activeReports}</span>
              </div>

              <div className="relative">
                <Bell
                  className={`h-6 w-6 ${
                    sirenAlerts.length > 0 ? 'text-red-500 animate-bounce' : 'text-white'
                  }`}
                />
                {sirenAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {sirenAlerts.length}
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
            <AlertCircle className="inline mr-2" />
            {error}
          </div>
        )}

        {/* Control Panel */}
        <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex space-x-2">
              {['users', 'reports', 'sirens'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-md transition ${
                    view === v
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border rounded-md px-3 py-2"
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
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {view === 'users' && (
              <>
                <select
                  value={collegeFilter}
                  onChange={(e) => setCollegeFilter(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="">All Colleges</option>
                  {[...new Set(users.map(u => u.College))].map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>

                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="">All Courses</option>
                  {[...new Set(users.map(u => u.Course))].map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>

                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="border rounded-md px-3 py-2"
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
                className="border rounded-md px-3 py-2"
              >
                <option value="">All Statuses</option>
                {[...new Set(reports.map(r => r.Status))].map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Data Views */}
        <div className="space-y-6">
          {/* Users View */}
          {view === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getFilteredData(users, 'users').map((user) => (
                <Card key={user._id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">{user.Username} <b style={{fontSize : "10px"}} className='text-sm text-gray'>id_{user._id}</b></CardTitle>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">College Email</p>
                          <p className="font-medium">{user.CollegeEmail || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Personal Email</p>
                          <p className="font-medium">{user.PersonalEmail || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="font-medium">{user.Phone || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">College</p>
                          <p className="font-medium">{user.College || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Course</p>
                          <p className="font-medium">{user.Course || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Year</p>
                          <p className="font-medium">{user.Year || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="pt-4">
                        <p className="text-gray-500">Medical Information</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">Blood Group: {user.BloodGroup || "Not provided"}</p>
                          <p className="text-sm">Medical Conditions: {user.MedicalConditions || "None"}</p>
                          <p className="text-sm">Allergies: {user.Allergies || "None"}</p>
                          <p className="text-sm">Medications: {user.Medications || "None"}</p>
                        </div>
                      </div>
                      <div className="pt-4">
                        <p className="text-gray-500">Emergency Contact</p>
                        <p className="text-sm font-medium">{user.EmergencyContact || "Not provided"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Reports View */}
          {view === 'reports' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {getFilteredData(
      reports.filter((report) => {
        if (adminData.username === "SreeCharan") {
          return true; // Display all reports
        } else if (adminData.username === "Police") {
          return report.WhomToReport === "police";
        } else if (adminData.username === "WomenOrg") {
          return report.WhomToReport === "women_organization";
        }
        return false; // Default case, no reports
      }),
      'reports'
    ).map((report) => (
      <Card key={report._id} className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">
              {report.Title}{" "}
              <b style={{ fontSize: "10px" }} className="text-sm text-gray">
                id_{report._id}
              </b>
            </CardTitle>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                report.Status === "Resolved"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {report.Status}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{report.Description}</p>
            <p className="text-sm text-gray-600 italic bold">
              {report.HarasserDetails}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <a
                  href={`https://www.google.com/maps?q=${report.Location.latitude},${report.Location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Location
                </a>
              </div>
              <div className="flex items-center text-xs">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className='font-bold italic p-1'>
                Location Harassed : {report.h_location ? report.h_location : "Not provided"}
                </span>
              </div>
              <p className="text-sm">
                <span className="font-medium">Reported:</span>{" "}
                {new Date(report.createdAt).toLocaleString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">userId : </span>{" "}
                <b style={{ fontSize: "10px" }} className="text-sm text-gray">
                  id_{report.userId}
                </b>
              </p>
              <span className="font-medium text-xs italic text-gray-700 bg-yellow-300 px-1 py-0.5 rounded-full">
  reported to{" "}
  {report.WhomToReport === "police"
    ? "police"
    : report.WhomToReport === "women_organization"
    ? "women organization"
    : "Admin"}
</span>

            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => handleStatusChange(report._id, "Resolved")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  report.Status === "Resolved"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                disabled={report.Status === "Resolved"}
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleDeleteReport(report._id)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm font-medium hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)}


          {/* Sirens View */}
          {view === 'sirens' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredData(sirenAlerts, 'sirens').map((alert) => (
                <Card key={alert._id} className="border-red-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-red-600">
                        Emergency Alert from {alert.Username}
                        <div className="text-xs text-gray-500 font-normal mt-1">
                          id_{alert._id}
                        </div>
                      </CardTitle>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        SOS
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="text-sm mt-1 bg-gray-50 p-2 rounded-md">
                          {alert.Description || 'No description provided'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <a
                            href={`https://www.google.com/maps?q=${alert.Location?.latitude},${alert.Location?.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View Location
                          </a>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Triggered:</span>{' '}
                            {new Date(alert.Time).toLocaleString()}
                          </p>
                          {/* <p className="text-sm">
                            <span className="font-medium">User ID:</span>{' '}
                            <span className="text-gray-600">id_{alert.userId}</span>
                          </p> */}
                          {alert.Phone && (
                            <p className="text-sm">
                              <span className="font-medium">Contact:</span>{' '}
                              <a href={`tel:${alert.Phone}`} className="text-blue-500 hover:underline">
                                {alert.Phone}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 flex items-center space-x-1"
                        >
                          <Bell className="h-4 w-4" />
                          <span>Emergency Siren</span>
                        </button>
                        {/* <button
                          onClick={() => {
                            // Handle alert deletion
                            setError('Alert deletion not implemented');
                          }}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm font-medium hover:bg-red-200 flex items-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;