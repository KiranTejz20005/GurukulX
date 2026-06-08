"use client"

import Link from "next/link"
import { PlayCircle, Clock, Star, CheckCircle2, ChevronRight, Lock } from "lucide-react"

export default function CourseDetailsPage({ params }: { params: { orgSlug: string, courseSlug: string } }) {
  // Mock course data based on the slug
  const title = params.courseSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const modules = [
    {
      title: "Module 1: Getting Started",
      duration: "45m",
      lessons: [
        { title: "Introduction to the course", duration: "5m", isFree: true },
        { title: "Setting up your environment", duration: "15m", isFree: true },
        { title: "Basic concepts overview", duration: "25m", isFree: false }
      ]
    },
    {
      title: "Module 2: Core Concepts",
      duration: "2h 15m",
      lessons: [
        { title: "Deep dive into state", duration: "45m", isFree: false },
        { title: "Component lifecycle", duration: "40m", isFree: false },
        { title: "Performance optimization", duration: "50m", isFree: false }
      ]
    }
  ]

  return (
    <div className="flex-1 w-full bg-background">
      {/* Course Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-4 uppercase tracking-wider">
              <span>Development</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <span>Beginner Friendly</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Master the fundamentals and build production-ready applications with this comprehensive, step-by-step guide.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> 4.5 hours on-demand</div>
              <div className="flex items-center gap-2 text-yellow-500"><Star className="w-5 h-5 fill-current" /> 4.9 (120 reviews)</div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href={`/${params.orgSlug}/course/${params.courseSlug}/lesson/introduction-to-the-course`}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-transform hover:scale-105 shadow-lg shadow-primary/20"
              >
                Enroll Now - $49
              </Link>
            </div>
          </div>
          
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2000&auto=format&fit=crop" 
              alt="Course Thumbnail" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:scale-110 transition-transform">
                <PlayCircle className="w-10 h-10 text-white ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        <div className="lg:col-span-2 space-y-16">
          {/* What you'll learn */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">What you'll learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-8 rounded-2xl border border-border">
              {[
                "Build full-stack applications from scratch",
                "Master modern UI design principles",
                "Deploy your projects to production",
                "Implement secure authentication",
                "Optimize performance and SEO",
                "Write clean, maintainable code"
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {modules.map((mod, i) => (
                <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
                  <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{mod.title}</h3>
                    <span className="text-sm text-muted-foreground">{mod.duration}</span>
                  </div>
                  <div className="divide-y divide-border">
                    {mod.lessons.map((lesson, j) => (
                      <div key={j} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                        <div className="flex items-center gap-3">
                          {lesson.isFree ? (
                            <PlayCircle className="w-5 h-5 text-primary" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className={`text-sm ${lesson.isFree ? 'text-foreground group-hover:text-primary transition-colors cursor-pointer underline-offset-4 group-hover:underline' : 'text-muted-foreground'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {lesson.isFree && <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">Preview</span>}
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-8">
            <h3 className="font-bold text-lg mb-4">This course includes:</h3>
            <ul className="space-y-4 text-sm text-muted-foreground mb-8">
              <li className="flex items-center gap-3"><PlayCircle className="w-5 h-5" /> 4.5 hours on-demand video</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5" /> 12 downloadable resources</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5" /> Full lifetime access</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5" /> Certificate of completion</li>
            </ul>
            <Link 
              href={`/${params.orgSlug}/course/${params.courseSlug}/lesson/introduction-to-the-course`}
              className="w-full block text-center bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Enroll Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
