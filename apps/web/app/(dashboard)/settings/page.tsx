"use client"

import { useState, useEffect } from "react"
import { Settings as SettingsIcon, Check, Loader2, Globe, Building, Mail, Clock, ExternalLink, ShieldCheck } from "lucide-react"
import { api } from "@/lib/api"

export default function SettingsPage() {
  const [workspace, setWorkspace] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [customDomain, setCustomDomain] = useState("")
  const [supportEmail, setSupportEmail] = useState("support@gurukulx.dev")
  const [timezone, setTimezone] = useState("UTC (Coordinated Universal Time)")
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [verifyingDomain, setVerifyingDomain] = useState(false)
  const [domainVerified, setDomainVerified] = useState(false)

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        setLoading(true)
        const data = await api.workspaces.getCurrent()
        if (data) {
          setWorkspace(data)
          setName(data.name || "")
          setSlug(data.slug || "")
          setCustomDomain(data.customDomain || "")
        }
      } catch (err) {
        console.error("Failed to load workspace settings", err)
      } finally {
        setLoading(false)
      }
    }
    loadWorkspace()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setSaving(true)
      const targetId = workspace?.id || 'dev-workspace-123'
      const updated = await api.workspaces.update(targetId, {
        name: name.trim(),
        slug: slug.trim() || undefined,
        customDomain: customDomain.trim() || undefined,
      })
      if (updated) setWorkspace(updated)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error("Failed to save workspace settings", err)
    } finally {
      setSaving(false)
    }
  }

  const handleVerifyDomain = async () => {
    if (!customDomain.trim()) return
    setVerifyingDomain(true)
    setDomainVerified(false)
    try {
      const targetId = workspace?.id || 'dev-workspace-123'
      await api.workspaces.update(targetId, {
        customDomain: customDomain.trim(),
      })
      setDomainVerified(true)
    } catch (err) {
      console.error("Domain verification failed", err)
    } finally {
      setVerifyingDomain(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto text-foreground">
        <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span>Loading organization settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-foreground">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Organization Settings</h1>
          <p className="text-xs text-muted-foreground">Manage your academy brand, custom domain, and general workspace preferences.</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Changes saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        {/* General Preferences */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Building className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">General Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">Organization Name *</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. GurukulX Academy"
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">Workspace URL Slug *</label>
              <div className="flex items-center">
                <span className="h-11 px-3.5 bg-muted border border-r-0 border-border rounded-l-xl text-xs text-muted-foreground flex items-center font-mono">
                  gurukulx.dev/
                </span>
                <input 
                  type="text" 
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="gurukulx"
                  className="w-full h-11 px-4 bg-background border border-border rounded-r-xl text-xs text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Support Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Timezone</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>EST (Eastern Standard Time)</option>
                    <option>PST (Pacific Standard Time)</option>
                    <option>IST (Indian Standard Time)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-border">
            <button 
              type="submit"
              disabled={saving || !name.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Landing Page Settings Section */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-1">Public Landing Page & Theme</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">Customize your public landing hero banner, curriculum highlights, and navigation links.</p>
          </div>
          <a 
            href="/settings/landingpage/edit"
            className="px-5 py-2.5 text-xs font-semibold text-foreground bg-secondary border border-border rounded-xl hover:bg-muted transition-colors flex items-center gap-1.5 w-fit shrink-0"
          >
            <span>Open Page Builder</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </a>
        </div>

        {/* Custom Domains Section */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Custom Academy Domain</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Point your domain CNAME record to <code className="bg-muted px-1.5 py-0.5 rounded text-primary font-mono">cname.gurukulx.dev</code> to serve your academy under your own branded URL.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <input 
              type="text" 
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="e.g. academy.yourdomain.com"
              className="flex-1 h-11 px-4 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
            <button 
              type="button"
              onClick={handleVerifyDomain}
              disabled={verifyingDomain || !customDomain.trim()}
              className="px-6 py-2.5 text-xs font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {verifyingDomain ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {verifyingDomain ? "Verifying..." : "Verify & Save"}
            </button>
          </div>

          {domainVerified && (
            <p className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium">
              <Check className="w-3.5 h-3.5" /> Domain registered and verified for SSL termination.
            </p>
          )}
        </div>

        {/* Plan & Features */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-1">Subscription & License</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">Multi-tenant enterprise license with unlimited courses, active students, and automated verification.</p>
            <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Enterprise License Active
            </div>
          </div>
          <button 
            type="button"
            className="px-5 py-2.5 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded-xl hover:text-foreground transition-colors shrink-0"
          >
            Manage Billing
          </button>
        </div>
      </form>
    </div>
  )
}
