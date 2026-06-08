"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, Settings, Users, PenTool, LayoutDashboard } from "lucide-react"

export default function CourseLayout({ children, params }: { children: React.ReactNode, params: { courseId: string } }) {
  const pathname = usePathname()
  
  const tabs = [
    { name: "Builder", href: `/courses/${params.courseId}/builder`, icon: PenTool },
    { name: "Settings", href: `/courses/${params.courseId}/settings`, icon: Settings },
    { name: "People & Marks", href: `/courses/${params.courseId}/people`, icon: Users },
    { name: "Exercises", href: `/courses/${params.courseId}/exercises`, icon: LayoutDashboard },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Course Header Navigation */}
      <header className="h-16 border-b border-border bg-card shrink-0 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/courses" className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Courses</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold text-foreground text-sm">Course Management</h1>
        </div>

        <nav className="flex items-center gap-1">
          {tabs.map(tab => {
            const isActive = pathname.startsWith(tab.href)
            return (
              <Link 
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
