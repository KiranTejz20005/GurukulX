"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Filter, BookOpen, Clock, Star, PlayCircle, Loader2, Sparkles } from "lucide-react"
import { api } from "@/lib/api"

export default function AcademyHomePage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = React.use(params)

  const [courses, setCourses] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    api.courses.getAll()
      .then((data) => {
        setCourses(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load catalog courses", err)
        setLoading(false)
      })
  }, [])

  const formattedOrgName = (!orgSlug || orgSlug.toLowerCase() === 'demo')
    ? "GurukulX"
    : orgSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const filteredCourses = courses.filter(c => {
    if (!searchQuery.trim()) return true
    return (c.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
           (c.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex-1 w-full flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/15 via-background to-background py-20 px-4 md:px-6 border-b border-border/50">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Official Learning Portal
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Welcome to {formattedOrgName}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Master new skills with interactive courses, structured pathways, and hands-on evaluations.
          </p>

          <div className="max-w-md mx-auto relative pt-4">
            <Search className="absolute left-4 top-1/2 text-muted-foreground w-5 h-5 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full bg-card border border-border rounded-full py-3.5 pl-12 pr-6 text-sm text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Course Catalog</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Explore available courses</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading course catalog...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/50 p-8 space-y-4">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <h3 className="text-lg font-semibold">No courses found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {searchQuery ? `No courses matching "${searchQuery}".` : "No courses have been published in this workspace yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const moduleCount = course.modules?.length || 0
              const thumbnail = course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"

              return (
                <Link 
                  key={course.id} 
                  href={`/${orgSlug}/course/${course.slug || course.id}`} 
                  className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                    <img 
                      src={thumbnail} 
                      alt={course.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur text-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
                      {course.published ? "Published" : "Draft"}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                      {course.description || "No description provided."}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4 mt-auto">
                      <span className="flex items-center gap-1.5 font-medium">
                        <BookOpen className="w-4 h-4 text-primary" /> {moduleCount} Modules
                      </span>
                      <span className="flex items-center gap-1 text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                        View Course →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
