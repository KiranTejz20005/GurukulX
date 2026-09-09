"use client"

import { useState, useEffect } from "react"
import {
  Layers,
  Plus,
  Code2,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  X,
  Palette,
  Layout,
  BookOpen,
} from "lucide-react"
import { api } from "@/lib/api"

interface WidgetItem {
  id: string
  name: string
  theme: string
  layout: string
  primaryColor: string
  courses: Array<{
    course: {
      id: string
      title: string
      thumbnail?: string
      type: string
    }
  }>
  _count?: {
    courses: number
  }
}

interface CourseOption {
  id: string
  title: string
}

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<WidgetItem[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [widgetName, setWidgetName] = useState("")
  const [widgetTheme, setWidgetTheme] = useState("dark")
  const [widgetLayout, setWidgetLayout] = useState("grid")
  const [widgetColor, setWidgetColor] = useState("#3b82f6")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [wList, cList] = await Promise.all([
        api.widgets.findAll(),
        api.courses.getAll().catch(() => []),
      ])
      setWidgets(wList)
      setCourses(cList)
    } catch (err) {
      console.error("Failed to load widgets:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateWidget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!widgetName.trim()) return
    try {
      setSaving(true)
      await api.widgets.create({
        name: widgetName.trim(),
        theme: widgetTheme,
        layout: widgetLayout,
        primaryColor: widgetColor,
        courseIds: selectedCourses,
      })
      setIsModalOpen(false)
      setWidgetName("")
      setSelectedCourses([])
      loadData()
    } catch (err) {
      console.error("Failed to create widget:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this embed widget?")) return
    try {
      await api.widgets.delete(id)
      loadData()
    } catch (err) {
      console.error("Failed to delete widget:", err)
    }
  }

  const copyEmbedCode = (widgetId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    const snippet = `<iframe src="${origin}/embed/${widgetId}" width="100%" height="500" frameborder="0" style="border-radius:12px; overflow:hidden;"></iframe>`
    navigator.clipboard.writeText(snippet)
    setCopiedId(widgetId)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const toggleCourseSelect = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    )
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Embeddable Widgets</h1>
          <p className="text-sm text-gray-400 mt-1">
            Build custom course carousels and grids to embed seamlessly into any website or marketing page.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Widget
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading widgets...</p>
        </div>
      ) : widgets.length === 0 ? (
        /* Empty State */
        <div className="flex items-center justify-center pt-8">
          <div className="w-[700px] bg-[#0d1117] border border-white/10 border-dashed rounded-2xl p-14 flex flex-col items-center text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <Layers className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No widgets created yet</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-[360px] leading-relaxed">
              Create an embeddable widget to showcase your courses anywhere with an iframe snippet.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Create First Widget
            </button>
          </div>
        </div>
      ) : (
        /* Widgets Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => {
            const isCopied = copiedId === widget.id
            return (
              <div
                key={widget.id}
                className="bg-[#0f141c] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: widget.primaryColor }}
                      />
                      <h3 className="text-base font-semibold text-white">{widget.name}</h3>
                    </div>
                    <span className="text-[11px] font-medium uppercase px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                      {widget.layout}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1 mb-4">
                    <div className="flex items-center gap-2">
                      <Palette className="w-3.5 h-3.5 text-gray-500" />
                      <span>Theme: <strong className="text-gray-300 capitalize">{widget.theme}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                      <span>Courses: <strong className="text-gray-300">{widget.courses?.length || 0}</strong></span>
                    </div>
                  </div>

                  {/* Course thumbnails preview */}
                  <div className="h-16 bg-[#161f2e] rounded-xl p-2 flex items-center gap-2 overflow-x-auto border border-white/5 mb-4">
                    {widget.courses && widget.courses.length > 0 ? (
                      widget.courses.map((wc, i) => (
                        <div
                          key={i}
                          className="px-2.5 py-1 bg-white/5 rounded-lg text-[11px] text-gray-300 font-medium whitespace-nowrap border border-white/5"
                        >
                          {wc.course?.title || "Course"}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 px-2">No courses selected</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    onClick={() => copyEmbedCode(widget.id)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition flex items-center gap-1.5"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? "Copied!" : "Copy Embed Code"}
                  </button>

                  <button
                    onClick={() => handleDelete(widget.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Delete Widget"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal: Create Widget */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111823] border border-white/15 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Create Course Widget</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateWidget} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Widget Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Homepage Featured Courses"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                    Layout
                  </label>
                  <select
                    value={widgetLayout}
                    onChange={(e) => setWidgetLayout(e.target.value)}
                    className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="grid">Grid</option>
                    <option value="carousel">Carousel</option>
                    <option value="list">List</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                    Theme
                  </label>
                  <select
                    value={widgetTheme}
                    onChange={(e) => setWidgetTheme(e.target.value)}
                    className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="dark">Dark Theme</option>
                    <option value="light">Light Theme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={widgetColor}
                    onChange={(e) => setWidgetColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-gray-300">{widgetColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Select Courses to Include ({selectedCourses.length})
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 bg-[#1b2535] border border-white/10 rounded-xl p-3">
                  {courses.length === 0 ? (
                    <p className="text-xs text-gray-500">No courses available in this workspace</p>
                  ) : (
                    courses.map((c) => {
                      const isSelected = selectedCourses.includes(c.id)
                      return (
                        <div
                          key={c.id}
                          onClick={() => toggleCourseSelect(c.id)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs font-medium transition ${
                            isSelected
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                              : "text-gray-300 hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <span className="truncate">{c.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !widgetName.trim()}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create Widget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
