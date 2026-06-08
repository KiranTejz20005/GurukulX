"use client"

import { Workflow, Plus } from "lucide-react"

export default function ZapierPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Zapier</h1>
          <p className="text-sm text-gray-400">Connect your courses with 5,000+ apps using Zapier.</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          Connect Zapier
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 bg-[#09090b] rounded-xl">
        <div className="w-16 h-16 bg-[#ff4f00]/10 rounded-2xl flex items-center justify-center mb-6">
          <Workflow className="w-8 h-8 text-[#ff4f00]" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Automate your workflows</h3>
        <p className="text-[13px] text-gray-400 mb-8 max-w-[320px] leading-relaxed">
          Create Zaps to automatically enroll students, send notifications, and sync data between apps.
        </p>
        <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Connect Zapier
        </button>
      </div>
    </div>
  )
}
