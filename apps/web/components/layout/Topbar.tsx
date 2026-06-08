import { Search, Bell, ExternalLink } from "lucide-react"

export function Topbar() {
  return (
    <header className="h-14 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium border border-border">
            ST
          </div>
          <span className="font-medium text-foreground">St.Peter's Engineering College</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Progress & Quick Links */}
        <div className="flex items-center gap-3 pr-4 border-r border-border">
          <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">17%</span>
          </div>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5">
            Open Academy
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Global Search Button */}
        <button className="flex items-center justify-between bg-muted/30 hover:bg-muted/50 border border-border px-3 py-1.5 rounded-md w-64 text-sm text-muted-foreground transition-colors group">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 group-hover:text-foreground transition-colors" />
            <span>Search</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="bg-background border border-border rounded px-1.5 py-0.5 text-[10px] font-medium font-sans">⌘</kbd>
            <kbd className="bg-background border border-border rounded px-1.5 py-0.5 text-[10px] font-medium font-sans">K</kbd>
          </div>
        </button>

        {/* Notifications */}
        <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted/50 text-muted-foreground transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
