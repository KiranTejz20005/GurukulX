"use client"

import * as React from "react"
import {
  Bell,
  CheckCheck,
  Sparkles,
  BookOpen,
  Users,
  Zap,
  ShieldAlert,
  Trash2,
  Check,
  X,
  GraduationCap,
  Key,
  FileCheck2,
  MessageSquare,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications, type Notification } from "@/hooks/useNotifications"

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "AI_COMPLETE":
      return <Sparkles className="w-3.5 h-3.5 text-purple-400" />
    case "COURSE_CREATED":
    case "COURSE_PUBLISHED":
      return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
    case "ENROLLMENT":
      return <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
    case "QUIZ_ATTEMPT":
      return <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
    case "SUBMISSION":
      return <FileCheck2 className="w-3.5 h-3.5 text-teal-400" />
    case "FORUM_POST":
      return <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
    case "MEMBER_JOINED":
      return <Users className="w-3.5 h-3.5 text-indigo-400" />
    case "API_KEY":
      return <Key className="w-3.5 h-3.5 text-rose-400" />
    case "SYSTEM":
    default:
      return <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
  }
}

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [filter, setFilter] = React.useState<"all" | "unread">("all")
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markOneRead,
    markAllRead,
    deleteOne,
    clearAll,
  } = useNotifications(15000)

  // Refresh when panel opens
  React.useEffect(() => {
    if (isOpen) refresh()
  }, [isOpen, refresh])

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen])

  const filtered = notifications.filter((n) =>
    filter === "unread" ? !n.read : true
  )

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notifications-bell-btn"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Open notifications"
        aria-expanded={isOpen}
        className={cn(
          "relative w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 outline-none",
          isOpen
            ? "bg-muted border-primary/40 text-foreground"
            : "bg-muted/30 hover:bg-muted/60 border-border text-muted-foreground hover:text-foreground"
        )}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-background animate-in zoom-in-50 duration-200">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-[22rem] rounded-2xl border border-border bg-popover/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold bg-primary/15 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => refresh()}
                title="Refresh notifications"
                className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border/40 bg-muted/10 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors",
                filter === "all"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors",
                filter === "unread"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40 scrollbar-thin">
            {loading && notifications.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs">Loading notifications…</span>
              </div>
            ) : error ? (
              <div className="py-8 text-center text-xs text-destructive px-4">
                <ShieldAlert className="w-6 h-6 mx-auto mb-2 opacity-60" />
                <p className="font-medium">Could not reach notification service</p>
                <p className="text-muted-foreground mt-1">Make sure the API server is running.</p>
                <button
                  onClick={() => refresh()}
                  className="mt-3 text-primary underline text-[11px] hover:no-underline"
                >
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 px-4 text-center flex flex-col items-center gap-2">
                <Bell className="w-8 h-8 opacity-20 stroke-[1.5]" />
                <p className="text-sm font-medium text-foreground">
                  {filter === "unread" ? "No unread notifications" : "All caught up!"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {filter === "unread"
                    ? "Switch to 'All' to see past notifications."
                    : "New activity across courses, enrollments and forum posts will appear here."}
                </p>
              </div>
            ) : (
              filtered.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "group relative p-3.5 hover:bg-muted/40 transition-colors flex items-start gap-3 select-none cursor-pointer",
                    !notif.read && "bg-primary/5"
                  )}
                  onClick={() => {
                    if (!notif.read) markOneRead(notif.id)
                    if (notif.link) window.location.href = notif.link
                  }}
                >
                  {/* Unread indicator dot */}
                  {!notif.read && (
                    <span className="absolute left-1.5 top-4 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}

                  {/* Icon */}
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/60">
                    <NotificationIcon type={notif.type} />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <span
                        className={cn(
                          "text-xs truncate",
                          !notif.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                        )}
                      >
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70 shrink-0 mt-px">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    {notif.actorName && (
                      <span className="text-[10px] text-primary/80 mt-0.5 block">
                        by {notif.actorName}
                      </span>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); markOneRead(notif.id) }}
                      title={notif.read ? "Mark as unread" : "Mark as read"}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteOne(notif.id) }}
                      title="Dismiss"
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/60 bg-muted/20 text-xs text-muted-foreground">
              <span>{notifications.length} total · syncs every 15s</span>
              <button
                onClick={clearAll}
                className="text-[11px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
