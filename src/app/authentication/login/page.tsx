"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
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

      {/* Right Side - Login Form - Compact Horizontal Layout */}
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
              className="flex-1 py-3 text-center text-gray-500 font-medium hover:text-gray-700"
            >
              Sign Up
            </Link>
            <Link
              href="/authentication/login"
              className="flex-1 py-3 text-center text-emerald-600 font-medium border-b-2 border-emerald-500"
            >
              Log In
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-600 text-sm mb-6">Log in to your account</p>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 mb-4">
            <FcGoogle className="w-4 h-4" />
            <span className="text-gray-700 font-medium text-sm">Continue with Google</span>
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

          {/* Form - Compact Horizontal Layout */}
          <form className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-black"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-black"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-3 w-3 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-gray-600">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-600 text-sm mt-2"
            >
              Log In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                href="/authentication/signup" 
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Even More Compact */}
      <div className="lg:hidden w-full p-4">
        <div className="max-w-sm mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">$</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SplitToo</span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <Link
              href="/authentication/signup"
              className="flex-1 py-2 text-center text-gray-500 font-medium text-sm"
            >
              Sign Up
            </Link>
            <Link
              href="/authentication/login"
              className="flex-1 py-2 text-center text-emerald-600 font-medium border-b-2 border-emerald-500 text-sm"
            >
              Log In
            </Link>
          </div>

          <h1 className="text-lg font-bold text-gray-900 mb-1">Welcome back</h1>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 mb-3 text-sm">
            <FcGoogle className="w-4 h-4" />
            <span className="text-gray-700 font-medium">Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-gray-500 text-xs">or</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-3">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-black"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-600 text-sm"
            >
              Log In
            </button>
          </form>

          {/* Mobile Image */}
          <div className="mt-8">
            <Image
              src="/images/bill.png"
              alt="Split Bills Illustration"
              width={300}
              height={300}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}