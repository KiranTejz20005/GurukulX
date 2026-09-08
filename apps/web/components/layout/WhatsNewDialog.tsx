"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Sparkles, BarChart2, ShieldCheck, Bell, Search } from "lucide-react"

interface WhatsNewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WhatsNewDialog({ open, onOpenChange }: WhatsNewDialogProps) {
  const updates = [
    {
      icon: BarChart2,
      title: "Real-Time Analytics Dashboard",
      desc: "Live learner metrics, completion rates, course performance, and CSV exports.",
      badge: "New",
    },
    {
      icon: ShieldCheck,
      title: "Automated Compliance Auditing",
      desc: "Instant compliance tracking, learner progress certification, and status breakdown.",
      badge: "New",
    },
    {
      icon: Bell,
      title: "Real-Time Notification Center",
      desc: "Instant updates on course publishing, student enrollments, quiz scores, and forum replies.",
      badge: "Improved",
    },
    {
      icon: Search,
      title: "Global Command Palette (Ctrl+K)",
      desc: "Fuzzy search courses, programs, and navigate anywhere in the platform with your keyboard.",
      badge: "New",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl border-border bg-popover/98 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="text-left space-y-1">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-lg font-bold text-foreground">
              What&apos;s new in GurukulX
            </DialogTitle>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
              v1.2.0
            </span>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Explore the latest features, improvements, and updates shipped to your platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {updates.map((up, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl border border-border/70 bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 mt-0.5 text-foreground">
                <up.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground">{up.title}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/80">
                    {up.badge}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  {up.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            Got it
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
