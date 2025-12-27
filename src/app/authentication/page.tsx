"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FaCheck, FaUsers, FaChartLine, FaReceipt } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans antialiased">
      {/* Header - Splitwise Style */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">$</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Splito</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              <Link href="#features" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                How it works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/authentication/login" 
              className="text-gray-700 font-medium hover:text-emerald-600 transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/authentication/signup" 
              className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-sm hover:shadow"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Splitwise Style */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Split bills with<br />
                <span className="text-emerald-500">friends. Fairly.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-6 mb-8 max-w-xl">
                Keep track of your shared expenses and balances with housemates, trips, groups, friends, and family.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  href="/authentication/signup" 
                  className="px-8 py-3.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-sm hover:shadow text-center"
                >
                  Get started for free
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="px-8 py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors text-center"
                >
                  See how it works
                </Link>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaCheck className="text-emerald-500" />
                  <span className="text-gray-700">No hidden fees</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheck className="text-emerald-500" />
                  <span className="text-gray-700">Works offline</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheck className="text-emerald-500" />
                  <span className="text-gray-700">Multi-currency</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheck className="text-emerald-500" />
                  <span className="text-gray-700">Secure & private</span>
                </div>
              </div>
            </div>

            {/* Right Illustration with Cards */}
            <div className="lg:w-1/2 relative">
              <div className="relative w-full max-w-xl">
                <Image 
                  src="/images/landing-illustration.png" 
                  alt="Expense Management Illustration"
                  width={600}
                  height={600}
                  className="w-full h-auto object-contain"
                  priority
                />
                
                {/* Floating Cards - Splitwise Style */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 w-56">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Roommates</span>
                    <span className="text-xs text-emerald-600 font-medium">$0</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Alex</span>
                      <span className="text-gray-900 font-medium">+$42.50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sam</span>
                      <span className="text-gray-900 font-medium">-$21.25</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 w-48">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FaReceipt className="text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Recent Expense</span>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-900 font-medium">Dinner at Restaurant</div>
                    <div className="text-gray-500">$85.00 • 4 people</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SplitToo Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to manage shared expenses with anyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <FaUsers className="text-emerald-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Create a group</h3>
              <p className="text-gray-600">
                Add friends, roommates, or travel buddies. Name your group and set the currency.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <FaReceipt className="text-emerald-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Add expenses</h3>
              <p className="text-gray-600">
                Enter bills, specify who paid, and split equally or by specific amounts.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <FaChartLine className="text-emerald-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Settle up</h3>
              <p className="text-gray-600">
                See who owes whom and settle balances directly in the app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <div className="relative w-full max-w-lg">
                <Image 
                  src="/images/tyre.png" 
                  alt="Split Bill Illustration"
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Smart splitting for every situation
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Equal splits</h3>
                    <p className="text-gray-600">Divide expenses equally among all group members automatically.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Custom splits</h3>
                    <p className="text-gray-600">Specify exact amounts for each person if the split isn't equal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Expense categories</h3>
                    <p className="text-gray-600">Organize by Food, Travel, Shopping, Utilities, and more.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Receipt scanning</h3>
                    <p className="text-gray-600">Take photos of receipts to automatically extract details.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/authentication/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-sm hover:shadow mt-8"
              >
                Try all features free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-emerald-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">10M+</div>
              <div className="text-gray-600">Users worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">$50B+</div>
              <div className="text-gray-600">Expenses tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">150+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">4.8★</div>
              <div className="text-gray-600">App Store rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to simplify your shared expenses?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join millions who trust SplitToo to split bills fairly and keep friendships intact.
          </p>
          <Link
            href="/authentication/signup"
            className="inline-block px-10 py-4 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-sm hover:shadow text-lg"
          >
            Start splitting for free
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="md:w-1/3">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">$</span>
                </div>
                <span className="text-2xl font-bold">SplitToo</span>
              </div>
              <p className="text-gray-400 mb-6">
                The easiest way to split expenses with friends and family.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mobile Apps</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 SplitToo. All rights reserved.
              </div>
              <div className="text-gray-400 text-sm">
                Made with ❤️ for fair splits everywhere
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}