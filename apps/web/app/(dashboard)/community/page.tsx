"use client"

import * as React from "react"
import Link from "next/link"
import { MessageSquare, Search, Plus, Loader2, User, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

export default function CommunityPage() {
  const [forums, setForums] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchForums = async () => {
    try {
      setLoading(true)
      const data = await api.forums.getAll()
      setForums(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load community forums", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchForums()
  }, [])

  const filteredForums = forums.filter(f =>
    (f.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="text-foreground space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Community & Forums</h1>
          <p className="text-xs text-muted-foreground">Questions and discussions shared across your organization.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/community/new">
            <Plus className="w-4 h-4" /> Ask Community
          </Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find questions or topics..." 
            className="h-10 w-full pl-9 pr-4 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Questions List or Empty State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs">Loading community discussions...</p>
        </div>
      ) : filteredForums.length > 0 ? (
        <div className="space-y-4">
          {filteredForums.map((forum) => {
            const postCount = forum._count?.posts || forum.posts?.length || 0
            return (
              <div 
                key={forum.id}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                      Question
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Just now
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {forum.title}
                  </h3>
                  
                  {forum.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {forum.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span>{postCount} Answers</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center pt-12">
          <div className="w-full max-w-[600px] bg-card border border-border border-dashed rounded-2xl p-12 flex flex-col items-center text-center shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">No Questions Posted Yet</h2>
              <p className="text-xs text-muted-foreground max-w-[320px] leading-relaxed">
                Be the first to ask a question and start a discussion in your community.
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/community/new">
                <Plus className="w-4 h-4" /> Ask Community Question
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
