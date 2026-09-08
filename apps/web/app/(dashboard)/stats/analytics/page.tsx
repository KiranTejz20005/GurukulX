"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Download,
  Search,
  ArrowUpRight,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  Clock,
  ArrowRight,
  FileCheck2,
  AlertCircle
} from "lucide-react"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  summary: {
    totalCourses: number
    publishedCourses: number
    totalLearners: number
    totalEnrollments: number
    totalLessons: number
    totalCompletedLessons: number
    overallCompletionRate: number
    averageQuizScore: number
    quizPassRate: number
    totalSubmissions: number
    activeLearnersLast7Days: number
  }
  coursesBreakdown: Array<{
    id: string
    title: string
    description: string | null
    published: boolean
    instructorName: string
    enrollmentsCount: number
    modulesCount: number
    lessonsCount: number
    completedLearnersCount: number
    inProgressLearnersCount: number
    completionRate: number
    averageQuizScore: number
    createdAt: string
  }>
  activityTimeline: Array<{
    date: string
    enrollments: number
    completions: number
    quizAttempts: number
  }>
  recentActivity: Array<{
    id: string
    type: "ENROLLMENT" | "QUIZ_ATTEMPT" | "SUBMISSION"
    user: string
    email: string
    courseTitle: string
    timestamp: string
    details: string
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedRange, setSelectedRange] = React.useState<"7D" | "30D" | "90D" | "ALL">("30D")
  const [lastUpdated, setLastUpdated] = React.useState<string>("")

  const fetchAnalytics = React.useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true)
    setError(null)
    try {
      const res = await api.stats.getAnalytics()
      setData(res)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err)
      setError("Failed to load analytics data from server. Please check your connection.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Filtered courses based on search
  const filteredCourses = React.useMemo(() => {
    if (!data?.coursesBreakdown) return []
    if (!searchQuery.trim()) return data.coursesBreakdown

    const q = searchQuery.toLowerCase()
    return data.coursesBreakdown.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    )
  }, [data, searchQuery])

  // CSV Export functionality
  const handleExportCSV = () => {
    if (!data?.coursesBreakdown || data.coursesBreakdown.length === 0) return

    const headers = [
      "Course Title",
      "Instructor",
      "Published",
      "Enrolled Learners",
      "Modules",
      "Lessons",
      "Completed Learners",
      "In Progress",
      "Completion Rate (%)",
      "Avg Quiz Score (%)",
    ]

    const rows = data.coursesBreakdown.map((c) => [
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.instructorName.replace(/"/g, '""')}"`,
      c.published ? "Yes" : "No",
      c.enrollmentsCount,
      c.modulesCount,
      c.lessonsCount,
      c.completedLearnersCount,
      c.inProgressLearnersCount,
      `${c.completionRate}%`,
      `${c.averageQuizScore}%`,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `gurukulx_analytics_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading && !data) {
    return (
      <div className="p-6 sm:p-8 max-w-[1400px] mx-auto space-y-8 animate-pulse text-muted-foreground">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted/60 rounded-lg" />
            <div className="h-4 w-96 bg-muted/40 rounded-md" />
          </div>
          <div className="h-10 w-28 bg-muted/60 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted/30 border border-border/50 rounded-2xl p-5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-muted/30 border border-border/50 rounded-2xl" />
          <div className="h-80 bg-muted/30 border border-border/50 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto space-y-8 text-foreground">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Analytics & Insights
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time learner engagement, course completion metrics, and assessment benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Selector */}
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border text-xs">
            {(["7D", "30D", "90D", "ALL"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-medium transition-all",
                  selectedRange === range
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-foreground bg-muted/40 hover:bg-muted border border-border rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin text-primary")} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm shadow-primary/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-[11px] text-muted-foreground/70 -mt-5">
          Last updated at {lastUpdated}
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchAnalytics(true)}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Learners */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Learners
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {data?.summary.totalLearners ?? 0}
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5 inline" />
              Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {data?.summary.totalEnrollments ?? 0} total course enrollments
          </p>
        </div>

        {/* Completion Rate */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Avg Completion Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {data?.summary.overallCompletionRate ?? 0}%
            </span>
            <span className="text-xs font-medium text-muted-foreground">overall</span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, data?.summary.overallCompletionRate ?? 0)}%` }}
            />
          </div>
        </div>

        {/* Active Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Curriculum Courses
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {data?.summary.totalCourses ?? 0}
            </span>
            <span className="text-xs font-medium text-purple-400">
              {data?.summary.publishedCourses ?? 0} published
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {data?.summary.totalLessons ?? 0} total modular lessons
          </p>
        </div>

        {/* Assessment Benchmark */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Assessment Pass Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {data?.summary.quizPassRate ?? 0}%
            </span>
            <span className="text-xs font-medium text-amber-400">
              {data?.summary.averageQuizScore ?? 0}% avg
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {data?.summary.totalSubmissions ?? 0} projects submitted
          </p>
        </div>
      </div>

      {/* Center Grid: Activity Timeline Chart & Engagement Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Learner Activity & Completions
                </h2>
                <p className="text-xs text-muted-foreground">
                  Daily distribution of enrollments, lesson completions, and quiz submissions.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  Completions
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Enrollments
                </span>
              </div>
            </div>

            {/* Custom SVG / CSS Bar Visualization */}
            <div className="h-56 w-full flex items-end justify-between gap-2 pt-8 pb-2 px-2">
              {(data?.activityTimeline || []).map((item, idx) => {
                const maxVal = 10
                const completionHeight = Math.max(12, (item.completions / maxVal) * 160)
                const enrollmentHeight = Math.max(8, (item.enrollments / maxVal) * 120)

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Completion Bar */}
                      <div
                        className="w-3.5 sm:w-5 bg-primary/80 group-hover:bg-primary rounded-t-md transition-all relative"
                        style={{ height: `${completionHeight}px` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded shadow border border-border whitespace-nowrap z-10 pointer-events-none">
                          {item.completions} completions
                        </div>
                      </div>

                      {/* Enrollment Bar */}
                      <div
                        className="w-3.5 sm:w-5 bg-emerald-500/70 group-hover:bg-emerald-500 rounded-t-md transition-all relative"
                        style={{ height: `${enrollmentHeight}px` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded shadow border border-border whitespace-nowrap z-10 pointer-events-none">
                          {item.enrollments} enrolled
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.date}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Aggregated across all registered students</span>
            <span className="font-medium text-foreground">Updated in real-time</span>
          </div>
        </div>

        {/* Live Recent Activity Stream */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
                <p className="text-xs text-muted-foreground">Latest actions from active learners</p>
              </div>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
              {(data?.recentActivity || []).length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No recent activity recorded yet.
                </div>
              ) : (
                data?.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors border border-border/40"
                  >
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      {activity.type === "ENROLLMENT" && <GraduationCap className="w-3.5 h-3.5" />}
                      {activity.type === "QUIZ_ATTEMPT" && <Award className="w-3.5 h-3.5 text-amber-400" />}
                      {activity.type === "SUBMISSION" && <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {activity.user}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(activity.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {activity.courseTitle}
                      </p>
                      <span className="text-[10px] font-medium text-primary/90">
                        {activity.details}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/audience"
            className="mt-4 pt-3 border-t border-border/60 text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-between"
          >
            <span>View all audience members</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Course Performance Master Table */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Course Performance Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">
              Detailed tracking per published course, including enrollment volume and completion rate.
            </p>
          </div>

          {/* Search Table */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter courses..."
              className="w-full h-9 pl-9 pr-3 bg-muted/30 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[11px] border-b border-border/60">
              <tr>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4 text-center">Enrolled</th>
                <th className="py-3 px-4 text-center">Lessons</th>
                <th className="py-3 px-4">Completion Progress</th>
                <th className="py-3 px-4 text-center">Avg Quiz</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <BookOpen className="w-8 h-8 opacity-25 mx-auto mb-2" />
                    <p className="font-medium text-foreground">No courses found</p>
                    <p className="text-xs">
                      {searchQuery ? "No courses matching your search query." : "No courses have been created yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      <div className="flex flex-col">
                        <span className="font-semibold">{course.title}</span>
                        {course.description && (
                          <span className="text-[11px] text-muted-foreground line-clamp-1">
                            {course.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">
                      {course.instructorName}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-foreground">
                      {course.enrollmentsCount}
                    </td>
                    <td className="py-3.5 px-4 text-center text-muted-foreground">
                      {course.lessonsCount}
                    </td>
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted/60 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-foreground text-xs shrink-0 w-9 text-right">
                          {course.completionRate}%
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {course.completedLearnersCount} certified / {course.inProgressLearnersCount} in progress
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-amber-400">
                      {course.averageQuizScore}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          course.published
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {course.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors p-1"
                      >
                        <span>Manage</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
