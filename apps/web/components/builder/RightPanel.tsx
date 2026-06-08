import { Eye, Save, Type, Image as ImageIcon, Video, Code, AlignLeft } from "lucide-react"

export function RightPanel() {
  return (
    <div className="flex-1 bg-background flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium px-2.5 py-1 bg-white/10 text-gray-300 rounded-full">Draft</span>
          <p className="text-sm text-gray-400">Last saved just now</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-12 px-8">
          <input 
            type="text" 
            placeholder="Lesson Title..." 
            defaultValue="Reading Materials"
            className="w-full text-4xl font-bold bg-transparent text-white focus:outline-none placeholder:text-gray-700 mb-8"
          />

          {/* Floating Toolbar Placeholder */}
          <div className="flex items-center gap-1 mb-6 p-1 border border-white/10 rounded-lg bg-[#09090b] w-fit">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"><Type className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"><AlignLeft className="w-4 h-4" /></button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"><ImageIcon className="w-4 h-4" /></button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"><Video className="w-4 h-4" /></button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"><Code className="w-4 h-4" /></button>
          </div>

          <div className="prose prose-invert max-w-none">
            <textarea 
              rows={20}
              placeholder="Start writing or type '/' for commands..."
              defaultValue="Welcome to the reading materials for this module. In this section, we will cover the core fundamentals necessary to understand the subsequent video lessons. \n\nPlease read through the attached PDF document."
              className="w-full text-base bg-transparent text-gray-300 focus:outline-none placeholder:text-gray-700 resize-none leading-relaxed"
            />
          </div>

          {/* Upload Zone */}
          <div className="mt-8 border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-blue-500/50 transition-colors cursor-pointer group bg-[#09090b]">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-blue-500/10 transition-colors">
              <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <p className="text-sm font-medium text-white mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or PDF (max. 10MB)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
