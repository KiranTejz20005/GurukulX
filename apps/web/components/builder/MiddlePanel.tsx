"use client"

import { Save, RefreshCw, Eye, FileText, Image as ImageIcon, Video, HelpCircle, Check, PlayCircle, Sparkles, Share2 } from "lucide-react"
import { api } from "@/lib/api"
import { useState, useEffect, useRef } from "react"
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
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [lessonType, setLessonType] = useState<'TEXT' | 'VIDEO' | 'QUIZ' | 'ASSIGNMENT'>('TEXT')
  const [isPreview, setIsPreview] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeModule = course?.modules?.find((m: any) => m.id === activeModuleId)
  const activeLesson = activeLessonId ? activeModule?.lessons?.find((l: any) => l.id === activeLessonId) : null

  // Sync state when selection changes
  useEffect(() => {
    if (activeLesson) {
      setTitle(activeLesson.title || "")
      setContent(activeLesson.content || "")
      setVideoUrl(activeLesson.videoUrl || "")
      setLessonType(activeLesson.type || 'TEXT')
    } else if (activeModule) {
      setTitle(activeModule.title || "")
      setContent(activeModule.description || "")
      setVideoUrl("")
      setLessonType('TEXT')
    }
    setIsPreview(false)
  }, [activeLessonId, activeModuleId, course])

  const handleSave = async () => {
    if (!activeModuleId) return
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      if (activeLessonId) {
        await api.lessons.update(activeModuleId, activeLessonId, { 
          title, 
          content,
          videoUrl: lessonType === 'VIDEO' ? videoUrl : undefined,
          type: lessonType
        })
      } else {
        await api.modules.update(course.id, activeModuleId, { 
          title, 
          description: content 
        })
      }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      onUpdate()
    } catch (e) {
      console.error("Failed to save editor content", e)
    } finally {
      setIsSaving(false)
    }
  }

  // Formatting helper for text toolbar
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end) || "text"
    const replacement = `${prefix}${selectedText}${suffix}`

    const newContent = text.substring(0, start) + replacement + text.substring(end)
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length)
    }, 50)
  }

  const handleInsertImage = () => {
    const url = prompt("Enter Image URL:", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800")
    if (url) {
      insertFormatting(`\n![Image](${url})\n`)
    }
  }

  const handleInsertVideo = () => {
    const url = prompt("Enter Video Stream or Embed URL:", "https://www.youtube.com/embed/dQw4w9WgXcQ")
    if (url) {
      setVideoUrl(url)
      setLessonType('VIDEO')
      insertFormatting(`\n[Video](${url})\n`)
    }
  }

  if (!activeModule) {
    return (
      <div className="flex-1 bg-background flex flex-col h-full items-center justify-center text-muted-foreground p-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
          <FileText className="w-8 h-8" />
        </div>
        <p className="font-semibold text-lg text-foreground mb-1">No Item Selected</p>
        <p className="text-sm text-center max-w-sm">Select a module or lesson from the left panel curriculum to begin editing.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background flex flex-col h-full relative text-foreground">
      {/* Editor Top Bar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary uppercase tracking-wider">
            {activeLessonId ? lessonType : 'MODULE'}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {activeLesson ? (activeLesson.isPublished ? 'Published' : 'Draft') : 'Draft'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => {
              const shareUrl = `${window.location.origin}/gurukulx/course/${course?.slug || course?.id}`
              navigator.clipboard.writeText(shareUrl)
              alert(`Course share link copied!\n${shareUrl}`)
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Link
          </Button>

          <Button 
            variant={isPreview ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8 text-xs gap-1.5"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="w-3.5 h-3.5" /> 
            {isPreview ? "Edit Mode" : "Preview"}
          </Button>

          <Button 
            size="sm" 
            className="h-8 text-xs gap-1.5" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : saveSuccess ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Save className="w-3.5 h-3.5" />}
            {saveSuccess ? "Saved!" : "Save Draft"}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-10 px-8 space-y-6">
          {/* Title Input */}
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${activeLessonId ? 'Lesson' : 'Module'} Title...`}
            className="w-full text-3xl font-bold bg-transparent border-b border-transparent focus:border-border outline-none text-foreground placeholder:text-muted-foreground/40 pb-2 transition-colors"
          />

          {/* Lesson Type Selector (If editing a lesson) */}
          {activeLessonId && (
            <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border text-xs">
              <span className="text-muted-foreground font-medium px-2">Type:</span>
              <button 
                onClick={() => setLessonType('TEXT')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${lessonType === 'TEXT' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
              >
                Text Lesson
              </button>
              <button 
                onClick={() => setLessonType('VIDEO')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${lessonType === 'VIDEO' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
              >
                Video Lesson
              </button>
              <button 
                onClick={() => setLessonType('QUIZ')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${lessonType === 'QUIZ' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
              >
                Interactive Quiz
              </button>
            </div>
          )}

          {/* Video URL Input if Video Lesson */}
          {activeLessonId && lessonType === 'VIDEO' && (
            <div className="p-4 border border-border rounded-xl bg-card space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4 text-primary" /> Video Streaming URL
              </label>
              <input 
                type="text" 
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          {/* Editor Box or Preview Mode */}
          {isPreview ? (
            <div className="border border-border rounded-xl bg-card p-8 min-h-[400px] prose dark:prose-invert max-w-none shadow-sm">
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
              {videoUrl && (
                <div className="mb-6 aspect-video rounded-xl overflow-hidden bg-black border border-border flex items-center justify-center">
                  <iframe src={videoUrl} className="w-full h-full" allowFullScreen />
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {content || <span className="text-muted-foreground italic">No content added yet.</span>}
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 border-b border-border p-2 bg-muted/20 overflow-x-auto text-xs">
                <button 
                  onClick={() => insertFormatting("# ")}
                  className="px-2 py-1 rounded hover:bg-accent text-foreground font-semibold hover:text-primary transition-colors"
                >
                  H1
                </button>
                <button 
                  onClick={() => insertFormatting("## ")}
                  className="px-2 py-1 rounded hover:bg-accent text-foreground font-semibold hover:text-primary transition-colors"
                >
                  H2
                </button>

                <div className="w-px h-4 bg-border mx-1" />

                <button 
                  onClick={() => insertFormatting("**", "**")}
                  className="p-1.5 rounded hover:bg-accent text-foreground font-bold w-7 h-7 flex items-center justify-center"
                  title="Bold"
                >
                  B
                </button>
                <button 
                  onClick={() => insertFormatting("*", "*")}
                  className="p-1.5 rounded hover:bg-accent text-foreground italic w-7 h-7 flex items-center justify-center"
                  title="Italic"
                >
                  I
                </button>
                <button 
                  onClick={() => insertFormatting("<u>", "</u>")}
                  className="p-1.5 rounded hover:bg-accent text-foreground underline w-7 h-7 flex items-center justify-center"
                  title="Underline"
                >
                  U
                </button>

                <div className="w-px h-4 bg-border mx-1" />

                <button 
                  onClick={handleInsertImage}
                  className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground w-7 h-7 flex items-center justify-center"
                  title="Insert Image"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handleInsertVideo}
                  className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground w-7 h-7 flex items-center justify-center"
                  title="Insert Video Link"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Text Area */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing rich lesson content, module overview, or paste materials..."
                className="w-full min-h-[450px] p-6 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/40 leading-relaxed text-sm font-sans"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
