"use client"

import { Settings, Sparkles, X, SlidersHorizontal, Eye, Lock } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<'settings' | 'ai'>('settings')

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full flex-shrink-0 text-foreground">
      {/* Header Tabs */}
      <div className="h-14 border-b border-border flex items-center px-2 shrink-0 bg-background/50 backdrop-blur">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center gap-2 h-10 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Properties
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-2 h-10 text-sm font-medium rounded-md transition-colors ${activeTab === 'ai' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
        >
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI Tutor
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'settings' ? (
          <div className="p-5 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visibility</label>
              <div className="space-y-2 mt-2">
                <button className="w-full flex items-center justify-between p-3 border border-primary/50 bg-primary/5 rounded-lg text-left">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Published</p>
                      <p className="text-xs text-muted-foreground">Visible to all enrolled students</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-4 border-primary bg-background" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-border bg-background hover:bg-accent rounded-lg text-left transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Draft</p>
                      <p className="text-xs text-muted-foreground">Only visible to instructors</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-border" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL Slug</label>
              <input 
                type="text" 
                placeholder="my-lesson-slug" 
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground mt-1">Changing this might break existing links.</p>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-border">
              <Button variant="destructive" className="w-full">
                Delete Item
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-5 overflow-y-auto">
              <div className="bg-accent rounded-lg p-4 text-sm text-foreground shadow-sm">
                <p className="flex items-center gap-2 font-medium mb-1">
                  <Sparkles className="w-4 h-4 text-purple-500" /> AI Assistant
                </p>
                <p className="text-muted-foreground">I can help you generate content, create quizzes, or improve your writing. What do you need help with?</p>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-background">
              <textarea 
                placeholder="Ask AI for help..." 
                className="w-full bg-accent border border-border rounded-lg px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
              <Button className="w-full mt-2" size="sm">
                Send to AI
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
