import React from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
          </div>
          ClassroomIO
        </Link>
      </div>
      
      <div className="w-full max-w-[400px]">
        {children}
      </div>

      <div className="absolute bottom-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ClassroomIO. All rights reserved.
      </div>
    </div>
  )
}
