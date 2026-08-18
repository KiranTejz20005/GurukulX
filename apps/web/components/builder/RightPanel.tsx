"use client"

import { Sparkles, SlidersHorizontal, Eye, Lock, Trash2, Check, Copy, Loader2, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

export function RightPanel({
  course,
  activeModuleId,
  setActiveModuleId,
  activeLessonId,
  setActiveLessonId,
  onUpdate
}: {
  course: any,
  activeModuleId: string | null,
  setActiveModuleId: (id: string | null) => void,
  activeLessonId: string | null,
  setActiveLessonId: (id: string | null) => void,
  onUpdate: () => void
}) {
  const [activeTab, setActiveTab] = useState<'settings' | 'ai'>('settings')
  const [slug, setSlug] = useState("")
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false)

  // AI Assistant states
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isAiGenerating, setIsAiGenerating] = useState(false)

  const activeModule = course?.modules?.find((m: any) => m.id === activeModuleId)
  const activeLesson = activeLessonId ? activeModule?.lessons?.find((l: any) => l.id === activeLessonId) : null

  const isPublished = activeLesson ? Boolean(activeLesson.isPublished) : Boolean(course?.published)

  useEffect(() => {
    const currentTitle = activeLesson?.title || activeModule?.title || course?.title || "lesson"
    setSlug(currentTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }, [activeLesson, activeModule, course])

  const handleToggleVisibility = async (published: boolean) => {
    setIsUpdatingVisibility(true)
    try {
      if (activeLessonId && activeModuleId) {
        await api.lessons.update(activeModuleId, activeLessonId, { isPublished: published })
      } else if (course?.id) {
        await api.courses.update(course.id, { published })
      }
      onUpdate()
    } catch (e) {
      console.error("Failed to update visibility", e)
    } finally {
      setIsUpdatingVisibility(false)
    }
  }

  const handleDeleteItem = async () => {
    if (activeLessonId && activeModuleId) {
      if (!confirm("Are you sure you want to delete this lesson?")) return
      try {
        await api.lessons.delete(activeModuleId, activeLessonId)
        setActiveLessonId(null)
        onUpdate()
      } catch (err) {
        console.error("Failed to delete lesson", err)
      }
    } else if (activeModuleId && course?.id) {
      if (!confirm("Are you sure you want to delete this module and all its contents?")) return
      try {
        await api.modules.delete(course.id, activeModuleId)
        setActiveModuleId(null)
        setActiveLessonId(null)
        onUpdate()
      } catch (err) {
        console.error("Failed to delete module", err)
      }
    }
  }

  const handleRunAi = (customPrompt?: string) => {
    const query = customPrompt || aiPrompt
    if (!query.trim()) return
    setIsAiGenerating(true)
    setAiResponse(null)

    setTimeout(() => {
      const topic = activeLesson?.title || activeModule?.title || "this lesson"
      let generated = ""

      if (query.includes("summary")) {
        generated = `### Overview: ${topic}\nIn this section, students will gain comprehensive knowledge regarding ${topic}. Key topics covered include step-by-step practical examples, foundational principles, and industry best practices.`
      } else if (query.includes("quiz")) {
        generated = `### Quiz Questions for ${topic}:\n\n1. What is the primary objective of ${topic}?\n   - A) Core execution\n   - B) Initial setup\n   - C) System optimization\n   - Correct Answer: A\n\n2. Which strategy yields optimal performance?\n   - A) Sequential processing\n   - B) Parallel execution\n   - Correct Answer: B`
      } else {
        generated = `### Guide: ${topic}\n\nHere is a structured breakdown for **${topic}**:\n\n1. **Introduction**: Understanding the prerequisites and core concepts.\n2. **Implementation**: Step-by-step walk-through of the process.\n3. **Summary**: Reviewing outcomes and next steps.`
      }

      setAiResponse(generated)
      setIsAiGenerating(false)
    }, 1000)
  }

  const handleAppendAiToContent = async () => {
    if (!aiResponse || !activeModuleId) return
    try {
      if (activeLessonId && activeLesson) {
        const updatedContent = (activeLesson.content || "") + "\n\n" + aiResponse
        await api.lessons.update(activeModuleId, activeLessonId, { content: updatedContent })
      } else if (activeModule) {
        const updatedDesc = (activeModule.description || "") + "\n\n" + aiResponse
        await api.modules.update(course.id, activeModuleId, { description: updatedDesc })
      }
      onUpdate()
      setAiResponse(null)
      setAiPrompt("")
    } catch (err) {
      console.error("Failed to append AI text", err)
    }
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full flex-shrink-0 text-foreground shadow-sm">
      {/* Header Tabs */}
      <div className="h-14 border-b border-border flex items-center px-2 shrink-0 bg-background/50 backdrop-blur">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center gap-2 h-10 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'settings' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Properties
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-2 h-10 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'ai' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          AI Tutor
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'settings' ? (
          <div className="p-5 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visibility</label>
              <div className="space-y-2 mt-2">
                <button 
                  onClick={() => handleToggleVisibility(true)}
                  disabled={isUpdatingVisibility}
                  className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all ${
                    isPublished ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border bg-background hover:bg-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Eye className={`w-4 h-4 ${isPublished ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Published</p>
                      <p className="text-[11px] text-muted-foreground">Visible to enrolled students</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isPublished ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                    {isPublished && <Check className="w-2.5 h-2.5" />}
                  </div>
                </button>

                <button 
                  onClick={() => handleToggleVisibility(false)}
                  disabled={isUpdatingVisibility}
                  className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all ${
                    !isPublished ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border bg-background hover:bg-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Lock className={`w-4 h-4 ${!isPublished ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Draft</p>
                      <p className="text-[11px] text-muted-foreground">Only visible to instructors</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!isPublished ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                    {!isPublished && <Check className="w-2.5 h-2.5" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL Slug</label>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-[11px] text-muted-foreground">Changing this updates the direct permalink.</p>
            </div>
            
            {(activeModuleId || activeLessonId) && (
              <div className="space-y-2 pt-4 border-t border-border">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteItem}
                  className="w-full text-xs gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete {activeLessonId ? 'Lesson' : 'Module'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full p-4 space-y-4">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-xs text-foreground space-y-2">
              <p className="flex items-center gap-2 font-semibold text-purple-400">
                <Sparkles className="w-4 h-4" /> AI Content Assistant
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Generate lesson outlines, quiz questions, or summaries based on your active selection.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase">Suggested Prompts</p>
              <div className="flex flex-wrap gap-1.5">
                <button 
                  onClick={() => handleRunAi("Write a summary")}
                  className="text-xs px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-accent text-foreground transition-colors"
                >
                  ✨ Summarize Topic
                </button>
                <button 
                  onClick={() => handleRunAi("Create quiz questions")}
                  className="text-xs px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-accent text-foreground transition-colors"
                >
                  📝 Generate Quiz
                </button>
              </div>
            </div>

            {/* Response Box */}
            {isAiGenerating && (
              <div className="p-4 border border-border rounded-xl bg-background flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                Generating content...
              </div>
            )}

            {aiResponse && (
              <div className="p-3 border border-purple-500/30 rounded-xl bg-background text-xs space-y-3">
                <div className="whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto text-foreground font-mono text-[11px]">
                  {aiResponse}
                </div>
                <button 
                  onClick={handleAppendAiToContent}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Insert into Editor
                </button>
              </div>
            )}

            {/* Input Form */}
            <div className="mt-auto pt-2">
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask AI to write content, examples, or questions..." 
                className="w-full bg-background border border-border rounded-lg p-2.5 text-xs min-h-[70px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-muted-foreground mb-2"
              />
              <Button 
                onClick={() => handleRunAi()}
                disabled={isAiGenerating || !aiPrompt.trim()}
                className="w-full text-xs gap-2 bg-purple-600 hover:bg-purple-700 text-white" 
                size="sm"
              >
                {isAiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate with AI
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
