"use client"

import { Search, Mail, Filter, Download, MoreHorizontal } from "lucide-react"

export default function CoursePeoplePage() {
  const students = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", progress: 85, enrolledAt: "2026-05-10", status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", progress: 100, enrolledAt: "2026-04-22", status: "Completed" },
    { id: 3, name: "Charlie Davis", email: "charlie@example.com", progress: 15, enrolledAt: "2026-06-01", status: "Inactive" },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">People & Marks</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage enrolled students and view their progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-border bg-background rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
              <Mail className="w-4 h-4" />
              Invite Students
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-muted/20">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search students by name or email..." 
                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-border bg-background rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Student Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Progress</th>
                  <th className="px-6 py-3 font-medium">Enrolled Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{student.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${student.progress === 100 ? 'bg-green-500' : 'bg-primary'}`} 
                            style={{ width: `${student.progress}%` }} 
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{student.enrolledAt}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${
                        student.status === 'Active' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                        student.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
