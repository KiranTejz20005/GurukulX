"use client"

import { Settings, Layers, PlayCircle, Share, Home, LayoutList, Plus, GripVertical, ChevronDown, FileText } from "lucide-react"
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
  setActiveModuleId: (id: string) => void,
  activeLessonId: string | null,
  setActiveLessonId: (id: string) => void,
  onUpdate: () => void 
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState("")
  const [modules, setModules] = useState<any[]>([])
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (course?.modules) {
      setModules(course.modules)
    }
  }, [course])

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

  const handleAddLesson = async (moduleId: string) => {
    try {
      await api.lessons.create(moduleId, { title: "New Lesson", type: 'TEXT' })
      onUpdate()
    } catch (e) {
      console.error(e)
    }
  }

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    if (result.type === 'module') {
      const items = Array.from(modules)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setModules(items)
      // TODO: Send reorder API request
    }
    // Implement lesson reorder later
  }

  return (
    <div className="w-72 border-r border-border bg-card flex flex-col h-full flex-shrink-0 text-foreground">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center px-4 shrink-0 bg-background/50 backdrop-blur">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Home className="w-4 h-4" />
          Exit Builder
        </Link>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground bg-accent rounded-lg">
          <LayoutList className="w-4 h-4" />
          Curriculum
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors">
          <Share className="w-4 h-4" />
          Publish
        </button>
      </div>

      <div className="px-5 py-2 mt-2 flex justify-between items-center">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Modules</p>
      </div>

      {/* Modules List with DnD */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="modules" type="module">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {modules.map((mod: any, index: number) => {
                  const isExpanded = expandedModules[mod.id]
                  return (
                    <Draggable key={mod.id} draggableId={mod.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-background border border-border rounded-xl overflow-hidden shadow-sm transition-all ${snapshot.isDragging ? 'ring-2 ring-primary/50 shadow-md scale-[1.02]' : ''}`}
                        >
                          <div className={`w-full flex items-center px-2 py-2 text-sm group ${activeModuleId === mod.id && !activeLessonId ? 'bg-primary/5' : 'hover:bg-accent/50'}`}>
                            <div 
                              {...provided.dragHandleProps}
                              className="p-1.5 text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing rounded"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <button 
                              className="flex-1 flex items-center gap-2 pl-1 py-1 text-left"
                              onClick={() => {
                                setActiveModuleId(mod.id)
                                setActiveLessonId(null)
                                if (!isExpanded) toggleModule(mod.id)
                              }}
                            >
                              <span className={`font-medium ${activeModuleId === mod.id && !activeLessonId ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                {mod.title}
                              </span>
                            </button>
                            <button 
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
                              onClick={() => toggleModule(mod.id)}
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="bg-muted/10 border-t border-border p-2 space-y-1">
                              {(!mod.lessons || mod.lessons.length === 0) ? (
                                <div className="pl-8 py-2 text-xs text-muted-foreground/70 italic flex items-center gap-2">
                                  No lessons yet.
                                </div>
                              ) : (
                                mod.lessons.map((lesson: any) => (
                                  <button 
                                    key={lesson.id} 
                                    onClick={() => {
                                      setActiveModuleId(mod.id)
                                      setActiveLessonId(lesson.id)
                                    }}
                                    className={`w-full flex items-center gap-3 pl-8 pr-3 py-2 text-sm rounded-lg transition-colors ${activeLessonId === lesson.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="truncate">{lesson.title}</span>
                                  </button>
                                ))
                              )}
                              
                              <button 
                                onClick={() => handleAddLesson(mod.id)}
                                className="w-full flex items-center gap-2 pl-8 pr-3 py-1.5 mt-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
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

        <div className="pt-4 px-1">
          <input 
            type="text" 
            placeholder="New Module Title..." 
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
          />
          <button 
            onClick={handleAddModule}
            disabled={isAdding || !newModuleTitle.trim()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" /> Add Module
          </button>
        </div>
      </div>
    </div>
  )
}
