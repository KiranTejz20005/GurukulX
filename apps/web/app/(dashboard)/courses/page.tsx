"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Filter, LayoutGrid, BookOpen, Plus, LoaderCircle, Layers, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const data = await api.courses.getAll()
      setCourses(data || [])
    } catch (err) {
      console.error("Failed to load courses:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setIsCreating(true)
      const newCourse = await api.courses.create({
        title: title.trim(),
        description: description.trim(),
      })

      if (newCourse?.id) {
        // Optionally create an initial module
        await api.modules.create(newCourse.id, { title: 'Module 1: Introduction' }).catch(() => {})
        router.push(`/courses/${newCourse.id}/builder`)
      } else {
        await fetchCourses()
        setIsDialogOpen(false)
        setTitle('')
        setDescription('')
      }
    } catch (err) {
      console.error("Failed to create course:", err)
    } finally {
      setIsCreating(false)
    }
  }

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Courses</h1>
          <p className="text-sm text-muted-foreground">Where lessons turn into courses and courses turn into enrollments.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Find Course" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors w-64 placeholder:text-muted-foreground"
          />
        </div>
        <Button variant="outline" className="h-9 gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <LayoutGrid className="w-4 h-4" />
        </Button>
      </div>

      {/* Course List or Empty State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id}
              className="group bg-card border border-border rounded-2xl p-5 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div>
                <div className="w-full h-36 bg-muted/60 rounded-xl mb-4 overflow-hidden relative border border-border flex items-center justify-center">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <BookOpen className="w-8 h-8 mb-1 text-primary/70" />
                      <span className="text-xs font-medium">GurukulX Course</span>
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                    course.published ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3 className="font-semibold text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {course.description || "No description provided."}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{course.modules?.length || 0} Modules</span>
                </div>
                <Link 
                  href={`/courses/${course.id}/builder`}
                  className="flex items-center gap-1 text-primary font-medium hover:underline"
                >
                  Builder
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center mt-12">
          <div className="w-[500px] bg-card border border-border border-dashed rounded-2xl p-12 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 border border-border">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No Courses Found</h2>
            <p className="text-[13px] text-muted-foreground mb-8 max-w-[280px] leading-relaxed">
              {searchQuery ? "No courses match your filter criteria." : "Share your knowledge with the world by creating engaging courses for your students."}
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Course
            </Button>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h2 className="text-xl font-semibold mb-1">Create New Course</h2>
              <p className="text-xs text-muted-foreground">Enter a title and description to start building your new course.</p>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Course Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Masterclass in Web Development"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description (Optional)</label>
                <textarea 
                  placeholder="What will students learn in this course?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-24 p-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || !title.trim()} className="gap-2">
                  {isCreating ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

