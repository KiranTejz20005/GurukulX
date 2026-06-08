import { Settings, Layers, PlayCircle, Share, Home, LayoutList, CheckCircle2, Plus } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useState } from "react"

export function LeftPanel({ course, activeModuleId, setActiveModuleId, onUpdate }: { course: any, activeModuleId: string | null, setActiveModuleId: (id: string) => void, onUpdate: () => void }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState("")

  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || !course?.id) return
    setIsAdding(true)
    try {
      await api.modules.create(course.id, { title: newModuleTitle })
      setNewModuleTitle("")
      onUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setIsAdding(false)
    }
  }

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

      <div className="px-6 py-2 mt-2 flex justify-between items-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Modules</p>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {course?.modules?.map((mod: any) => (
          <button 
            key={mod.id} 
            onClick={() => setActiveModuleId(mod.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors group ${activeModuleId === mod.id ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'}`}>
            <div className="flex items-center gap-3">
              <Layers className={`w-4 h-4 transition-colors ${activeModuleId === mod.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
              <span className="truncate">{mod.title}</span>
            </div>
          </button>
        ))}

        <div className="mt-4 px-1">
          <input 
            type="text" 
            placeholder="New Module Title..." 
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
            className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white mb-2 focus:outline-none focus:border-blue-500"
          />
          <button 
            onClick={handleAddModule}
            disabled={isAdding || !newModuleTitle.trim()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-500 border border-blue-500/20 rounded-lg hover:bg-blue-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" /> Add Module
          </button>
        </div>
      </div>
    </div>
  )
}
