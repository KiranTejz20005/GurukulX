"use client"

import React, { useState, useEffect, useId } from "react"
import Link from "next/link"
import { 
  Eye, 
  BookOpen, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw, 
  Globe, 
  Award, 
  ArrowUpRight, 
  BarChart3, 
  Layers, 
  Sparkles,
  Calendar
} from "lucide-react"
import { api } from "@/lib/api"

type TimeRange = 7 | 30 | 90

interface LandingStatsTotals {
  landingViews: number
  coursePageViews: number
  uniqueVisitors: number
  enrollments: number
  completions: number
  conversionRate: number
}

interface SparklineItem {
  date: string
  views: number
  enrollments: number
  uniqueVisitors: number
  completions: number
}

interface FunnelStep {
  name: string
  count: number
  conversionFromPrev: number | null
}

interface CountryItem {
  country: string
  views: number
  enrollments: number
  sharePercentage: number
}

interface TopCourseItem {
  id: string
  title: string
  type: string
  published: boolean
  views: number
  enrollments: number
  completions: number
  completionRate: number
}

const COUNTRY_FLAGS: Record<string, string> = {
  "United States": "🇺🇸",
  "India": "🇮🇳",
  "United Kingdom": "🇬🇧",
  "Germany": "🇩🇪",
  "Canada": "🇨🇦",
  "Australia": "🇦🇺",
  "France": "🇫🇷",
  "Japan": "🇯🇵",
  "Brazil": "🇧🇷",
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<TimeRange>(30)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<SparklineItem | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const [totals, setTotals] = useState<LandingStatsTotals>({
    landingViews: 0,
    coursePageViews: 0,
    uniqueVisitors: 0,
    enrollments: 0,
    completions: 0,
    conversionRate: 0,
  })
  const [sparkline, setSparkline] = useState<SparklineItem[]>([])
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>([])
  const [countries, setCountries] = useState<CountryItem[]>([])
  const [topCourses, setTopCourses] = useState<TopCourseItem[]>([])

  const chartGradientId = useId()

  const loadData = async (selectedRange: TimeRange, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)

      const [landingRes, funnelRes, countryRes, topRes] = await Promise.all([
        api.analytics.getLandingStats(selectedRange),
        api.analytics.getCourseFunnel(selectedRange),
        api.analytics.getCountryBreakdown(selectedRange),
        api.analytics.getTopCourses(selectedRange),
      ])

      if (landingRes) {
        setTotals(landingRes.totals || {})
        setSparkline(landingRes.sparkline || [])
      }
      if (funnelRes && funnelRes.steps) {
        setFunnelSteps(funnelRes.steps)
      }
      if (Array.isArray(countryRes)) {
        setCountries(countryRes)
      }
      if (Array.isArray(topRes)) {
        setTopCourses(topRes)
      }
    } catch (err) {
      console.error("Failed to load analytics data:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData(range)
  }, [range])

  const maxViews = Math.max(...sparkline.map((s) => s.views), 10)
  const maxEnrollments = Math.max(...sparkline.map((s) => s.enrollments), 5)

  // Generate SVG path for trend chart
  const chartWidth = 900
  const chartHeight = 220
  const paddingX = 20
  const paddingY = 25

  const points = sparkline.map((item, idx) => {
    const x = paddingX + (idx / Math.max(sparkline.length - 1, 1)) * (chartWidth - paddingX * 2)
    const y = chartHeight - paddingY - (item.views / maxViews) * (chartHeight - paddingY * 2)
    return { x, y, item }
  })

  const pathD = points.length > 0
    ? points.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`, "")
    : ""

  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const areaD = (pathD && firstPoint && lastPoint)
    ? `${pathD} L ${lastPoint.x},${chartHeight - paddingY} L ${firstPoint.x},${chartHeight - paddingY} Z`
    : ""

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              Live
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Real-time learner traffic, conversion funnels, and geographic performance metrics.
          </p>
        </div>

        {/* Time Range & Refresh Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-[#09090b] border border-white/10 rounded-lg p-1">
            {([7, 30, 90] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  range === r
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {r} Days
              </button>
            ))}
          </div>

          <button
            onClick={() => loadData(range, true)}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-300 bg-[#09090b] border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {/* 1. Landing Views */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">Landing Views</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {loading ? "—" : totals.landingViews.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500">Public landing hits</span>
        </div>

        {/* 2. Course Page Views */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">Course Views</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {loading ? "—" : totals.coursePageViews.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500">Curriculum previews</span>
        </div>

        {/* 3. Unique Visitors */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">Unique Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {loading ? "—" : totals.uniqueVisitors.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500">Estimated learners</span>
        </div>

        {/* 4. Total Enrollments */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">Enrollments</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {loading ? "—" : totals.enrollments.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500">Active enrollments</span>
        </div>

        {/* 5. Course Completions */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">Completions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {loading ? "—" : totals.completions.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500">100% course completions</span>
        </div>

        {/* 6. Conversion Rate */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">Conversion</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {loading ? "—" : `${totals.conversionRate}%`}
          </p>
          <span className="text-[11px] text-gray-500">Views to enrolled</span>
        </div>
      </div>

      {/* Traffic Trend Chart */}
      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Daily Traffic & Engagement</h2>
            <p className="text-xs text-gray-400">Total views and student enrollments over the past {range} days.</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-gray-300">Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-300">Enrollments</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-gray-500">
            <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-500" />
            Loading trend data...
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-[220px] overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75].map((factor, i) => {
                const y = paddingY + factor * (chartHeight - paddingY * 2)
                return (
                  <line
                    key={i}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                )
              })}

              {/* Area */}
              {areaD && (
                <path d={areaD} fill={`url(#${chartGradientId})`} />
              )}

              {/* Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Points & Interactive Tooltips */}
              {points.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    className="fill-blue-500 stroke-[#09090b] stroke-2 hover:r-5 transition-all cursor-pointer"
                    onMouseEnter={(e) => {
                      setActiveTooltip(pt.item)
                      setTooltipPos({ x: pt.x, y: pt.y })
                    }}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {activeTooltip && tooltipPos && (
              <div
                className="absolute pointer-events-none z-20 bg-gray-900 border border-white/20 rounded-lg p-2.5 shadow-xl text-xs -translate-x-1/2 -translate-y-full mb-3"
                style={{
                  left: `${(tooltipPos.x / chartWidth) * 100}%`,
                  top: `${tooltipPos.y}px`,
                }}
              >
                <div className="font-semibold text-white mb-1">{activeTooltip.date}</div>
                <div className="flex items-center justify-between gap-4 text-gray-300">
                  <span>Views:</span>
                  <span className="font-medium text-blue-400">{activeTooltip.views}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-gray-300">
                  <span>Enrollments:</span>
                  <span className="font-medium text-emerald-400">{activeTooltip.enrollments}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-gray-300">
                  <span>Completions:</span>
                  <span className="font-medium text-purple-400">{activeTooltip.completions}</span>
                </div>
              </div>
            )}

            {/* X-Axis Date Labels */}
            <div className="flex justify-between text-[11px] text-gray-500 pt-2 px-2">
              <span>{sparkline[0]?.date || ""}</span>
              <span>{sparkline[Math.floor(sparkline.length / 2)]?.date || ""}</span>
              <span>{sparkline[sparkline.length - 1]?.date || ""}</span>
            </div>
          </div>
        )}
      </div>

      {/* Row: Funnel & Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Course Conversion Funnel */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-white">Course Conversion Funnel</h2>
            <p className="text-xs text-gray-400">Step-by-step learner retention and completion flow.</p>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-4">
            {funnelSteps.map((step, idx) => {
              const maxFunnelCount = funnelSteps[0]?.count || 1
              const pctOfTop = Math.max(8, Math.round((step.count / maxFunnelCount) * 100))

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-300">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-white">{step.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{step.count.toLocaleString()}</span>
                      {step.conversionFromPrev !== null && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">
                          {step.conversionFromPrev}% conv
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pctOfTop}%`,
                        background:
                          idx === 0
                            ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                            : idx === 1
                            ? "linear-gradient(90deg, #6366f1, #818cf8)"
                            : idx === 2
                            ? "linear-gradient(90deg, #10b981, #34d399)"
                            : "linear-gradient(90deg, #a855f7, #c084fc)",
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Geographic Breakdown */}
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Geographic Distribution</h2>
              <p className="text-xs text-gray-400">Top regions by learner views and sign-ups.</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Globe className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 pb-2">
                  <th className="font-medium pb-2">Country</th>
                  <th className="font-medium pb-2 text-right">Views</th>
                  <th className="font-medium pb-2 text-right">Enrollments</th>
                  <th className="font-medium pb-2 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {countries.map((c, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 flex items-center gap-2 text-white font-medium">
                      <span>{COUNTRY_FLAGS[c.country] || "🌐"}</span>
                      <span>{c.country}</span>
                    </td>
                    <td className="py-2.5 text-right text-gray-300 font-mono">
                      {c.views.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right text-emerald-400 font-mono">
                      {c.enrollments.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${c.sharePercentage}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-gray-400 w-10 text-right">
                          {c.sharePercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Top Performing Courses</h2>
            <p className="text-xs text-gray-400">Ranked by overall views, active enrollments, and completion rates.</p>
          </div>
          <Link
            href="/courses"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium"
          >
            View All Courses
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 pb-3">
                <th className="font-medium pb-3 w-12">#</th>
                <th className="font-medium pb-3">Course Title</th>
                <th className="font-medium pb-3">Type</th>
                <th className="font-medium pb-3 text-right">Views</th>
                <th className="font-medium pb-3 text-right">Enrollments</th>
                <th className="font-medium pb-3 text-right">Completions</th>
                <th className="font-medium pb-3 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topCourses.map((course, idx) => (
                <tr key={course.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 text-gray-500 font-mono font-medium">0{idx + 1}</td>
                  <td className="py-3.5">
                    <Link
                      href={`/courses/${course.id}/builder`}
                      className="font-medium text-white hover:text-blue-400 transition-colors"
                    >
                      {course.title}
                    </Link>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-white/5 text-gray-300 border border-white/10">
                      {course.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-gray-200 font-mono font-medium">
                    {course.views.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right text-emerald-400 font-mono font-medium">
                    {course.enrollments.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right text-purple-400 font-mono font-medium">
                    {course.completions.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, course.completionRate)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-white w-12 text-right">
                        {course.completionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
