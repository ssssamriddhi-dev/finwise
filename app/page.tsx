'use client'

import { useState, useEffect } from "react"
import { loadDemoData } from "@/lib/data"

const quotes = [
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
  { text: "Beware of little expenses; a small leak will sink a great ship.", author: "Benjamin Franklin" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

function Chip() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <rect x="0.5" y="0.5" width="31" height="23" rx="3.5" fill="#C9A227" stroke="#A88420"/>
      <rect x="10" y="0.5" width="12" height="23" fill="#B8921E"/>
      <rect x="0.5" y="7" width="31" height="10" fill="#B8921E"/>
      <rect x="10" y="7" width="12" height="10" fill="#A07818"/>
    </svg>
  )
}

function MastercardLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EB001B' }} />
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F79E1B', marginLeft: -9 }} />
    </div>
  )
}

export default function Home() {
  const [name, setName] = useState("")
  const [animating, setAnimating] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [quoteVisible, setQuoteVisible] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteVisible(false)
      setTimeout(() => {
        setQuoteIndex(i => (i + 1) % quotes.length)
        setQuoteVisible(true)
      }, 400)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const savedName = typeof window !== "undefined" ? localStorage.getItem("finwise_name") : null

  if (savedName && !submitted) {
    return (
      <main className="min-h-screen bg-[#0B0F10] flex items-center justify-center px-4">
      {rocket !== "idle" && (
        <div style={{ position: 'fixed', top: '42%', left: 0, zIndex: 100, pointerEvents: 'none', width: 180, height: 108, borderRadius: 14, background: 'linear-gradient(135deg, #0c3330 0%, #2D8F85 70%, #37ADA2 100%)', boxShadow: '0 0 40px rgba(45,143,133,0.8)', transform: rocket === "ready" ? 'translateX(-220px) translateY(-50%) rotate(-10deg)' : 'translateX(calc(100vw + 220px)) translateY(-50%) rotate(-5deg)', transition: rocket === "shooting" ? 'transform 0.28s cubic-bezier(0.55, 0, 1, 0.45)' : 'none', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '100%', top: '50%', width: 100, height: 2, background: 'linear-gradient(to left, rgba(55,173,162,0.7), transparent)' }} />
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>FINWISE</span>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 800, fontStyle: 'italic' }}>VISA</span>
        </div>
      )}
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
    setAnimating(true)
    setTimeout(() => {
      localStorage.setItem("finwise_name", name.trim())
      window.location.href = "/onboarding"
    }, 750)
  }

  const handleDemo = () => {
    loadDemoData()
    window.location.href = "/dashboard"
  }

  return (
    <main className="min-h-screen bg-[#0B0F10] flex flex-col items-center justify-center px-4 overflow-hidden relative">
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,143,133,0.07) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ opacity: quoteVisible ? 1 : 0, transform: quoteVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.4s ease, transform 0.4s ease', textAlign: 'center', marginBottom: 32, maxWidth: 300, position: 'relative', zIndex: 1 }}>
        <p style={{ color: '#8C9A9E', fontSize: 11, fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>"{quotes[quoteIndex].text}"</p>
        <p style={{ color: '#2D8F85', fontSize: 11, marginTop: 6, fontWeight: 500 }}>— {quotes[quoteIndex].author}</p>
      </div>
      <div style={{ position: 'relative', width: 280, height: 168, marginBottom: 40, zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'linear-gradient(135deg, #2a1e04 0%, #6B4F12 35%, #C49A25 75%, #DEB84A 100%)', transform: animating ? 'translate(130%, 90%) rotate(40deg) scale(0.75)' : 'translate(20px, 16px) rotate(7deg)', transition: 'transform 0.55s cubic-bezier(0.7, 0, 1, 0.45), opacity 0.55s ease', opacity: animating ? 0 : 1, zIndex: 1, boxShadow: '0 16px 48px rgba(0,0,0,0.5)', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,220,120,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,220,130,0.85)', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>FINWISE</span>
            <span style={{ color: 'rgba(255,200,80,0.6)', fontSize: 9, letterSpacing: 2 }}>SAVINGS</span>
          </div>
          <div>
            <p style={{ color: 'rgba(255,210,100,0.45)', fontSize: 12, letterSpacing: 3, marginBottom: 8, fontFamily: 'monospace' }}>6011 •••• •••• 5634</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,210,100,0.6)', fontSize: 10, letterSpacing: 1 }}>GOLD MEMBER</span>
              <span style={{ color: 'rgba(255,210,100,0.8)', fontSize: 11, fontWeight: 700 }}>RuPay</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'linear-gradient(135deg, #0a0d14 0%, #131929 50%, #1d2840 100%)', border: '1px solid rgba(255,255,255,0.05)', transform: animating ? 'translate(-120%, -100%) rotate(-28deg) scale(0.75)' : 'translate(10px, 8px) rotate(-4deg)', transition: 'transform 0.5s cubic-bezier(0.7, 0, 1, 0.45) 0.07s, opacity 0.5s ease 0.07s', opacity: animating ? 0 : 1, zIndex: 2, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -25, left: -25, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(180,185,255,0.75)', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>FINWISE</span>
            <span style={{ color: 'rgba(180,185,255,0.4)', fontSize: 9, letterSpacing: 2 }}>CREDIT</span>
          </div>
          <div>
            <p style={{ color: 'rgba(180,185,255,0.3)', fontSize: 12, letterSpacing: 3, marginBottom: 8, fontFamily: 'monospace' }}>5423 •••• •••• 9021</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(180,185,255,0.5)', fontSize: 10, letterSpacing: 1 }}>ELITE</span>
              <MastercardLogo />
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'linear-gradient(135deg, #0c3330 0%, #18574f 30%, #2D8F85 70%, #37ADA2 100%)', transform: animating ? 'translate(0px, -140%) rotate(6deg) scale(0.85)' : 'translate(0, 0) rotate(0deg)', transition: 'transform 0.45s cubic-bezier(0.7, 0, 1, 0.45) 0.14s, opacity 0.45s ease 0.14s', opacity: animating ? 0 : 1, zIndex: 3, boxShadow: '0 20px 56px rgba(45,143,133,0.28)', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: 50, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>FINWISE</span>
            <Chip />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, letterSpacing: 3, marginBottom: 10, fontFamily: 'monospace' }}>4821 •••• •••• 3847</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 2px' }}>Card Holder</p>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, margin: 0 }}>{name.trim().toUpperCase() || 'YOUR NAME'}</p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 800, fontStyle: 'italic' }}>VISA</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: 300, position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 22, textAlign: 'center' }}>
          <p style={{ color: '#2D8F85', fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', margin: '0 0 8px' }}>Finwise</p>
          <h1 style={{ color: '#F5F7F7', fontSize: 24, fontWeight: 600, lineHeight: 1.3, margin: '0 0 6px' }}>Your personal<br />finance dashboard</h1>
          <p style={{ color: '#8C9A9E', fontSize: 12, margin: 0 }}>Track expenses, set budgets, reach your goals.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} style={{ width: '100%', boxSizing: 'border-box', background: '#121A1C', border: '1px solid #1E2D30', color: '#F5F7F7', padding: '12px 16px', borderRadius: 12, fontSize: 14, outline: 'none' }} onFocus={(e) => (e.target.style.borderColor = '#2D8F85')} onBlur={(e) => (e.target.style.borderColor = '#1E2D30')} />
          <button onClick={handleSubmit} disabled={name.trim().length < 2} style={{ width: '100%', background: name.trim().length < 2 ? '#1A2426' : '#2D8F85', color: name.trim().length < 2 ? '#4A5A5E' : 'white', padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: name.trim().length < 2 ? 'not-allowed' : 'pointer', border: 'none', transition: 'background 0.2s' }}>Get Started →</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#1E2D30' }} />
            <span style={{ color: '#8C9A9E', fontSize: 11 }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#1E2D30' }} />
          </div>
          <button onClick={handleDemo} style={{ width: '100%', background: '#121A1C', border: '1px solid #1E2D30', color: '#8C9A9E', padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>✨ Try Demo</button>
          <p style={{ color: '#8C9A9E', fontSize: 11, textAlign: 'center', margin: 0 }}>See the app with sample data — no setup needed</p>
        </div>
      </div>
    </main>
  )
}
