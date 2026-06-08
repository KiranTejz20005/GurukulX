"use client"

import { ArrowUp, BookOpen, GraduationCap, Award, ChevronDown } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-full p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-10 tracking-tight">What course do you want to create?</h1>

      {/* AI Course Creator Box */}
      <div className="w-full bg-card border border-border rounded-card p-4 shadow-sm mb-8">
        <textarea 
          placeholder="Ask ClassroomIO to create a course for you..." 
          className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm placeholder:text-muted-foreground p-2 h-20 outline-none"
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-muted/50 border border-border px-3 py-1.5 rounded-md text-xs font-medium hover:bg-muted transition-colors">
              Beginner
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button className="flex items-center gap-2 bg-muted/50 border border-border px-3 py-1.5 rounded-md text-xs font-medium hover:bg-muted transition-colors">
              Gemini 3.1 Flash Lite <span className="text-success">$</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          
          <button className="w-8 h-8 rounded-md bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground transition-colors shadow-sm">
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full mb-8">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Or start from a template</span>
        <div className="h-px bg-border flex-1" />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[
          {
            icon: GraduationCap,
            title: "Product 101 Course",
            description: "A fundamentals course teaching customers how to use your product."
          },
          {
            icon: BookOpen,
            title: "Product Onboarding Training",
            description: "An onboarding training that gets new users productive in their first week."
          },
          {
            icon: Award,
            title: "Become an Expert on X",
            description: "A in-depth course turning learners into experts on a specific topic or niche."
          }
        ].map((template) => (
          <button 
            key={template.title}
            className="flex flex-col items-start p-6 rounded-card border border-border bg-card hover:border-primary/50 hover:bg-muted/10 transition-all text-left shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <template.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold text-sm mb-2">{template.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
