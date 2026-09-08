"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Search,
  Home,
  BookOpen,
  FolderKanban,
  FileVideo,
  Users,
  MessageSquare,
  Bot,
  Code2,
  Zap,
  Settings,
  PlusCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  Trash2,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  category: "Navigation" | "Actions" | "Tools" | "Quick Links"
  keywords?: string[]
  action: () => void
  badge?: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ isOpen, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("gurukulx_recent_commands")
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return
    const updated = [term, ...recentSearches.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 5)
    setRecentSearches(updated)
    try {
      localStorage.setItem("gurukulx_recent_commands", JSON.stringify(updated))
    } catch {
      // Ignore
    }
  }

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRecentSearches([])
    try {
      localStorage.removeItem("gurukulx_recent_commands")
    } catch {
      // Ignore
    }
  }

  const handleNavigate = (url: string, title?: string) => {
    if (title) saveRecentSearch(title)
    onOpenChange(false)
    router.push(url)
  }

  const commandItems: CommandItem[] = React.useMemo(
    () => [
      // Quick Actions
      {
        id: "action-new-course",
        title: "Create New Course",
        description: "Draft a new course with AI assistance or start blank",
        icon: PlusCircle,
        category: "Actions",
        keywords: ["new", "create", "course", "ai", "builder", "draft"],
        badge: "AI Powered",
        action: () => handleNavigate("/courses", "Create New Course"),
      },
      {
        id: "action-new-program",
        title: "Create Program / Cohort",
        description: "Organize courses into structured learning tracks",
        icon: FolderKanban,
        category: "Actions",
        keywords: ["program", "cohort", "track", "curriculum"],
        action: () => handleNavigate("/programs", "Create Program"),
      },
      {
        id: "action-upload-media",
        title: "Upload Media & Assets",
        description: "Manage videos, images, and course documents",
        icon: FileVideo,
        category: "Actions",
        keywords: ["media", "video", "upload", "file", "asset", "pdf"],
        action: () => handleNavigate("/media", "Upload Media"),
      },
      {
        id: "action-open-academy",
        title: "Open Learner Academy",
        description: "Preview public portal for enrolled students",
        icon: ExternalLink,
        category: "Actions",
        keywords: ["preview", "academy", "portal", "student", "view"],
        action: () => {
          onOpenChange(false)
          window.open("/", "_blank")
        },
      },

      // Navigation
      {
        id: "nav-home",
        title: "Home / AI Course Builder",
        description: "Generate courses with prompt-based builder",
        icon: Sparkles,
        category: "Navigation",
        keywords: ["home", "builder", "ai", "prompt", "generator"],
        action: () => handleNavigate("/", "Home"),
      },
      {
        id: "nav-courses",
        title: "Courses Library",
        description: "View, edit, and manage all your courses",
        icon: BookOpen,
        category: "Navigation",
        keywords: ["courses", "lessons", "modules", "curriculum"],
        action: () => handleNavigate("/courses", "Courses Library"),
      },
      {
        id: "nav-programs",
        title: "Programs",
        description: "Structured learning paths and certificate tracks",
        icon: FolderKanban,
        category: "Navigation",
        keywords: ["programs", "degrees", "tracks", "paths"],
        action: () => handleNavigate("/programs", "Programs"),
      },
      {
        id: "nav-media",
        title: "Media Library",
        description: "Video hosting, documents, and media management",
        icon: FileVideo,
        category: "Navigation",
        keywords: ["media", "storage", "video", "cdn", "assets"],
        action: () => handleNavigate("/media", "Media Library"),
      },
      {
        id: "nav-community",
        title: "Community Discussions",
        description: "Learner engagement, questions, and discussion boards",
        icon: MessageSquare,
        category: "Navigation",
        keywords: ["community", "forums", "discussion", "chat", "comments"],
        action: () => handleNavigate("/community", "Community Discussions"),
      },
      {
        id: "nav-audience",
        title: "Audience & Learners",
        description: "Student rosters, progress tracking, and enrollments",
        icon: Users,
        category: "Navigation",
        keywords: ["audience", "students", "learners", "users", "enrollment"],
        action: () => handleNavigate("/audience", "Audience & Learners"),
      },

      // Tools & Integrations
      {
        id: "tool-mcp",
        title: "MCP Server Integration",
        description: "Connect Model Context Protocol tools & agents",
        icon: Bot,
        category: "Tools",
        keywords: ["mcp", "model context protocol", "agent", "ai", "llm"],
        badge: "Beta",
        action: () => handleNavigate("/mcp", "MCP Server Integration"),
      },
      {
        id: "tool-api",
        title: "API Keys & Developer Webhooks",
        description: "Manage REST endpoints and developer credentials",
        icon: Code2,
        category: "Tools",
        keywords: ["api", "keys", "webhook", "endpoints", "dev"],
        action: () => handleNavigate("/api", "API Keys"),
      },
      {
        id: "tool-zapier",
        title: "Zapier & Webhooks Automation",
        description: "Connect 5000+ apps with event triggers",
        icon: Zap,
        category: "Tools",
        keywords: ["zapier", "automation", "triggers", "workflows"],
        action: () => handleNavigate("/zapier", "Zapier Automation"),
      },
      {
        id: "tool-settings",
        title: "Workspace & Organization Settings",
        description: "Custom domain, branding, billing, and team roles",
        icon: Settings,
        category: "Tools",
        keywords: ["settings", "admin", "config", "billing", "domain", "branding"],
        action: () => handleNavigate("/settings", "Settings"),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Filter items based on query
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return commandItems

    const terms = query.toLowerCase().split(" ").filter(Boolean)
    return commandItems.filter((item) => {
      const matchText = [
        item.title,
        item.description || "",
        item.category,
        ...(item.keywords || []),
      ]
        .join(" ")
        .toLowerCase()

      return terms.every((term) => matchText.includes(term))
    })
  }, [commandItems, query])

  // Reset selection index on search change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Focus input on open
  React.useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action()
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      onOpenChange(false)
    }
  }

  // Scroll active item into view
  React.useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  // Group filtered items by category
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filteredItems.forEach((item) => {
      const categoryItems = groups[item.category] || []
      categoryItems.push(item)
      groups[item.category] = categoryItems
    })
    return groups
  }, [filteredItems])

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={handleKeyDown}
          className="fixed left-[50%] top-[20%] sm:top-[25%] z-50 w-[95vw] max-w-2xl translate-x-[-50%] overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[15%] data-[state=open]:slide-in-from-top-[15%]"
        >
          {/* Header Search Input */}
          <div className="flex items-center border-b border-border/60 px-4 py-3.5 gap-3 bg-muted/20">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, page, action, or press Esc to exit..."
              className="flex h-7 w-full rounded-md bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
              ESC
            </kbd>
          </div>

          {/* Quick Recent Badges when query is empty */}
          {!query && recentSearches.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border-b border-border/40 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="shrink-0 text-[11px] font-medium">Recent:</span>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="shrink-0 bg-muted/40 hover:bg-muted border border-border/60 hover:text-foreground text-[11px] px-2 py-0.5 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <button
                onClick={clearRecentSearches}
                title="Clear recent searches"
                className="shrink-0 text-[10px] text-muted-foreground/70 hover:text-destructive transition-colors ml-2"
              >
                <Trash2 className="w-3 h-3 inline mr-1" />
                Clear
              </button>
            </div>
          )}

          {/* Results List */}
          <div
            ref={listRef}
            className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin"
          >
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Search className="w-8 h-8 opacity-30 stroke-[1.5]" />
                <p className="font-medium text-foreground">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-muted-foreground">
                  Try searching for keywords like &ldquo;course&rdquo;, &ldquo;media&rdquo;, &ldquo;api&rdquo;, or &ldquo;settings&rdquo;.
                </p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-3 last:mb-0">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const globalIndex = filteredItems.findIndex((i) => i.id === item.id)
                      const isSelected = globalIndex === selectedIndex

                      const Icon = item.icon

                      return (
                        <div
                          key={item.id}
                          data-index={globalIndex}
                          onClick={() => item.action()}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-all select-none",
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                              : "hover:bg-muted/60 text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                                isSelected
                                  ? "bg-primary-foreground/15 border-primary-foreground/20 text-primary-foreground"
                                  : "bg-muted/40 border-border/80 text-muted-foreground group-hover:text-foreground"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium truncate flex items-center gap-2">
                                {item.title}
                                {item.badge && (
                                  <span
                                    className={cn(
                                      "text-[10px] font-semibold px-1.5 py-0.2 rounded-full border",
                                      isSelected
                                        ? "bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground"
                                        : "bg-primary/10 border-primary/20 text-primary"
                                    )}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </span>
                              {item.description && (
                                <span
                                  className={cn(
                                    "text-xs truncate transition-colors",
                                    isSelected
                                      ? "text-primary-foreground/80"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </div>

                          <ArrowRight
                            className={cn(
                              "h-4 w-4 shrink-0 transition-transform duration-200",
                              isSelected
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-1"
                            )}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls / Shortcuts */}
          <div className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-background px-1.5 py-0.5 border border-border text-[10px] font-mono">↑</kbd>
                <kbd className="rounded bg-background px-1.5 py-0.5 border border-border text-[10px] font-mono">↓</kbd>
                <span>to navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-background px-1.5 py-0.5 border border-border text-[10px] font-mono">↵</kbd>
                <span>to select</span>
              </span>
            </div>
            <span className="text-muted-foreground/80">GurukulX Command Center</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
