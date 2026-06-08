"use client"

import { File, FileVideo, Link as LinkIcon, Search, Video } from "lucide-react"

export default function MediaPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Media Manager</h1>
        <p className="text-sm text-gray-400">Keep files, videos, and links for your courses in one library.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex gap-4">
          <div className="mt-1 text-gray-400">
            <File className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-1">Total Storage</h3>
            <p className="text-2xl font-semibold text-white mb-1">0 B</p>
            <p className="text-[13px] text-gray-500">Total Storage</p>
          </div>
        </div>

        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex gap-4">
          <div className="mt-1 text-gray-400">
            <FileVideo className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-1">Internal Storage</h3>
            <p className="text-2xl font-semibold text-white mb-1">0 B</p>
            <p className="text-[13px] text-gray-500">Internal Storage</p>
          </div>
        </div>

        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex gap-4">
          <div className="mt-1 text-gray-400">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-1">External Assets</h3>
            <p className="text-2xl font-semibold text-white mb-1">0</p>
            <p className="text-[13px] text-gray-500">External Assets</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-white bg-white/10 rounded-full border border-white/10">All types</button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">Video</button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">Document</button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">Image</button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">Audio</button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">Other</button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assets" 
              className="h-9 pl-9 pr-4 bg-[#09090b] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20 transition-colors w-48 placeholder:text-gray-500"
            />
          </div>
          <select className="h-9 px-3 bg-[#09090b] border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors appearance-none pr-8">
            <option>All statuses</option>
          </select>
          <button className="h-9 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex items-center justify-center pt-4">
        <div className="w-[800px] h-[400px] border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
            <Video className="w-6 h-6 text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No assets found</h2>
          <p className="text-[13px] text-gray-400 mb-2 max-w-[300px] leading-relaxed">
            The asset does not exist or is not available in this organization.
          </p>
        </div>
      </div>
    </div>
  )
}
