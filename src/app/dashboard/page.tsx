"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  FaUsers, 
  FaReceipt, 
  FaMoneyBillWave, 
  FaChartPie,
  FaBell,
  FaSearch,
  FaPlus,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

export default function DashboardPage() {
  const [activeGroup, setActiveGroup] = useState('Roommates');
  
  const groups = [
    { id: 1, name: 'Roommates', members: 3, total: 1200, color: 'bg-emerald-500' },
    { id: 2, name: 'Weekend Trip', members: 5, total: 850, color: 'bg-blue-500' },
    { id: 3, name: 'Office Lunch', members: 8, total: 320, color: 'bg-purple-500' },
    { id: 4, name: 'Family', members: 4, total: 2100, color: 'bg-amber-500' },
  ];

  const recentExpenses = [
    { id: 1, description: 'Grocery shopping', amount: 85.50, person: 'You', date: 'Today', group: 'Roommates' },
    { id: 2, description: 'Dinner at Restaurant', amount: 120.00, person: 'Alex', date: 'Yesterday', group: 'Weekend Trip' },
    { id: 3, description: 'Uber ride', amount: 24.75, person: 'Sam', date: '2 days ago', group: 'Roommates' },
    { id: 4, description: 'Movie tickets', amount: 60.00, person: 'You', date: '3 days ago', group: 'Office Lunch' },
  ];

  const balances = [
    { person: 'Alex', amount: 42.50, type: 'owes you', avatar: 'A' },
    { person: 'Sam', amount: 21.25, type: 'you owe', avatar: 'S' },
    { person: 'Jordan', amount: 15.00, type: 'settled', avatar: 'J' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">$</span>
                </div>
                <span className="text-xl font-bold text-gray-900">SplitToo</span>
              </div>
              
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-emerald-600 font-medium border-b-2 border-emerald-500 pb-1">
                  Dashboard
                </Link>
                <Link href="/groups" className="text-gray-600 hover:text-emerald-600 font-medium">
                  Groups
                </Link>
                <Link href="/expenses" className="text-gray-600 hover:text-emerald-600 font-medium">
                  Expenses
                </Link>
                <Link href="/activity" className="text-gray-600 hover:text-emerald-600 font-medium">
                  Activity
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FaSearch className="text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <FaBell className="text-gray-500" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">U</span>
                </div>
                <span className="text-gray-700 font-medium hidden md:block">User123</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, User! 👋</h1>
          <p className="text-gray-600 mt-2">Here's your expense overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">$+63.75</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-emerald-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Groups</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">$485.25</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaChartPie className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FaReceipt className="text-amber-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Groups */}
          <div className="lg:col-span-2 space-y-8">
            {/* Groups Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Groups</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm">
                  <FaPlus className="w-3 h-3" />
                  New Group
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((group) => (
                  <div 
                    key={group.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${activeGroup === group.name ? 'border-emerald-500' : 'border-gray-200'}`}
                    onClick={() => setActiveGroup(group.name)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${group.color} rounded-lg flex items-center justify-center`}>
                          <FaUsers className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{group.name}</h3>
                          <p className="text-sm text-gray-500">{group.members} members</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${group.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last activity: Today</span>
                      <span className="text-emerald-600 font-medium">View →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  View all →
                </button>
              </div>
              
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaReceipt className="text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{expense.description}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span>{expense.group}</span>
                          <span>•</span>
                          <span>{expense.person}</span>
                          <span>•</span>
                          <span>{expense.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{expense.person === 'You' ? 'You paid' : 'You owe'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:text-emerald-600 text-gray-500 flex items-center justify-center gap-2">
                <FaPlus />
                Add new expense
              </button>
            </div>
          </div>

          {/* Right Column - Balances & Quick Actions */}
          <div className="space-y-8">
            {/* Balances */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Balances</h2>
              
              <div className="space-y-4">
                {balances.map((balance, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${balance.type === 'owes you' ? 'bg-emerald-100' : balance.type === 'you owe' ? 'bg-red-100' : 'bg-gray-100'}`}>
                        <span className={`font-bold ${balance.type === 'owes you' ? 'text-emerald-600' : balance.type === 'you owe' ? 'text-red-600' : 'text-gray-600'}`}>
                          {balance.avatar}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{balance.person}</h4>
                        <p className={`text-sm ${balance.type === 'owes you' ? 'text-emerald-600' : balance.type === 'you owe' ? 'text-red-600' : 'text-gray-500'}`}>
                          {balance.type === 'settled' ? 'All settled up' : balance.type}
                        </p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${balance.type === 'owes you' ? 'text-emerald-600' : balance.type === 'you owe' ? 'text-red-600' : 'text-gray-900'}`}>
                      {balance.type === 'owes you' ? '+' : balance.type === 'you owe' ? '-' : ''}${balance.amount}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600">
                Settle Up
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600">
                  <FaPlus className="text-gray-500" />
                  <span>Add expense</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600">
                  <FaUsers className="text-gray-500" />
                  <span>Create group</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600">
                  <FaCalendarAlt className="text-gray-500" />
                  <span>View report</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600">
                  <FaCog className="text-gray-500" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
              <h3 className="font-bold text-emerald-800 mb-3">Pro Tip</h3>
              <p className="text-emerald-700 text-sm">
                Use the "Simplify Debts" feature to automatically calculate the fewest transactions needed to settle all balances in your group.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}