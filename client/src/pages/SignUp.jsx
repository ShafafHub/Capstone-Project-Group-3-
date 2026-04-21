import { useState } from 'react';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // --- Validate email format ---
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());

  // --- Validate form ---
  const validateForm = () => {
    let e = {};

    if (!email) e.email = 'Email cannot be empty';
    else if (!validateEmail(email)) e.email = 'Invalid email format';

    if (!password) e.password = 'Password cannot be empty';
    else if (password.length < 6)
      e.password = 'Password must be at least 6 characters';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // --- Submit signup ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await api.post('/auth/register', {
        email: email.toLowerCase(),
        password,
      });

      localStorage.setItem('token', res.data.token);
      navigate('/home');

    } catch (err) {
      const message = err?.response?.data?.message || 'Signup failed';

  setErrors({ general: message });
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create an Account
        </h2>

        {/* Sub text */}
        <p className="text-center text-gray-500 text-sm mb-6">
          Have an Account?{' '}
          <Link to="/signin" className="text-blue-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>

        {/* General Error */}
        {errors.general && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email
            <input
              id="email"
              name='email'
              type="email"
              placeholder="Enter Email Address"
              autoComplete="email"
              className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
            </label>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password
            <input
              id='password'
              name='password'
              type="password"
              placeholder="Create Password"
              autoComplete="new-password"
              className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            </label>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Create Account
          </button>

        </form>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By creating account, you agree to our{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Terms of Service
          </span>
        </p>

        {/* Divider */}
        <div className="my-6 border-t"></div>

        {/* Social */}
        <p className="text-center text-sm text-gray-500 mb-4">
          Or create an account using:
        </p>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 bg-white text-gray-700 hover:bg-gray-50 transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 bg-white text-gray-700 hover:bg-gray-50 transition">
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
            </svg>
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  )
}