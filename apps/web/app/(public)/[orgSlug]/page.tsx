"use client"

import Link from "next/link"
import { Search, Filter, BookOpen, Clock, Star, PlayCircle } from "lucide-react"

export default function AcademyHomePage({ params }: { params: { orgSlug: string } }) {
  // Mock courses
  const courses = [
    {
      id: "1",
      slug: "intro-to-design",
      title: "Introduction to User Interface Design",
      description: "Learn the fundamentals of UI design, color theory, and typography from industry experts.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
      instructor: "Jane Smith",
      duration: "4 hours",
      rating: 4.8,
      price: "$49"
    },
    {
      id: "2",
      slug: "advanced-react",
      title: "Advanced React Patterns",
      description: "Master React context, custom hooks, and performance optimization techniques for large scale apps.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2000&auto=format&fit=crop",
      instructor: "John Doe",
      duration: "6.5 hours",
      rating: 4.9,
      price: "$89"
    },
    {
      id: "3",
      slug: "marketing-101",
      title: "Digital Marketing 101",
      description: "A comprehensive guide to SEO, content marketing, and paid advertising strategies.",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2000&auto=format&fit=crop",
      instructor: "Sarah Jenkins",
      duration: "3 hours",
      rating: 4.7,
      price: "Free"
    }
  ]

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Welcome to {params.orgSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Expand your skills with our premium courses taught by industry professionals.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for courses..."
              className="w-full bg-background border-none rounded-full py-4 pl-12 pr-6 text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">All Courses</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link key={course.id} href={`/${params.orgSlug}/course/${course.slug}`} className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                <img src={course.image} alt={course.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur text-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {course.price}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>
                    <span className="flex items-center gap-1.5 text-yellow-500"><Star className="w-4 h-4 fill-current" /> {course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary font-medium">
                    <PlayCircle className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
