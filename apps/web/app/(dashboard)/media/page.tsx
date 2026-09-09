"use client"

import { useState, useEffect } from "react"
import {
  File,
  FileVideo,
  FileText,
  Image as ImageIcon,
  Music,
  Link as LinkIcon,
  Search,
  UploadCloud,
  Trash2,
  ExternalLink,
  X,
  HardDrive,
} from "lucide-react"
import { api } from "@/lib/api"

interface MediaItem {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  createdAt: string
}

interface StorageStats {
  totalBytes: number
  count: number
  limitBytes: number
  breakdown: {
    image: number
    video: number
    document: number
    other: number
  }
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 B"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function MediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [storage, setStorage] = useState<StorageStats>({
    totalBytes: 0,
    count: 0,
    limitBytes: 5 * 1024 * 1024 * 1024,
    breakdown: { image: 0, video: 0, document: 0, other: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadName, setUploadName] = useState("")
  const [uploadUrl, setUploadUrl] = useState("")
  const [uploadMime, setUploadMime] = useState("image/png")
  const [uploadSizeMb, setUploadSizeMb] = useState("2.5")
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [storageRes, itemsRes] = await Promise.all([
        api.media.getStorage(),
        api.media.findAll(filterType === "all" ? undefined : filterType),
      ])
      setStorage(storageRes)
      setMediaList(itemsRes)
    } catch (err) {
      console.error("Failed to load media items:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [filterType])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadName.trim() || !uploadUrl.trim()) return
    try {
      setSaving(true)
      const sizeBytes = Math.round((parseFloat(uploadSizeMb) || 1) * 1024 * 1024)
      await api.media.create({
        filename: uploadName.trim(),
        url: uploadUrl.trim(),
        mimeType: uploadMime,
        size: sizeBytes,
      })
      setIsUploadModalOpen(false)
      setUploadName("")
      setUploadUrl("")
      loadData()
    } catch (err) {
      console.error("Failed to add asset:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return
    try {
      await api.media.delete(id)
      loadData()
    } catch (err) {
      console.error("Failed to delete asset:", err)
    }
  }

  const filteredItems = mediaList.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getIconForMime = (mime: string) => {
    if (mime.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-emerald-400" />
    if (mime.startsWith("video/")) return <FileVideo className="w-5 h-5 text-blue-400" />
    if (mime.startsWith("audio/")) return <Music className="w-5 h-5 text-purple-400" />
    if (mime.includes("pdf") || mime.includes("document")) return <FileText className="w-5 h-5 text-amber-400" />
    return <File className="w-5 h-5 text-gray-400" />
  }

  const percentUsed = Math.min(100, Math.round((storage.totalBytes / storage.limitBytes) * 100))

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Media Manager</h1>
          <p className="text-sm text-gray-400 mt-1">
            Store, view, and organize assets, videos, and reference materials for your workspace.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
        >
          <UploadCloud className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Storage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0f141c] border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Storage</span>
            <HardDrive className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-2">{formatBytes(storage.totalBytes)}</div>
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden mb-2">
            <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${percentUsed}%` }} />
          </div>
          <p className="text-xs text-gray-500">
            {percentUsed}% of {formatBytes(storage.limitBytes)} used
          </p>
        </div>

        <div className="bg-[#0f141c] border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Internal Assets</span>
            <File className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{storage.count}</div>
          <p className="text-xs text-gray-500">
            Images: {formatBytes(storage.breakdown.image)} · Videos: {formatBytes(storage.breakdown.video)}
          </p>
        </div>

        <div className="bg-[#0f141c] border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Documents & Other</span>
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatBytes(storage.breakdown.document + storage.breakdown.other)}
          </div>
          <p className="text-xs text-gray-500">Includes PDFs, course attachments, and audio files</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Type filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: "all", label: "All Types" },
            { id: "image", label: "Images" },
            { id: "video", label: "Videos" },
            { id: "application", label: "Documents" },
            { id: "audio", label: "Audio" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition ${
                filterType === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-[#0f141c] text-gray-400 border border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-[#0f141c] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading media library...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex items-center justify-center pt-8">
          <div className="w-[700px] bg-[#0d1117] border border-white/10 border-dashed rounded-2xl p-14 flex flex-col items-center text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <UploadCloud className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">No assets found</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-[320px]">
              Upload course assets, video lectures, and certificates to access them easily across GurukulX.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <UploadCloud className="w-4 h-4" />
              Upload First Asset
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-[#0f141c] border border-white/10 rounded-2xl p-4 hover:border-white/20 transition flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="h-32 bg-[#151c27] rounded-xl flex items-center justify-center mb-3 overflow-hidden border border-white/5 relative">
                  {item.mimeType.startsWith("image/") ? (
                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                  ) : (
                    getIconForMime(item.mimeType)
                  )}
                  <span className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-gray-300 backdrop-blur-sm">
                    {formatBytes(item.size)}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-white truncate" title={item.filename}>
                  {item.filename}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{item.mimeType}</p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View
                </a>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Asset */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111823] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Add New Asset</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. course-intro-video.mp4"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                  Asset URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or cloud storage URL"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                    Type
                  </label>
                  <select
                    value={uploadMime}
                    onChange={(e) => setUploadMime(e.target.value)}
                    className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="image/png">Image (PNG/JPG)</option>
                    <option value="video/mp4">Video (MP4)</option>
                    <option value="application/pdf">Document (PDF)</option>
                    <option value="audio/mp3">Audio (MP3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                    Size (MB)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={uploadSizeMb}
                    onChange={(e) => setUploadSizeMb(e.target.value)}
                    className="w-full bg-[#1b2535] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !uploadName.trim() || !uploadUrl.trim()}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? "Adding..." : "Save Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
