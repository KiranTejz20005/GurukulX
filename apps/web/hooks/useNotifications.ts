"use client"

import * as React from "react"
import { apiClient } from "@/lib/api"

export interface Notification {
  id: string
  workspaceId: string
  type:
    | "ENROLLMENT"
    | "COURSE_PUBLISHED"
    | "COURSE_CREATED"
    | "QUIZ_ATTEMPT"
    | "SUBMISSION"
    | "FORUM_POST"
    | "API_KEY"
    | "MEMBER_JOINED"
    | "AI_COMPLETE"
    | "SYSTEM"
  title: string
  message: string
  read: boolean
  link?: string | null
  actorName?: string | null
  actorEmail?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  markOneRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  deleteOne: (id: string) => Promise<void>
  clearAll: () => Promise<void>
}

export function useNotifications(pollIntervalMs = 15000): UseNotificationsReturn {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  const fetchNotifications = React.useCallback(async () => {
    try {
      const res = await apiClient.get<Notification[]>("/notifications")
      setNotifications(res.data)
      setError(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load notifications"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load + polling
  React.useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, pollIntervalMs)
    return () => clearInterval(interval)
  }, [fetchNotifications, pollIntervalMs])

  const markOneRead = React.useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
    try {
      await apiClient.patch(`/notifications/${id}/read`)
    } catch {
      // Revert on error
      await fetchNotifications()
    }
  }, [fetchNotifications])

  const markAllRead = React.useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await apiClient.patch("/notifications/mark-all-read")
    } catch {
      await fetchNotifications()
    }
  }, [fetchNotifications])

  const deleteOne = React.useCallback(async (id: string) => {
    // Optimistic remove
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    try {
      await apiClient.delete(`/notifications/${id}`)
    } catch {
      await fetchNotifications()
    }
  }, [fetchNotifications])

  const clearAll = React.useCallback(async () => {
    // Optimistic clear
    setNotifications([])
    try {
      await apiClient.delete("/notifications/clear-all")
    } catch {
      await fetchNotifications()
    }
  }, [fetchNotifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
    markOneRead,
    markAllRead,
    deleteOne,
    clearAll,
  }
}
