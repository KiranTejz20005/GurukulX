import { Settings, Layers, PlayCircle, Share, Home, LayoutList, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function LeftPanel() {
  return (
    <div className="w-64 border-r border-white/10 bg-[#09090b] flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
          <Home className="w-4 h-4" />
          Exit Builder
        </Link>
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-white/10 rounded-lg">
          <LayoutList className="w-4 h-4" />
          Curriculum
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Share className="w-4 h-4" />
          Publish
        </button>
      </div>

      <div className="px-6 py-2 mt-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Modules</p>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors group">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            <span className="truncate">Introduction</span>
          </div>
        </button>
        <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors group">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            <span className="truncate">Core Concepts</span>
          </div>
        </button>
        <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors group">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            <span className="truncate">Advanced Topics</span>
          </div>
        </button>
        
        <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-500 border border-blue-500/20 rounded-lg hover:bg-blue-500/10 transition-colors">
          + Add Module
        </button>
      </div>
    </div>
  )
}
