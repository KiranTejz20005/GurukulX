import Link from "next/link"
import { Search, Filter, LayoutGrid, BookOpen } from "lucide-react"

export default function CoursesPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Courses</h1>
          <p className="text-sm text-gray-400">Where lessons turn into courses and courses turn into enrollments.</p>
        </div>
        <Link href="/" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Create Course
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Find Course" 
            className="h-9 pl-9 pr-4 bg-[#09090b] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20 transition-colors w-64 placeholder:text-gray-500"
          />
        </div>
        <button className="h-9 px-3 bg-[#09090b] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2 text-gray-300">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="h-9 w-9 bg-[#09090b] border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors text-gray-300">
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

      {/* Empty State */}
      <div className="flex items-center justify-center">
        <div className="w-[500px] bg-[#09090b] border border-white/5 border-dashed rounded-2xl p-12 flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5">
            <BookOpen className="w-6 h-6 text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No Courses Created</h2>
          <p className="text-[13px] text-gray-400 mb-8 max-w-[280px] leading-relaxed">
            Share your knowledge with the world by creating engaging courses for your students.
          </p>
          <Link href="/" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Create Course
          </Link>
        </div>
      </div>
    </div>
  )
}
