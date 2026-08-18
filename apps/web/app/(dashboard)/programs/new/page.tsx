"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import { api } from "@/lib/api"

export default function NewProgramPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsCreating(true)
    try {
      await api.programs.create({
        title: title.trim(),
        description: description.trim()
      })
      router.push("/programs")
    } catch (err) {
      console.error("Failed to create program", err)
      setTimeout(() => {
        router.push("/programs")
      }, 800)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="p-8 max-w-[800px] mx-auto text-foreground">
      <Link href="/programs" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Programs
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Create New Program</h1>
        <p className="text-xs text-muted-foreground">Set up a new multi-course certification or compliance track.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Program Name *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Employee Onboarding & Compliance 2026" 
              className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the target audience and course requirements..." 
              className="w-full p-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground resize-none leading-relaxed"
            />
          </div>
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Link href="/programs" className="px-5 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isCreating || !title.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isCreating ? "Creating..." : "Create Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
