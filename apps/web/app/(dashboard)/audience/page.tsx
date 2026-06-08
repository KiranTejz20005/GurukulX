"use client"

import { Users, Search } from "lucide-react"

export default function AudiencePage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Audience</h1>
          <p className="text-sm text-gray-400">Manage your students, instructors, and organization members.</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          Invite Member
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search audience..." 
            className="w-full h-10 pl-10 pr-4 bg-[#09090b] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No members yet</h3>
        <p className="text-[13px] text-gray-400 mb-8 max-w-[320px] leading-relaxed">
          Start building your community by inviting students and instructors to your organization.
        </p>
        <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Invite Member
        </button>
      </div>
    </div>
  )
}
