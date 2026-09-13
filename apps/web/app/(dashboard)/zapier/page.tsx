"use client"

import * as React from "react"
import { 
  Workflow, 
  Copy, 
  Check, 
  Zap, 
  CheckCircle2, 
  Send, 
  Key, 
  Eye, 
  EyeOff, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Radio
} from "lucide-react"

interface WebhookTrigger {
  id: string
  event: string
  description: string
  active: boolean
  lastTriggered?: string
}

interface ZapItem {
  id: string
  title: string
  description: string
  targetApp: string
  event: string
  active: boolean
}

export default function ZapierPage() {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [showSecret, setShowSecret] = React.useState(false)
  const [testingWebhook, setTestingWebhook] = React.useState(false)
  const [testResult, setTestResult] = React.useState<string | null>(null)

  const [zaps, setZaps] = React.useState<ZapItem[]>([
    {
      id: "zap_1",
      title: "Sync New Enrollments to Google Sheets",
      description: "Appends learner name, email, and selected course row to Master Ledger.",
      targetApp: "Google Sheets",
      event: "student.enrolled",
      active: true,
    },
    {
      id: "zap_2",
      title: "Broadcast Certificate Awards in Slack #general",
      description: "Sends automated kudos message when a student finishes course certification.",
      targetApp: "Slack",
      event: "certificate.issued",
      active: true,
    },
    {
      id: "zap_3",
      title: "Update HubSpot CRM Deal Stage on Completion",
      description: "Moves contact to 'Certified Learner' lifecycle stage upon curriculum graduation.",
      targetApp: "HubSpot",
      event: "course.completed",
      active: false,
    },
  ])

  const webhookEndpoint = "https://api.gurukulx.dev/v1/webhooks/zapier/dev-workspace-123"
  const webhookSecret = "whsec_gx_9a8f21c830df294ea6b71b"

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const toggleZap = (id: string) => {
    setZaps(prev => prev.map(z => z.id === id ? { ...z, active: !z.active } : z))
  }

  const handleSendTest = () => {
    setTestingWebhook(true)
    setTestResult(null)
    setTimeout(() => {
      setTestingWebhook(false)
      setTestResult("Test payload dispatched successfully: HTTP 200 OK from Zapier Webhook Receiver.")
      setTimeout(() => setTestResult(null), 4000)
    }, 600)
  }

  return (
    <div className="p-8 max-w-[1300px] mx-auto text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Zapier & Webhook Integrations</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ff4f00]/10 text-[#ff4f00] border border-[#ff4f00]/20">
              <Zap className="w-3 h-3" />
              Webhooks Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Connect GurukulX events to 5,000+ business applications including Slack, Google Sheets, HubSpot, and Notion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSendTest}
            disabled={testingWebhook}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-foreground bg-muted/60 hover:bg-muted rounded-xl border border-border transition-colors cursor-pointer disabled:opacity-50"
          >
            {testingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {testingWebhook ? "Sending..." : "Test Webhook Ping"}
          </button>
          <a
            href="https://zapier.com/apps"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#ff4f00] hover:bg-[#e04500] rounded-xl transition-all shadow-xs"
          >
            Open Zapier
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {testResult && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Webhook Connection Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#ff4f00]" />
          Workspace Webhook Endpoint
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Webhook Target URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookEndpoint}
                className="w-full h-10 px-3 bg-muted/30 border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(webhookEndpoint, "endpoint")}
                className="h-10 px-3 bg-muted/60 hover:bg-muted border border-border rounded-xl text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedKey === "endpoint" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === "endpoint" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Webhook HMAC Secret</label>
            <div className="flex items-center gap-2">
              <input
                type={showSecret ? "text" : "password"}
                readOnly
                value={webhookSecret}
                className="w-full h-10 px-3 bg-muted/30 border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none"
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="h-10 px-3 bg-muted/60 hover:bg-muted border border-border rounded-xl text-xs text-foreground transition-colors cursor-pointer"
                title={showSecret ? "Hide secret" : "Reveal secret"}
              >
                {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => copyToClipboard(webhookSecret, "secret")}
                className="h-10 px-3 bg-muted/60 hover:bg-muted border border-border rounded-xl text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedKey === "secret" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === "secret" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Integrations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Configured Workflows ({zaps.length})</h2>
          <span className="text-xs text-muted-foreground">Toggle automations on or off in real-time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {zaps.map((zap) => (
            <div 
              key={zap.id}
              className={`bg-card border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                zap.active ? "border-border" : "border-border/60 opacity-70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
                    {zap.targetApp}
                  </span>
                  <button
                    onClick={() => toggleZap(zap.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                      zap.active ? "bg-emerald-500" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        zap.active ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-sm font-semibold text-foreground mb-1.5">{zap.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{zap.description}</p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px]">
                <span className="font-mono text-muted-foreground">Trigger: {zap.event}</span>
                <span className={zap.active ? "text-emerald-500 font-medium" : "text-muted-foreground"}>
                  {zap.active ? "Active" : "Paused"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
