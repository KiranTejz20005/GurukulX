import { GripVertical, FileText, Video, HelpCircle, FileCheck, MoreVertical } from "lucide-react"

export function MiddlePanel() {
  return (
    <div className="w-80 border-r border-white/10 bg-[#09090b] flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-5 shrink-0">
        <h2 className="text-sm font-semibold text-white">Introduction</h2>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Lesson Item */}
        <div className="bg-[#18181b] border border-white/10 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500/50 transition-colors group relative">
          <div className="cursor-grab text-gray-600 group-hover:text-gray-400">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Video className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Welcome to the Course</p>
            <p className="text-xs text-gray-500 truncate">Video • 2:45</p>
          </div>
        </div>

        {/* Lesson Item (Active) */}
        <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3 flex items-center gap-3 cursor-pointer group relative">
          <div className="cursor-grab text-gray-600 group-hover:text-gray-400">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Reading Materials</p>
            <p className="text-xs text-gray-500 truncate">Text</p>
          </div>
        </div>

        {/* Lesson Item */}
        <div className="bg-[#18181b] border border-white/10 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500/50 transition-colors group relative">
          <div className="cursor-grab text-gray-600 group-hover:text-gray-400">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Initial Assessment</p>
            <p className="text-xs text-gray-500 truncate">Quiz • 5 Questions</p>
          </div>
        </div>

      </div>
      
      {/* Footer Add Buttons */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          + Add Lesson
        </button>
      </div>
    </div>
  )
}
