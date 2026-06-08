"use client"

import { useState } from "react"
import { ArrowUp, BookOpen, GraduationCap, Award, ChevronDown, CheckCircle, Circle, LoaderCircle, Compass, ShieldCheck, Users } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CreatingStep = 'reading' | 'naming' | 'building'

const steps: { key: CreatingStep; label: string }[] = [
  { key: 'reading', label: 'Reading and analyzing your prompt...' },
  { key: 'naming', label: 'Drafting course title and outline...' },
  { key: 'building', label: 'Building the curriculum...' }
]

const heroHighlights = [
  { label: 'Prompt first', value: 'Turn a rough idea into a structured course brief.' },
  { label: 'Template guided', value: 'Start from proven outlines for faster launches.' },
  { label: 'Model aware', value: 'Choose the right AI model for the task.' }
]

const COURSE_TEMPLATES = [
  {
    id: "product-101",
    title: "Product 101 Course",
    description: "A fundamentals course teaching customers how to use your product.",
    icon: GraduationCap,
    prompt: "I want to create a 101 course for my software product. It should cover the basics of logging in, setting up a profile, and creating the first project."
  },
  {
    id: "onboarding",
    title: "Employee Onboarding",
    description: "An onboarding training that gets new hires productive in their first week.",
    icon: Users,
    prompt: "Design a 5-day employee onboarding course for new software engineers joining our team. Include company culture, setting up the dev environment, and pushing the first PR."
  },
  {
    id: "expert",
    title: "Become an Expert",
    description: "A in-depth course turning learners into experts on a specific niche.",
    icon: Award,
    prompt: "I want an advanced masterclass on React Server Components and Next.js App Router for senior developers."
  },
  {
    id: "compliance",
    title: "Compliance Training",
    description: "Standardized training for security, privacy, and company policies.",
    icon: ShieldCheck,
    prompt: "Create a standard yearly compliance training course covering data privacy, phishing, and workplace harassment."
  },
  {
    id: "hobby",
    title: "Hobby Masterclass",
    description: "Teach a practical skill like photography, cooking, or coding.",
    icon: Compass,
    prompt: "I want to teach beginners how to bake sourdough bread from scratch. It should include equipment, starter maintenance, and baking."
  },
  {
    id: "general",
    title: "Blank Canvas",
    description: "Start from scratch with a custom prompt.",
    icon: BookOpen,
    prompt: ""
  }
]

export default function DashboardHome() {
  const router = useRouter()
  const [creatingState, setCreatingState] = useState<'idle' | 'creating'>('idle')
  const [creatingStep, setCreatingStep] = useState<CreatingStep>('reading')
  const [draftingPrompt, setDraftingPrompt] = useState('')
  const [composerPrompt, setComposerPrompt] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  function stepStatus(key: CreatingStep): 'done' | 'active' | 'pending' {
    const order: CreatingStep[] = ['reading', 'naming', 'building']
    const current = order.indexOf(creatingStep)
    const target = order.indexOf(key)

    if (target < current) return 'done'
    if (target === current) return 'active'
    return 'pending'
  }

  function selectTemplate(template: any) {
    setComposerPrompt(template.prompt)
    setSelectedTemplateId(template.id)
  }

  async function handleCreate() {
    if (!composerPrompt.trim()) return

    setDraftingPrompt(composerPrompt)
    setCreatingState('creating')
    setCreatingStep('reading')

    // Simulate AI generation process
    await new Promise((r) => setTimeout(r, 1500))
    setCreatingStep('naming')
    
    await new Promise((r) => setTimeout(r, 2000))
    setCreatingStep('building')

    await new Promise((r) => setTimeout(r, 2000))

    // For now, redirect to the course list or builder
    router.push('/courses')
  }

  return (
    <div className="relative overflow-hidden min-h-[85vh] -m-6 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_34%),radial-gradient(circle_at_right,_rgba(16,185,129,0.1),_transparent_26%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-16 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -right-24 top-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-[28rem] h-[28rem] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      {creatingState === 'creating' ? (
        <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-16">
          <BlurFade className="w-full max-w-2xl">
            <div className="mb-8 flex justify-center">
              <span className="border bg-card/80 text-muted-foreground rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur">
                Drafting in progress
              </span>
            </div>

            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your course is being built</h1>
              <p className="text-muted-foreground mx-auto max-w-xl text-sm leading-6 sm:text-base">
                Our AI assistant is currently structuring the modules, writing the lessons, and organizing the content based on your prompt.
              </p>
            </div>

            <div className="bg-card/80 mt-8 rounded-[1.75rem] border p-5 shadow-[0_20px_80px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6">
              <p className="mb-5 rounded-2xl bg-black/5 dark:bg-white/5 px-4 py-3 text-sm italic text-muted-foreground">"{draftingPrompt}"</p>

              <div className="flex flex-col gap-3">
                {steps.map((step) => {
                  const status = stepStatus(step.key)
                  return (
                    <div 
                      key={step.key} 
                      className={`flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-colors ${
                        status === 'active' ? 'bg-white/5 dark:bg-white/10' : 'bg-transparent'
                      }`}
                    >
                      {status === 'done' ? (
                        <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                      ) : status === 'active' ? (
                        <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          status === 'done'
                            ? 'text-muted-foreground line-through'
                            : status === 'active'
                              ? 'text-foreground'
                              : 'text-muted-foreground/70'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </BlurFade>
        </div>
      ) : (
        <div className="relative flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6">
          <div className="w-full max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
              <div className="space-y-6">
                <BlurFade>
                  <span className="border bg-card/80 text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur">
                    AI-assisted course builder
                  </span>
                </BlurFade>

                <BlurFade delay={0.04}>
                  <div className="space-y-4">
                    <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                      Build a course from a single prompt.
                    </h1>
                    <p className="text-muted-foreground max-w-xl text-base leading-7 sm:text-lg">
                      Describe the outcome you want, pick a template, and let the assistant shape the lesson flow, title, and first draft.
                    </p>
                  </div>
                </BlurFade>

                <div className="grid gap-3 sm:grid-cols-3">
                  {heroHighlights.map((highlight, index) => (
                    <BlurFade key={highlight.label} delay={0.06 * index} className="h-full">
                      <div className="bg-card/70 h-full rounded-2xl border p-4 shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                          {highlight.label}
                        </p>
                        <p className="text-foreground mt-2 text-sm leading-6">
                          {highlight.value}
                        </p>
                      </div>
                    </BlurFade>
                  ))}
                </div>
              </div>

              <BlurFade delay={0.12}>
                <div className="bg-card/90 rounded-[2rem] border p-4 shadow-[0_30px_90px_-36px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Course creator</p>
                      <p className="text-foreground mt-1 text-sm">A focused workspace for drafting and publishing.</p>
                    </div>
                    <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
                      Guided flow
                    </div>
                  </div>

                  <div className="w-full mt-6 flex flex-col gap-3">
                    <textarea 
                      placeholder="Ask ClassroomIO to create a course for you..." 
                      className="w-full bg-background border border-border focus:border-primary/50 rounded-xl resize-none text-sm placeholder:text-muted-foreground p-4 h-32 outline-none shadow-inner"
                      value={composerPrompt}
                      onChange={(e) => setComposerPrompt(e.target.value)}
                    />
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Select defaultValue="beginner">
                          <SelectTrigger className="h-8 w-[120px] bg-muted/50 border-border text-xs font-medium">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select defaultValue="gemini">
                          <SelectTrigger className="h-8 w-[140px] bg-muted/50 border-border text-xs font-medium">
                            <SelectValue placeholder="Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gemini">Google API (Gemini)</SelectItem>
                            <SelectItem value="claude">Claude</SelectItem>
                            <SelectItem value="openai">OpenAI</SelectItem>
                            <SelectItem value="kimi">Kimi</SelectItem>
                            <SelectItem value="moonshot">Moonshot</SelectItem>
                            <SelectItem value="nvidia">Nvidia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <button 
                        onClick={handleCreate}
                        disabled={!composerPrompt.trim()}
                        className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4">
              <BlurFade delay={0.18}>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.22em]">
                  Starter templates
                </p>
              </BlurFade>

              <BlurFade delay={0.2}>
                <p className="text-muted-foreground text-sm">
                  Pick a template and adapt the prompt in a second.
                </p>
              </BlurFade>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COURSE_TEMPLATES.map((template, index) => {
                const isSelected = selectedTemplateId === template.id
                return (
                  <BlurFade key={template.id} delay={0.04 * index} className="h-full">
                    <button
                      type="button"
                      className={`group border transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none flex h-full min-h-[180px] w-full cursor-pointer flex-col items-start gap-3 rounded-[1.5rem] p-5 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${
                        isSelected
                          ? 'bg-primary/5 border-primary ring-primary/20 ring-2'
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                      onClick={() => selectTemplate(template)}
                    >
                      <div className="text-primary bg-primary/10 flex w-10 h-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/15">
                        <template.icon className="w-6 h-6" />
                      </div>
                      <span className="text-foreground text-sm leading-tight font-semibold">
                        {template.title}
                      </span>
                      <span className="text-muted-foreground text-xs leading-snug">
                        {template.description}
                      </span>
                    </button>
                  </BlurFade>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
