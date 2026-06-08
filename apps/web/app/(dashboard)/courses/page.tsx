"use client"

import Link from "next/link"
import { Search, Filter, LayoutGrid, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CoursesPage() {
  return (
    <div className="text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Courses</h1>
          <p className="text-sm text-muted-foreground">Where lessons turn into courses and courses turn into enrollments.</p>
        </div>
        <Button asChild>
          <Link href="/">Create Course</Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Find Course" 
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

      {/* Empty State */}
      <div className="flex items-center justify-center mt-20">
        <div className="w-[500px] bg-card border border-border border-dashed rounded-2xl p-12 flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 border border-border">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No Courses Created</h2>
          <p className="text-[13px] text-muted-foreground mb-8 max-w-[280px] leading-relaxed">
            Share your knowledge with the world by creating engaging courses for your students.
          </p>
          <Button asChild>
            <Link href="/">Create Course</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
