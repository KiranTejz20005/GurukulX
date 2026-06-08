import Link from "next/link"
import { CheckCircle2, Image as ImageIcon, Users, BookOpen, FileText, Globe, ChevronRight } from "lucide-react"

export default function SetupPage() {
  return (
    <div className="p-8 max-w-[900px] mx-auto text-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Get Started</h1>
        <p className="text-sm text-gray-400">Complete these steps to set up your learning platform</p>
      </div>

      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 mb-8 flex flex-col justify-center min-h-[120px]">
        <p className="text-[13px] text-gray-400 mb-4">Complete these steps to set up your learning platform</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">1 of 6 completed</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-5 flex items-center justify-between opacity-50">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="w-5 h-5 text-gray-400" />
            <div>
              <h3 className="text-sm font-medium text-white line-through">Upload a profile picture and update username</h3>
              <p className="text-xs text-gray-500">Personalize and add a human touch making interactions more personal and memorable</p>
            </div>
          </div>
          <span className="text-xs font-medium text-gray-500">Done</span>
        </div>

        <button className="w-full bg-[#09090b] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left group">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-0.5">Update organisation profile picture</h3>
              <p className="text-xs text-gray-500">Establish a professional and recognizable identity for your organization</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Todo</span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </button>

        <Link href="/" className="w-full bg-[#09090b] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left group block">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-0.5">Create Course</h3>
              <p className="text-xs text-gray-500">Create a course that you will share with your students</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Todo</span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </Link>

        <button className="w-full bg-[#09090b] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left group">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-0.5">Create a lesson</h3>
              <p className="text-xs text-gray-500">Break your course into lesson that your students can easily understand</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Todo</span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </button>

        <div className="h-4"></div>

        <button className="w-full bg-[#09090b] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left group">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-0.5">Create an exercise</h3>
              <p className="text-xs text-gray-500">Test your students allow them to demonstarte their understanding of the subject matter</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Todo</span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </button>

        <button className="w-full bg-[#09090b] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left group">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-0.5">Publish a course</h3>
              <p className="text-xs text-gray-500">Make your course public and purchaseable</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Todo</span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </button>
      </div>
    </div>
  )
}
