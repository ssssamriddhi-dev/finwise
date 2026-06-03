'use client'

import { useEffect, useState } from "react"
import { RefreshCw, ExternalLink } from "lucide-react"

const NEWS_SOURCES = [
  {
    name: "Moneycontrol",
    description: "Markets, stocks, mutual funds, personal finance",
    url: "https://moneycontrol.com",
    color: "#2D8F85",
    emoji: "📈"
  },
  {
    name: "Economic Times",
    description: "Business news, economy, markets",
    url: "https://economictimes.indiatimes.com",
    color: "#2D8F85",
    emoji: "📰"
  },
  {
    name: "Mint",
    description: "Personal finance, markets, startups",
    url: "https://livemint.com",
    color: "#2D8F85",
    emoji: "💹"
  },
  {
    name: "NDTV Profit",
    description: "Stock market, business, economy",
    url: "https://ndtvprofit.com",
    color: "#2D8F85",
    emoji: "📊"
  },
  {
    name: "Business Standard",
    description: "Finance, economy, policy news",
    url: "https://business-standard.com",
    color: "#2D8F85",
    emoji: "🏦"
  },
  {
    name: "Zerodha Varsity",
    description: "Learn investing, trading, personal finance",
    url: "https://zerodha.com/varsity",
    color: "#2D8F85",
    emoji: "🎓"
  },
]

const PRICE_LINKS = [
  { name: "Gold Price Today", url: "https://www.goodreturns.in/gold-rates/", emoji: "🥇", desc: "Live 24K gold rates across cities" },
  { name: "Petrol & Diesel", url: "https://www.goodreturns.in/petrol-price.html", emoji: "⛽", desc: "Daily fuel prices across India" },
  { name: "USD/INR Rate", url: "https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=INR", emoji: "💱", desc: "Live currency exchange rates" },
  { name: "Sensex & Nifty", url: "https://www.nseindia.com", emoji: "📉", desc: "NSE live market data" },
  { name: "Fixed Deposit Rates", url: "https://groww.in/fd", emoji: "🏛️", desc: "Best FD rates from top banks" },
  { name: "Mutual Funds", url: "https://groww.in/mutual-funds", emoji: "📦", desc: "Top performing mutual funds" },
]

export default function News() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("finwise_name")
    if (!saved) { window.location.href = "/"; return }
    setTimeout(() => setLoading(false), 600)
  }, [])

  return (
    <main className="min-h-screen bg-[#0B0F10] px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-1">Finwise</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold">Financial News</h1>
            <p className="text-[#8C9A9E] text-sm mt-1">Live data from trusted sources</p>
          </div>
          <button onClick={() => window.location.href = "/dashboard"} className="text-[#8C9A9E] text-xs hover:text-[#F5F7F7] transition-colors">← Dashboard</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={24} className="text-[#2D8F85] animate-spin" />
          </div>
        ) : (
          <>
            {/* Live Price Links */}
            <div className="mb-8">
              <h2 className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-3">Live Market Prices</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRICE_LINKS.map(p => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                    className="bg-[#121A1C] rounded-2xl p-4 border border-[#1E2D30] hover:border-[#2D8F85]/50 transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{p.emoji}</span>
                      <ExternalLink size={12} className="text-[#8C9A9E] group-hover:text-[#2D8F85] transition-colors mt-1" />
                    </div>
                    <p className="text-[#F5F7F7] text-sm font-medium">{p.name}</p>
                    <p className="text-[#8C9A9E] text-xs mt-1">{p.desc}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* News Sources */}
            <div className="mb-8">
              <h2 className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-3">News Sources</h2>
              <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] overflow-hidden">
                <div className="divide-y divide-[#1E2D30]">
                  {NEWS_SOURCES.map(s => (
                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-4 hover:bg-[#171F21] transition-colors group">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{s.emoji}</span>
                        <div>
                          <p className="text-[#F5F7F7] text-sm font-medium">{s.name}</p>
                          <p className="text-[#8C9A9E] text-xs">{s.description}</p>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-[#8C9A9E] group-hover:text-[#2D8F85] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] p-4 text-center">
              <p className="text-[#8C9A9E] text-xs">All links open real, live websites. Finwise does not store or display market data directly.</p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
