"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, X, Settings, Image as ImageIcon, Link as LinkIcon, Type, LayoutTemplate } from "lucide-react"

type SectionKey = 'hero' | 'navigation' | 'features' | 'footer'

export default function LandingPageEditor() {
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState<SectionKey | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [theme, setTheme] = useState('minimal')

  // Mock settings state
  const [settings, setSettings] = useState({
    hero: {
      title: "Welcome to ClassroomIO",
      subtitle: "The modern learning platform",
      ctaText: "Get Started",
    },
    navigation: {
      showLogo: true,
      links: ["Courses", "About", "Contact"]
    },
    features: {
      title: "Why choose us?",
      items: ["Interactive Lessons", "Expert Mentors", "Community"]
    },
    footer: {
      text: "© 2026 ClassroomIO"
    }
  })

  const sections = [
    { key: 'navigation', title: 'Navigation', icon: LinkIcon },
    { key: 'hero', title: 'Hero Section', icon: Image },
    { key: 'features', title: 'Features', icon: LayoutTemplate },
    { key: 'footer', title: 'Footer', icon: Settings },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    // mock save
    await new Promise(r => setTimeout(r, 1000))
    setIsSaving(false)
  }

  const handleClose = () => {
    if (selectedSection) {
      setSelectedSection(null)
    } else {
      router.push('/settings')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex h-screen w-screen bg-background overflow-hidden">
      
      {/* Left Sidebar / Editor Panel */}
      <div className="w-[360px] h-full border-r border-border bg-card flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between p-4 border-b border-border">
          {selectedSection ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedSection(null)} className="p-1 hover:bg-muted rounded-md transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-semibold text-sm capitalize">{selectedSection}</h3>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button onClick={handleClose} className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!selectedSection ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Page Builder</h4>
                <div className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setSelectedSection(section.key as SectionKey)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{section.title}</span>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 rotate-180 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Theme Settings</h4>
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="minimal">Minimal</option>
                  <option value="bold">Bold</option>
                  <option value="playful">Playful</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedSection === 'hero' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Headline</label>
                    <input 
                      type="text" 
                      value={settings.hero.title}
                      onChange={(e) => setSettings({...settings, hero: {...settings.hero, title: e.target.value}})}
                      className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Subtitle</label>
                    <textarea 
                      value={settings.hero.subtitle}
                      onChange={(e) => setSettings({...settings, hero: {...settings.hero, subtitle: e.target.value}})}
                      className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary resize-none h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">CTA Button Text</label>
                    <input 
                      type="text" 
                      value={settings.hero.ctaText}
                      onChange={(e) => setSettings({...settings, hero: {...settings.hero, ctaText: e.target.value}})}
                      className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </>
              )}
              {selectedSection === 'navigation' && (
                <div className="text-sm text-muted-foreground">Navigation settings coming soon...</div>
              )}
              {selectedSection === 'features' && (
                <div className="text-sm text-muted-foreground">Features settings coming soon...</div>
              )}
              {selectedSection === 'footer' && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Footer Text</label>
                  <input 
                    type="text" 
                    value={settings.footer.text}
                    onChange={(e) => setSettings({...settings, footer: {...settings.footer, text: e.target.value}})}
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="flex-1 bg-muted/30 relative overflow-y-auto">
        <div className="max-w-5xl mx-auto my-8 bg-background border border-border shadow-2xl rounded-xl min-h-[800px] overflow-hidden flex flex-col">
          
          {/* Mock Preview Header */}
          <div className="h-16 border-b border-border flex items-center justify-between px-8 bg-card">
            {settings.navigation.showLogo && (
              <div className="font-bold text-lg tracking-tight">ClassroomIO</div>
            )}
            <div className="flex gap-6">
              {settings.navigation.links.map(link => (
                <span key={link} className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{link}</span>
              ))}
            </div>
          </div>

          {/* Mock Preview Hero */}
          <div className={`flex-1 flex flex-col items-center justify-center text-center px-8 py-32 ${theme === 'bold' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight">
              {settings.hero.title}
            </h1>
            <p className={`text-xl mb-10 max-w-2xl ${theme === 'bold' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {settings.hero.subtitle}
            </p>
            <button className={`px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:scale-105 shadow-lg ${theme === 'bold' ? 'bg-background text-primary' : 'bg-primary text-primary-foreground'}`}>
              {settings.hero.ctaText}
            </button>
          </div>

          {/* Mock Preview Features */}
          <div className="py-24 bg-muted/30 px-8 text-center border-t border-border">
            <h2 className="text-3xl font-bold mb-12">{settings.features.title}</h2>
            <div className="flex justify-center gap-8 flex-wrap">
              {settings.features.items.map(item => (
                <div key={item} className="bg-card border border-border p-8 rounded-2xl w-64 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <LayoutTemplate className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{item}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Preview Footer */}
          <div className="py-8 bg-card border-t border-border text-center">
            <p className="text-sm text-muted-foreground">{settings.footer.text}</p>
          </div>

        </div>
      </div>
    </div>
  )
}
