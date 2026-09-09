"use client"

import { useState, useEffect } from "react"
import { Tag as TagIcon, Plus, FolderPlus, Trash2, Edit3, Check, X, ChevronRight, ChevronDown } from "lucide-react"
import { api } from "@/lib/api"

interface TagItem {
  id: string
  name: string
  color: string
  description?: string
  groupId?: string
  _count?: {
    courses: number
  }
}

interface TagGroupItem {
  id: string
  name: string
  description?: string
  selectionMode: string
  tags: TagItem[]
}

const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#64748b", // Slate
]

export default function TagsPage() {
  const [groups, setGroups] = useState<TagGroupItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Create Group Modal state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [groupMode, setGroupMode] = useState("SINGLE")
  const [savingGroup, setSavingGroup] = useState(false)

  // Create Tag Modal state
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")
  const [tagName, setTagName] = useState("")
  const [tagDescription, setTagDescription] = useState("")
  const [tagColor, setTagColor] = useState(PRESET_COLORS[0])
  const [savingTag, setSavingTag] = useState(false)

  // Accordion open/close state
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const data = await api.tags.getGroups()
      setGroups(data)
      // Expand all by default
      const exp: Record<string, boolean> = {}
      data.forEach((g: TagGroupItem) => {
        exp[g.id] = true
      })
      setExpandedGroups(exp)
    } catch (err: any) {
      console.error("Failed to load tags:", err)
      setError("Failed to load tags and groups")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) return
    try {
      setSavingGroup(true)
      await api.tags.createGroup({
        name: groupName.trim(),
        description: groupDescription.trim() || undefined,
        selectionMode: groupMode,
      })
      setGroupName("")
      setGroupDescription("")
      setIsGroupModalOpen(false)
      fetchGroups()
    } catch (err) {
      console.error("Failed to create group:", err)
    } finally {
      setSavingGroup(false)
    }
  }

  const handleDeleteGroup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag group? All tags within it will also be deleted.")) return
    try {
      await api.tags.deleteGroup(id)
      fetchGroups()
    } catch (err) {
      console.error("Failed to delete group:", err)
    }
  }

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagName.trim()) return
    try {
      setSavingTag(true)
      await api.tags.createTag({
        name: tagName.trim(),
        color: tagColor,
        description: tagDescription.trim() || undefined,
        groupId: selectedGroupId || undefined,
      })
      setTagName("")
      setTagDescription("")
      setIsTagModalOpen(false)
      fetchGroups()
    } catch (err) {
      console.error("Failed to create tag:", err)
    } finally {
      setSavingTag(false)
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return
    try {
      await api.tags.deleteTag(id)
      fetchGroups()
    } catch (err) {
      console.error("Failed to delete tag:", err)
    }
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const openAddTagForGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
    setIsTagModalOpen(true)
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tag Groups & Tags</h1>
          <p className="text-sm text-gray-400 mt-1">
            Categorize courses into single or multi-select tag groups for precise filtering.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGroupModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
          >
            <FolderPlus className="w-4 h-4" />
            New Group
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading tag groups...</p>
        </div>
      ) : groups.length === 0 ? (
        /* Empty State */
        <div className="flex items-center justify-center pt-8">
          <div className="w-[800px] bg-[#0d1117] border border-white/10 border-dashed rounded-2xl p-16 flex flex-col items-center text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <TagIcon className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No tag groups yet</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-[360px] leading-relaxed">
              Create a tag group first (like "Difficulty", "Department", or "Topic"), then add tags inside it.
            </p>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <FolderPlus className="w-4 h-4" />
              Create Your First Group
            </button>
          </div>
        </div>
      ) : (
        /* Groups List */
        <div className="space-y-6">
          {groups.map((group) => {
            const isExpanded = !!expandedGroups[group.id]
            return (
              <div
                key={group.id}
                className="bg-[#0f141c] border border-white/10 rounded-2xl overflow-hidden shadow-sm transition hover:border-white/20"
              >
                {/* Group Header */}
                <div className="p-5 flex items-center justify-between bg-[#131a26]/60 border-b border-white/5">
                  <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => toggleGroup(group.id)}>
                    <button className="text-gray-400 hover:text-white">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-base font-semibold text-white">{group.name}</h2>
                        <span className="text-[11px] font-medium uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {group.selectionMode}
                        </span>
                        <span className="text-xs text-gray-400">
                          {group.tags?.length || 0} {group.tags?.length === 1 ? "tag" : "tags"}
                        </span>
                      </div>
                      {group.description && (
                        <p className="text-xs text-gray-400 mt-1">{group.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddTagForGroup(group.id)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Tag
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Group Tags Grid */}
                {isExpanded && (
                  <div className="p-5">
                    {group.tags && group.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {group.tags.map((tag) => (
                          <div
                            key={tag.id}
                            className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-white/10 bg-[#161f2e]/70 hover:border-white/20 transition shadow-sm"
                          >
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: tag.color || "#3b82f6" }}
                            />
                            <span className="text-sm font-medium text-gray-200">{tag.name}</span>
                            {tag._count && tag._count.courses > 0 && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">
                                {tag._count.courses}
                              </span>
                            )}
                            <button
                              onClick={() => handleDeleteTag(tag.id)}
                              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition ml-1 p-0.5"
                              title="Delete Tag"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-gray-400">
                        No tags in this group yet. Click "Add Tag" to create one.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal: Create Tag Group */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111823] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Create Tag Group</h3>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Difficulty, Department, Topic"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Briefly describe what this tag group is for..."
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Selection Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGroupMode("SINGLE")}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      groupMode === "SINGLE"
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-[#1b2535] border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    Single Select
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroupMode("MULTI")}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      groupMode === "MULTI"
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-[#1b2535] border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    Multi Select
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGroup || !groupName.trim()}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {savingGroup ? "Creating..." : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Tag */}
      {isTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111823] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Add New Tag</h3>
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTag} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beginner, Security, Finance"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTagColor(c)}
                      className={`w-7 h-7 rounded-full transition flex items-center justify-center border ${
                        tagColor === c ? "scale-110 border-white" : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {tagColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Assign to Group
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">No Group (Standalone)</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Short description..."
                  value={tagDescription}
                  onChange={(e) => setTagDescription(e.target.value)}
                  className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsTagModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTag || !tagName.trim()}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {savingTag ? "Adding..." : "Add Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
