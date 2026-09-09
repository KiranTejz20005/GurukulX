"use client"

import * as React from "react"
import {
  ChevronsUpDown,
  Sun,
  Moon,
  Laptop,
  Sparkles,
  MessageSquarePlus,
  BookOpen,
  HelpCircle,
  LogOut,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme, type Theme } from "@/hooks/useTheme"
import { FeedbackDialog } from "@/components/layout/FeedbackDialog"
import { WhatsNewDialog } from "@/components/layout/WhatsNewDialog"

export function UserNavPopover() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [openFeedback, setOpenFeedback] = React.useState(false)
  const [openWhatsNew, setOpenWhatsNew] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const { theme, setTheme } = useTheme()

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Popover Dropdown Panel positioned above the trigger */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-64 sm:w-72 rounded-2xl border border-border bg-popover/98 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-150">
          {/* User Profile Header */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/40">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran"
              alt="Avatar"
              className="w-9 h-9 rounded-full bg-muted border border-border/80 object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                Kiran Teja
              </p>
              <p className="text-xs text-muted-foreground truncate">
                kittuplayz123@gmail.com
              </p>
            </div>
          </div>

          <div className="h-px bg-border/60 my-1.5" />

          {/* Theme Selector Segmented Control */}
          <div className="flex items-center justify-between px-3 py-2 text-xs">
            <span className="font-medium text-foreground">Theme</span>
            <div className="flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/80 gap-0.5">
              <button
                type="button"
                onClick={() => setTheme("light")}
                title="Light Mode"
                className={cn(
                  "p-1.5 rounded-md transition-all cursor-pointer",
                  theme === "light"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                title="Dark Mode"
                className={cn(
                  "p-1.5 rounded-md transition-all cursor-pointer",
                  theme === "dark"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                title="System Preference"
                className={cn(
                  "p-1.5 rounded-md transition-all cursor-pointer",
                  theme === "system"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="h-px bg-border/60 my-1" />

          {/* Menu Action Items */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setIsOpen(false)
                setOpenWhatsNew(true)
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer text-left"
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>What&apos;s new</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                setOpenFeedback(true)
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer text-left"
            >
              <MessageSquarePlus className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Feedback</span>
            </button>

            <a
              href="https://github.com/KiranTejz20005/GurukulX"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer text-left"
            >
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Documentation</span>
            </a>

            <a
              href="mailto:support@gurukulx.dev"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer text-left"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Need help?</span>
            </a>
          </div>

          <div className="h-px bg-border/60 my-1" />

          {/* Log Out */}
          <button
            onClick={() => {
              setIsOpen(false)
              window.location.href = "/auth/login"
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      )}

      {/* Trigger Button at Bottom of Sidebar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="User profile menu"
        className={cn(
          "flex items-center gap-3 w-full p-2 rounded-xl transition-all duration-150 text-left cursor-pointer border border-transparent select-none",
          isOpen
            ? "bg-sidebar-accent border-border/80 shadow-xs"
            : "hover:bg-sidebar-accent"
        )}
      >
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran"
          alt="Avatar"
          className="w-8 h-8 rounded-full bg-zinc-800 border border-border/80 flex-shrink-0 object-cover"
        />
        <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-medium text-foreground truncate">Kiran Teja</p>
          <p className="text-xs text-muted-foreground truncate">Admin</p>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-muted-foreground ml-auto group-data-[collapsible=icon]:hidden shrink-0" />
      </button>

      {/* Modals for Feedback and What's New */}
      <FeedbackDialog open={openFeedback} onOpenChange={setOpenFeedback} />
      <WhatsNewDialog open={openWhatsNew} onOpenChange={setOpenWhatsNew} />
    </div>
  )
}
