import Link from "next/link"
import { CheckSquare } from "lucide-react"

export default function ProgramsPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Programs</h1>
          <p className="text-sm text-gray-400">Give a group of people access to multiple courses, like a class</p>
        </div>
        <Link href="/programs/new" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          + New Program
        </Link>
      </div>

      {/* Empty State */}
      <div className="flex items-center justify-center pt-8">
        <div className="w-[600px] bg-[#09090b] border border-white/5 border-dashed rounded-2xl p-16 flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
            <CheckSquare className="w-6 h-6 text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No programs yet</h2>
          <p className="text-[13px] text-gray-400 mb-8 max-w-[320px] leading-relaxed">
            Create your first certification or compliance program.
          </p>
          <Link href="/programs/new" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            + New Program
          </Link>
        </div>
      </div>
    </div>
  )
}
