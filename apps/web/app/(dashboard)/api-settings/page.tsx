"use client"

import { useState } from "react"
import { Key, Copy, Plus, Trash2, Eye, EyeOff } from "lucide-react"

export default function ApiSettingsPage() {
  const [keys, setKeys] = useState([
    { id: 1, name: "Production Key", value: "sk_live_51Nx...8Yzp", lastUsed: "2 hours ago", created: "2026-01-15" }
  ])
  const [showKey, setShowKey] = useState<number | null>(null)

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">API Settings</h1>
          <p className="text-sm text-gray-400">Manage your API keys for programmatic access.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create new key
        </button>
      </div>

      <div className="bg-[#09090b] border border-white/10 rounded-xl overflow-hidden max-w-4xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-medium text-white mb-2">Secret API Keys</h2>
          <p className="text-sm text-gray-400">Do not share your API keys in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-[#18181b] border-b border-white/10 text-gray-400">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Secret Key</th>
              <th className="px-6 py-3 font-medium">Last Used</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {keys.map(key => (
              <tr key={key.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-400" />
                  {key.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-300">
                      {showKey === key.id ? "sk_live_51NxH3K2L9xJ8YzpQRT1W2E3" : key.value}
                    </span>
                    <button 
                      onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                      className="p-1 hover:bg-white/10 rounded text-gray-400 transition-colors"
                    >
                      {showKey === key.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded text-gray-400 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{key.lastUsed}</td>
                <td className="px-6 py-4 text-gray-400">{key.created}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setKeys(keys.filter(k => k.id !== key.id))}
                    className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
