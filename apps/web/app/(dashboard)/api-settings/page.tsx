"use client"

import { Code, Key } from "lucide-react"

export default function ApiSettingsPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">API</h1>
          <p className="text-sm text-gray-400">Manage your API keys and developer settings.</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Key className="w-4 h-4" />
          Generate API Key
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 bg-[#09090b] rounded-xl">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
          <Code className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No API keys found</h3>
        <p className="text-[13px] text-gray-400 mb-8 max-w-[320px] leading-relaxed">
          Create an API key to securely access your data programmatically and build custom integrations.
        </p>
        <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Generate API Key
        </button>
      </div>
    </div>
  )
}
