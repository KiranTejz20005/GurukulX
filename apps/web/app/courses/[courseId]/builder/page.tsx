"use client"

import { LeftPanel } from "@/components/builder/LeftPanel"
import { MiddlePanel } from "@/components/builder/MiddlePanel"
import { RightPanel } from "@/components/builder/RightPanel"

export default function CourseBuilderPage() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-gray-200">
      <LeftPanel />
      <MiddlePanel />
      <RightPanel />
    </div>
  )
}
