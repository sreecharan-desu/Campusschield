import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, UserX, Trash2 } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@radix-ui/react-select';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const token = localStorage.getItem('adminToken');

  const API_BASE_URL = 'https://campus-schield-backend-api.vercel.app/api/v1/admin';

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

  useEffect(() => {
    if (!token) {
      navigate('/admin/signin');
      return;
    }
    fetchData();
  }, [token, navigate]);

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

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      if (data.success) {
        setReports(
          reports.map((report) =>
            report._id === reportId ? { ...report, status: newStatus } : report
          )
        );
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

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }

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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Users ({users.length})</h2>
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-medium">{user.Username}</p>
                      <p className="text-sm text-gray-600">{user.CollegeEmail}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete User"
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                    >
                      <UserX className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Reports ({reports.length})</h2>
            <div className="space-y-4">
              {reports.length === 0 ? (
                <p className="text-gray-500">No reports found.</p>
              ) : (
                reports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        title="Delete Report"
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Select
                        value={report.status}
                        onValueChange={(value) => handleStatusChange(report._id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>{report.status}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-500">{report.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
