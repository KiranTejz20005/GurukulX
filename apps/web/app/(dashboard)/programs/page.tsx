"use client"

import * as React from "react"
import Link from "next/link"
import { CheckSquare, Plus, Loader2, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

export default function ProgramsPage() {
  const [programs, setPrograms] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    api.programs.getAll()
      .then((data) => {
        setPrograms(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch programs", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="text-foreground space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Programs</h1>
          <p className="text-xs text-muted-foreground">Give groups of students access to multi-course certification tracks.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/programs/new">
            <Plus className="w-4 h-4" /> New Program
          </Link>
        </Button>
      </div>

      {/* Program List or Empty State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs">Loading programs...</p>
        </div>
      ) : programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div 
              key={program.id}
              className="bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-primary/50 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{program.title}</h3>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                    {program.published ? "Active Program" : "Draft"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {program.description || "No description provided."}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center pt-12">
          <div className="w-full max-w-[600px] bg-card border border-border border-dashed rounded-2xl p-12 flex flex-col items-center text-center shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">No Programs Created Yet</h2>
              <p className="text-xs text-muted-foreground max-w-[320px] leading-relaxed">
                Create your first multi-course certification or compliance program for your students.
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/programs/new">
                <Plus className="w-4 h-4" /> New Program
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
