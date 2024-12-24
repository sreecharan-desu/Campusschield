import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import BottomNavbar from '../components/BottomNavbar';

const Signin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        college_email: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const signInSchema = z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        college_email: z.string().email('Invalid email format').includes('rgukt', 'Must be a valid college email')
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setApiError('');

        try {
            // Validate form data
            const validatedData = signInSchema.parse(formData);

            // Make API call
            const response = await axios.post('https://campus-schield-backend-api.vercel.app/api/v1/user/signin', validatedData);
            
            if (response.data.success) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // Handle successful signin
                navigate('/profile');
            } else {
                setApiError(response.data.msg || 'Sign in failed. Please try again.');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                const fieldErrors = {};
                error.errors.forEach(err => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                // Handle API errors
                setApiError(error.response?.data?.msg || 'Sign in failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (<>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <div className="max-w-md w-full m-4 p-8 bg-white rounded-2xl shadow-2xl space-y-8 transform hover:scale-105 transition-all duration-300">
                <div>
                    <h2 className="text-center text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to access your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1 block">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.username}</p>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.password}</p>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="college_email" className="text-sm font-medium text-gray-700 mb-1 block">
                                College Email
                            </label>
                            <input
                                id="college_email"
                                name="college_email"
                                type="email"
                                required
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                placeholder="Enter your college email"
                                value={formData.college_email}
                                onChange={handleChange}
                            />
                            {errors.college_email && (
                                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.college_email}</p>
                            )}
                        </div>
                    </div>

                    {apiError && (
                        <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-lg animate-bounce">
                            {apiError}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                            Forgot your password?
                        </a>
                    </div>

                    <div className="text-center text-sm">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button 
                                onClick={() => navigate('/signup')} 
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                            >
                                Sign up now
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
                            

        <BottomNavbar/>
    </>);
};

export default Signin;
