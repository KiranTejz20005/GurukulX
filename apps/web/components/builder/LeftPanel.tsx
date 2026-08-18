"use client"

import { Settings, Share, Home, LayoutList, Plus, GripVertical, ChevronDown, FileText, Trash2, CheckCircle2, Globe, EyeOff, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"

export function LeftPanel({ 
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
  const [activeTab, setActiveTab] = useState<'curriculum' | 'settings' | 'publish'>('curriculum')
  const [isAdding, setIsAdding] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState("")
  const [modules, setModules] = useState<any[]>([])
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

  // Course Settings form state
  const [courseTitle, setCourseTitle] = useState(course?.title || "")
  const [courseDesc, setCourseDesc] = useState(course?.description || "")
  const [isSavingCourse, setIsSavingCourse] = useState(false)
  const [courseSaveSuccess, setCourseSaveSuccess] = useState(false)
  const [shareUrl, setShareUrl] = useState(`http://localhost:3000/demo/course/${course?.id || ""}`)

  useEffect(() => {
    if (typeof window !== 'undefined' && course?.id) {
      setShareUrl(`${window.location.origin}/demo/course/${course.id}`)
    }
  }, [course?.id])

  useEffect(() => {
    if (course?.modules) {
      setModules(course.modules)
      // Auto expand active module
      if (activeModuleId) {
        setExpandedModules(prev => ({ ...prev, [activeModuleId]: true }))
      }
    }
    if (course) {
      setCourseTitle(course.title || "")
      setCourseDesc(course.description || "")
    }
  }, [course, activeModuleId])

  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || !course?.id) return
    setIsAdding(true)
    try {
      const created = await api.modules.create(course.id, { title: newModuleTitle.trim() })
      setNewModuleTitle("")
      if (created?.id) {
        setActiveModuleId(created.id)
        setActiveLessonId(null)
        setExpandedModules(prev => ({ ...prev, [created.id]: true }))
      }
      onUpdate()
    } catch (e) {
      console.error("Failed to add module", e)
    } finally {
      setIsAdding(false)
    }
  }

  const handleAddLesson = async (moduleId: string) => {
    try {
      const created = await api.lessons.create(moduleId, { title: "New Lesson", type: 'TEXT' })
      if (created?.id) {
        setActiveModuleId(moduleId)
        setActiveLessonId(created.id)
        setExpandedModules(prev => ({ ...prev, [moduleId]: true }))
      }
      onUpdate()
    } catch (e) {
      console.error("Failed to add lesson", e)
    }
  }

  const handleDeleteModule = async (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this module and all its lessons?")) return
    try {
      await api.modules.delete(course.id, moduleId)
      if (activeModuleId === moduleId) {
        setActiveModuleId(null)
        setActiveLessonId(null)
      }
      onUpdate()
    } catch (err) {
      console.error("Failed to delete module", err)
    }
  }

  const handleDeleteLesson = async (e: React.MouseEvent, moduleId: string, lessonId: string) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this lesson?")) return
    try {
      await api.lessons.delete(moduleId, lessonId)
      if (activeLessonId === lessonId) {
        setActiveLessonId(null)
      }
      onUpdate()
    } catch (err) {
      console.error("Failed to delete lesson", err)
    }
  }

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    if (result.type === 'module') {
      const items = Array.from(modules)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setModules(items)

      // Persist order in API
      try {
        await Promise.all(items.map((mod, idx) => api.modules.reorder(course.id, mod.id, idx)))
        onUpdate()
      } catch (err) {
        console.error("Failed to reorder modules", err)
      }
    }
  }

  const handleSaveCourseSettings = async () => {
    if (!course?.id) return
    setIsSavingCourse(true)
    setCourseSaveSuccess(false)
    try {
      await api.courses.update(course.id, {
        title: courseTitle,
        description: courseDesc
      })
      setCourseSaveSuccess(true)
      setTimeout(() => setCourseSaveSuccess(false), 2000)
      onUpdate()
    } catch (err) {
      console.error("Failed to update course settings", err)
    } finally {
      setIsSavingCourse(false)
    }
  }

  const handleToggleCoursePublish = async () => {
    if (!course?.id) return
    try {
      await api.courses.update(course.id, {
        published: !course.published
      })
      onUpdate()
    } catch (err) {
      console.error("Failed to publish course", err)
    }
  }

  return (
    <div className="w-72 border-r border-border bg-card flex flex-col h-full flex-shrink-0 text-foreground shadow-sm">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center px-4 shrink-0 bg-background/50 backdrop-blur">
        <Link href="/courses" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Home className="w-4 h-4" />
          Exit Builder
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="p-3 space-y-1 border-b border-border bg-muted/20">
        <button 
          onClick={() => setActiveTab('curriculum')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'curriculum' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          Curriculum
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'settings' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          Course Settings
        </button>
        <button 
          onClick={() => setActiveTab('publish')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'publish' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
          }`}
        >
          <Share className="w-4 h-4" />
          Publish & Share
        </button>
      </div>

      {/* Content depending on tab */}
      {activeTab === 'curriculum' && (
        <>
          <div className="px-4 py-2 mt-2 flex justify-between items-center shrink-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Modules ({modules.length})</p>
          </div>

          {/* Modules List with DnD */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="modules" type="module">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2.5">
                    {modules.map((mod: any, index: number) => {
                      const isExpanded = expandedModules[mod.id]
                      const isModuleActive = activeModuleId === mod.id && !activeLessonId

                      return (
                        <Draggable key={mod.id} draggableId={mod.id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={provided.draggableProps.style as any}
                              className={`bg-background border rounded-xl overflow-hidden shadow-sm transition-all ${
                                snapshot.isDragging ? 'ring-2 ring-primary shadow-md scale-[1.02]' : 'border-border hover:border-border/80'
                              }`}
                            >
                              <div className={`w-full flex items-center px-2 py-2 text-sm group ${
                                isModuleActive ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-accent/50'
                              }`}>
                                <div 
                                  {...provided.dragHandleProps}
                                  className="p-1 text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing rounded"
                                >
                                  <GripVertical className="w-3.5 h-3.5" />
                                </div>
                                <button 
                                  className="flex-1 flex items-center gap-2 pl-1 py-1 text-left min-w-0"
                                  onClick={() => {
                                    setActiveModuleId(mod.id)
                                    setActiveLessonId(null)
                                    if (!isExpanded) toggleModule(mod.id)
                                  }}
                                >
                                  <span className={`font-medium truncate text-xs ${
                                    isModuleActive ? 'text-primary font-semibold' : 'text-foreground'
                                  }`}>
                                    {mod.title}
                                  </span>
                                </button>

                                <button 
                                  title="Delete Module"
                                  onClick={(e) => handleDeleteModule(e, mod.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all mr-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <button 
                                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-transform"
                                  onClick={() => toggleModule(mod.id)}
                                >
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                                </button>
                              </div>

                              {isExpanded && (
                                <div className="bg-muted/15 border-t border-border p-2 space-y-1">
                                  {(!mod.lessons || mod.lessons.length === 0) ? (
                                    <div className="pl-6 py-1.5 text-xs text-muted-foreground/70 italic flex items-center gap-2">
                                      No lessons in this module.
                                    </div>
                                  ) : (
                                    mod.lessons.map((lesson: any) => {
                                      const isLessonActive = activeLessonId === lesson.id
                                      return (
                                        <div 
                                          key={lesson.id} 
                                          className={`group/lesson flex items-center justify-between pl-6 pr-2 py-1.5 rounded-lg text-xs transition-colors ${
                                            isLessonActive ? 'bg-primary/15 text-primary font-medium shadow-2xs' : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                                          }`}
                                        >
                                          <button 
                                            onClick={() => {
                                              setActiveModuleId(mod.id)
                                              setActiveLessonId(lesson.id)
                                            }}
                                            className="flex-1 flex items-center gap-2 text-left truncate py-0.5"
                                          >
                                            <FileText className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">{lesson.title}</span>
                                          </button>
                                          <button 
                                            title="Delete Lesson"
                                            onClick={(e) => handleDeleteLesson(e, mod.id, lesson.id)}
                                            className="opacity-0 group-hover/lesson:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all shrink-0"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      )
                                    })
                                  )}
                                  
                                  <button 
                                    onClick={() => handleAddLesson(mod.id)}
                                    className="w-full flex items-center gap-2 pl-6 pr-2 py-1.5 mt-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="pt-3 px-1">
              <input 
                type="text" 
                placeholder="New Module Title..." 
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
              <button 
                onClick={handleAddModule}
                disabled={isAdding || !newModuleTitle.trim()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              >
                {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add Module
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Information</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Course Title</label>
            <input 
              type="text" 
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Course title..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Course Description</label>
            <textarea 
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Course description..."
            />
          </div>

          <button
            onClick={handleSaveCourseSettings}
            disabled={isSavingCourse}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-xs"
          >
            {isSavingCourse ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {courseSaveSuccess ? "Saved!" : "Save Course Info"}
          </button>
        </div>
      )}

      {activeTab === 'publish' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Visibility</h3>

          <div className="p-4 border border-border rounded-xl bg-background space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              {course?.published ? (
                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                  <Globe className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <EyeOff className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">{course?.published ? "Course Published" : "Course in Draft"}</p>
                <p className="text-xs text-muted-foreground">
                  {course?.published ? "Visible to enrolled students" : "Only visible to course authors"}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleCoursePublish}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors shadow-xs ${
                course?.published 
                  ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/20"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {course?.published ? "Unpublish Course" : "Publish Course Now"}
            </button>
          </div>

          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2 border-t border-border">Share & Enroll Link</h3>

          <div className="p-4 border border-border rounded-xl bg-background space-y-3 shadow-xs">
            <p className="text-xs text-muted-foreground">Direct link to student enrollment & course overview page:</p>
            
            <div className="space-y-2">
              <input 
                type="text" 
                readOnly 
                value={shareUrl}
                className="w-full bg-muted/30 border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl)
                    alert("Course share link copied to clipboard!")
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                >
                  <Share className="w-3.5 h-3.5" />
                  Copy Share Link
                </button>

                <a
                  href={`/demo/course/${course?.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg border border-border hover:bg-accent text-foreground transition-colors flex items-center justify-center"
                  title="Open Public Preview"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
