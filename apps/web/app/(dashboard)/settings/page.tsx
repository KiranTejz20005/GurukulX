"use client"

import { Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white mb-1">Settings</h1>
        <p className="text-sm text-gray-400">Manage your organization's general preferences and billing.</p>
      </div>

      <div className="bg-[#09090b] border border-white/10 rounded-xl p-8 max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Organization Name</label>
            <input 
              type="text" 
              defaultValue="ClassroomIO" 
              className="w-full h-10 px-4 bg-transparent border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Support Email</label>
            <input 
              type="email" 
              defaultValue="support@classroomio.com" 
              className="w-full h-10 px-4 bg-transparent border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Timezone</label>
            <select className="w-full h-10 px-4 bg-[#18181b] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
              <option>UTC (Coordinated Universal Time)</option>
              <option>EST (Eastern Standard Time)</option>
              <option>PST (Pacific Standard Time)</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end">
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Landing Page Settings Section */}
      <div className="mt-8 bg-[#09090b] border border-white/10 rounded-xl p-8 max-w-3xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Landing Page</h2>
          <p className="text-sm text-gray-400 mt-1">Customize the public-facing landing page of your academy.</p>
        </div>
        <a 
          href="/settings/landingpage/edit"
          className="px-5 py-2.5 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 transition-colors"
        >
          Open Editor
        </a>
      </div>
    </div>
  )
}
