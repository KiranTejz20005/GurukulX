"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Award, Book, Users, MonitorPlay, ExternalLink, RefreshCw, TrendingUp } from "lucide-react"
import { api } from "@/lib/api"

interface DashStats {
  certificatesIssued: number
  numberOfCourses: number
  totalStudents: number
  topCourses: Array<{ id: string; title: string; enrollments: number; thumbnail?: string }>
}

interface Certification {
  id: string
  certificateNumber: string
  issuedAt: string
  user: { id: string; name?: string; email: string }
  course: { id: string; title: string }
}

interface LoginActivity {
  day: string
  count: number
  percentage: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashStats | null>(null)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([])
  const [workspaceSlug, setWorkspaceSlug] = useState("gurukulx")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const [statsData, certsData, activityData, setupData] = await Promise.all([
        api.dash.getStats(),
        api.dash.getRecentCertifications(),
        api.dash.getLoginActivity(),
        api.workspaces.getSetupProgress().catch(() => null),
      ])
      setStats(statsData)
      setCertifications(certsData)
      setLoginActivity(activityData)
      if (setupData?.workspace?.slug) {
        setWorkspaceSlug(setupData.workspace.slug)
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err)
      // Set fallback data so the page still renders
      setStats({ certificatesIssued: 0, numberOfCourses: 0, totalStudents: 0, topCourses: [] })
      setCertifications([])
      setLoginActivity([
        { day: "Sun", count: 0, percentage: 0 },
        { day: "Mon", count: 0, percentage: 0 },
        { day: "Tue", count: 0, percentage: 0 },
        { day: "Wed", count: 0, percentage: 0 },
        { day: "Thu", count: 0, percentage: 0 },
        { day: "Fri", count: 0, percentage: 0 },
        { day: "Sat", count: 0, percentage: 0 },
      ])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getHourOfDay = () => {
    const h = new Date().getHours()
    if (h < 12) return "Good Morning"
    if (h < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mr-3" />
          <span className="text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {getHourOfDay()} Kiran Teja!
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="px-3 py-2 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/courses/new"
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            Create Course
          </Link>
          <Link
            href={`/${workspaceSlug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            View site
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex gap-4 hover:border-white/20 transition-colors">
          <div className="mt-1 text-yellow-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-1">Certificates issued</h3>
            <p className="text-3xl font-bold text-white mb-2">{stats?.certificatesIssued ?? 0}</p>
            <p className="text-[13px] text-gray-500 leading-relaxed">Total certificates issued to students in your organization</p>
          </div>
        </div>

        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex gap-4 hover:border-white/20 transition-colors">
          <div className="mt-1 text-blue-400">
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-1">Number of courses</h3>
            <p className="text-3xl font-bold text-white mb-2">{stats?.numberOfCourses ?? 0}</p>
            <p className="text-[13px] text-gray-500 leading-relaxed">Courses created within this organization</p>
          </div>
        </div>

        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex gap-4 hover:border-white/20 transition-colors">
          <div className="mt-1 text-green-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-1">Total students</h3>
            <p className="text-3xl font-bold text-white mb-2">{stats?.totalStudents ?? 0}</p>
            <p className="text-[13px] text-gray-500 leading-relaxed">Based on student enrollments</p>
          </div>
        </div>
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Courses */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-200">Top Courses</h3>
            <Link href="/courses" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          </div>

          {stats?.topCourses && stats.topCourses.length > 0 ? (
            <div className="flex flex-col gap-2 flex-1">
              {stats.topCourses.map((course, i) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                      {course.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{course.enrollments}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                <MonitorPlay className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-200 mb-2">Create Your First Course</h4>
              <p className="text-[13px] text-gray-500 mb-6 max-w-[250px]">Start creating courses to track course progress</p>
              <Link
                href="/courses/new"
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Create Course
              </Link>
            </div>
          )}
        </div>

        {/* Recent Certifications */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-200">Recent certifications</h3>
            <Link href="/stats/compliance" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          </div>

          {certifications.length > 0 ? (
            <div className="flex flex-col gap-2 flex-1">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {cert.user?.name || cert.user?.email}
                    </p>
                    <p className="text-[12px] text-gray-500 truncate">{cert.course?.title}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {formatDate(cert.issuedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-200 mb-2">No certificates earned yet</h4>
              <p className="text-[13px] text-gray-500 mb-6 max-w-[300px]">When students complete a course and earn a certificate, they will appear here</p>
              <Link
                href="/courses"
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                View courses
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Student Login Activity Chart */}
      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-base font-medium text-gray-200">Student Login Activity</h3>
        </div>
        <p className="text-[13px] text-gray-500 mb-8">Most active days of the week (last 90 days)</p>

        <div className="h-48 flex items-end justify-between px-4 pb-6 border-b border-white/10 relative">
          {/* Y Axis Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 px-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-full border-t border-white/5" />
            ))}
          </div>

          {loginActivity.length > 0
            ? loginActivity.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-3 relative z-10 flex-1 mx-1">
                  <div
                    className="w-full rounded-t-sm transition-all duration-700"
                    style={{
                      height: `${Math.max(item.percentage, 2)}%`,
                      background: item.percentage > 60
                        ? "linear-gradient(180deg, #60a5fa, #3b82f6)"
                        : item.percentage > 30
                        ? "linear-gradient(180deg, #93c5fd, #60a5fa)"
                        : "linear-gradient(180deg, #374151, #1f2937)",
                    }}
                  />
                  <span className="text-xs text-gray-500">{item.day}</span>
                </div>
              ))
            : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="flex flex-col items-center gap-3 relative z-10 flex-1 mx-1">
                  <div className="w-full rounded-t-sm bg-white/5" style={{ height: "4px" }} />
                  <span className="text-xs text-gray-500">{day}</span>
                </div>
              ))}
        </div>

        {loginActivity.length > 0 && (
          <div className="flex justify-between px-4 mt-4">
            {loginActivity.map((item) => (
              <div key={item.day} className="flex-1 mx-1 text-center">
                <span className="text-[11px] text-gray-600">{item.count > 0 ? item.count : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
