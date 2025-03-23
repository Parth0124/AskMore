import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileDropdown = () => setIsProfileOpen((prev) => !prev);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                AskMore
              </span>
            </Link>
          </div>
          <div className="flex-1 flex justify-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2"
            >
              Home
            </Link>
          </div>
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center"
                onClick={toggleProfileDropdown}
              >
                {user ? (
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.email}&background=random`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-8 w-8 p-1 border-2 border-gray-300 rounded-full hover:border-indigo-600" />
                )}
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl z-10">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700">
                        {user.email}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
