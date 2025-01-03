import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { ToastContainer, toast } from 'react-toastify';
import { adminTokenState, adminDataState } from '../store';

const AdminSignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  // Recoil setters
  const setAdminToken = useSetRecoilState(adminTokenState);
  const setAdminData = useSetRecoilState(adminDataState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://campus-schield-backend-api.vercel.app/api/v1/admin/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Update Recoil state instead of localStorage
        // setAdminToken(data.token);
        localStorage.setItem("adminToken",data.token);
        setAdminData(data.admin);
        toast.success('Signed in successfully!', { position: 'top-right' });
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials', { position: 'top-right' });
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Campus Shield Admin</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 3a7 7 0 00-7 7c0 .9.2 1.75.52 2.52l1.45-1.46A5.5 5.5 0 1113.93 6.6l1.47-1.47A6.965 6.965 0 0010 3zm8.54 6.46a8.1 8.1 0 00-1.23-1.4l1.4-1.4A9.97 9.97 0 0120 10a9.97 9.97 0 01-1.46 3.54l-1.4-1.4c.58-.64.94-1.4 1.14-2.2zm-3.12 3.66l1.45 1.45A7 7 0 0110 17a7 7 0 01-5.34-2.46l1.46-1.45A5.5 5.5 0 0010 15.5c1.7 0 3.23-.72 4.42-1.94z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.94 4.94a.75.75 0 011.06 0l12.12 12.12a.75.75 0 01-1.06 1.06L2.94 6a.75.75 0 010-1.06zm3.4 3.4a5.5 5.5 0 017.22 7.22l-7.22-7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignIn;