import React from "react"
import Link from "next/link"
import { Award, Users, BookOpen, ShieldCheck, ArrowRight } from "lucide-react"

export default async function AboutPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params
  const brandName = (!orgSlug || orgSlug.toLowerCase() === 'demo')
    ? 'GurukulX'
    : orgSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="flex-1 w-full bg-background text-foreground py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            About Our Academy
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Empowering Learning at {brandName}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We build modern, engaging, and outcome-oriented educational programs for our learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Expert Curated</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every course is built and vetted by domain leaders with interactive exercises and modular lessons.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Industry Recognized</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Earn verifiable certificates of completion to showcase on your professional portfolio.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Vibrant Community</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engage with mentors, peer learners, and study groups through built-in forum discussions.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to start learning?</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Browse our course catalog and enroll in your first course today.
          </p>
          <div className="pt-2">
            <Link 
              href={`/${orgSlug}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md"
            >
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
