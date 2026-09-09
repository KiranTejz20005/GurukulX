"use client"

import { useEffect, useState, useCallback } from "react"
import { Users, Search, Plus, X, MoreVertical, Mail, Shield, RefreshCw, Trash2, RotateCcw, ChevronDown } from "lucide-react"
import { api } from "@/lib/api"

interface Member {
  id: string
  role: string
  joinedAt: string
  user: {
    id: string
    name?: string
    email: string
    createdAt: string
    courseCount: number
  }
}

interface Invite {
  id: string
  email: string
  role: string
  expiresAt: string
  createdAt: string
}

const ROLES = ["STUDENT", "INSTRUCTOR", "ADMIN"]

const roleBadge = (role: string) => {
  const styles: Record<string, string> = {
    ADMIN: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    INSTRUCTOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    STUDENT: "bg-green-500/20 text-green-400 border-green-500/30",
  }
  return styles[role] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

export default function AudiencePage() {
  const [members, setMembers] = useState<Member[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("STUDENT")
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"members" | "invites">("members")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [membersData, invitesData] = await Promise.all([
        api.audience.getMembers(search, roleFilter),
        api.audience.getPendingInvites(),
      ])
      setMembers(membersData)
      setInvites(invitesData)
    } catch (err) {
      console.error("Failed to load audience", err)
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    setInviting(true)
    try {
      await api.audience.inviteMember(inviteEmail.trim(), inviteRole)
      setInviteSuccess(true)
      setInviteEmail("")
      setTimeout(() => {
        setInviteSuccess(false)
        setShowInviteModal(false)
        loadData()
      }, 2000)
    } catch (err) {
      console.error("Invite failed", err)
    } finally {
      setInviting(false)
    }
  }

  const handleRevokeInvite = async (id: string) => {
    try {
      await api.audience.revokeInvite(id)
      setInvites((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      console.error("Revoke failed", err)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Remove this member from your workspace?")) return
    try {
      await api.audience.removeMember(userId)
      setMembers((prev) => prev.filter((m) => m.user.id !== userId))
    } catch (err) {
      console.error("Remove failed", err)
    }
    setOpenMenuId(null)
  }

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await api.audience.updateMemberRole(userId, role)
      setMembers((prev) =>
        prev.map((m) => (m.user.id === userId ? { ...m, role } : m))
      )
    } catch (err) {
      console.error("Role update failed", err)
    }
    setOpenMenuId(null)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Audience</h1>
          <p className="text-sm text-gray-400">Manage your students, instructors, and organization members.</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#09090b] border border-white/10 rounded-lg p-1 w-fit">
        {(["members", "invites"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors capitalize ${
              activeTab === tab ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab}
            {tab === "invites" && invites.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-blue-600 text-white rounded-full">
                {invites.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "members" && (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#09090b] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors text-gray-200 placeholder-gray-600"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3 bg-[#09090b] border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button
              onClick={() => loadData()}
              className="h-10 px-3 bg-[#09090b] border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-5 h-5 text-blue-400 animate-spin mr-3" />
              <span className="text-gray-400 text-sm">Loading members...</span>
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No members yet</h3>
              <p className="text-[13px] text-gray-400 mb-8 max-w-[320px] leading-relaxed">
                Start building your community by inviting students and instructors to your organization.
              </p>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Invite Member
              </button>
            </div>
          ) : (
            <div className="bg-[#09090b] border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {((member.user.name || member.user.email || "U")[0] || "U").toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-200">{member.user.name || "—"}</p>
                            <p className="text-xs text-gray-500">{member.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-md border ${roleBadge(member.role)}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">{member.user.courseCount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{formatDate(member.joinedAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-300"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === member.id && (
                            <div className="absolute right-0 top-8 w-48 bg-[#111113] border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden">
                              <div className="p-1">
                                <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Change Role</p>
                                {ROLES.map((r) => (
                                  <button
                                    key={r}
                                    onClick={() => handleUpdateRole(member.user.id, r)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                      member.role === r ? "text-blue-400 bg-blue-500/10" : "text-gray-300 hover:bg-white/5"
                                    }`}
                                  >
                                    {r}
                                  </button>
                                ))}
                                <hr className="border-white/10 my-1" />
                                <button
                                  onClick={() => handleRemoveMember(member.user.id)}
                                  className="w-full text-left px-3 py-2 text-sm rounded-md text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Remove Member
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === "invites" && (
        <div className="bg-[#09090b] border border-white/10 rounded-xl overflow-hidden">
          {invites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Mail className="w-10 h-10 text-gray-600 mb-4" />
              <p className="text-gray-400 text-sm">No pending invitations</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-300">{invite.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-md border ${roleBadge(invite.role)}`}>
                        {invite.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{formatDate(invite.expiresAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRevokeInvite(invite.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-gray-500 hover:text-red-400"
                        title="Revoke invite"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-lg font-semibold text-white">Invite Member</h2>
                <p className="text-sm text-gray-400 mt-0.5">Send an invitation to join your workspace</p>
              </div>
              <button
                onClick={() => { setShowInviteModal(false); setInviteEmail(""); setInviteSuccess(false) }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {inviteSuccess ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-white font-medium">Invitation sent!</p>
                  <p className="text-sm text-gray-400 mt-1">They will receive an email shortly.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full h-10 px-4 bg-[#09090b] border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                      onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full h-10 px-4 bg-[#09090b] border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleInvite}
                    disabled={inviting || !inviteEmail.trim()}
                    className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {inviting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    {inviting ? "Sending..." : "Send Invitation"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Close menus on outside click */}
      {openMenuId && (
        <div className="fixed inset-0 z-5" onClick={() => setOpenMenuId(null)} />
      )}
    </div>
  )
}
