"use client"

import * as React from "react"
import { Search, ExternalLink } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CommandPalette } from "@/components/layout/CommandPalette"
import { NotificationsPopover } from "@/components/layout/NotificationsPopover"

export function Topbar() {
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [isMac, setIsMac] = React.useState(false)

  // Detect OS for shortcut display & set up global keyboard shortcut
  React.useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
      // Slash '/' to search when not typing in an active input
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (document.activeElement?.tagName || "").toUpperCase()
        )
      ) {
        e.preventDefault()
        setCommandOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header className="h-14 bg-background/95 backdrop-blur-md border-b border-border flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
        {/* Left: Organization & Sidebar Toggle */}
        <div className="flex items-center gap-3 text-sm">
          <SidebarTrigger className="-ml-2" />
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold border border-primary/20">
              ST
            </div>
            <span className="font-semibold text-foreground text-sm tracking-tight">
              St.Peter&apos;s Engineering College
            </span>
          </div>
        </div>

        {/* Right: Quick Links, Search Command, Notifications */}
        <div className="flex items-center gap-3">
          {/* Progress & Quick Links */}
          <div className="hidden md:flex items-center gap-3 pr-3 border-r border-border">
            <div className="w-7 h-7 rounded-full border-2 border-primary/30 flex items-center justify-center bg-primary/5">
              <span className="text-[10px] font-bold text-primary">17%</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <span>Open Academy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Global Search & Command Bar Trigger */}
          <button
            onClick={() => setCommandOpen(true)}
            aria-label="Open global search and command palette"
            className="flex items-center justify-between bg-muted/40 hover:bg-muted/80 border border-border/80 hover:border-border px-3 py-1.5 rounded-lg w-52 sm:w-64 text-xs text-muted-foreground transition-all duration-150 group shadow-xs cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 group-hover:text-foreground transition-colors" />
              <span className="group-hover:text-foreground font-medium transition-colors">
                Search or command...
              </span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="inline-flex items-center rounded bg-background px-1.5 py-0.5 text-[10px] font-medium font-sans text-muted-foreground border border-border/80 shadow-2xs">
                {isMac ? "⌘" : "Ctrl"}
              </kbd>
              <kbd className="inline-flex items-center rounded bg-background px-1.5 py-0.5 text-[10px] font-medium font-sans text-muted-foreground border border-border/80 shadow-2xs">
                K
              </kbd>
            </div>
          </button>

          {/* Notifications Dropdown */}
          <NotificationsPopover />
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </>
  )
}
