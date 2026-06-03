'use client'

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react"
import { getExpenses, getIncomes } from "@/lib/data"

export default function Report() {
  const [name, setName] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("finwise_name")
    if (!saved) { window.location.href = "/"; return }
    setName(saved)
    setMounted(true)
  }, [])

  if (!mounted) return null

  const expenses = getExpenses()
  const incomes = getIncomes()

  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth()-1, 1)
  const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth()+1).padStart(2,"0")}`

  const thisMonthExp = expenses.filter(e => e.date.startsWith(thisMonth))
  const lastMonthExp = expenses.filter(e => e.date.startsWith(lastMonth))
  const thisMonthInc = incomes.filter(i => i.date.startsWith(thisMonth))
  const lastMonthInc = incomes.filter(i => i.date.startsWith(lastMonth))

  const totalIncome = thisMonthInc.reduce((s,i) => s+i.amount, 0)
  const totalExpenses = thisMonthExp.reduce((s,e) => s+e.amount, 0)
  const savings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? Math.round((savings/totalIncome)*100) : 0

  const lastIncome = lastMonthInc.reduce((s,i) => s+i.amount, 0)
  const lastExpenses = lastMonthExp.reduce((s,e) => s+e.amount, 0)
  const lastSavings = lastIncome - lastExpenses

  const expChange = lastExpenses > 0 ? Math.round(((totalExpenses - lastExpenses)/lastExpenses)*100) : 0
  const savChange = lastSavings > 0 ? Math.round(((savings - lastSavings)/lastSavings)*100) : 0

  const categories: Record<string,number> = {}
  thisMonthExp.forEach(e => { categories[e.category] = (categories[e.category]||0) + e.amount })
  const sortedCats = Object.entries(categories).sort((a,b) => b[1]-a[1])
  const topCategory = sortedCats[0]
  const lowestCategory = sortedCats[sortedCats.length-1]

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN")
  const monthName = now.toLocaleString("en-IN", {month: "long", year: "numeric"})

  return (
    <main className="min-h-screen bg-[#0B0F10] px-4 py-8">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-1">Finwise</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold">Monthly Report</h1>
            <p className="text-[#8C9A9E] text-sm">{monthName}</p>
          </div>
          <button onClick={() => window.location.href = "/dashboard"} className="flex items-center gap-1 text-[#8C9A9E] text-xs hover:text-[#F5F7F7] transition-colors">
            <ArrowLeft size={14} /> Dashboard
          </button>
        </div>

        {totalIncome === 0 && totalExpenses === 0 ? (
          <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] px-5 py-16 text-center">
            <p className="text-[#F5F7F7] text-sm font-medium mb-2">No data for this month yet</p>
            <p className="text-[#8C9A9E] text-sm">Add income and expenses to see your monthly report.</p>
            <button onClick={() => window.location.href = "/dashboard"} className="mt-6 bg-[#2D8F85] hover:bg-[#39A596] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all">Go to Dashboard</button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#121A1C] rounded-2xl p-5 border border-[#1E2D30]">
                <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Income</p>
                <p className="text-[#F5F7F7] text-2xl font-semibold">{fmt(totalIncome)}</p>
              </div>
              <div className="bg-[#121A1C] rounded-2xl p-5 border border-[#1E2D30]">
                <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Expenses</p>
                <p className="text-[#F5F7F7] text-2xl font-semibold">{fmt(totalExpenses)}</p>
                {lastExpenses > 0 && (
                  <div className={`flex items-center gap-1 mt-1 ${expChange > 0 ? "text-red-400" : "text-[#2D8F85]"}`}>
                    {expChange > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <p className="text-xs">{Math.abs(expChange)}% vs last month</p>
                  </div>
                )}
              </div>
              <div className="bg-[#121A1C] rounded-2xl p-5 border border-[#1E2D30]">
                <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Saved</p>
                <p className={`text-2xl font-semibold ${savings >= 0 ? "text-[#2D8F85]" : "text-red-400"}`}>{fmt(savings)}</p>
                {lastSavings > 0 && (
                  <div className={`flex items-center gap-1 mt-1 ${savChange >= 0 ? "text-[#2D8F85]" : "text-red-400"}`}>
                    {savChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <p className="text-xs">{Math.abs(savChange)}% vs last month</p>
                  </div>
                )}
              </div>
              <div className="bg-[#121A1C] rounded-2xl p-5 border border-[#1E2D30]">
                <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Savings Rate</p>
                <p className={`text-2xl font-semibold ${savingsRate >= 20 ? "text-[#2D8F85]" : "text-yellow-400"}`}>{savingsRate}%</p>
                <p className="text-[#8C9A9E] text-xs mt-1">{savingsRate >= 20 ? "Great job!" : "Try to save more"}</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] p-5 mb-4">
              <h3 className="text-[#F5F7F7] text-sm font-medium mb-4">Highlights</h3>
              <div className="space-y-3">
                {topCategory && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#8C9A9E] text-xs">Highest spending category</p>
                      <p className="text-[#F5F7F7] text-sm font-medium">{topCategory[0]}</p>
                    </div>
                    <p className="text-red-400 text-sm font-medium">{fmt(topCategory[1])}</p>
                  </div>
                )}
                {lowestCategory && lowestCategory[0] !== topCategory?.[0] && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#8C9A9E] text-xs">Lowest spending category</p>
                      <p className="text-[#F5F7F7] text-sm font-medium">{lowestCategory[0]}</p>
                    </div>
                    <p className="text-[#2D8F85] text-sm font-medium">{fmt(lowestCategory[1])}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8C9A9E] text-xs">Total transactions</p>
                    <p className="text-[#F5F7F7] text-sm font-medium">{thisMonthExp.length + thisMonthInc.length} this month</p>
                  </div>
                  <p className="text-[#8C9A9E] text-sm">{thisMonthExp.length} expenses, {thisMonthInc.length} income</p>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            {sortedCats.length > 0 && (
              <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] p-5 mb-4">
                <h3 className="text-[#F5F7F7] text-sm font-medium mb-4">Spending by Category</h3>
                <div className="space-y-3">
                  {sortedCats.map(([cat, amount]) => (
                    <div key={cat}>
                      <div className="flex justify-between mb-1">
                        <p className="text-[#8C9A9E] text-xs">{cat}</p>
                        <p className="text-[#F5F7F7] text-xs font-medium">{fmt(amount)}</p>
                      </div>
                      <div className="w-full bg-[#1E2D30] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#2D8F85]" style={{width: `${(amount/totalExpenses)*100}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verdict */}
            <div className={`rounded-2xl p-5 border ${savings > 0 ? "bg-[#2D8F85]/10 border-[#2D8F85]/30" : "bg-red-500/10 border-red-500/30"}`}>
              <p className={`text-sm font-medium mb-1 ${savings > 0 ? "text-[#2D8F85]" : "text-red-400"}`}>
                {savings > 0 ? "✅ Great month!" : "⚠️ Overspent this month"}
              </p>
              <p className="text-[#8C9A9E] text-xs">
                {savings > 0
                  ? `You saved ${fmt(savings)} this month with a ${savingsRate}% savings rate. ${savingsRate >= 30 ? "Excellent financial discipline!" : "Keep it up!"}`
                  : `You spent ${fmt(Math.abs(savings))} more than you earned. Try reducing ${topCategory?.[0]} expenses next month.`
                }
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
