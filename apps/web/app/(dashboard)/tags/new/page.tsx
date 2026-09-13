"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Tag as TagIcon, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"

export default function NewTagPage() {
  const router = useRouter()
  const [tagName, setTagName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [selectionMode, setSelectionMode] = React.useState<"SINGLE" | "MULTIPLE">("SINGLE")
  const [isCreating, setIsCreating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagName.trim()) return

    setIsCreating(true)
    setError(null)
    try {
      await api.tags.createGroup({
        name: tagName.trim(),
        description: description.trim() || undefined,
        selectionMode,
      })
      router.push("/tags")
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create tag group"
      setError(errorMsg)
      setIsCreating(false)
    }
  }

  return (
    <div className="p-8 max-w-[800px] mx-auto text-foreground">
      <Link href="/tags" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Tags
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Create Tag Group</h1>
        <p className="text-xs text-muted-foreground">Organize your labels into groups for easier filtering across courses.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Tag Group Name *</label>
            <input 
              type="text" 
              required
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g. Difficulty Level / Department" 
              className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Description (Optional)</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Classification based on student skill requirements" 
              className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Selection Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectionMode("SINGLE")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectionMode === "SINGLE" 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border bg-background hover:bg-muted/50"
                }`}
              >
                <div className="font-semibold text-sm mb-1">Single Choice</div>
                <div className="text-xs text-muted-foreground">Courses can only have one tag from this group</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectionMode("MULTIPLE")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectionMode === "MULTIPLE" 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border bg-background hover:bg-muted/50"
                }`}
              >
                <div className="font-semibold text-sm mb-1">Multiple Choice</div>
                <div className="text-xs text-muted-foreground">Courses can have multiple tags from this group</div>
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Link href="/tags" className="px-5 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isCreating || !tagName.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <TagIcon className="w-4 h-4" />}
              {isCreating ? "Creating..." : "Create Tag Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
