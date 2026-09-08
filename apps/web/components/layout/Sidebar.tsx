"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, LayoutDashboard, BarChart2, Settings as SettingsIcon, BookOpen, Layers, ImageIcon, Tags, Grid, MessageSquare, Users, Zap, ChevronDown, ChevronRight, Code, Workflow 
} from "lucide-react"
import { EarlyAdopterCard } from "@/components/layout/EarlyAdopterCard"
import { UserNavPopover } from "@/components/layout/UserNavPopover"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 w-full px-2 py-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-[11px] font-bold text-white">
            <span className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm truncate text-foreground">GurukulX</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/80">
              Free
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group, groupIdx) => {
          const menuContent = (
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (pathname !== "/" &&
                    item.href !== "/" &&
                    pathname.startsWith(item.href))

                if (item.subItems) {
                  return (
                    <Collapsible
                      key={item.href}
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.label}
                            isActive={isActive}
                          >
                            <item.icon />
                            <span>{item.label}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((sub) => (
                              <SidebarMenuSubItem key={sub.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === sub.href}
                                >
                                  <Link href={sub.href}>
                                    <span>{sub.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={isActive}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          )

          if (!group.title) {
            return (
              <SidebarGroup key={groupIdx}>
                <SidebarGroupContent>{menuContent}</SidebarGroupContent>
              </SidebarGroup>
            )
          }

          return (
            <Collapsible
              key={group.title}
              defaultOpen
              className="group/collapsible-group"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2 py-1.5 rounded-md transition-colors cursor-pointer select-none group/trigger text-sidebar-foreground/70">
                    <span className="font-semibold text-xs tracking-wider uppercase">
                      {group.title}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=closed]/collapsible-group:-rotate-90 group-hover/trigger:text-sidebar-accent-foreground" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>{menuContent}</SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="p-0 gap-1 border-t border-border/40">
        <EarlyAdopterCard />
        <div className="px-2 pb-2">
          <UserNavPopover />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
