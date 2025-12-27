"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, redirect if basic validation passes
    if (formData.username && formData.email && formData.password) {
      router.push('/dashboard');
    } else {
      setError('Please fill in all required fields');
    }
    
    setLoading(false);
  };

  const handleGoogleSignUp = () => {
    // Simulate Google sign up
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Large Image */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-start">
        <div className="w-full h-full flex items-center">
          <Image
            src="/images/bill.png"
            alt="Split Bills Illustration"
            width={900}
            height={900}
            className="w-auto h-[90vh] object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">$</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Splito</span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <Link
              href="/authentication/signup"
              className="flex-1 py-3 text-center text-emerald-600 font-medium border-b-2 border-emerald-500"
            >
              Sign Up
            </Link>
            <Link
              href="/authentication/login"
              className="flex-1 py-3 text-center text-gray-500 font-medium hover:text-gray-700"
            >
              Log In
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-600 text-sm mb-6">Start splitting expenses today</p>

          {/* Google Button */}
          <button 
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 mb-4"
          >
            <FcGoogle className="w-4 h-4" />
            <span className="text-gray-700 font-medium text-sm">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 text-xs">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-black"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-black"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-black"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-black"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start pt-1">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-3 w-3 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-0.5"
                required
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600 leading-tight">
                I agree to Terms & Privacy Policy
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-600 disabled:bg-emerald-400 text-sm mt-2 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link 
                href="/authentication/login" 
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden w-full p-4">
        {/* ... (same mobile content with form handling) ... */}
      </div>
    </div>
  );
}