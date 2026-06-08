"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewCommunityQuestionPage() {
  return (
    <div className="p-8 max-w-[800px] mx-auto text-gray-200">
      <Link href="/community" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Community
      </Link>
      
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white mb-1">Ask the Community</h1>
        <p className="text-sm text-gray-400">Post a question to be answered by your organization's members.</p>
      </div>

      <div className="bg-[#09090b] border border-white/10 rounded-xl p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Question Title</label>
            <input 
              type="text" 
              placeholder="What's your question?" 
              className="w-full h-10 px-4 bg-transparent border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Details</label>
            <textarea 
              rows={6}
              placeholder="Provide more context..." 
              className="w-full p-4 bg-transparent border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 resize-none"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Link href="/community" className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Cancel
            </Link>
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Post Question
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
