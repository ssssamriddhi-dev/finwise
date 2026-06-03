'use client'

import { useState } from "react"
import { loadDemoData } from "@/lib/data"

export default function Home() {
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const savedName = typeof window !== "undefined" ? localStorage.getItem("finwise_name") : null

  if (savedName && !submitted) {
    return (
      <main className="min-h-screen bg-[#0B0F10] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#2D8F85] text-sm font-medium tracking-widest uppercase mb-3">Welcome back</p>
          <h1 className="text-[#F5F7F7] text-4xl font-semibold mb-8">Hey, {savedName} 👋</h1>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="bg-[#2D8F85] hover:bg-[#39A596] text-white px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full mb-3"
          >
            Go to Dashboard
          </button>
          <p className="text-[#8C9A9E] text-xs mt-4 cursor-pointer hover:text-[#F5F7F7] transition-colors"
            onClick={() => { localStorage.removeItem("finwise_name"); window.location.reload(); }}>
            Not you? Change name
          </p>
        </div>
      </main>
    )
  }

  const handleSubmit = () => {
    if (name.trim().length < 2) return
    localStorage.setItem("finwise_name", name.trim())
    setSubmitted(true)
    window.location.href = "/onboarding"
  }

  const handleDemo = () => {
    loadDemoData()
    window.location.href = "/dashboard"
  }

  return (
    <main className="min-h-screen bg-[#0B0F10] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="text-[#2D8F85] text-sm font-medium tracking-widest uppercase mb-3">Finwise</p>
          <h1 className="text-[#F5F7F7] text-3xl font-semibold leading-snug">
            Your personal<br />finance dashboard
          </h1>
          <p className="text-[#8C9A9E] text-sm mt-3">Track expenses, set budgets, reach your goals.</p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-[#121A1C] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85] transition-colors"
          />
          <button
            onClick={handleSubmit}
            disabled={name.trim().length < 2}
            className="w-full bg-[#2D8F85] hover:bg-[#39A596] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-medium transition-all duration-200"
          >
            Get Started
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-[#1E2D30]" />
            <p className="text-[#8C9A9E] text-xs">or</p>
            <div className="flex-1 h-px bg-[#1E2D30]" />
          </div>

          <button
            onClick={handleDemo}
            className="w-full bg-[#121A1C] hover:bg-[#1E2D30] border border-[#1E2D30] hover:border-[#2D8F85]/50 text-[#8C9A9E] hover:text-[#F5F7F7] py-3 rounded-xl text-sm font-medium transition-all duration-200"
          >
            ✨ Try Demo
          </button>
          <p className="text-[#8C9A9E] text-xs text-center">See the app with sample data — no setup needed</p>
        </div>
      </div>
    </main>
  )
}
