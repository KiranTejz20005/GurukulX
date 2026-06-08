"use client"

import { MoreVertical, Save, RefreshCw, HelpCircle, Eye, Settings, FileText, Image as ImageIcon, Video } from "lucide-react"
import { api } from "@/lib/api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function MiddlePanel({ 
  course, 
  activeModuleId, 
  activeLessonId,
  onUpdate 
}: { 
  course: any, 
  activeModuleId: string | null, 
  activeLessonId: string | null,
  onUpdate: () => void 
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")

  const activeModule = course?.modules?.find((m: any) => m.id === activeModuleId)
  const activeLesson = activeLessonId ? activeModule?.lessons?.find((l: any) => l.id === activeLessonId) : null

  // Update local state when selection changes
  useEffect(() => {
    if (activeLesson) {
      setTitle(activeLesson.title)
      setContent(activeLesson.content || "")
    } else if (activeModule) {
      setTitle(activeModule.title)
      setContent(activeModule.description || "")
    }
  }, [activeLessonId, activeModuleId, course])

  const handleSave = async () => {
    if (!activeModuleId) return
    setIsSaving(true)
    try {
      if (activeLessonId) {
        await api.lessons.update(activeModuleId, activeLessonId, { title, content })
      } else {
        await api.modules.update(course.id, activeModuleId, { title, description: content })
      }
      onUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  if (!activeModule) {
    return (
      <div className="flex-1 bg-background flex flex-col h-full items-center justify-center text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 opacity-20" />
        </div>
        <p className="font-medium text-foreground">No Item Selected</p>
        <p className="text-sm">Select a module or lesson from the curriculum</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background flex flex-col h-full relative">
      {/* Editor Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary uppercase tracking-wider">
            {activeLessonId ? 'LESSON' : 'MODULE'}
          </span>
          <span className="text-sm font-medium text-muted-foreground ml-2">Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
            <Eye className="w-4 h-4 mr-2" /> Preview
          </Button>
          <Button 
            size="sm" 
            className="h-8" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-12 px-8">
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${activeLessonId ? 'Lesson' : 'Module'} Title`}
            className="w-full text-4xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30 mb-8"
          />

          {/* Simple Rich Text Editor Mockup */}
          <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 border-b border-border p-2 bg-muted/20 overflow-x-auto">
              <select className="h-8 px-2 bg-transparent text-sm border-none outline-none cursor-pointer hover:bg-accent rounded text-foreground">
                <option>Paragraph</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
              </select>
              <div className="w-px h-4 bg-border mx-2" />
              <button className="p-1.5 rounded hover:bg-accent text-foreground font-bold font-serif w-8 h-8">B</button>
              <button className="p-1.5 rounded hover:bg-accent text-foreground italic font-serif w-8 h-8">I</button>
              <button className="p-1.5 rounded hover:bg-accent text-foreground underline font-serif w-8 h-8">U</button>
              <div className="w-px h-4 bg-border mx-2" />
              <button className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </button>
            </div>
            
            {/* Text Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing content or type '/' for commands..."
              className="w-full min-h-[500px] p-6 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/50 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
