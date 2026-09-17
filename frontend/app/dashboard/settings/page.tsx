"use client"
import React from 'react'
import { mockUser } from '@/data/mockData'

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 pb-10 max-w-4xl mx-auto w-full">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your profile, privacy, and account preferences.</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-[#13151a] border border-[#23252a] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#23252a]">
          <h3 className="text-lg font-bold text-white">Profile Settings</h3>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input type="text" defaultValue={mockUser.fullName} className="w-full bg-[#0a0a0c] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ff6b8b] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input type="email" defaultValue={mockUser.email} className="w-full bg-[#0a0a0c] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ff6b8b] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
              <input type="text" defaultValue={mockUser.phone} className="w-full bg-[#0a0a0c] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ff6b8b] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Occupation / Business</label>
              <input type="text" defaultValue={mockUser.occupation} className="w-full bg-[#0a0a0c] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ff6b8b] transition-colors" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-xl text-sm font-semibold transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="bg-[#13151a] border border-[#23252a] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#23252a]">
          <h3 className="text-lg font-bold text-white">Privacy & Data</h3>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium mb-1">Transaction Data Access</h4>
              <p className="text-sm text-gray-400">Allow CreditBridge to analyze your uploaded transaction history.</p>
            </div>
            <div className="w-12 h-6 bg-[#10b981] rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
            </div>
          </div>
          <div className="w-full h-px bg-[#23252a]"></div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium mb-1">Voice Assessment Data</h4>
              <p className="text-sm text-gray-400">Keep a record of your AI voice assessment conversations.</p>
            </div>
            <div className="w-12 h-6 bg-[#10b981] rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="bg-[#13151a] border border-[#23252a] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#23252a]">
          <h3 className="text-lg font-bold text-white">Account Management</h3>
        </div>
        <div className="p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h4 className="text-white font-medium mb-1">Log out of all devices</h4>
            <p className="text-sm text-gray-400">You will be required to log in again on all your devices.</p>
          </div>
          <button className="bg-[#23252a] hover:bg-[#333] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap">
            Logout All
          </button>
        </div>
        <div className="p-6 bg-red-500/5 border-t border-[#23252a] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h4 className="text-red-500 font-medium mb-1">Delete Account</h4>
            <p className="text-sm text-gray-400">Permanently delete your account and all associated financial data.</p>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap">
            Delete Account
          </button>
        </div>
      </div>

    </div>
  )
}
