"use client"

import * as React from "react"
import { Rocket } from "lucide-react"
import { UpgradeDialog } from "@/components/layout/UpgradeDialog"
import { api } from "@/lib/api"

export function EarlyAdopterCard() {
  const [openUpgrade, setOpenUpgrade] = React.useState(false)
  const [studentCount, setStudentCount] = React.useState(0)
  const maxStudents = 20

  React.useEffect(() => {
    // Fetch live learner count from backend
    api.stats
      .getAnalytics()
      .then((data) => {
        if (data?.summary?.totalLearners !== undefined) {
          setStudentCount(data.summary.totalLearners)
        }
      })
      .catch(() => {
        // Fallback to 0 if not loaded
      })
  }, [])

  const percentage = Math.min(100, Math.round((studentCount / maxStudents) * 100))
  const remaining = Math.max(0, maxStudents - studentCount)

  return (
    <>
      <div className="mx-2 mb-2 p-3 rounded-xl border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs group-data-[collapsible=icon]:hidden">
        {/* Title Header with Rocket */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shrink-0">
            <Rocket className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-foreground tracking-tight">
            Become an Early Adopter
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-3">
          <div className="w-full h-1.5 rounded-full bg-muted/80 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(4, percentage)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
            <span>
              {studentCount} of {maxStudents} students
            </span>
            <span>{remaining} left</span>
          </div>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={() => setOpenUpgrade(true)}
          className="w-full py-1.5 px-3 rounded-lg border border-border/80 bg-background/90 hover:bg-muted hover:border-border text-foreground text-xs font-semibold shadow-2xs transition-all duration-150 cursor-pointer text-center select-none"
        >
          Upgrade now
        </button>
      </div>

      <UpgradeDialog open={openUpgrade} onOpenChange={setOpenUpgrade} />
    </>
  )
}
