"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState({
    fullname: "",
    orgName: "",
    siteName: "",
    goal: "",
  })

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    // Mock save logic
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="bg-card border border-border shadow-lg rounded-2xl p-8 max-w-lg mx-auto w-full">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          C
        </div>
        <h1 className="text-2xl font-bold text-foreground">Welcome to ClassroomIO!</h1>
        <p className="text-sm text-muted-foreground mt-2">Let's set up your academy.</p>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Your Full Name</label>
              <input 
                type="text" 
                value={fields.fullname}
                onChange={(e) => setFields({...fields, fullname: e.target.value})}
                placeholder="e.g. Jane Doe"
                className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Academy Name</label>
              <input 
                type="text" 
                value={fields.orgName}
                onChange={(e) => {
                  const val = e.target.value;
                  setFields({
                    ...fields, 
                    orgName: val, 
                    siteName: val.toLowerCase().replace(/[^a-z0-9]/g, '-')
                  })
                }}
                placeholder="e.g. Design Mastery"
                className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Academy Subdomain</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                  https://
                </span>
                <input 
                  type="text" 
                  value={fields.siteName}
                  onChange={(e) => setFields({...fields, siteName: e.target.value})}
                  className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none border border-border bg-background text-sm focus:ring-primary focus:border-primary"
                  placeholder="design-mastery"
                />
                <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-border bg-muted text-muted-foreground text-sm">
                  .classroomio.com
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">What brings you here today?</h3>
            <div className="space-y-2">
              {[
                "I want to sell courses to students.",
                "I want to train my employees.",
                "I want to build a community.",
                "Just exploring."
              ].map(goal => (
                <label key={goal} className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <input 
                    type="radio" 
                    name="goal" 
                    value={goal}
                    checked={fields.goal === goal}
                    onChange={(e) => setFields({...fields, goal: e.target.value})}
                    className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-offset-background"
                  />
                  <span className="ml-3 text-sm text-foreground font-medium">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
          <div className="flex gap-1">
            <div className={`w-12 h-1.5 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`w-12 h-1.5 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <div className="flex gap-2">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                Back
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={loading || (step === 1 && (!fields.fullname || !fields.orgName))}
              className="px-6 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === 1 ? "Continue" : "Finish Setup")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
