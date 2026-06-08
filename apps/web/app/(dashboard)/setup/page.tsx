"use client"

import { useState } from "react"
import { BadgeCheck, BookOpen, ChevronRight, FileText, Globe, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const MOCK_SETUP_ITEMS = [
  { id: 'profile', title: 'Update Profile', desc: 'Add your name, avatar, and bio to personalize your account.', isCompleted: true, icon: UserPlus },
  { id: 'org', title: 'Update Organization', desc: 'Set up your academy name, logo, and custom branding.', isCompleted: false, icon: Users },
  { id: 'course', title: 'Create a Course', desc: 'Draft your first course to start teaching.', isCompleted: false, icon: BookOpen },
  { id: 'lesson', title: 'Create a Lesson', desc: 'Add content, videos, or reading materials to your course.', isCompleted: false, icon: FileText },
  { id: 'exercise', title: 'Create an Exercise', desc: 'Add quizzes or assignments to test student knowledge.', isCompleted: false, icon: FileText },
  { id: 'publish', title: 'Publish Course', desc: 'Make your course live and share it with the world.', isCompleted: false, icon: Globe },
]

export default function SetupPage() {
  const [items, setItems] = useState(MOCK_SETUP_ITEMS)
  
  const completedCount = items.filter(i => i.isCompleted).length
  const totalCount = items.length

  const handleAction = (id: string) => {
    // For demo purposes, toggle completion
    setItems(items.map(item => item.id === id ? { ...item, isCompleted: true } : item))
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Get Started</h1>
        <p className="text-muted-foreground mt-2">Complete these steps to set up your learning platform</p>
      </div>

      <div className="border border-border bg-card rounded-xl p-6 mb-8 shadow-sm">
        <p className="text-muted-foreground mb-4 text-sm">
          Complete these steps to set up your learning platform
        </p>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-foreground">
            {completedCount} of {totalCount} completed
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalCount }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i < completedCount ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center p-4 rounded-xl border transition-all ${item.isCompleted ? 'bg-muted/30 border-border opacity-70' : 'bg-card border-border shadow-sm'}`}
          >
            <div className="flex-shrink-0 mr-4">
              {item.isCompleted ? (
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 pr-4">
              <h3 className={`text-base font-semibold ${item.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {item.title}
              </h3>
              <p className={`text-sm mt-0.5 ${item.isCompleted ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>
                {item.desc}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              {item.isCompleted ? (
                <Button variant="secondary" size="sm" disabled className="bg-muted text-muted-foreground">
                  Done
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => handleAction(item.id)}>
                  To do
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
