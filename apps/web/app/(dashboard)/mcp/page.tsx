"use client"

import * as React from "react"
import { 
  Bot, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Code2, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  Zap, 
  Server, 
  RefreshCw,
  Info
} from "lucide-react"

interface ToolDefinition {
  name: string
  description: string
  category: string
  parameters: Record<string, { type: string; description: string; required?: boolean; default?: string }>
}

const MCP_TOOLS: ToolDefinition[] = [
  {
    name: "gurukulx_search_courses",
    description: "Search and retrieve published courses, curriculum modules, and tags across the academy.",
    category: "Catalog",
    parameters: {
      query: { type: "string", description: "Search query or keyword", required: false, default: "Fullstack" },
      limit: { type: "number", description: "Maximum number of records to return", required: false, default: "5" },
    }
  },
  {
    name: "gurukulx_get_analytics",
    description: "Retrieve real-time metrics including enrollments, completion rates, and country breakdown.",
    category: "Analytics",
    parameters: {
      days: { type: "number", description: "Timeframe in days to aggregate", required: false, default: "30" },
    }
  },
  {
    name: "gurukulx_get_compliance",
    description: "Audit compliance records, overdue learners, and certificate issuance status.",
    category: "Compliance",
    parameters: {
      status: { type: "string", description: "Filter by status: compliant, overdue, or pending", required: false, default: "all" },
    }
  },
  {
    name: "gurukulx_invite_member",
    description: "Generate and dispatch an invitation token to onboard a new student or instructor.",
    category: "Audience",
    parameters: {
      email: { type: "string", description: "Target user email address", required: true, default: "student@example.com" },
      role: { type: "string", description: "Role assignment: STUDENT, INSTRUCTOR, or ADMIN", required: true, default: "STUDENT" },
    }
  }
]

export default function McpPage() {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"config" | "tools" | "playground">("config")
  const [selectedTool, setSelectedTool] = React.useState<ToolDefinition>(MCP_TOOLS[0] as ToolDefinition)
  const [toolInputs, setToolInputs] = React.useState<Record<string, string>>({
    query: "Fullstack",
    limit: "5"
  })
  const [isRunning, setIsRunning] = React.useState(false)
  const [toolOutput, setToolOutput] = React.useState<string | null>(null)
  const [executionTime, setExecutionTime] = React.useState<number | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const claudeConfigSnippet = JSON.stringify({
    mcpServers: {
      gurukulx: {
        command: "npx",
        args: ["-y", "@gurukulx/mcp-server"],
        env: {
          GURUKULX_API_URL: "http://localhost:3001",
          GURUKULX_WORKSPACE_ID: "dev-workspace-123",
          GURUKULX_API_KEY: "gx_live_••••••••••••••••"
        }
      }
    }
  }, null, 2)

  const cursorSseSnippet = JSON.stringify({
    type: "sse",
    url: "http://localhost:3001/mcp/sse",
    headers: {
      "x-workspace-id": "dev-workspace-123",
      "Authorization": "Bearer gx_live_••••••••••••••••"
    }
  }, null, 2)

  const handleSelectTool = (tool: ToolDefinition) => {
    setSelectedTool(tool)
    const defaults: Record<string, string> = {}
    Object.entries(tool.parameters).forEach(([key, val]) => {
      defaults[key] = val.default || ""
    })
    setToolInputs(defaults)
    setToolOutput(null)
    setExecutionTime(null)
  }

  const handleRunTool = () => {
    setIsRunning(true)
    setToolOutput(null)
    const startTime = performance.now()

    setTimeout(() => {
      const endTime = performance.now()
      setExecutionTime(Math.round(endTime - startTime))
      setIsRunning(false)

      if (selectedTool.name === "gurukulx_search_courses") {
        setToolOutput(JSON.stringify({
          status: "success",
          count: 2,
          results: [
            {
              id: "course_1",
              title: "Fullstack Web Development with Next.js 16",
              slug: "fullstack-web-dev",
              level: "Intermediate",
              published: true,
              totalEnrollments: 142
            },
            {
              id: "course_2",
              title: "Advanced TypeScript & Microservices Architecture",
              slug: "advanced-typescript",
              level: "Advanced",
              published: true,
              totalEnrollments: 89
            }
          ]
        }, null, 2))
      } else if (selectedTool.name === "gurukulx_get_analytics") {
        setToolOutput(JSON.stringify({
          status: "success",
          period: `${toolInputs.days || 30} days`,
          metrics: {
            activeLearners: 342,
            completionRate: "78.4%",
            avgWatchTimeMinutes: 42.6,
            topCountries: ["IN", "US", "DE", "GB", "CA"]
          }
        }, null, 2))
      } else if (selectedTool.name === "gurukulx_get_compliance") {
        setToolOutput(JSON.stringify({
          status: "success",
          complianceScore: "94.2%",
          auditedUsers: 48,
          records: [
            { userId: "user_101", name: "Rahul Verma", status: "COMPLIANT", certifiedAt: "2026-03-01" },
            { userId: "user_102", name: "Sarah Jenkins", status: "COMPLIANT", certifiedAt: "2026-03-04" },
            { userId: "user_103", name: "Alex Chen", status: "PENDING_RENEWAL", dueDate: "2026-04-15" }
          ]
        }, null, 2))
      } else {
        setToolOutput(JSON.stringify({
          status: "success",
          message: `Invitation generated for ${toolInputs.email || "student@example.com"}`,
          inviteToken: "inv_" + Math.random().toString(36).substring(2, 10),
          role: toolInputs.role || "STUDENT",
          expiresIn: "7 days"
        }, null, 2))
      }
    }, 450)
  }

  return (
    <div className="p-8 max-w-[1300px] mx-auto text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Model Context Protocol (MCP)</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Engine Online
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Connect AI assistants (Claude Desktop, Cursor, Copilot) directly to your GurukulX workspace tools and databases.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === "config" 
                ? "bg-card text-foreground shadow-xs" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Config & Setup
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === "tools" 
                ? "bg-card text-foreground shadow-xs" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Tools Catalog ({MCP_TOOLS.length})
          </button>
          <button
            onClick={() => setActiveTab("playground")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === "playground" 
                ? "bg-card text-foreground shadow-xs" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Tool Playground
          </button>
        </div>
      </div>

      {/* Tab: Config & Setup */}
      {activeTab === "config" && (
        <div className="space-y-6">
          {/* Quick Info Banner */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-foreground">Standardized AI Agent Interoperability</span>
              <p className="text-muted-foreground leading-relaxed">
                By configuring MCP, your local AI coding agent or desktop chat can query live LMS records, pull learner data, trigger course automations, and generate certified transcripts without context switching.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Claude Desktop Config */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs">
                      C
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">Claude Desktop Configuration</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(claudeConfigSnippet, "claude")}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted rounded-lg border border-border transition-colors cursor-pointer"
                  >
                    {copiedKey === "claude" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === "claude" ? "Copied" : "Copy JSON"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Add this to your <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[11px]">claude_desktop_config.json</code> file:
                </p>
                <div className="bg-muted/40 border border-border rounded-xl p-4 font-mono text-xs text-foreground/90 overflow-x-auto">
                  <pre>{claudeConfigSnippet}</pre>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>File Location: %APPDATA%\Claude\claude_desktop_config.json</span>
                <span className="text-emerald-500 font-medium">Stdio transport ready</span>
              </div>
            </div>

            {/* Cursor / SSE Config */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs">
                      ⚡
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">Cursor & SSE Remote Agent</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cursorSseSnippet, "cursor")}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted rounded-lg border border-border transition-colors cursor-pointer"
                  >
                    {copiedKey === "cursor" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === "cursor" ? "Copied" : "Copy JSON"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Connect over Server-Sent Events (SSE) from Cursor IDE Settings &gt; Features &gt; MCP:
                </p>
                <div className="bg-muted/40 border border-border rounded-xl p-4 font-mono text-xs text-foreground/90 overflow-x-auto">
                  <pre>{cursorSseSnippet}</pre>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Protocol: Model Context Protocol v2024-11-05</span>
                <span className="text-blue-500 font-medium">SSE transport ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tools Catalog */}
      {activeTab === "tools" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MCP_TOOLS.map((tool) => (
            <div key={tool.name} className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                    {tool.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">Tool</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground font-mono mb-2">{tool.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{tool.description}</p>
                
                <div className="space-y-2 border-t border-border/60 pt-3">
                  <span className="text-[11px] font-semibold text-foreground">Parameters:</span>
                  {Object.entries(tool.parameters).map(([param, config]) => (
                    <div key={param} className="flex items-baseline justify-between text-xs bg-muted/30 px-3 py-1.5 rounded-lg border border-border/40">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-medium text-foreground">{param}</span>
                        {config.required && <span className="text-rose-500 text-[10px] font-bold">*</span>}
                        <span className="text-muted-foreground text-[11px]">({config.type})</span>
                      </div>
                      <span className="text-muted-foreground text-[11px] truncate max-w-[200px]">{config.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex justify-end">
                <button
                  onClick={() => {
                    handleSelectTool(tool)
                    setActiveTab("playground")
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  Test in Playground
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Playground */}
      {activeTab === "playground" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Select & Configure Tool
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Target MCP Tool</label>
                  <select
                    value={selectedTool.name}
                    onChange={(e) => {
                      const found = MCP_TOOLS.find(t => t.name === e.target.value)
                      if (found) handleSelectTool(found)
                    }}
                    className="w-full h-10 px-3 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {MCP_TOOLS.map(t => (
                      <option key={t.name} value={t.name}>{t.name} ({t.category})</option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <span className="text-xs font-semibold text-foreground">Arguments:</span>
                  {Object.entries(selectedTool.parameters).map(([key, config]) => (
                    <div key={key}>
                      <label className="block text-[11px] font-mono text-muted-foreground mb-1">
                        {key} {config.required && <span className="text-destructive">*</span>}
                      </label>
                      <input
                        type="text"
                        value={toolInputs[key] || ""}
                        onChange={(e) => setToolInputs(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={config.description}
                        className="w-full h-9 px-3 bg-background border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRunTool}
                  disabled={isRunning}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {isRunning ? "Executing Tool..." : "Run Tool Call"}
                </button>
              </div>
            </div>
          </div>

          {/* Terminal output */}
          <div className="lg:col-span-7">
            <div className="bg-[#09090b] border border-border rounded-2xl p-6 shadow-xs flex flex-col h-full min-h-[420px]">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-gray-400">mcp-sandbox-output.json</span>
                </div>
                {executionTime !== null && (
                  <span className="text-[11px] font-mono text-emerald-400">
                    Execution: {executionTime}ms
                  </span>
                )}
              </div>

              <div className="flex-1 font-mono text-xs overflow-x-auto text-gray-300 leading-relaxed">
                {isRunning && (
                  <div className="flex items-center gap-2 text-muted-foreground animate-pulse py-8">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Communicating with GurukulX MCP Server...</span>
                  </div>
                )}
                {!isRunning && toolOutput && (
                  <pre className="text-emerald-400">{toolOutput}</pre>
                )}
                {!isRunning && !toolOutput && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16 text-gray-500">
                    <Code2 className="w-10 h-10 mb-3 stroke-1" />
                    <p className="text-xs">Select arguments on the left and click "Run Tool Call" to simulate an MCP query.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
