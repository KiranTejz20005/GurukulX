"use client"

import * as React from "react"
import {
  RefreshCw,
  ShieldCheck,
  ShieldOff,
  AlertTriangle,
  Clock,
  Activity,
  CircleDashed,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Download,
  Search,
  AlertCircle,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  Users,
  Check,
} from "lucide-react"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ComplianceSummary {
  compliant: number
  nonCompliant: number
  expiringSoon: number
  inGracePeriod: number
  inProgress: number
  notStarted: number
  waived: number
  noRecord: number
  overallComplianceRate: number
  totalLearnersTracked: number
}

interface CourseCompliance {
  id: string
  title: string
  description: string | null
  totalEnrolled: number
  compliantCount: number
  inProgressCount: number
  notStartedCount: number
  nonCompliantCount: number
  expiringSoonCount: number
  complianceRate: number
  updatedAt: string
}

interface LearnerCompliance {
  id: string
  userId: string
  name: string
  email: string
  courseId: string
  courseTitle: string
  progressPercentage: number
  status: "COMPLIANT" | "NON_COMPLIANT" | "EXPIRING_SOON" | "IN_GRACE_PERIOD" | "IN_PROGRESS" | "NOT_STARTED" | "WAIVED" | "NO_RECORD"
  enrolledAt: string
  completedLessons: number
  totalLessons: number
  certifiedAt: string | null
  validUntil: string | null
}

interface ComplianceData {
  summary: ComplianceSummary
  courses: CourseCompliance[]
  learners: LearnerCompliance[]
}

const STATUS_CONFIG = {
  COMPLIANT: { label: "Compliant", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: ShieldCheck },
  NON_COMPLIANT: { label: "Non-compliant", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: ShieldOff },
  EXPIRING_SOON: { label: "Expiring soon", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: AlertTriangle },
  IN_GRACE_PERIOD: { label: "Grace period", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: Clock },
  IN_PROGRESS: { label: "In progress", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Activity },
  NOT_STARTED: { label: "Not started", color: "text-muted-foreground", bg: "bg-muted/30", border: "border-border", icon: CircleDashed },
  WAIVED: { label: "Waived", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", icon: CheckCircle2 },
  NO_RECORD: { label: "No record", color: "text-muted-foreground", bg: "bg-muted/20", border: "border-border", icon: HelpCircle },
}

export default function CompliancePage() {
  const [data, setData] = React.useState<ComplianceData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"course" | "learners">("course")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [lastUpdated, setLastUpdated] = React.useState("")

  const fetchData = React.useCallback(async (manual = false) => {
    if (manual) setRefreshing(true)
    setError(null)
    try {
      const res = await api.stats.getCompliance()
      setData(res)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch {
      setError("Failed to load compliance data. Make sure the API server is running.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
    const interval = setInterval(() => fetchData(), 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const filteredCourses = React.useMemo(() => {
    if (!data?.courses) return []
    if (!searchQuery.trim()) return data.courses
    const q = searchQuery.toLowerCase()
    return data.courses.filter((c) => c.title.toLowerCase().includes(q))
  }, [data, searchQuery])

  const filteredLearners = React.useMemo(() => {
    if (!data?.learners) return []
    if (!searchQuery.trim()) return data.learners
    const q = searchQuery.toLowerCase()
    return data.learners.filter(
      (l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.courseTitle.toLowerCase().includes(q)
    )
  }, [data, searchQuery])

  const handleExportCSV = () => {
    if (!data) return
    const rows = data.learners.map((l) => [
      `"${l.name}"`, `"${l.email}"`, `"${l.courseTitle}"`, l.status, `${l.progressPercentage}%`,
      l.certifiedAt ? new Date(l.certifiedAt).toLocaleDateString() : "—",
      l.validUntil ? new Date(l.validUntil).toLocaleDateString() : "—",
    ])
    const csv = "data:text/csv;charset=utf-8," + [
      "Name,Email,Course,Status,Progress,Certified At,Valid Until",
      ...rows.map((r) => r.join(",")),
    ].join("\n")
    const link = document.createElement("a")
    link.href = encodeURI(csv)
    link.download = `compliance_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading && !data) {
    return (
      <div className="p-8 max-w-[1200px] mx-auto flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading compliance data…</span>
      </div>
    )
  }

  const s = data?.summary

  const statCards = [
    { key: "compliant", label: "Compliant", value: s?.compliant ?? 0, icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { key: "nonCompliant", label: "Non-compliant", value: s?.nonCompliant ?? 0, icon: ShieldOff, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { key: "expiringSoon", label: "Expiring soon", value: s?.expiringSoon ?? 0, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { key: "inGracePeriod", label: "In grace period", value: s?.inGracePeriod ?? 0, icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { key: "inProgress", label: "In progress", value: s?.inProgress ?? 0, icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { key: "notStarted", label: "Not started", value: s?.notStarted ?? 0, icon: CircleDashed, color: "text-muted-foreground", bg: "bg-muted/30", border: "border-border" },
    { key: "waived", label: "Waived", value: s?.waived ?? 0, icon: CheckCircle2, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
    { key: "noRecord", label: "No record", value: s?.noRecord ?? 0, icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted/20", border: "border-border" },
  ]

  return (
    <div className="p-6 sm:p-8 max-w-[1200px] mx-auto space-y-8 text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Compliance</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Track certification status across every compliance course in your organization.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-muted/40 hover:bg-muted border border-border rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin text-primary")} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm shadow-primary/20"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-[11px] text-muted-foreground/70 -mt-5">Last updated at {lastUpdated} · auto-refreshes every 30s</p>
      )}

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => fetchData(true)} className="text-xs font-semibold underline">Retry</button>
        </div>
      )}

      {/* Overall Compliance Rate Banner */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Overall Compliance Rate</p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-foreground">{s?.overallComplianceRate ?? 0}%</span>
            <span className="text-sm text-muted-foreground">{s?.totalLearnersTracked ?? 0} learners tracked</span>
          </div>
          <div className="mt-3 w-full max-w-xs bg-muted/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, s?.overallComplianceRate ?? 0)}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{s?.compliant ?? 0}</p>
            <p className="text-xs text-muted-foreground">Certified</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{s?.inProgress ?? 0}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{s?.expiringSoon ?? 0}</p>
            <p className="text-xs text-muted-foreground">Expiring</p>
          </div>
        </div>
      </div>

      {/* Learner Status Grid */}
      <div className="rounded-2xl border border-border/80 bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-1">Learner Status Distribution</h2>
        <p className="text-xs text-muted-foreground mb-6">Counts across learners in all compliance courses.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(({ key, label, value, icon: Icon, color, bg, border }) => (
            <div key={key} className={cn("rounded-xl border p-4 flex flex-col gap-2", bg, border)}>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-background/50 border", border)}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <p className={cn("text-2xl font-bold", color)}>{value}</p>
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs + Search */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border w-fit">
            <button
              onClick={() => setActiveTab("course")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                activeTab === "course" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              By Course ({data?.courses.length ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("learners")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                activeTab === "learners" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              By Learner ({data?.learners.length ?? 0})
            </button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "course" ? "Filter courses…" : "Filter learners…"}
              className="w-full h-9 pl-9 pr-3 bg-muted/30 border border-border rounded-xl text-xs focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        {/* By Course Table */}
        {activeTab === "course" && (
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-sm font-semibold text-foreground">Compliance Courses</h2>
              <p className="text-xs text-muted-foreground">Course-level compliance status with learner counts.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/30 text-muted-foreground uppercase tracking-wider text-[11px] border-b border-border/60">
                  <tr>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4 text-center">Enrolled</th>
                    <th className="py-3 px-4 text-center">Compliant</th>
                    <th className="py-3 px-4 text-center">In Progress</th>
                    <th className="py-3 px-4 text-center">Not Started</th>
                    <th className="py-3 px-4">Compliance Rate</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-muted-foreground">
                        <BookOpen className="w-8 h-8 opacity-20 mx-auto mb-2" />
                        <p className="font-medium text-foreground">No compliance courses found</p>
                        <p className="text-xs mt-1">
                          {searchQuery ? "No courses match your search." : "Publish courses and enroll learners to track compliance."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-foreground">{course.title}</p>
                          {course.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1">{course.description}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-foreground">{course.totalEnrolled}</td>
                        <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">{course.compliantCount}</td>
                        <td className="py-3.5 px-4 text-center text-blue-400 font-semibold">{course.inProgressCount}</td>
                        <td className="py-3.5 px-4 text-center text-muted-foreground">{course.notStartedCount}</td>
                        <td className="py-3.5 px-4 min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted/60 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  course.complianceRate >= 80 ? "bg-emerald-500" :
                                  course.complianceRate >= 50 ? "bg-amber-500" : "bg-red-500"
                                )}
                                style={{ width: `${course.complianceRate}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-foreground w-8 text-right">{course.complianceRate}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link href={`/courses/${course.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                            View <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* By Learner Table */}
        {activeTab === "learners" && (
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="text-sm font-semibold text-foreground">Learner Compliance Status</h2>
              <p className="text-xs text-muted-foreground">Individual compliance record per learner per course.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/30 text-muted-foreground uppercase tracking-wider text-[11px] border-b border-border/60">
                  <tr>
                    <th className="py-3 px-4">Learner</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Certified</th>
                    <th className="py-3 px-4 text-center">Valid Until</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredLearners.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-muted-foreground">
                        <Users className="w-8 h-8 opacity-20 mx-auto mb-2" />
                        <p className="font-medium text-foreground">No learner records found</p>
                        <p className="text-xs mt-1">
                          {searchQuery ? "No learners match your search." : "Enroll learners in courses to track their compliance status."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredLearners.map((learner) => {
                      const cfg = STATUS_CONFIG[learner.status]
                      const StatusIcon = cfg.icon
                      return (
                        <tr key={learner.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-foreground">{learner.name}</p>
                            <p className="text-[11px] text-muted-foreground">{learner.email}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-foreground line-clamp-1">{learner.courseTitle}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {learner.completedLessons}/{learner.totalLessons} lessons
                            </p>
                          </td>
                          <td className="py-3.5 px-4 min-w-[120px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted/60 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    learner.progressPercentage === 100 ? "bg-emerald-500" :
                                    learner.progressPercentage >= 50 ? "bg-blue-500" : "bg-muted-foreground/40"
                                  )}
                                  style={{ width: `${learner.progressPercentage}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-foreground w-8 text-right">{learner.progressPercentage}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold", cfg.bg, cfg.border, cfg.color)}>
                              <StatusIcon className="w-3 h-3" />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-muted-foreground">
                            {learner.certifiedAt
                              ? <span className="flex items-center justify-center gap-1 text-emerald-400 font-medium"><Check className="w-3 h-3" />{new Date(learner.certifiedAt).toLocaleDateString()}</span>
                              : <span className="text-muted-foreground/50">—</span>
                            }
                          </td>
                          <td className="py-3.5 px-4 text-center text-muted-foreground">
                            {learner.validUntil ? (
                              <span className={cn(
                                "font-medium",
                                new Date(learner.validUntil) < new Date() ? "text-red-400" :
                                new Date(learner.validUntil) < new Date(Date.now() + 30 * 86400000) ? "text-amber-400" :
                                "text-foreground"
                              )}>
                                {new Date(learner.validUntil).toLocaleDateString()}
                              </span>
                            ) : <span className="text-muted-foreground/50">—</span>}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
