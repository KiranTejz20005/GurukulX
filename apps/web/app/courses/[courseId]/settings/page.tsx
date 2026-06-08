"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Save, Image as ImageIcon, Globe, Lock, Unlock } from "lucide-react"

export default function CourseSettingsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [courseTitle, setCourseTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  // Mock initial data fetch
  useEffect(() => {
    setCourseTitle(params.courseId ? String(params.courseId).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "")
    setDescription("Master the fundamentals and build production-ready applications with this comprehensive, step-by-step guide.")
  }, [params.courseId])

  const handleSave = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Course Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your course configuration and visibility.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-4">General Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Course Title</label>
            <input 
              type="text" 
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary h-32 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Course Thumbnail</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 cursor-pointer transition-colors">
              <ImageIcon className="w-8 h-8 mb-4 opacity-50" />
              <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
              <p className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-4">Access & Visibility</h2>
          
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-start gap-3">
              <div className={`mt-1 p-2 rounded-md ${isPublic ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                {isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Public Status</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isPublic ? "Your course is live and visible to the public." : "Your course is currently hidden from the public catalog."}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsPublic(!isPublic)}
              className="px-4 py-2 border border-border bg-background rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              {isPublic ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
