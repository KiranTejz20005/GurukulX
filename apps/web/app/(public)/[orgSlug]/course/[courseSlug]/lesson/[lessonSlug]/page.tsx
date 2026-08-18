"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Menu, PlayCircle, FileText, CheckCircle2, HelpCircle, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { api } from "@/lib/api"

export default function LessonViewerPage({ params }: { params: Promise<{ orgSlug: string, courseSlug: string, lessonSlug: string }> }) {
  const { orgSlug, courseSlug, lessonSlug } = React.use(params)

  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [course, setCourse] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [completedLessons, setCompletedLessons] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    if (!courseSlug) return
    api.courses.getOne(courseSlug)
      .then((data) => {
        setCourse(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load course for lesson viewer", err)
        setLoading(false)
      })
  }, [courseSlug])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen bg-background items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading lesson content...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen bg-background flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Lesson Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested course or lesson content is unavailable.</p>
        <Link href={`/${orgSlug}`} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
          Return to Catalog
        </Link>
      </div>
    )
  }

  const modules = course.modules || []

  // Flatten all lessons into a list to determine active, previous, and next lessons
  const allLessons: { lesson: any, moduleId: string }[] = []
  modules.forEach((mod: any) => {
    (mod.lessons || []).forEach((l: any) => {
      allLessons.push({ lesson: l, moduleId: mod.id })
    })
  })

  // Find active lesson by ID or slug match, or default to first
  const activeItem = allLessons.find(item => item.lesson.id === lessonSlug || item.lesson.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === lessonSlug) || allLessons[0]
  const activeLesson = activeItem?.lesson

  const currentIndex = allLessons.findIndex(item => item.lesson.id === activeLesson?.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1]?.lesson : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1]?.lesson : null

  const isCompleted = activeLesson?.id ? Boolean(completedLessons[activeLesson.id]) : false

  const toggleComplete = () => {
    if (!activeLesson?.id) return
    setCompletedLessons(prev => ({
      ...prev,
      [activeLesson.id]: !prev[activeLesson.id]
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen bg-background overflow-hidden text-foreground font-sans">
      
      {/* Left Sidebar - Course Curriculum */}
      <div className={`${sidebarOpen ? 'w-[320px]' : 'w-0'} flex-shrink-0 border-r border-border bg-card flex flex-col transition-all duration-300 overflow-hidden`}>
        <div className="h-14 border-b border-border flex items-center px-4 shrink-0 bg-background/50 justify-between">
          <Link href={`/${orgSlug}/course/${course.id}`} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Course Overview
          </Link>
        </div>
        
        <div className="p-4 border-b border-border bg-muted/20 shrink-0 space-y-2">
          <h2 className="font-bold text-sm text-foreground line-clamp-2">{course.title}</h2>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${allLessons.length > 0 ? Math.round((Object.keys(completedLessons).length / allLessons.length) * 100) : 0}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {allLessons.length > 0 ? Math.round((Object.keys(completedLessons).length / allLessons.length) * 100) : 0}% Complete
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {modules.map((mod: any, i: number) => {
            const modLessons = mod.lessons || []
            return (
              <div key={mod.id || i} className="border-b border-border/40">
                <div className="px-4 py-2.5 bg-muted/30 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  {mod.title}
                </div>
                <div className="divide-y divide-border/30">
                  {modLessons.map((lesson: any) => {
                    const isActive = lesson.id === activeLesson?.id
                    const lessonIsCompleted = Boolean(completedLessons[lesson.id])
                    return (
                      <Link 
                        key={lesson.id} 
                        href={`/${orgSlug}/course/${course.id}/lesson/${lesson.id}`}
                        className={`flex items-start gap-3 p-3 text-xs transition-colors ${
                          isActive ? 'bg-primary/10 border-l-4 border-primary font-medium text-primary' : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {lessonIsCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : lesson.type === 'VIDEO' ? (
                            <PlayCircle className="w-4 h-4 text-primary" />
                          ) : (
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-foreground font-medium">{lesson.title}</p>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{lesson.type || 'TEXT'}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Lesson Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        
        {/* Top Navbar Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-semibold text-xs md:text-sm text-foreground truncate max-w-md">
              {activeLesson?.title || "Lesson Viewer"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleComplete}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isCompleted 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/30' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {isCompleted ? "Completed ✓" : "Mark as Complete"}
            </button>
          </div>
        </header>

        {/* Lesson Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {!activeLesson ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8 space-y-3">
              <FileText className="w-10 h-10 opacity-30" />
              <p className="font-medium text-sm text-foreground">No lesson content selected.</p>
              <p className="text-xs">Select a lesson from the left curriculum sidebar to view.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header Title */}
              <div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-primary/10 text-primary uppercase tracking-wider">
                  {activeLesson.type || 'TEXT'} LESSON
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mt-3 leading-tight">
                  {activeLesson.title}
                </h1>
              </div>

              {/* Video Player if Lesson type is VIDEO */}
              {activeLesson.type === 'VIDEO' && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-border shadow-lg relative">
                  {activeLesson.videoUrl ? (
                    activeLesson.videoUrl.includes('youtube.com') || activeLesson.videoUrl.includes('embed') ? (
                      <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen />
                    ) : (
                      <video src={activeLesson.videoUrl} controls className="w-full h-full object-contain" />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 p-6">
                      <PlayCircle className="w-12 h-12 text-primary opacity-60" />
                      <p className="text-xs">Video content stream ready.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Text Lesson Content */}
              <div className="border border-border rounded-2xl bg-card p-6 md:p-8 space-y-4 shadow-xs">
                <div className="whitespace-pre-wrap leading-relaxed text-sm text-foreground">
                  {activeLesson.content || <span className="text-muted-foreground italic">No detailed content provided for this lesson yet.</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav Controls */}
        <footer className="h-14 border-t border-border bg-card px-6 flex items-center justify-between shrink-0">
          <div>
            {prevLesson && (
              <Link 
                href={`/${orgSlug}/course/${course.id}/lesson/${prevLesson.id}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous: {prevLesson.title}
              </Link>
            )}
          </div>

          <div>
            {nextLesson && (
              <Link 
                href={`/${orgSlug}/course/${course.id}/lesson/${nextLesson.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
              >
                Next Lesson: {nextLesson.title} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
