"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, Settings, Users, PenTool, LayoutDashboard, Share2, Copy, Check, ExternalLink, X } from "lucide-react"

export default function CourseLayout({ children, params }: { children: React.ReactNode, params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params)
  const pathname = usePathname()
  
  const [showShareModal, setShowShareModal] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [publicShareUrl, setPublicShareUrl] = React.useState(`http://localhost:3000/demo/course/${courseId}`)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setPublicShareUrl(`${window.location.origin}/demo/course/${courseId}`)
    }
  }, [courseId])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { name: "Builder", href: `/courses/${courseId}/builder`, icon: PenTool },
    { name: "Settings", href: `/courses/${courseId}/settings`, icon: Settings },
    { name: "People & Marks", href: `/courses/${courseId}/people`, icon: Users },
    { name: "Exercises", href: `/courses/${courseId}/exercises`, icon: LayoutDashboard },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Course Header Navigation */}
      <header className="h-16 border-b border-border bg-card shrink-0 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link href="/courses" className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Courses</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold text-foreground text-sm">Course Management</h1>
        </div>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            {tabs.map(tab => {
              const isActive = pathname.startsWith(tab.href)
              return (
                <Link 
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.name}
                </Link>
              )
            })}
          </nav>

          <div className="h-6 w-px bg-border" />

          {/* Share Course Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Course
          </button>
        </div>
      </header>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Share Course</h3>
                  <p className="text-xs text-muted-foreground">Anyone with this link can view this course</p>
                </div>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Public Shareable Link</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={publicShareUrl}
                  className="flex-1 bg-muted/30 border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0 shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <a
                href={publicShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Public Preview Page
              </a>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
