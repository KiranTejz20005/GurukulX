import { GripVertical, FileText, Video, HelpCircle, FileCheck, MoreVertical, Plus } from "lucide-react"
import { api } from "@/lib/api"
import { useState } from "react"

export function MiddlePanel({ course, activeModuleId, onUpdate }: { course: any, activeModuleId: string | null, onUpdate: () => void }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newLessonTitle, setNewLessonTitle] = useState("")

  const activeModule = course?.modules?.find((m: any) => m.id === activeModuleId)

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim() || !activeModuleId) return
    setIsAdding(true)
    try {
      await api.lessons.create(activeModuleId, { title: newLessonTitle, type: 'TEXT' })
      setNewLessonTitle("")
      onUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setIsAdding(false)
    }
  }

  if (!activeModule) {
    return (
      <div className="w-80 border-r border-white/10 bg-[#09090b] flex flex-col h-full flex-shrink-0 items-center justify-center text-gray-500">
        <p>Select a module to view lessons</p>
      </div>
    )
  }

  return (
    <div className="w-80 border-r border-white/10 bg-[#09090b] flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-5 shrink-0">
        <h2 className="text-sm font-semibold text-white truncate pr-2">{activeModule.title}</h2>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeModule.lessons?.map((lesson: any) => (
          <div key={lesson.id} className="bg-[#18181b] border border-white/10 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500/50 transition-colors group relative">
            <div className="cursor-grab text-gray-600 group-hover:text-gray-400">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
              {lesson.type === 'VIDEO' ? <Video className="w-4 h-4 text-blue-500" /> : 
               lesson.type === 'QUIZ' ? <HelpCircle className="w-4 h-4 text-purple-500" /> :
               <FileText className="w-4 h-4 text-gray-300" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
              <p className="text-xs text-gray-500 truncate">{lesson.type}</p>
            </div>
          </div>
        ))}

        {activeModule.lessons?.length === 0 && (
          <p className="text-xs text-center text-gray-500 mt-10">No lessons yet</p>
        )}
      </div>
      
      {/* Footer Add Buttons */}
      <div className="p-4 border-t border-white/10">
        <input 
          type="text" 
          placeholder="New Lesson Title..." 
          value={newLessonTitle}
          onChange={(e) => setNewLessonTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddLesson()}
          className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white mb-2 focus:outline-none focus:border-blue-500"
        />
        <button 
          onClick={handleAddLesson}
          disabled={isAdding || !newLessonTitle.trim()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus className="w-4 h-4" /> Add Lesson
        </button>
      </div>
    </div>
  )
}
