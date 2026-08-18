import React from "react"
import Link from "next/link"

export default async function PublicAcademyLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode,
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const brandName = (!orgSlug || orgSlug.toLowerCase() === 'demo') 
    ? 'GurukulX' 
    : orgSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Public Header / Nav */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href={`/${orgSlug}`} className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              {brandName.charAt(0).toUpperCase()}
            </div>
            {brandName}
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/${orgSlug}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
            <Link href={`/${orgSlug}/about`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="hidden md:flex bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {brandName}. Powered by GurukulX.
        </div>
      </footer>
    </div>
  )
}
