"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Menu, PlayCircle, FileText, CheckCircle2, MessageSquare } from "lucide-react"

export default function LessonViewerPage({ params }: { params: { orgSlug: string, courseSlug: string, lessonSlug: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const modules = [
    {
      title: "Module 1: Getting Started",
      lessons: [
        { title: "Introduction to the course", type: "video", duration: "5m", completed: true, slug: "introduction-to-the-course" },
        { title: "Setting up your environment", type: "video", duration: "15m", completed: false, slug: "setting-up-your-environment" },
        { title: "Basic concepts overview", type: "text", duration: "10m", completed: false, slug: "basic-concepts-overview" }
      ]
    },
    {
      title: "Module 2: Core Concepts",
      lessons: [
        { title: "Deep dive into state", type: "video", duration: "45m", completed: false, slug: "deep-dive-into-state" },
        { title: "Component lifecycle", type: "video", duration: "40m", completed: false, slug: "component-lifecycle" },
      ]
    }
  ]

  const courseTitle = params.courseSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const lessonTitle = params.lessonSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen bg-background overflow-hidden">
      
      {/* Left Sidebar - Curriculum */}
      <div className={`${sidebarOpen ? 'w-[320px]' : 'w-0'} flex-shrink-0 border-r border-border bg-card flex flex-col transition-all duration-300 overflow-hidden`}>
        <div className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-background">
          <Link href={`/${params.orgSlug}/course/${params.courseSlug}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Course
          </Link>
        </div>
        
        <div className="p-4 border-b border-border bg-muted/20 shrink-0">
          <h2 className="font-bold text-foreground line-clamp-2">{courseTitle}</h2>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/4" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">25%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {modules.map((mod, i) => (
            <div key={i} className="border-b border-border last:border-b-0">
              <div className="px-4 py-3 bg-muted/30 font-semibold text-sm text-foreground">
                {mod.title}
              </div>
              <div className="divide-y divide-border/50">
                {mod.lessons.map((lesson, j) => {
                  const isActive = lesson.slug === params.lessonSlug
                  return (
                    <Link 
                      key={j} 
                      href={`/${params.orgSlug}/course/${params.courseSlug}/lesson/${lesson.slug}`}
                      className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors ${isActive ? 'bg-primary/5 border-l-2 border-primary' : 'border-l-2 border-transparent'}`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {lesson.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-muted-foreground/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-primary' : 'text-foreground'}`}>
                          {lesson.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                          {lesson.type === 'video' ? <PlayCircle className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                          {lesson.duration}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-foreground truncate">{lessonTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted">
              <MessageSquare className="w-4 h-4" />
              Discuss
            </button>
            <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              Mark as Complete
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Video Player Mock */}
          <div className="bg-black aspect-video w-full max-h-[70vh] flex items-center justify-center relative group">
            <img 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2000&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-50"
              alt="Video Poster"
            />
            <button className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground relative z-10 hover:scale-110 transition-transform shadow-2xl">
              <PlayCircle className="w-10 h-10 ml-1" />
            </button>
            
            {/* Fake Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer overflow-hidden">
                <div className="h-full bg-primary w-1/3" />
              </div>
              <div className="flex items-center justify-between text-white text-sm font-medium">
                <div className="flex items-center gap-4">
                  <PlayCircle className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                  <span>01:23 / 05:00</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold border border-white/30 rounded px-1 cursor-pointer hover:bg-white/10">CC</span>
                  <span className="font-bold cursor-pointer hover:text-primary transition-colors">1x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content below video */}
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold mb-6">{lessonTitle}</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Welcome to the first lesson! In this video, we'll cover the fundamental concepts you need to succeed in this course. Make sure to download the attached resources before proceeding to the next video.
              </p>
              
              <div className="bg-muted/50 border border-border rounded-xl p-6 my-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Downloads & Resources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-primary hover:underline font-medium flex items-center gap-2">
                      Course_Slides_Module_1.pdf
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline font-medium flex items-center gap-2">
                      Starter_Code_Template.zip
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
