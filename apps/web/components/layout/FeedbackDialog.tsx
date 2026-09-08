"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { MessageSquarePlus, Check, Send } from "lucide-react"

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [feedback, setFeedback] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFeedback("")
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6 rounded-2xl border-border bg-popover/98 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="text-left space-y-1">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-1">
            <MessageSquarePlus className="w-4 h-4" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Share your feedback
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Help us improve GurukulX. Tell us what you like or what could be better.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">Thank you for your feedback!</p>
            <p className="text-xs text-muted-foreground">Our team reviews every single submission.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <textarea
              required
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What's on your mind? Feature requests, bugs, or general feedback..."
              className="w-full text-xs p-3 rounded-xl border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!feedback.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
