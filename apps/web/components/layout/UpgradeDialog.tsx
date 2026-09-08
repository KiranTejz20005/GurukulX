"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Rocket, Check, Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react"

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  const perks = [
    "Unlimited student enrollments (beyond 20 limit)",
    "Custom academy domain & white-label branding",
    "Real-time compliance audit reports & certifications",
    "AI course generation assistant & auto-quizzes",
    "Webhooks, MCP & Zapier integrations",
    "24/7 Priority Discord & email support",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl border-border bg-popover/98 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="text-left space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-1">
            <Rocket className="w-5 h-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Become an Early Adopter
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500 border border-blue-500/20">
              Pro Tier
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Unlock unlimited learners, AI-powered course generation, automated compliance tracking, and dedicated support for your academy.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 rounded-xl bg-muted/40 border border-border/80 p-4 space-y-2.5">
          <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
            <div>
              <span className="text-2xl font-bold text-foreground">$29</span>
              <span className="text-xs text-muted-foreground"> / month</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Save 40% Early Adopter Special
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-foreground/90">
                <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Maybe later
          </button>
          <button
            onClick={() => {
              window.location.href = "/settings/billing"
            }}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md cursor-pointer"
          >
            <span>Upgrade now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
