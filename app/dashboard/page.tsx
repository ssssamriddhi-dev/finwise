'use client'

import { useEffect, useState } from "react"

export default function Dashboard() {
  const [name, setName] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("finwise_name")
    if (!saved) { window.location.href = "/"; return; }
    setName(saved)
  }, [])

  return (
    <main className="min-h-screen bg-[#0B0F10] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-1">Finwise</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold">Good morning, {name} 👋</h1>
          </div>
          <button
            onClick={() => { localStorage.removeItem("finwise_name"); window.location.href = "/"; }}
            className="text-[#8C9A9E] text-xs hover:text-[#F5F7F7] transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#121A1C] rounded-2xl p-5 border border-[#1E2D30]">
            <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Total Income</p>
            <p className="text-[#F5F7F7] text-2xl font-semibold">₹0</p>
          </div>
          <div className="bg-[#121A1C] rounded-2xl p-5 border border-[#1E2D30]">
            <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Total Expenses</p>
            <p className="text-[#F5F7F7] text-2xl font-semibold">₹0</p>
          </div>
          <div className="bg-[#121A1C] rounded-2xl p-5 border border-[#1E2D30]">
            <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Savings</p>
            <p className="text-[#2D8F85] text-2xl font-semibold">₹0</p>
          </div>
        </div>

        <div className="bg-[#121A1C] rounded-2xl p-6 border border-[#1E2D30]">
          <p className="text-[#F5F7F7] text-sm font-medium mb-1">Dashboard coming soon</p>
          <p className="text-[#8C9A9E] text-xs">We're building your financial overview. Check back soon!</p>
        </div>
      </div>
    </main>
  )
}
