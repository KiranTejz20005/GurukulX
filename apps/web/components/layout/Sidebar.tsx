"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Home, LayoutDashboard, BarChart2, Settings as SettingsIcon, BookOpen, Layers, Image as ImageIcon, Tags, Grid, MessageSquare, Users, Zap, ChevronDown, ChevronRight, Activity, Code, Workflow } from "lucide-react"

const NAV_GROUPS = [
  {
    title: "Home",
    items: [
      { label: "Home", icon: Home, href: "/" },
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { 
        label: "Stats", 
        icon: BarChart2, 
        href: "/stats",
        subItems: [
          { label: "Analytics", href: "/stats/analytics" },
          { label: "Compliance", href: "/stats/compliance" }
        ]
      },
      { label: "Setup", icon: SettingsIcon, href: "/setup" },
    ]
  },
  {
    title: "Content",
    items: [
      { label: "Courses", icon: BookOpen, href: "/courses" },
      { label: "Programs", icon: Layers, href: "/programs" },
      { label: "Media", icon: ImageIcon, href: "/media" },
      { label: "Tags", icon: Tags, href: "/tags" },
      { label: "Widgets", icon: Grid, href: "/widgets" },
    ]
  },
  {
    title: "People",
    items: [
      { label: "Community", icon: MessageSquare, href: "/community" },
      { label: "Audience", icon: Users, href: "/audience" },
    ]
  },
  {
    title: "Automation",
    items: [
      { label: "MCP", icon: Zap, href: "/mcp" },
      { label: "API", icon: Code, href: "/api-settings" },
      { label: "Zapier", icon: Workflow, href: "/zapier" },
    ]
  },
  {
    title: "Settings",
    items: [
      { 
        label: "Settings", 
        icon: SettingsIcon, 
        href: "/settings",
        subItems: [
          { label: "General", href: "/settings/general" },
          { label: "Billing", href: "/settings/billing" }
        ]
      },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "/stats": true // default open based on image
  })

  const toggleExpand = (href: string) => {
    setExpandedItems(prev => ({ ...prev, [href]: !prev[href] }))
  }

  return (
    <aside className="w-[260px] h-screen bg-[#09090b] border-r border-border flex flex-col flex-shrink-0 text-gray-300">
      {/* Organization Switcher */}
      <div className="h-14 px-4 flex items-center border-b border-border">
        <button className="flex items-center gap-3 w-full px-1 py-1.5 rounded-md hover:bg-white/5 transition-colors">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-[11px] font-bold text-white">
            <span className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <span className="font-semibold text-sm text-gray-200 truncate">ClassroomIO</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300 font-medium">Free</span>
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className="px-3 mb-2 text-[11px] font-medium text-gray-500 capitalize tracking-wide">
              {group.title}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (pathname !== "/" && item.href !== "/" && pathname.startsWith(item.href));
                const isExpanded = expandedItems[item.href];

                return (
                  <div key={item.href}>
                    {item.subItems ? (
                      <button
                        onClick={() => toggleExpand(item.href)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive 
                            ? "bg-blue-600/10 text-blue-500" 
                            : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive 
                            ? "bg-blue-600/10 text-blue-500" 
                            : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    )}

                    {/* SubItems */}
                    {item.subItems && isExpanded && (
                      <div className="mt-1 mb-2 ml-4 pl-4 border-l border-white/10 flex flex-col gap-1">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              pathname === sub.href
                                ? "bg-blue-600/10 text-blue-500"
                                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Banner (Bottom) */}
      <div className="px-4 pb-4 mt-auto">
        <div className="bg-black border border-white/10 rounded-xl p-5 text-center shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Zap className="w-5 h-5 mx-auto text-blue-500 mb-3" />
          <h5 className="font-semibold text-sm text-gray-200 mb-1.5">Become an Early Adopter</h5>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed px-1">
            Unlock unlimited features and invest in our future
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            Upgrade Now
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border bg-[#09090b]">
        <button className="flex items-center gap-3 w-full hover:bg-white/5 p-2 rounded-lg transition-colors text-left justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran" alt="Avatar" className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">Kiran Teja Lanke</p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </aside>
  )
}
