"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  RefreshCw, 
  ShieldCheck, 
  ShieldOff, 
  AlertTriangle, 
  Clock, 
  Activity, 
  CircleDashed, 
  CheckCircle, 
  HelpCircle, 
  Book, 
  Plus, 
  Search, 
  Filter, 
  X, 
  Check, 
  RotateCcw, 
  Award,
  ArrowRight,
  ChevronRight
} from "lucide-react"
import { api } from "@/lib/api"

interface ComplianceOverview {
  compliant: number
  non_compliant: number
  expiring_soon: number
  in_grace_period: number
  in_progress: number
  not_started: number
  waived: number
  no_record: number
}

interface ComplianceCourse {
  id: string
  title: string
  description?: string
  type: string
  validityMonths: number
  gracePeriodDays: number
  published: boolean
  thumbnail?: string
  totalLearners: number
  compliantCount: number
  expiringSoonCount: number
  gracePeriodCount: number
  nonCompliantCount: number
  inProgressCount: number
  notStartedCount: number
  waivedCount: number
  complianceRate: number
}

interface ComplianceLearner {
  recordId: string
  userId: string
  learnerName: string
  learnerEmail: string
  learnerAvatar?: string
  courseId: string
  courseTitle: string
  status: string
  completedAt: string | null
  validUntil: string | null
  cycleNumber: number
}

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'by-course' | 'learners'>('by-course')
  const [overview, setOverview] = useState<ComplianceOverview>({
    compliant: 0,
    non_compliant: 0,
    expiring_soon: 0,
    in_grace_period: 0,
    in_progress: 0,
    not_started: 0,
    waived: 0,
    no_record: 0,
  })
  const [courses, setCourses] = useState<ComplianceCourse[]>([])
  const [learners, setLearners] = useState<ComplianceLearner[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Filters for learners tab
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [courseFilter, setCourseFilter] = useState('ALL')

  // Create course modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newValidityMonths, setNewValidityMonths] = useState(12)
  const [newGracePeriodDays, setNewGracePeriodDays] = useState(14)
  const [isCreating, setIsCreating] = useState(false)

  // Action status notification
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)

      const [overviewData, coursesData, learnersData] = await Promise.all([
        api.compliance.getOverview(),
        api.compliance.getCourses(),
        api.compliance.getLearners(),
      ])

      if (overviewData) setOverview(overviewData)
      if (Array.isArray(coursesData)) setCourses(coursesData)
      if (Array.isArray(learnersData)) setLearners(learnersData)
    } catch (err) {
      console.error("Failed to load compliance data:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateComplianceCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      setIsCreating(true)
      await api.compliance.createCourse({
        title: newTitle.trim(),
        description: newDescription.trim(),
        validityMonths: Number(newValidityMonths),
        gracePeriodDays: Number(newGracePeriodDays),
      })
      setIsModalOpen(false)
      setNewTitle('')
      setNewDescription('')
      setActionSuccess("Compliance course created successfully!")
      setTimeout(() => setActionSuccess(null), 4000)
      await loadData(true)
    } catch (err) {
      console.error("Failed to create compliance course:", err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleWaive = async (courseId: string, userId: string, learnerName: string) => {
    try {
      await api.compliance.waive(courseId, userId)
      setActionSuccess(`Waived compliance requirement for ${learnerName}`)
      setTimeout(() => setActionSuccess(null), 4000)
      await loadData(true)
    } catch (err) {
      console.error("Failed to waive compliance:", err)
    }
  }

  const handleReset = async (courseId: string, userId: string, learnerName: string) => {
    try {
      await api.compliance.reset(courseId, userId)
      setActionSuccess(`Reset compliance cycle for ${learnerName}`)
      setTimeout(() => setActionSuccess(null), 4000)
      await loadData(true)
    } catch (err) {
      console.error("Failed to reset compliance:", err)
    }
  }

  const filteredLearners = learners.filter((l) => {
    const matchesSearch =
      l.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.learnerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter
    const matchesCourse = courseFilter === 'ALL' || l.courseId === courseFilter

    return matchesSearch && matchesStatus && matchesCourse
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Compliant
          </span>
        )
      case 'expiring_soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Expiring Soon
          </span>
        )
      case 'in_grace_period':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Clock className="w-3 h-3" /> In Grace Period
          </span>
        )
      case 'non_compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldOff className="w-3 h-3" /> Non-compliant
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-3 h-3" /> In Progress
          </span>
        )
      case 'waived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CheckCircle className="w-3 h-3" /> Waived
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-white/10">
            <CircleDashed className="w-3 h-3" /> Not Started
          </span>
        )
    }
  }

  return (
    <div className="p-8 max-w-[1300px] mx-auto text-gray-200">
      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400/80 hover:text-emerald-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Compliance Training</h1>
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              Enterprise
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Track recurring certifications, validity periods, and learner compliance status across all compliance courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Compliance Course
          </button>
          <button
            onClick={() => loadData(true)}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 bg-[#09090b] border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Learner Status 8-Card Grid */}
      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-white">Learner Status Overview</h2>
          <span className="text-xs text-gray-400">Aggregated across all compliance programs</span>
        </div>
        <p className="text-xs text-gray-500 mb-6">Real-time status breakdown based on course validity and grace period policies.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {/* 1. Compliant */}
          <div className="bg-white/[0.02] border border-emerald-500/20 rounded-xl p-3.5 hover:bg-emerald-500/[0.04] transition-all">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{loading ? "—" : overview.compliant}</p>
            <p className="text-[11px] font-medium text-emerald-400/90">Compliant</p>
          </div>

          {/* 2. Non-compliant */}
          <div className="bg-white/[0.02] border border-rose-500/20 rounded-xl p-3.5 hover:bg-rose-500/[0.04] transition-all">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center mb-2.5">
              <ShieldOff className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{loading ? "—" : overview.non_compliant}</p>
            <p className="text-[11px] font-medium text-rose-400/90">Non-compliant</p>
          </div>

          {/* 3. Expiring Soon */}
          <div className="bg-white/[0.02] border border-amber-500/20 rounded-xl p-3.5 hover:bg-amber-500/[0.04] transition-all">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{loading ? "—" : overview.expiring_soon}</p>
            <p className="text-[11px] font-medium text-amber-400/90">Expiring soon</p>
          </div>

          {/* 4. In Grace Period */}
          <div className="bg-white/[0.02] border border-orange-500/20 rounded-xl p-3.5 hover:bg-orange-500/[0.04] transition-all">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center mb-2.5">
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{loading ? "—" : overview.in_grace_period}</p>
            <p className="text-[11px] font-medium text-orange-400/90">In grace period</p>
          </div>

          {/* 5. In Progress */}
          <div className="bg-white/[0.02] border border-blue-500/20 rounded-xl p-3.5 hover:bg-blue-500/[0.04] transition-all">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2.5">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{loading ? "—" : overview.in_progress}</p>
            <p className="text-[11px] font-medium text-blue-400/90">In progress</p>
          </div>

          {/* 6. Not Started */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 hover:bg-white/5 transition-all">
            <div className="w-7 h-7 rounded-lg bg-gray-500/10 flex items-center justify-center mb-2.5">
              <CircleDashed className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{loading ? "—" : overview.not_started}</p>
            <p className="text-[11px] font-medium text-gray-400">Not started</p>
          </div>

          {/* 7. Waived */}
          <div className="bg-white/[0.02] border border-purple-500/20 rounded-xl p-3.5 hover:bg-purple-500/[0.04] transition-all">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2.5">
              <CheckCircle className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{loading ? "—" : overview.waived}</p>
            <p className="text-[11px] font-medium text-purple-400/90">Waived</p>
          </div>

          {/* 8. No Record */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 hover:bg-white/5 transition-all">
            <div className="w-7 h-7 rounded-lg bg-gray-500/10 flex items-center justify-center mb-2.5">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{loading ? "—" : overview.no_record}</p>
            <p className="text-[11px] font-medium text-gray-400">No record</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('by-course')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'by-course'
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          By course ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('learners')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'learners'
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Learners ({learners.length})
        </button>
      </div>

      {/* Tab 1: By Course View */}
      {activeTab === 'by-course' && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-[#09090b] border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-sm text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mb-3" />
              Loading compliance courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-[#09090b] border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">No compliance courses yet</h3>
              <p className="text-xs text-gray-400 max-w-sm mb-6">
                Create recurring compliance courses to enforce yearly data privacy, security, and harassment certifications.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Create First Compliance Course
              </button>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-[#09090b] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Course Details */}
                <div className="flex-1 max-w-xl">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Compliance
                    </span>
                    <span className="text-xs text-gray-400">
                      Valid for {course.validityMonths} months · {course.gracePeriodDays} days grace
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">{course.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {course.description || "Mandatory compliance module for organizational certification."}
                  </p>

                  {/* Micro stats pills */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 text-gray-300 font-medium">
                      {course.totalLearners} Learners Enrolled
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">
                      {course.compliantCount} Compliant
                    </span>
                    {course.expiringSoonCount > 0 && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 font-medium">
                        {course.expiringSoonCount} Expiring Soon
                      </span>
                    )}
                    {course.gracePeriodCount > 0 && (
                      <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 font-medium">
                        {course.gracePeriodCount} In Grace Period
                      </span>
                    )}
                    {course.nonCompliantCount > 0 && (
                      <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 font-medium">
                        {course.nonCompliantCount} Non-compliant
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 self-start lg:self-auto">
                  <div className="w-48 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-400">Compliance Rate</span>
                      <span className="text-white font-mono">{course.complianceRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, course.complianceRate)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCourseFilter(course.id)
                        setActiveTab('learners')
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      Learners ({course.totalLearners})
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/courses/${course.id}/builder`}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                      Edit Course
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Learners View */}
      {activeTab === 'learners' && (
        <div className="bg-[#09090b] border border-white/10 rounded-xl p-6">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by learner name, email, or course..."
                className="w-full h-10 pl-9 pr-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL" className="bg-gray-900">All Statuses</option>
                <option value="compliant" className="bg-gray-900">Compliant</option>
                <option value="expiring_soon" className="bg-gray-900">Expiring Soon</option>
                <option value="in_grace_period" className="bg-gray-900">In Grace Period</option>
                <option value="non_compliant" className="bg-gray-900">Non-compliant</option>
                <option value="in_progress" className="bg-gray-900">In Progress</option>
                <option value="not_started" className="bg-gray-900">Not Started</option>
                <option value="waived" className="bg-gray-900">Waived</option>
              </select>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL" className="bg-gray-900">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-gray-900">{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Learners Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 pb-3">
                  <th className="font-semibold pb-3">Learner</th>
                  <th className="font-semibold pb-3">Course</th>
                  <th className="font-semibold pb-3">Status</th>
                  <th className="font-semibold pb-3">Completed Date</th>
                  <th className="font-semibold pb-3">Valid Until</th>
                  <th className="font-semibold pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLearners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No matching learner compliance records found.
                    </td>
                  </tr>
                ) : (
                  filteredLearners.map((learner) => (
                    <tr key={learner.recordId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                            {learner.learnerAvatar ? (
                              <img src={learner.learnerAvatar} alt={learner.learnerName} className="w-8 h-8 rounded-full" />
                            ) : (
                              learner.learnerName.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{learner.learnerName}</div>
                            <div className="text-[11px] text-gray-400">{learner.learnerEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-300 font-medium max-w-[220px] truncate">
                        {learner.courseTitle}
                      </td>
                      <td className="py-3.5">
                        {getStatusBadge(learner.status)}
                      </td>
                      <td className="py-3.5 text-gray-400 font-mono text-[11px]">
                        {learner.completedAt ? new Date(learner.completedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3.5 text-gray-400 font-mono text-[11px]">
                        {learner.validUntil ? (
                          <span className={learner.status === 'expiring_soon' ? "text-amber-400 font-semibold" : learner.status === 'non_compliant' ? "text-rose-400 font-semibold" : ""}>
                            {new Date(learner.validUntil).toLocaleDateString()}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {learner.status !== 'waived' && (
                            <button
                              onClick={() => handleWaive(learner.courseId, learner.userId, learner.learnerName)}
                              className="px-2.5 py-1 text-[11px] font-medium text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-md transition-colors"
                              title="Waive compliance requirement"
                            >
                              Waive
                            </button>
                          )}
                          <button
                            onClick={() => handleReset(learner.courseId, learner.userId, learner.learnerName)}
                            className="px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors flex items-center gap-1"
                            title="Reset compliance cycle to require retake"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reset
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Compliance Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0e0e11] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Create Compliance Course</h3>
                <p className="text-xs text-gray-400">Configure recurring training, validity windows, and grace periods.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplianceCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Course Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Annual Information Security & HIPAA Training"
                  className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe compliance standards, regulations covered, and learning outcomes..."
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Validity Period (Months)</label>
                  <input
                    type="number"
                    min={1}
                    max={36}
                    value={newValidityMonths}
                    onChange={(e) => setNewValidityMonths(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Usually 12 months</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Grace Period (Days)</label>
                  <input
                    type="number"
                    min={0}
                    max={90}
                    value={newGracePeriodDays}
                    onChange={(e) => setNewGracePeriodDays(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Days before marked non-compliant</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white bg-transparent hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTitle.trim()}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
