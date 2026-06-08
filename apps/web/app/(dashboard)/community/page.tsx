"use client"

import Link from "next/link"
import { MessageSquare, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommunityPage() {
  return (
    <div className="text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Community</h1>
          <p className="text-sm text-muted-foreground">Questions and answers shared across your organization's courses.</p>
        </div>
        <Button asChild>
          <Link href="/community/new">Ask Community</Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Find Question" 
            className="h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors w-64 placeholder:text-muted-foreground"
          />
        </div>
        <select className="h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none pr-8">
          <option>All</option>
        </select>
      </div>

      {/* Empty State */}
      <div className="flex items-center justify-center mt-20">
        <div className="w-[800px] bg-card border border-border border-dashed rounded-2xl p-16 flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 border border-border">
            <MessageSquare className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No Questions asked</h2>
          <p className="text-[13px] text-muted-foreground mb-8 max-w-[320px] leading-relaxed">
            Ask a question to the community
          </p>
          <Button asChild>
            <Link href="/community/new">Ask Community</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
