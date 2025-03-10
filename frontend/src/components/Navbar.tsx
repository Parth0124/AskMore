import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); 

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AskMore</span>
            </Link>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="flex-1 flex justify-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
              Home
            </Link>
            <Link to="/learn" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
              Learn From AskMore
            </Link>
          </div>

          {/* Right Section - Profile */}
          <div className="flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center"
                  onClick={toggleProfileDropdown}
                >
                  <img
                     src={user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                     alt="Profile"
                     className="h-8 w-8 rounded-full"
                  />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl z-10">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      {user.displayName || user.email}
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                  onClick={toggleProfileDropdown}
                >
                  <User className="h-8 w-8 p-1 border-2 border-gray-300 rounded-full hover:border-indigo-600" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl z-10">
                    <Link
                      to="/signin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
