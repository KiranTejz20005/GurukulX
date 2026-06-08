"use client"

import { Plus, ListChecks, FileText, Settings, PlayCircle } from "lucide-react"

export default function CourseExercisesPage() {
  const exercises = [
    { id: 1, title: "Module 1 Quiz", type: "quiz", questions: 5, status: "published" },
    { id: 2, title: "Final Project Submission", type: "assignment", points: 100, status: "draft" }
  ]

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Exercises & Quizzes</h1>
            <p className="text-sm text-muted-foreground mt-1">Create assignments and assessments to test student knowledge.</p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Exercise
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {exercises.map(ex => (
              <div key={ex.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${ex.type === 'quiz' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                    {ex.type === 'quiz' ? <ListChecks className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{ex.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      <span>{ex.type}</span>
                      <span>•</span>
                      <span>{ex.type === 'quiz' ? `${ex.questions} questions` : `${ex.points} pts`}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ex.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {ex.status}
                  </span>
                  <button className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 cursor-pointer transition-colors mt-4">
              <Plus className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm font-medium text-foreground">Create your first assessment</p>
              <p className="text-xs mt-1">Add a quiz or coding assignment.</p>
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Exercise Types</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <ListChecks className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Quizzes</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Multiple choice and true/false questions, automatically graded.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-purple-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Assignments</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Open-ended text or file uploads requiring manual grading.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <PlayCircle className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Interactive</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Coming soon. Embed interactive code sandboxes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
