"use client"

import { useState, useEffect } from "react"
import { Key, Copy, Plus, Trash2, Eye, EyeOff, Check, Loader2, X, ShieldAlert } from "lucide-react"
import { api } from "@/lib/api"

interface ApiKeyItem {
  id: string
  name: string
  key: string
  lastUsedAt?: string | null
  createdAt: string
}

export default function ApiSettingsPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showKeyId, setShowKeyId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchKeys = async () => {
    try {
      setLoading(true)
      const data = await api.apiKeys.getAll()
      setKeys(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load API keys", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return
    try {
      setIsCreating(true)
      await api.apiKeys.create(newKeyName.trim())
      setNewKeyName("")
      setIsModalOpen(false)
      fetchKeys()
    } catch (err) {
      console.error("Failed to create API key", err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteKey = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke API Key "${name}"? Applications using it will lose access immediately.`)) return
    try {
      setDeletingId(id)
      await api.apiKeys.delete(id)
      setKeys((prev) => prev.filter((k) => k.id !== id))
    } catch (err) {
      console.error("Failed to delete API key", err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const maskKey = (fullKey: string) => {
    if (!fullKey) return "••••••••••••••••••••••••••••••••"
    const prefix = fullKey.slice(0, 8)
    const suffix = fullKey.slice(-4)
    return `${prefix}••••••••••••${suffix}`
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-foreground">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">API Settings</h1>
          <p className="text-xs text-muted-foreground">Manage your secret API keys for programmatic automation, SDKs, and headless access.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          Create new key
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs max-w-5xl">
        <div className="p-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-2 mb-1 text-amber-500">
            <ShieldAlert className="w-4 h-4" />
            <h2 className="text-sm font-semibold text-foreground">Secret API Keys</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Do not share your API keys in publicly accessible areas such as GitHub or client-side JavaScript. Keys grant full programmatic access to your GurukulX workspace.
          </p>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs">Loading API keys...</p>
          </div>
        ) : keys.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">No API keys created yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">Generate a key to connect custom scripts, LMS sync agents, or automated CI pipelines.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-xs"
            >
              Generate your first key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Secret Key</th>
                  <th className="px-6 py-3.5">Created</th>
                  <th className="px-6 py-3.5">Last Used</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {keys.map(key => (
                  <tr key={key.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-primary shrink-0" />
                        <span>{key.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-lg w-fit">
                        <span>
                          {showKeyId === key.id ? key.key : maskKey(key.key)}
                        </span>
                        <button 
                          onClick={() => setShowKeyId(showKeyId === key.id ? null : key.id)}
                          title={showKeyId === key.id ? "Hide key" : "Reveal key"}
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showKeyId === key.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                        <button 
                          onClick={() => handleCopy(key.id, key.key)}
                          title="Copy to clipboard"
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedId === key.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(key.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Never"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteKey(key.id, key.name)}
                        disabled={deletingId === key.id}
                        title="Revoke key"
                        className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === key.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">Create Secret API Key</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded-lg text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Key Name *</label>
                <input 
                  type="text" 
                  required
                  autoFocus
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. CI/CD Deployment Token / Mobile SDK"
                  className="w-full h-10 px-3 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Keys are automatically provisioned with workspace-level read/write permissions and prefix <code className="bg-muted px-1.5 py-0.5 rounded text-primary font-mono">gk_live_</code>.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newKeyName.trim()}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50"
                >
                  {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isCreating ? "Generating..." : "Generate Key"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
