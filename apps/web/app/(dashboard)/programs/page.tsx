"use client"

import Link from "next/link"
import { CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProgramsPage() {
  return (
    <div className="text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Programs</h1>
          <p className="text-sm text-muted-foreground">Give a group of people access to multiple courses, like a class</p>
        </div>
        <Button asChild>
          <Link href="/programs/new">+ New Program</Link>
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex items-center justify-center pt-20">
        <div className="w-[600px] bg-card border border-border border-dashed rounded-2xl p-16 flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 border border-border">
            <CheckSquare className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No programs yet</h2>
          <p className="text-[13px] text-muted-foreground mb-8 max-w-[320px] leading-relaxed">
            Create your first certification or compliance program.
          </p>
          <Button asChild>
            <Link href="/programs/new">+ New Program</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
