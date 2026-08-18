"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Send } from "lucide-react"
import { api } from "@/lib/api"

export default function NewCommunityQuestionPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [details, setDetails] = React.useState("")
  const [isPosting, setIsPosting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsPosting(true)
    setErrorMessage("")

    try {
      await api.forums.create({
        title: title.trim(),
        description: details.trim()
      })
      router.push("/community")
    } catch (err) {
      console.error("Failed to post question to community", err)
      // Fallback demo redirection
      setErrorMessage("Failed to post question to backend API.")
      setTimeout(() => {
        router.push("/community")
      }, 1000)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="p-8 max-w-[800px] mx-auto text-foreground">
      <Link href="/community" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Community
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Ask the Community</h1>
        <p className="text-xs text-muted-foreground">Post a question to be answered by your organization's members.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Question Title *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How do I configure custom domains for student portals?" 
              className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Details & Context</label>
            <textarea 
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide background information or error details..." 
              className="w-full p-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground resize-none leading-relaxed"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Link 
              href="/community" 
              className="px-5 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
            
            <button 
              type="submit"
              disabled={isPosting || !title.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {isPosting ? "Posting..." : "Post Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
