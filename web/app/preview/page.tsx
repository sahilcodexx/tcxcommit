"use client"

import { Keyboard } from "@/components/ui/keyboard"

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-8">
      <Keyboard enableHaptics={false} enableSound={false} />
    </div>
  )
}
