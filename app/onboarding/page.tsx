'use client'

import { useState } from "react"

const CURRENCIES = ["₹ INR", "$ USD", "€ EUR", "£ GBP", "AED"]
const PROFESSIONS = ["Student", "Corporate Employee", "Business Owner", "Freelancer", "Homemaker", "Retired", "Other"]
const DEPOSIT_DATES = ["1st", "5th", "10th", "15th", "20th", "25th", "Last day"]

const TEMPLATES: Record<string, {category: string, percent: number}[]> = {
  "Student": [
    { category: "Food & Dining", percent: 30 },
    { category: "Transport", percent: 15 },
    { category: "Education", percent: 20 },
    { category: "Entertainment", percent: 15 },
    { category: "Shopping", percent: 10 },
    { category: "Savings", percent: 10 },
  ],
  "Corporate Employee": [
    { category: "Rent & Housing", percent: 30 },
    { category: "Food & Dining", percent: 15 },
    { category: "Transport", percent: 10 },
    { category: "Investments", percent: 15 },
    { category: "Savings", percent: 15 },
    { category: "Entertainment", percent: 10 },
    { category: "Miscellaneous", percent: 5 },
  ],
  "Business Owner": [
    { category: "Rent & Housing", percent: 20 },
    { category: "Food & Dining", percent: 10 },
    { category: "Transport", percent: 10 },
    { category: "Investments", percent: 20 },
    { category: "Savings", percent: 20 },
    { category: "Miscellaneous", percent: 20 },
  ],
  "Freelancer": [
    { category: "Rent & Housing", percent: 25 },
    { category: "Food & Dining", percent: 15 },
    { category: "Transport", percent: 10 },
    { category: "Savings", percent: 20 },
    { category: "Investments", percent: 15 },
    { category: "Miscellaneous", percent: 15 },
  ],
  "Homemaker": [
    { category: "Food & Dining", percent: 35 },
    { category: "Shopping", percent: 20 },
    { category: "Health", percent: 15 },
    { category: "Education", percent: 15 },
    { category: "Savings", percent: 15 },
  ],
  "Retired": [
    { category: "Health", percent: 30 },
    { category: "Food & Dining", percent: 25 },
    { category: "Entertainment", percent: 15 },
    { category: "Transport", percent: 10 },
    { category: "Savings", percent: 20 },
  ],
  "Other": [
    { category: "Food & Dining", percent: 25 },
    { category: "Transport", percent: 15 },
    { category: "Shopping", percent: 15 },
    { category: "Savings", percent: 20 },
    { category: "Miscellaneous", percent: 25 },
  ],
}

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    currency: "₹ INR",
    profession: "",
    depositDate: "1st",
    income: "",
  })
  const [templateAccepted, setTemplateAccepted] = useState(false)

  const handleFinish = () => {
    const profile = {
      ...data,
      template: TEMPLATES[data.profession] || TEMPLATES["Other"],
      templateAccepted,
    }
    localStorage.setItem("finwise_profile", JSON.stringify(profile))

    if (templateAccepted && data.income) {
      const income = parseFloat(data.income)
      const template = TEMPLATES[data.profession] || TEMPLATES["Other"]
      const budgets = template.map(t => ({
        category: t.category,
        limit: Math.round((t.percent / 100) * income)
      }))
      localStorage.setItem("finwise_budgets", JSON.stringify(budgets))
    }

    window.location.href = "/dashboard"
  }

  const template = TEMPLATES[data.profession] || []

  return (
    <main className="min-h-screen bg-[#0B0F10] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        <div className="flex gap-2 mb-10">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-[#2D8F85]" : "bg-[#1E2D30]"}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 1 of 4</p>
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
            <button onClick={() => setStep(2)} className="w-full bg-[#2D8F85] hover:bg-[#39A596] text-white py-3 rounded-xl text-sm font-medium transition-all">Continue</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 2 of 4</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">What do you do?</h1>
            <p className="text-[#8C9A9E] text-sm mb-6">We will suggest a budget template for you.</p>
            <div className="space-y-2 mb-6">
              {PROFESSIONS.map(p => (
                <button key={p} onClick={() => setData(prev => ({...prev, profession: p}))}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${data.profession === p ? "bg-[#2D8F85]/10 border-[#2D8F85] text-[#F5F7F7]" : "bg-[#121A1C] border-[#1E2D30] text-[#8C9A9E] hover:border-[#2D8F85]/50"}`}>
                  {p}
                </button>
              ))}
            </div>

            {data.profession && (
              <div className="bg-[#121A1C] border border-[#1E2D30] rounded-2xl p-4 mb-6">
                <p className="text-[#F5F7F7] text-xs font-medium mb-3">Suggested budget for {data.profession}</p>
                {TEMPLATES[data.profession].map(t => (
                  <div key={t.category} className="flex justify-between items-center py-1.5">
                    <p className="text-[#8C9A9E] text-xs">{t.category}</p>
                    <p className="text-[#2D8F85] text-xs font-medium">{t.percent}%</p>
                  </div>
                ))}
                <button onClick={() => setTemplateAccepted(true)}
                  className={`w-full mt-3 py-2 rounded-xl text-xs font-medium transition-all border ${templateAccepted ? "bg-[#2D8F85] text-white border-[#2D8F85]" : "border-[#2D8F85] text-[#2D8F85] hover:bg-[#2D8F85]/10"}`}>
                  {templateAccepted ? "✓ Template accepted" : "Use this template"}
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 bg-[#121A1C] border border-[#1E2D30] text-[#8C9A9E] py-3 rounded-xl text-sm transition-all">Back</button>
              <button onClick={() => setStep(3)} disabled={!data.profession} className="flex-1 bg-[#2D8F85] hover:bg-[#39A596] disabled:opacity-40 text-white py-3 rounded-xl text-sm font-medium transition-all">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 3 of 4</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">Salary date</h1>
            <p className="text-[#8C9A9E] text-sm mb-8">When does your salary or pocket money get deposited each month?</p>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {DEPOSIT_DATES.map(d => (
                <button key={d} onClick={() => setData(p => ({...p, depositDate: d}))}
                  className={`px-4 py-3 rounded-xl text-sm transition-all border ${data.depositDate === d ? "bg-[#2D8F85]/10 border-[#2D8F85] text-[#F5F7F7]" : "bg-[#121A1C] border-[#1E2D30] text-[#8C9A9E] hover:border-[#2D8F85]/50"}`}>
                  {d}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 bg-[#121A1C] border border-[#1E2D30] text-[#8C9A9E] py-3 rounded-xl text-sm transition-all">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-[#2D8F85] hover:bg-[#39A596] text-white py-3 rounded-xl text-sm font-medium transition-all">Continue</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 4 of 4</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">Monthly income</h1>
            <p className="text-[#8C9A9E] text-sm mb-2">How much do you earn or receive per month?</p>
            <p className="text-[#8C9A9E] text-xs mb-8">You can update this every month from the dashboard.</p>
            <input
              type="number"
              placeholder="Enter amount"
              value={data.income}
              onChange={e => setData(p => ({...p, income: e.target.value}))}
              className="w-full bg-[#121A1C] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85] mb-4"
            />
            {templateAccepted && data.income && (
              <div className="bg-[#121A1C] border border-[#1E2D30] rounded-2xl p-4 mb-6">
                <p className="text-[#F5F7F7] text-xs font-medium mb-3">Your budget will be set as:</p>
                {TEMPLATES[data.profession].map(t => (
                  <div key={t.category} className="flex justify-between items-center py-1">
                    <p className="text-[#8C9A9E] text-xs">{t.category}</p>
                    <p className="text-[#2D8F85] text-xs font-medium">₹{Math.round((t.percent/100) * parseFloat(data.income || "0")).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setStep(3)} className="flex-1 bg-[#121A1C] border border-[#1E2D30] text-[#8C9A9E] py-3 rounded-xl text-sm transition-all">Back</button>
              <button onClick={handleFinish} disabled={!data.income} className="flex-1 bg-[#2D8F85] hover:bg-[#39A596] disabled:opacity-40 text-white py-3 rounded-xl text-sm font-medium transition-all">Go to Dashboard</button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
