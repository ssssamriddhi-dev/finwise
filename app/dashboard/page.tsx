'use client'

import { useEffect, useState } from "react"
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { getExpenses, getIncomes, addExpense, addIncome, deleteExpense, deleteIncome, CATEGORIES, type Expense, type Income } from "@/lib/data"

export default function Dashboard() {
  const [name, setName] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddIncome, setShowAddIncome] = useState(false)

  const [expForm, setExpForm] = useState({ amount: "", category: "Food & Dining", description: "", date: new Date().toISOString().split("T")[0] })
  const [incForm, setIncForm] = useState({ amount: "", source: "", date: new Date().toISOString().split("T")[0] })

  useEffect(() => {
    const saved = localStorage.getItem("finwise_name")
    if (!saved) { window.location.href = "/"; return }
    setName(saved)
    setExpenses(getExpenses())
    setIncomes(getIncomes())
  }, [])

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const savings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0

  const handleAddExpense = () => {
    if (!expForm.amount) return
    const e = addExpense({ amount: parseFloat(expForm.amount), category: expForm.category, description: expForm.description, date: expForm.date })
    setExpenses(prev => [e, ...prev])
    setExpForm({ amount: "", category: "Food & Dining", description: "", date: new Date().toISOString().split("T")[0] })
    setShowAddExpense(false)
  }

  const handleAddIncome = () => {
    if (!incForm.amount || !incForm.source) return
    const i = addIncome({ amount: parseFloat(incForm.amount), source: incForm.source, date: incForm.date })
    setIncomes(prev => [i, ...prev])
    setIncForm({ amount: "", source: "", date: new Date().toISOString().split("T")[0] })
    setShowAddIncome(false)
  }

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const handleDeleteIncome = (id: string) => {
    deleteIncome(id)
    setIncomes(prev => prev.filter(i => i.id !== id))
  }

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN")

  return (
    <main className="min-h-screen bg-[#0B0F10] px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-1">Finwise</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold">Hey, {name} 👋</h1>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.href = "/" }} className="text-[#8C9A9E] text-xs hover:text-[#F5F7F7] transition-colors">Sign out</button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#121A1C] rounded-2xl p-4 border border-[#1E2D30]">
            <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Income</p>
            <p className="text-[#F5F7F7] text-xl font-semibold">{fmt(totalIncome)}</p>
          </div>
          <div className="bg-[#121A1C] rounded-2xl p-4 border border-[#1E2D30]">
            <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Expenses</p>
            <p className="text-[#F5F7F7] text-xl font-semibold">{fmt(totalExpenses)}</p>
          </div>
          <div className="bg-[#121A1C] rounded-2xl p-4 border border-[#1E2D30]">
            <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Savings</p>
            <p className={`text-xl font-semibold ${savings >= 0 ? "text-[#2D8F85]" : "text-red-400"}`}>{fmt(savings)}</p>
          </div>
          <div className="bg-[#121A1C] rounded-2xl p-4 border border-[#1E2D30]">
            <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-2">Savings Rate</p>
            <p className={`text-xl font-semibold ${savingsRate >= 20 ? "text-[#2D8F85]" : "text-yellow-400"}`}>{savingsRate}%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => { setShowAddExpense(true); setShowAddIncome(false) }} className="flex items-center gap-2 bg-[#2D8F85] hover:bg-[#39A596] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Plus size={16} /> Add Expense
          </button>
          <button onClick={() => { setShowAddIncome(true); setShowAddExpense(false) }} className="flex items-center gap-2 bg-[#121A1C] hover:bg-[#1E2D30] text-[#F5F7F7] border border-[#1E2D30] px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Plus size={16} /> Add Income
          </button>
        </div>

        {/* Add Expense Form */}
        {showAddExpense && (
          <div className="bg-[#121A1C] border border-[#1E2D30] rounded-2xl p-5 mb-6">
            <h3 className="text-[#F5F7F7] text-sm font-medium mb-4">New Expense</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input type="number" placeholder="Amount (₹)" value={expForm.amount} onChange={e => setExpForm(p => ({...p, amount: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
              <select value={expForm.category} onChange={e => setExpForm(p => ({...p, category: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Description" value={expForm.description} onChange={e => setExpForm(p => ({...p, description: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
              <input type="date" value={expForm.date} onChange={e => setExpForm(p => ({...p, date: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddExpense} className="bg-[#2D8F85] hover:bg-[#39A596] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">Save</button>
              <button onClick={() => setShowAddExpense(false)} className="text-[#8C9A9E] hover:text-[#F5F7F7] px-4 py-2 rounded-xl text-sm transition-all">Cancel</button>
            </div>
          </div>
        )}

        {/* Add Income Form */}
        {showAddIncome && (
          <div className="bg-[#121A1C] border border-[#1E2D30] rounded-2xl p-5 mb-6">
            <h3 className="text-[#F5F7F7] text-sm font-medium mb-4">New Income</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input type="number" placeholder="Amount (₹)" value={incForm.amount} onChange={e => setIncForm(p => ({...p, amount: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
              <input type="text" placeholder="Source (e.g. Salary)" value={incForm.source} onChange={e => setIncForm(p => ({...p, source: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
              <input type="date" value={incForm.date} onChange={e => setIncForm(p => ({...p, date: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddIncome} className="bg-[#2D8F85] hover:bg-[#39A596] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">Save</button>
              <button onClick={() => setShowAddIncome(false)} className="text-[#8C9A9E] hover:text-[#F5F7F7] px-4 py-2 rounded-xl text-sm transition-all">Cancel</button>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1E2D30]">
            <h2 className="text-[#F5F7F7] text-sm font-medium">Transactions</h2>
          </div>
          {expenses.length === 0 && incomes.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[#8C9A9E] text-sm">No transactions yet.</p>
              <p className="text-[#8C9A9E] text-xs mt-1">Add your first income or expense above.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1E2D30]">
              {[...expenses.map(e => ({...e, type: "expense" as const})), ...incomes.map(i => ({...i, type: "income" as const, category: i.source, description: i.source}))]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(t => (
                  <div key={t.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-[#171F21] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === "expense" ? "bg-red-500/10" : "bg-[#2D8F85]/10"}`}>
                        {t.type === "expense" ? <TrendingDown size={14} className="text-red-400" /> : <TrendingUp size={14} className="text-[#2D8F85]" />}
                      </div>
                      <div>
                        <p className="text-[#F5F7F7] text-sm">{t.description}</p>
                        <p className="text-[#8C9A9E] text-xs">{t.category} · {t.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`text-sm font-medium ${t.type === "expense" ? "text-red-400" : "text-[#2D8F85]"}`}>
                        {t.type === "expense" ? "-" : "+"}{fmt(t.amount)}
                      </p>
                      <button onClick={() => t.type === "expense" ? handleDeleteExpense(t.id) : handleDeleteIncome(t.id)} className="text-[#8C9A9E] hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
