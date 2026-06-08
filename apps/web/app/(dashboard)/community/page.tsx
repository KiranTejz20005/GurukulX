import Link from "next/link"
import { MessageSquare, Search } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Community</h1>
          <p className="text-sm text-gray-400">Questions and answers shared across your organization's courses.</p>
        </div>
        <Link href="/community/new" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          Ask Community
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Find Question" 
            className="h-9 pl-9 pr-4 bg-[#09090b] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20 transition-colors w-64 placeholder:text-gray-500"
          />
        </div>
        <select className="h-9 px-3 bg-[#09090b] border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors appearance-none pr-8">
          <option>All</option>
        </select>
      </div>

      {/* Empty State */}
      <div className="flex items-center justify-center">
        <div className="w-[800px] bg-[#09090b] border border-white/5 border-dashed rounded-2xl p-16 flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
            <MessageSquare className="w-6 h-6 text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No Questions asked</h2>
          <p className="text-[13px] text-gray-400 mb-8 max-w-[320px] leading-relaxed">
            Ask a question to the community
          </p>
          <Link href="/community/new" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Ask Community
          </Link>
        </div>
      </div>
    </div>
  )
}
