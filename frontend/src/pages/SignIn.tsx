import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await apiFetch<{ access_token: string }>(
        "/auth/login/json",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      login(data.access_token, { email: payload.sub, userId: payload.user_id });
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-4xl w-full flex rounded-lg shadow-lg overflow-hidden mx-auto">
        <div className="hidden md:block md:w-1/2 bg-white">
          <img
            src="https://i.pinimg.com/736x/a2/ef/7b/a2ef7bdef4126e5f299883f6168c0331.jpg"
            alt="Login background"
            className="w-full h-full object-cover"
            style={{ maxHeight: "600px" }}
          />
        </div>
        <div className="w-full md:w-1/2 bg-gradient-to-br from-white to-purple-50 p-8">
          <div className="w-full">
            <div className="flex mb-6">
              <button className="w-1/2 py-2 text-center bg-blue-600 text-white rounded-l-md">
                Login
              </button>
              <button
                className="w-1/2 py-2 text-center bg-white text-gray-700 border border-gray-200 rounded-r-md"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
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
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Logging In..." : "LOGIN"}
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
