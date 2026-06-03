'use client'

import { useState } from "react"

const CURRENCIES = ["₹ INR", "$ USD", "€ EUR", "£ GBP", "AED"]
const PROFESSIONS = ["Student", "Corporate Employee", "Business Owner", "Freelancer", "Homemaker", "Retired", "Other"]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    currency: "₹ INR",
    profession: "",
    income: "",
  })

  const name = typeof window !== "undefined" ? localStorage.getItem("finwise_name") || "there" : "there"

  const handleFinish = () => {
    localStorage.setItem("finwise_profile", JSON.stringify(data))
    window.location.href = "/dashboard"
  }

  return (
    <main className="min-h-screen bg-[#0B0F10] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Progress dots */}
        <div className="flex gap-2 mb-10">
          {[1,2,3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-[#2D8F85]" : "bg-[#1E2D30]"}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 1 of 3</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">Your currency</h1>
            <p className="text-[#8C9A9E] text-sm mb-8">Which currency do you use daily?</p>
            <div className="space-y-2 mb-8">
              {CURRENCIES.map(c => (
                <button key={c} onClick={() => setData(p => ({...p, currency: c}))}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${data.currency === c ? "bg-[#2D8F85]/10 border-[#2D8F85] text-[#F5F7F7]" : "bg-[#121A1C] border-[#1E2D30] text-[#8C9A9E] hover:border-[#2D8F85]/50"}`}>
                  {c}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-[#2D8F85] hover:bg-[#39A596] text-white py-3 rounded-xl text-sm font-medium transition-all">
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 2 of 3</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">What do you do?</h1>
            <p className="text-[#8C9A9E] text-sm mb-8">This helps us personalise your experience.</p>
            <div className="space-y-2 mb-8">
              {PROFESSIONS.map(p => (
                <button key={p} onClick={() => setData(prev => ({...prev, profession: p}))}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${data.profession === p ? "bg-[#2D8F85]/10 border-[#2D8F85] text-[#F5F7F7]" : "bg-[#121A1C] border-[#1E2D30] text-[#8C9A9E] hover:border-[#2D8F85]/50"}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 bg-[#121A1C] border border-[#1E2D30] text-[#8C9A9E] py-3 rounded-xl text-sm transition-all hover:text-[#F5F7F7]">Back</button>
              <button onClick={() => setStep(3)} disabled={!data.profession} className="flex-1 bg-[#2D8F85] hover:bg-[#39A596] disabled:opacity-40 text-white py-3 rounded-xl text-sm font-medium transition-all">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 3 of 3</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">Monthly income</h1>
            <p className="text-[#8C9A9E] text-sm mb-8">Approximately how much do you earn per month?</p>
            <input
              type="number"
              placeholder="Enter amount"
              value={data.income}
              onChange={e => setData(p => ({...p, income: e.target.value}))}
              className="w-full bg-[#121A1C] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85] mb-8"
            />
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 bg-[#121A1C] border border-[#1E2D30] text-[#8C9A9E] py-3 rounded-xl text-sm transition-all hover:text-[#F5F7F7]">Back</button>
              <button onClick={handleFinish} className="flex-1 bg-[#2D8F85] hover:bg-[#39A596] text-white py-3 rounded-xl text-sm font-medium transition-all">
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
