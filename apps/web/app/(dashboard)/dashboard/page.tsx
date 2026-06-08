import Link from "next/link"
import { Award, Book, Users, MonitorPlay, BarChart3, Plus, ExternalLink } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Good Evening Kiran Teja Lanke!</h1>
        <div className="flex items-center gap-3">
          <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
            Create Course
          </Link>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            View site
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex gap-4">
          <div className="mt-1 text-gray-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-1">Certificates issued</h3>
            <p className="text-2xl font-semibold text-white mb-2">0</p>
            <p className="text-[13px] text-gray-500 leading-relaxed">Total certificates issued to students in your organization</p>
          </div>
        </div>

        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex gap-4">
          <div className="mt-1 text-gray-400">
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-1">Number of courses</h3>
            <p className="text-2xl font-semibold text-white mb-2">0</p>
            <p className="text-[13px] text-gray-500 leading-relaxed">Courses created within this organization</p>
          </div>
        </div>

        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex gap-4">
          <div className="mt-1 text-gray-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-1">Total students</h3>
            <p className="text-2xl font-semibold text-white mb-2">0</p>
            <p className="text-[13px] text-gray-500 leading-relaxed">Based on student enrollments</p>
          </div>
        </div>
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Courses */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex flex-col h-[320px]">
          <h3 className="text-base font-medium text-gray-200 mb-auto">Top Courses</h3>
          
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
              <MonitorPlay className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-sm font-medium text-gray-200 mb-2">Create Your First Course</h4>
            <p className="text-[13px] text-gray-500 mb-6 max-w-[250px]">Start creating courses to track course progress</p>
            <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
              Create Course
            </button>
          </div>
        </div>

        {/* Recent Certifications */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex flex-col h-[320px]">
          <h3 className="text-base font-medium text-gray-200 mb-auto">Recent certifications</h3>
          
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-sm font-medium text-gray-200 mb-2">No certificates earned yet</h4>
            <p className="text-[13px] text-gray-500 mb-6 max-w-[300px]">When students complete a course and earn a certificate, they will appear here</p>
            <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
              View courses
            </button>
          </div>
        </div>
      </div>

      {/* Student Login Activity Chart */}
      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6">
        <h3 className="text-base font-medium text-gray-200 mb-1">Student Login Activity</h3>
        <p className="text-[13px] text-gray-500 mb-8">Most active days of the week (last 90 days)</p>
        
        {/* Simple CSS Bar Chart Replica */}
        <div className="h-48 flex items-end justify-between px-8 pb-6 border-b border-white/10 relative">
          {/* Y Axis Grid Lines (Simulated) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            <div className="w-full border-t border-white/5"></div>
            <div className="w-full border-t border-white/5"></div>
            <div className="w-full border-t border-white/5"></div>
          </div>

          <div className="w-12 flex flex-col items-center gap-3 relative z-10">
            <div className="w-full bg-blue-400 rounded-t-sm h-0" style={{ height: '0%' }}></div>
            <span className="text-xs text-gray-500">Sun</span>
          </div>
          <div className="w-12 flex flex-col items-center gap-3 relative z-10">
            <div className="w-full bg-[#8fbfff] rounded-t-sm" style={{ height: '100%' }}></div>
            <span className="text-xs text-gray-500">Mon</span>
          </div>
          <div className="w-12 flex flex-col items-center gap-3 relative z-10">
            <div className="w-full bg-blue-400 rounded-t-sm h-0" style={{ height: '0%' }}></div>
            <span className="text-xs text-gray-500">Tue</span>
          </div>
          <div className="w-12 flex flex-col items-center gap-3 relative z-10">
            <div className="w-full bg-[#8fbfff] rounded-t-sm" style={{ height: '100%' }}></div>
            <span className="text-xs text-gray-500">Wed</span>
          </div>
          <div className="w-12 flex flex-col items-center gap-3 relative z-10">
            <div className="w-full bg-blue-400 rounded-t-sm h-0" style={{ height: '0%' }}></div>
            <span className="text-xs text-gray-500">Thu</span>
          </div>
          <div className="w-12 flex flex-col items-center gap-3 relative z-10">
            <div className="w-full bg-blue-400 rounded-t-sm h-0" style={{ height: '0%' }}></div>
            <span className="text-xs text-gray-500">Fri</span>
          </div>
          <div className="w-12 flex flex-col items-center gap-3 relative z-10">
            <div className="w-full bg-[#8fbfff] rounded-t-sm" style={{ height: '100%' }}></div>
            <span className="text-xs text-gray-500">Sat</span>
          </div>
        </div>
      </div>

    </div>
  )
}
