import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import BottomNavbar from '../components/BottomNavbar';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        college_email: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const signUpSchema = z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        college_email: z.string().email('Invalid email format')
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            const validatedData = signUpSchema.parse(formData);
            const response = await axios.post('https://campus-schield-backend-api.vercel.app/api/v1/user/signup', validatedData);
            
            if (response.data.success) {
                // Redirect to signin page after successful signup
                navigate('/signin');
            } else {
                setApiError(response.data.msg || 'Sign up failed. Please try again.');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = {};
                error.errors.forEach(err => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                setApiError(error.response?.data?.msg || 'Sign up failed. Please try again.');
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
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join CampusSchield today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <p>Username must contain 8-16 characters and Password must contain 10-12 characters</p>
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
                                placeholder="Choose a username"
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
                                placeholder="Create a password"
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
                                                    <p className="text-red-500 text-sm text-center animate-pulse">{apiError}</p>
                                                )}
                            
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                                >
                                                    {isLoading ? 'Signing up...' : 'Sign Up'}
                                                </button>
                                            </form>
                                            <p className="mt-4 text-center text-sm text-gray-600">
                                                Already a user?{' '}
                                                <button
                                                    onClick={() => navigate('/signin')}
                                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                                                >
                                                    Sign in now
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                                                    <BottomNavbar />
                                                                </>
                                    );
                                }
                                
                                export default Signup;
                                