"use client"

import * as React from "react"
import Link from "next/link"
import { PlayCircle, Clock, Star, CheckCircle2, ChevronRight, Lock, BookOpen, FileText, HelpCircle, Loader2, ArrowRight } from "lucide-react"
import { api } from "@/lib/api"

export default function CourseDetailsPage({ params }: { params: Promise<{ orgSlug: string, courseSlug: string }> }) {
  const { orgSlug, courseSlug } = React.use(params)

  const [course, setCourse] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!courseSlug) return
    setLoading(true)
    api.courses.getOne(courseSlug)
      .then((data) => {
        setCourse(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch course details", err)
        setError("Course not found or database unreachable.")
        setLoading(false)
      })
  }, [courseSlug])

  if (loading) {
    return (
      <div className="flex-1 w-full bg-background flex flex-col items-center justify-center py-32 text-muted-foreground gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading course information...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="flex-1 w-full bg-background flex flex-col items-center justify-center py-32 text-center px-4 space-y-4">
        <BookOpen className="w-12 h-12 text-muted-foreground/40" />
        <h2 className="text-xl font-bold text-foreground">Course Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">{error || "The requested course could not be loaded."}</p>
        <Link 
          href={`/${orgSlug}`}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-colors"
        >
          Back to Course Catalog
        </Link>
      </div>
    )
  }

  const modules = course.modules || []
  const totalLessons = modules.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)
  const firstLesson = modules[0]?.lessons?.[0]
  const startLessonHref = firstLesson 
    ? `/${orgSlug}/course/${course.id}/lesson/${firstLesson.id}`
    : `/${orgSlug}/course/${course.id}/lesson/first`

  const thumbnail = course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"

  return (
    <div className="flex-1 w-full bg-background text-foreground">
      {/* Course Hero Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-wider">
              <span>Verified Course</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <span>{course.published ? "Live Access" : "Draft Preview"}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {course.title}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {course.description || "Master the core concepts and build practical skills with this structured course."}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> {modules.length} Modules ({totalLessons} Lessons)
              </div>
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="w-4 h-4 fill-current" /> 4.9 (High Rating)
              </div>
            </div>

            <div className="pt-2">
              <Link 
                href={startLessonHref}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
              >
                Start Learning Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border group">
            <img 
              src={thumbnail} 
              alt={course.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <Link 
                href={startLessonHref}
                className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:scale-110 transition-transform text-white"
              >
                <PlayCircle className="w-8 h-8 ml-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Curriculum */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-12">
          {/* Real Course Curriculum */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Course Curriculum</h2>
              <span className="text-xs text-muted-foreground font-medium">{modules.length} Modules • {totalLessons} Lessons</span>
            </div>

            {modules.length === 0 ? (
              <div className="p-8 border border-dashed border-border rounded-xl bg-card text-center text-xs text-muted-foreground">
                No modules created for this course yet.
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((mod: any, index: number) => {
                  const modLessons = mod.lessons || []
                  return (
                    <div key={mod.id || index} className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
                      <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-foreground">{mod.title}</h3>
                        <span className="text-xs text-muted-foreground">{modLessons.length} lessons</span>
                      </div>

                      <div className="divide-y divide-border">
                        {modLessons.length === 0 ? (
                          <div className="p-3 text-xs text-muted-foreground/60 italic pl-6">No lessons in this module.</div>
                        ) : (
                          modLessons.map((lesson: any) => {
                            const lessonHref = `/${orgSlug}/course/${course.id}/lesson/${lesson.id}`
                            return (
                              <Link 
                                key={lesson.id} 
                                href={lessonHref}
                                className="p-3.5 flex items-center justify-between hover:bg-accent/50 transition-colors group px-6"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.type === 'VIDEO' ? (
                                    <PlayCircle className="w-4 h-4 text-primary shrink-0" />
                                  ) : lesson.type === 'QUIZ' ? (
                                    <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                                  )}
                                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-muted rounded">
                                    {lesson.type || 'TEXT'}
                                  </span>
                                </div>
                              </Link>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-8 space-y-6 shadow-sm">
            <h3 className="font-bold text-base text-foreground">Course Overview:</h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-primary" /> {modules.length} Structured Modules
              </li>
              <li className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-primary" /> {totalLessons} Interactive Lessons & Exercises
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Self-paced Full Lifetime Access
              </li>
            </ul>

            <Link 
              href={startLessonHref}
              className="w-full block text-center bg-primary text-primary-foreground py-3 rounded-xl font-bold text-xs hover:bg-primary/90 transition-colors shadow-xs"
            >
              Start Learning Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
