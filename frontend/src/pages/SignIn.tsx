import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail } from 'lucide-react';

export const SignIn = () => {
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/chat');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    // This would connect to your authentication system
  };

  const handleSignUp = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-4xl w-full flex rounded-lg shadow-lg overflow-hidden">
        {/* Left side with plant image - now with contained height */}
        <div className="hidden md:block md:w-1/2 bg-white">
          <img 
            src="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Monstera plant" 
            className="w-full h-full object-cover"
            style={{ maxHeight: '600px' }}
          />
        </div>
        
        {/* Right side with login form */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
          <div className="w-full">
            {/* Tab navigation */}
            <div className="flex mb-6">
              <button
                className={`w-1/2 py-2 text-center ${
                  activeTab === 'login' 
                    ? 'bg-blue-600 text-white rounded-l-md' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-l-md'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`w-1/2 py-2 text-center ${
                  activeTab === 'signup' 
                    ? 'bg-blue-600 text-white rounded-r-md' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-r-md'
                }`}
                onClick={handleSignUp} // Navigate to signup on click
              >
                Sign Up
              </button>
            </div>
            
            {/* Welcome message */}
            <div className="text-center mb-6">
              <p className="text-gray-600">Welcome back! 👋</p>
              <h2 className="text-xl font-semibold text-gray-800 mt-1">
                Login to your account
              </h2>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-500">
                  Forgot Password?
                </Link>
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                LOGIN
              </button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.449-11.985l-9.449 0.319z"
                    fill="#4285F4"
                  />
                </svg>
                Login with Gmail
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};