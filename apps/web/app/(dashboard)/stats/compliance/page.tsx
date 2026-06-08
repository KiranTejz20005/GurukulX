"use client"

import { RefreshCw, ShieldCheck, ShieldOff, AlertTriangle, Clock, Activity, CircleDashed, CheckCircle, HelpCircle, Book } from "lucide-react"

export default function CompliancePage() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto text-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Compliance</h1>
          <p className="text-sm text-gray-400">Track certification status across every compliance course in your organization.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-medium text-white mb-1">Learner status</h2>
        <p className="text-[13px] text-gray-500 mb-8">Counts across learners in all compliance courses.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
          <div>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">0</p>
            <p className="text-xs text-gray-500">Compliant</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
              <ShieldOff className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">0</p>
            <p className="text-xs text-gray-500">Non-compliant</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">0</p>
            <p className="text-xs text-gray-500">Expiring soon</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">0</p>
            <p className="text-xs text-gray-500">In grace period</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">0</p>
            <p className="text-xs text-gray-500">In progress</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center mb-3">
              <CircleDashed className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">0</p>
            <p className="text-xs text-gray-500">Not started</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center mb-3">
              <CheckCircle className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">0</p>
            <p className="text-xs text-gray-500">Waived</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center mb-3">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">0</p>
            <p className="text-xs text-gray-500">No record</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-white/10 mb-6">
        <button className="pb-3 text-sm font-medium text-white border-b-2 border-blue-500">By course</button>
        <button className="pb-3 text-sm font-medium text-gray-400 hover:text-gray-300">Learners</button>
      </div>

      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 h-64 flex flex-col">
        <div>
          <h2 className="text-sm font-medium text-white mb-1">Courses</h2>
          <p className="text-[13px] text-gray-500">Compliance courses with learner status counts</p>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">
            <Book className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-white">No compliance courses yet</p>
        </div>
      </div>
    </div>
  )
}
