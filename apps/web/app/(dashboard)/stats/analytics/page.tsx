"use client"
import { Construction } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      <div className="flex flex-col items-center justify-center h-[60vh] bg-[#09090b] border border-white/10 rounded-xl">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
          <Construction className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400 text-center max-w-md">
          This section is currently being developed. Stay tuned for new features and updates for the Analytics module.
        </p>
      </div>
    </div>
  )
}
