"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { LeftPanel } from "@/components/builder/LeftPanel"
import { MiddlePanel } from "@/components/builder/MiddlePanel"
import { RightPanel } from "@/components/builder/RightPanel"
import { api } from "@/lib/api"

export default function CourseBuilderPage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  const fetchCourse = () => {
    api.courses.getOne(courseId)
      .then(data => {
        setCourse(data)
        if (!activeModuleId && data.modules?.length > 0) {
          setActiveModuleId(data.modules[0].id)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load course", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  if (loading) return <div className="flex h-screen items-center justify-center bg-background text-foreground">Loading builder...</div>

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      <LeftPanel 
        course={course} 
        activeModuleId={activeModuleId} 
        setActiveModuleId={setActiveModuleId} 
        activeLessonId={activeLessonId}
        setActiveLessonId={setActiveLessonId}
        onUpdate={fetchCourse} 
      />
      <MiddlePanel 
        course={course} 
        activeModuleId={activeModuleId} 
        activeLessonId={activeLessonId}
        onUpdate={fetchCourse} 
      />
      <RightPanel />
    </div>
  )
}
