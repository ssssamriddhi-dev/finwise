'use client'

import { useState } from "react"

const CURRENCIES = ["\u20b9 INR", "$ USD", "\u20ac EUR", "\u00a3 GBP", "AED"]
const PROFESSIONS = ["Student", "Corporate Employee", "Business Owner", "Freelancer", "Homemaker", "Retired", "Other"]
const DEPOSIT_DATES = ["1st", "5th", "10th", "15th", "20th", "25th", "Last day"]

const TEMPLATES = {
  "Student": [{ category: "Food & Dining", percent: 30 },{ category: "Transport", percent: 15 },{ category: "Education", percent: 20 },{ category: "Entertainment", percent: 15 },{ category: "Shopping", percent: 10 },{ category: "Savings", percent: 10 }],
  "Corporate Employee": [{ category: "Rent & Housing", percent: 30 },{ category: "Food & Dining", percent: 15 },{ category: "Transport", percent: 10 },{ category: "Investments", percent: 15 },{ category: "Savings", percent: 15 },{ category: "Entertainment", percent: 10 },{ category: "Miscellaneous", percent: 5 }],
  "Business Owner": [{ category: "Rent & Housing", percent: 20 },{ category: "Food & Dining", percent: 10 },{ category: "Transport", percent: 10 },{ category: "Investments", percent: 20 },{ category: "Savings", percent: 20 },{ category: "Miscellaneous", percent: 20 }],
  "Freelancer": [{ category: "Rent & Housing", percent: 25 },{ category: "Food & Dining", percent: 15 },{ category: "Transport", percent: 10 },{ category: "Savings", percent: 20 },{ category: "Investments", percent: 15 },{ category: "Miscellaneous", percent: 15 }],
  "Homemaker": [{ category: "Food & Dining", percent: 35 },{ category: "Shopping", percent: 20 },{ category: "Health", percent: 15 },{ category: "Education", percent: 15 },{ category: "Savings", percent: 15 }],
  "Retired": [{ category: "Health", percent: 30 },{ category: "Food & Dining", percent: 25 },{ category: "Entertainment", percent: 15 },{ category: "Transport", percent: 10 },{ category: "Savings", percent: 20 }],
  "Other": [{ category: "Food & Dining", percent: 25 },{ category: "Transport", percent: 15 },{ category: "Shopping", percent: 15 },{ category: "Savings", percent: 20 },{ category: "Miscellaneous", percent: 25 }],
}

function OldMan() {
  return (
    <div style={{ position: 'fixed', bottom: 12, left: 12, zIndex: 10, pointerEvents: 'none' }}>
      <div style={{ background: 'rgba(245,247,247,0.96)', borderRadius: 12, padding: '9px 13px', maxWidth: 158, boxShadow: '0 4px 20px rgba(0,0,0,0.3)', marginBottom: 5 }}>
        <p style={{ color: '#1A2426', fontSize: 10, fontStyle: 'italic', lineHeight: 1.55, margin: 0 }}>"Save first, spend what's left. Always."</p>
      </div>
      <div style={{ display: 'flex', gap: 3, paddingLeft: 22, marginBottom: 3 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(245,247,247,0.9)' }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(245,247,247,0.7)', marginTop: 1 }} />
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(245,247,247,0.55)', marginTop: 2 }} />
      </div>
      <svg width="64" height="70" viewBox="0 0 64 70" fill="none">
        <rect x="6" y="52" width="52" height="7" rx="3.5" fill="#1E2D30"/>
        <rect x="10" y="59" width="4" height="10" rx="2" fill="#162023"/>
        <rect x="50" y="59" width="4" height="10" rx="2" fill="#162023"/>
        <rect x="17" y="31" width="30" height="23" rx="10" fill="#2D3A4A"/>
        <circle cx="32" cy="20" r="13" fill="#F0B98A"/>
        <path d="M19 16 Q20 7 32 7 Q44 7 45 16 Q40 12 32 11 Q24 12 19 16Z" fill="white" opacity="0.92"/>
        <circle cx="26" cy="19" r="1.4" fill="#2D3748"/>
        <circle cx="38" cy="19" r="1.4" fill="#2D3748"/>
        <circle cx="26" cy="19" r="4.5" stroke="#8B7230" strokeWidth="1.2" fill="none"/>
        <circle cx="38" cy="19" r="4.5" stroke="#8B7230" strokeWidth="1.2" fill="none"/>
        <line x1="30.5" y1="19" x2="33.5" y2="19" stroke="#8B7230" strokeWidth="1.3"/>
        <line x1="17" y1="19" x2="21.5" y2="19" stroke="#8B7230" strokeWidth="1.2"/>
        <line x1="42.5" y1="19" x2="47" y2="19" stroke="#8B7230" strokeWidth="1.2"/>
        <path d="M27 26 Q32 30 37 26" stroke="#C8956A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M20 29 Q21 38 32 41 Q43 38 44 29 Q39 34 32 35 Q25 34 20 29Z" fill="white" opacity="0.87"/>
        <path d="M17 40 Q9 44 11 51" stroke="#2D3A4A" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M47 40 Q55 43 54 49" stroke="#2D3A4A" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <rect x="53" y="34" width="3" height="35" rx="1.5" fill="#9B7E45"/>
        <circle cx="54.5" cy="34" r="3.5" fill="#7A6035"/>
      </svg>
    </div>
  )
}


export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({ currency: "\u20b9 INR", profession: "", depositDate: "1st", income: "" })
  const [templateAccepted, setTemplateAccepted] = useState(false)
  const handleFinish = () => {
    localStorage.setItem("finwise_profile", JSON.stringify({ ...data, template: TEMPLATES[data.profession]||TEMPLATES["Other"], templateAccepted }))
    if (templateAccepted && data.income) {
      const income = parseFloat(data.income)
      localStorage.setItem("finwise_budgets", JSON.stringify((TEMPLATES[data.profession]||TEMPLATES["Other"]).map(t => ({ category: t.category, limit: Math.round((t.percent/100)*income) }))))
    }
    window.location.href = "/dashboard"
  }
  return (
    <main className="min-h-screen bg-[#0B0F10] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}><div style={{ position: 'absolute', top: '6%', left: '4%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #0c3330 0%, #37ADA2 100%)', transform: 'rotate(-12deg)', opacity: 0.22 }} /><div style={{ position: 'absolute', top: '10%', right: '5%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #2a1e04 0%, #DEB84A 100%)', transform: 'rotate(14deg)', opacity: 0.20 }} /><div style={{ position: 'absolute', top: '38%', left: '2%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #0a0d14 0%, #1d2840 100%)', transform: 'rotate(-18deg)', opacity: 0.22 }} /><div style={{ position: 'absolute', top: '40%', right: '3%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #0c3330 0%, #2D8F85 100%)', transform: 'rotate(16deg)', opacity: 0.20 }} /><div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #2a1e04 0%, #C49A25 100%)', transform: 'rotate(-10deg)', opacity: 0.20 }} /><div style={{ position: 'absolute', bottom: '8%', right: '4%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #0a0d14 0%, #1d2840 100%)', transform: 'rotate(12deg)', opacity: 0.22 }} /></div>
      <OldMan />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '6%', left: '4%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #0c3330 0%, #37ADA2 100%)', transform: 'rotate(-12deg)', opacity: 0.22 }} />
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #2a1e04 0%, #DEB84A 100%)', transform: 'rotate(14deg)', opacity: 0.20 }} />
        <div style={{ position: 'absolute', top: '38%', left: '2%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #0a0d14 0%, #1d2840 100%)', transform: 'rotate(-18deg)', opacity: 0.22 }} />
        <div style={{ position: 'absolute', top: '40%', right: '3%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #0c3330 0%, #2D8F85 100%)', transform: 'rotate(16deg)', opacity: 0.20 }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #2a1e04 0%, #C49A25 100%)', transform: 'rotate(-10deg)', opacity: 0.20 }} />
        <div style={{ position: 'absolute', bottom: '8%', right: '4%', width: 170, height: 102, borderRadius: 14, background: 'linear-gradient(135deg, #0a0d14 0%, #1d2840 100%)', transform: 'rotate(12deg)', opacity: 0.22 }} />
      </div>
      <OldMan />
      <div className="w-full max-w-sm relative" style={{ zIndex: 1 }}>
        <div className="flex gap-2 mb-10">{[1,2,3,4].map(i => (<div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-[#2D8F85]" : "bg-[#1E2D30]"}`} />))}</div>
        {step === 1 && (<div>
          <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 1 of 4</p>
          <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">Your currency</h1>
          <p className="text-[#8C9A9E] text-sm mb-8">Which currency do you use daily?</p>
          <div className="space-y-2 mb-8">{CURRENCIES.map(c => (<button key={c} onClick={() => setData(p => ({...p, currency: c}))} className={`w-full text-left px-4 py-3 rounded-xl text-sm border ${data.currency === c ? "bg-[#2D8F85]/10 border-[#2D8F85] text-[#F5F7F7]" : "bg-[#121A1C] border-[#1E2D30] text-[#8C9A9E]"}`}>{c}</button>))}</div>
          <button onClick={() => setStep(2)} className="w-full bg-[#2D8F85] text-white py-3 rounded-xl text-sm font-medium">Continue</button>
        </div>)}
        {step === 2 && (<div>
          <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 2 of 4</p>
          <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">What do you do?</h1>
          <p className="text-[#8C9A9E] text-sm mb-6">We will suggest a budget template.</p>
          <div className="space-y-2 mb-6">{PROFESSIONS.map(p => (<button key={p} onClick={() => setData(prev => ({...prev, profession: p}))} className={`w-full text-left px-4 py-3 rounded-xl text-sm border ${data.profession === p ? "bg-[#2D8F85]/10 border-[#2D8F85] text-[#F5F7F7]" : "bg-[#121A1C] border-[#1E2D30] text-[#8C9A9E]"}`}>{p}</button>))}</div>
          {data.profession && (<div className="bg-[#121A1C] border border-[#1E2D30] rounded-2xl p-4 mb-6">
            <p className="text-[#F5F7F7] text-xs font-medium mb-3">Suggested for {data.profession}</p>
            {TEMPLATES[data.profession].map(t => (<div key={t.category} className="flex justify-between py-1.5"><p className="text-[#8C9A9E] text-xs">{t.category}</p><p className="text-[#2D8F85] text-xs">{t.percent}%</p></div>))}
            <button onClick={() => setTemplateAccepted(true)} className={`w-full mt-3 py-2 rounded-xl text-xs font-medium border ${templateAccepted ? "bg-[#2D8F85] text-white border-[#2D8F85]" : "border-[#2D8F85] text-[#2D8F85]"}`}>{templateAccepted ? "\u2713 Accepted" : "Use this template"}</button>
          </div>)}
          <div className="flex gap-2"><button onClick={() => setStep(1)} className="flex-1 bg-[#121A1C] border border-[#1E2D30] text-[#8C9A9E] py-3 rounded-xl text-sm">Back</button><button onClick={() => setStep(3)} disabled={!data.profession} className="flex-1 bg-[#2D8F85] disabled:opacity-40 text-white py-3 rounded-xl text-sm font-medium">Continue</button></div>
        </div>)}
        {step === 3 && (<div>
          <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 3 of 4</p>
          <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">Salary date</h1>
          <p className="text-[#8C9A9E] text-sm mb-8">When does your salary get deposited?</p>
          <div className="grid grid-cols-2 gap-2 mb-8">{DEPOSIT_DATES.map(d => (<button key={d} onClick={() => setData(p => ({...p, depositDate: d}))} className={`px-4 py-3 rounded-xl text-sm border ${data.depositDate === d ? "bg-[#2D8F85]/10 border-[#2D8F85] text-[#F5F7F7]" : "bg-[#121A1C] border-[#1E2D30] text-[#8C9A9E]"}`}>{d}</button>))}</div>
          <div className="flex gap-2"><button onClick={() => setStep(2)} className="flex-1 bg-[#121A1C] border border-[#1E2D30] text-[#8C9A9E] py-3 rounded-xl text-sm">Back</button><button onClick={() => setStep(4)} className="flex-1 bg-[#2D8F85] text-white py-3 rounded-xl text-sm font-medium">Continue</button></div>
        </div>)}
        {step === 4 && (<div>
          <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-3">Step 4 of 4</p>
          <h1 className="text-[#F5F7F7] text-2xl font-semibold mb-2">Monthly income</h1>
          <p className="text-[#8C9A9E] text-sm mb-8">How much do you earn per month?</p>
          <input type="number" placeholder="Enter amount" value={data.income} onChange={e => setData(p => ({...p, income: e.target.value}))} className="w-full bg-[#121A1C] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85] mb-4" />
          {templateAccepted && data.income && (<div className="bg-[#121A1C] border border-[#1E2D30] rounded-2xl p-4 mb-6">
            <p className="text-[#F5F7F7] text-xs font-medium mb-3">Your budget will be set as:</p>
            {TEMPLATES[data.profession].map(t => (<div key={t.category} className="flex justify-between py-1"><p className="text-[#8C9A9E] text-xs">{t.category}</p><p className="text-[#2D8F85] text-xs">\u20b9{Math.round((t.percent/100)*parseFloat(data.income||"0")).toLocaleString("en-IN")}</p></div>))}
          </div>)}
          <div className="flex gap-2"><button onClick={() => setStep(3)} className="flex-1 bg-[#121A1C] border border-[#1E2D30] text-[#8C9A9E] py-3 rounded-xl text-sm">Back</button><button onClick={handleFinish} disabled={!data.income} className="flex-1 bg-[#2D8F85] disabled:opacity-40 text-white py-3 rounded-xl text-sm font-medium">Go to Dashboard</button></div>
        </div>)}
      </div>
    </main>
  )
}
