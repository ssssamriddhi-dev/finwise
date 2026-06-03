'use client'

import { useEffect, useState } from "react"
import { Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts"
import { getExpenses, getIncomes, addExpense, addIncome, deleteExpense, deleteIncome, getBudgets, saveBudgets, getGoals, saveGoals, CATEGORIES, type Expense, type Income, type Budget, type Goal } from "@/lib/data"

const COLORS = ["#2D8F85","#39A596","#4DB6AC","#80CBC4","#B2DFDB","#E0F2F1","#1B6B62","#0D4A43","#26A69A","#00897B"]
const EMOJIS = ["🎯","💻","✈️","📱","🎓","🏠","🚗","👜","💪","🌴","💍","🎸","📸","🏋️","🐾"]

export default function Dashboard() {
  const [name, setName] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [activeTab, setActiveTab] = useState<"transactions"|"charts"|"budget"|"goals">("transactions")
  const [budgetForm, setBudgetForm] = useState({ category: "Food & Dining", limit: "" })
  const [goalForm, setGoalForm] = useState({ name: "", target: "", saved: "", emoji: "🎯" })
  const [addingTo, setAddingTo] = useState<string|null>(null)
  const [search, setSearch] = useState("")
  const [addAmount, setAddAmount] = useState("")

  const [expForm, setExpForm] = useState({ amount: "", category: "Food & Dining", description: "", date: new Date().toISOString().split("T")[0] })
  const [incForm, setIncForm] = useState({ amount: "", source: "", date: new Date().toISOString().split("T")[0] })

  useEffect(() => {
    const saved = localStorage.getItem("finwise_name")
    if (!saved) { window.location.href = "/"; return }
    setName(saved)
    setExpenses(getExpenses())
    setIncomes(getIncomes())
    setBudgets(getBudgets())
    setGoals(getGoals())
  }, [])

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const savings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0

  const categoryData = CATEGORIES.map(cat => ({
    name: cat, value: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)
  })).filter(d => d.value > 0)

  const incomeVsExpense = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
    { name: "Savings", value: Math.max(savings, 0) },
  ]

  const getSpentForCategory = (cat: string) => expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)

  const handleAddExpense = () => {
    if (!expForm.amount) return
    const e = addExpense({ amount: parseFloat(expForm.amount), category: expForm.category, description: expForm.description || expForm.category, date: expForm.date })
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

  const handleAddBudget = () => {
    if (!budgetForm.limit) return
    const existing = budgets.filter(b => b.category !== budgetForm.category)
    const newBudgets = [...existing, { category: budgetForm.category, limit: parseFloat(budgetForm.limit) }]
    saveBudgets(newBudgets)
    setBudgets(newBudgets)
    setBudgetForm({ category: "Food & Dining", limit: "" })
  }

  const handleDeleteBudget = (cat: string) => {
    const newBudgets = budgets.filter(b => b.category !== cat)
    saveBudgets(newBudgets)
    setBudgets(newBudgets)
  }

  const handleAddGoal = () => {
    if (!goalForm.name || !goalForm.target) return
    const newGoal: Goal = { id: Date.now().toString(), name: goalForm.name, target: parseFloat(goalForm.target), saved: parseFloat(goalForm.saved) || 0, emoji: goalForm.emoji }
    const newGoals = [...goals, newGoal]
    saveGoals(newGoals)
    setGoals(newGoals)
    setGoalForm({ name: "", target: "", saved: "", emoji: "🎯" })
  }

  const handleAddToGoal = (id: string) => {
    if (!addAmount) return
    const newGoals = goals.map(g => g.id === id ? {...g, saved: Math.min(g.saved + parseFloat(addAmount), g.target)} : g)
    saveGoals(newGoals)
    setGoals(newGoals)
    setAddingTo(null)
    setAddAmount("")
  }

  const handleDeleteGoal = (id: string) => {
    const newGoals = goals.filter(g => g.id !== id)
    saveGoals(newGoals)
    setGoals(newGoals)
  }

  const handleDeleteExpense = (id: string) => { deleteExpense(id); setExpenses(prev => prev.filter(e => e.id !== id)) }
  const handleDeleteIncome = (id: string) => { deleteIncome(id); setIncomes(prev => prev.filter(i => i.id !== id)) }
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN")

  const getAlertColor = (spent: number, limit: number) => {
    const pct = spent / limit
    if (pct >= 1) return "text-red-400"
    if (pct >= 0.9) return "text-orange-400"
    if (pct >= 0.7) return "text-yellow-400"
    return "text-[#2D8F85]"
  }

  const getBarColor = (spent: number, limit: number) => {
    const pct = spent / limit
    if (pct >= 1) return "bg-red-400"
    if (pct >= 0.9) return "bg-orange-400"
    if (pct >= 0.7) return "bg-yellow-400"
    return "bg-[#2D8F85]"
  }

  const overBudgetCount = budgets.filter(b => getSpentForCategory(b.category) >= b.limit).length

  return (
    <main className="min-h-screen bg-[#0B0F10] px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#2D8F85] text-xs font-medium tracking-widest uppercase mb-1">Finwise</p>
            <h1 className="text-[#F5F7F7] text-2xl font-semibold">Hey, {name} 👋</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = "/news"} className="text-[#8C9A9E] text-xs hover:text-[#F5F7F7] transition-colors">📰 News</button>
            <button onClick={() => { localStorage.clear(); window.location.href = "/" }} className="text-[#8C9A9E] text-xs hover:text-[#F5F7F7] transition-colors">Sign out</button>
          </div>
        </div>

        {overBudgetCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-400" />
            <p className="text-red-400 text-sm">Budget exceeded in <strong>{overBudgetCount}</strong> {overBudgetCount === 1 ? "category" : "categories"}!</p>
          </div>
        )}

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

        <div className="flex gap-3 mb-6">
          <button onClick={() => { setShowAddExpense(true); setShowAddIncome(false) }} className="flex items-center gap-2 bg-[#2D8F85] hover:bg-[#39A596] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Plus size={16} /> Add Expense
          </button>
          <button onClick={() => { setShowAddIncome(true); setShowAddExpense(false) }} className="flex items-center gap-2 bg-[#121A1C] hover:bg-[#1E2D30] text-[#F5F7F7] border border-[#1E2D30] px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Plus size={16} /> Add Income
          </button>
        </div>

        {showAddExpense && (
          <div className="bg-[#121A1C] border border-[#1E2D30] rounded-2xl p-5 mb-6">
            <h3 className="text-[#F5F7F7] text-sm font-medium mb-4">New Expense</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input type="number" placeholder="Amount (₹)" value={expForm.amount} onChange={e => setExpForm(p => ({...p, amount: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
              <select value={expForm.category} onChange={e => setExpForm(p => ({...p, category: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Description (optional)" value={expForm.description} onChange={e => setExpForm(p => ({...p, description: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
              <input type="date" value={expForm.date} onChange={e => setExpForm(p => ({...p, date: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddExpense} className="bg-[#2D8F85] hover:bg-[#39A596] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">Save</button>
              <button onClick={() => setShowAddExpense(false)} className="text-[#8C9A9E] hover:text-[#F5F7F7] px-4 py-2 rounded-xl text-sm transition-all">Cancel</button>
            </div>
          </div>
        )}

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

        <div className="flex gap-2 mb-4 flex-wrap">
          {(["transactions","charts","budget","goals","score"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${activeTab === tab ? "bg-[#2D8F85] text-white" : "bg-[#121A1C] text-[#8C9A9E] border border-[#1E2D30]"}`}>{tab}</button>
          ))}
        </div>

        {activeTab === "transactions" && (
          <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1E2D30]">
              <h2 className="text-[#F5F7F7] text-sm font-medium">Transactions</h2>
            </div>
            <div className="px-5 py-3 border-b border-[#1E2D30]">
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]"
              />
            </div>
            {expenses.length === 0 && incomes.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-[#8C9A9E] text-sm">No transactions yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#1E2D30]">
                {[...expenses.map(e => ({...e, type: "expense" as const})), ...incomes.map(i => ({...i, type: "income" as const, category: i.source, description: i.source}))]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .filter(t => search === "" || t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()) || t.amount.toString().includes(search))
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
        )}

        {activeTab === "charts" && (
          <div className="space-y-4">
            {categoryData.length === 0 ? (
              <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] px-5 py-10 text-center">
                <p className="text-[#8C9A9E] text-sm">No expense data yet.</p>
              </div>
            ) : (
              <>
                <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] p-5">
                  <h3 className="text-[#F5F7F7] text-sm font-medium mb-4">Spending by Category</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name, percent}) => `${name} ${((percent ?? 0)*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "#121A1C", border: "1px solid #1E2D30", borderRadius: "12px", color: "#F5F7F7" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] p-5">
                  <h3 className="text-[#F5F7F7] text-sm font-medium mb-4">Income vs Expenses vs Savings</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={incomeVsExpense} barSize={48}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#8C9A9E", fontSize: 12 }} />
                      <YAxis hide />
                      <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "#121A1C", border: "1px solid #1E2D30", borderRadius: "12px", color: "#F5F7F7" }} />
                      <Bar dataKey="value" radius={[8,8,0,0]}>
                        {incomeVsExpense.map((_, i) => <Cell key={i} fill={i === 0 ? "#2D8F85" : i === 1 ? "#ef4444" : "#39A596"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] p-5">
                  <h3 className="text-[#F5F7F7] text-sm font-medium mb-1">Daily Spending — {new Date().toLocaleString("en-IN", {month: "long", year: "numeric"})}</h3>
                  <p className="text-[#8C9A9E] text-xs mb-4">How much you spent each day this month</p>
                  {(() => {
                    const now = new Date()
                    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
                    const dailyData = Array.from({length: daysInMonth}, (_, i) => {
                      const day = i + 1
                      const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
                      const total = expenses.filter(e => e.date === dateStr).reduce((s,e) => s + e.amount, 0)
                      return { day: String(day), amount: total }
                    })
                    const hasData = dailyData.some(d => d.amount > 0)
                    if (!hasData) return (
                      <div className="text-center py-8">
                        <p className="text-[#8C9A9E] text-sm">No expenses this month yet.</p>
                      </div>
                    )
                    return (
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={dailyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E2D30" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8C9A9E", fontSize: 10 }} interval={4} />
                          <YAxis hide />
                          <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={(l) => `Day ${l}`} contentStyle={{ background: "#121A1C", border: "1px solid #1E2D30", borderRadius: "12px", color: "#F5F7F7" }} />
                          <Line type="monotone" dataKey="amount" stroke="#2D8F85" strokeWidth={2} dot={{ fill: "#2D8F85", r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )
                  })()}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "budget" && (
          <div className="space-y-4">
            <div className="bg-[#121A1C] border border-[#1E2D30] rounded-2xl p-5">
              <h3 className="text-[#F5F7F7] text-sm font-medium mb-4">Set Budget Limit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <select value={budgetForm.category} onChange={e => setBudgetForm(p => ({...p, category: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <input type="number" placeholder="Monthly limit (₹)" value={budgetForm.limit} onChange={e => setBudgetForm(p => ({...p, limit: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
              </div>
              <button onClick={handleAddBudget} className="bg-[#2D8F85] hover:bg-[#39A596] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">Save Budget</button>
            </div>
            {budgets.length === 0 ? (
              <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] px-5 py-10 text-center">
                <p className="text-[#8C9A9E] text-sm">No budgets set yet.</p>
              </div>
            ) : (
              <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1E2D30]">
                  <h3 className="text-[#F5F7F7] text-sm font-medium">Budget Tracker</h3>
                </div>
                <div className="divide-y divide-[#1E2D30]">
                  {budgets.map(b => {
                    const spent = getSpentForCategory(b.category)
                    const pct = Math.min(spent / b.limit, 1)
                    const over = spent > b.limit
                    return (
                      <div key={b.category} className="px-5 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {over && <AlertTriangle size={14} className="text-red-400" />}
                            <p className="text-[#F5F7F7] text-sm">{b.category}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className={`text-sm font-medium ${getAlertColor(spent, b.limit)}`}>{fmt(spent)} / {fmt(b.limit)}</p>
                            <button onClick={() => handleDeleteBudget(b.category)} className="text-[#8C9A9E] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        <div className="w-full bg-[#1E2D30] rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full transition-all ${getBarColor(spent, b.limit)}`} style={{ width: `${pct * 100}%` }} />
                        </div>
                        <p className="text-[#8C9A9E] text-xs mt-1">{over ? `Over by ${fmt(spent - b.limit)}` : `${fmt(b.limit - spent)} remaining`}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "goals" && (
          <div className="space-y-4">
            <div className="bg-[#121A1C] border border-[#1E2D30] rounded-2xl p-5">
              <h3 className="text-[#F5F7F7] text-sm font-medium mb-4">New Savings Goal</h3>
              <div className="mb-3">
                <p className="text-[#8C9A9E] text-xs mb-2">Pick an emoji</p>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setGoalForm(p => ({...p, emoji: e}))} className={`w-9 h-9 rounded-xl text-lg transition-all ${goalForm.emoji === e ? "bg-[#2D8F85]/20 ring-1 ring-[#2D8F85]" : "bg-[#0B0F10]"}`}>{e}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input type="text" placeholder="Goal name (e.g. New Laptop)" value={goalForm.name} onChange={e => setGoalForm(p => ({...p, name: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
                <input type="number" placeholder="Target amount (₹)" value={goalForm.target} onChange={e => setGoalForm(p => ({...p, target: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
                <input type="number" placeholder="Already saved (₹)" value={goalForm.saved} onChange={e => setGoalForm(p => ({...p, saved: e.target.value}))} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#2D8F85]" />
              </div>
              <button onClick={handleAddGoal} disabled={!goalForm.name || !goalForm.target} className="bg-[#2D8F85] hover:bg-[#39A596] disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">Create Goal</button>
            </div>

            {goals.length === 0 ? (
              <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] px-5 py-10 text-center">
                <Target size={32} className="text-[#8C9A9E] mx-auto mb-3" />
                <p className="text-[#8C9A9E] text-sm">No goals yet.</p>
                <p className="text-[#8C9A9E] text-xs mt-1">Create your first savings goal above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map(g => {
                  const pct = Math.min(g.saved / g.target, 1)
                  const done = g.saved >= g.target
                  return (
                    <div key={g.id} className={`bg-[#121A1C] rounded-2xl border p-5 ${done ? "border-[#2D8F85]/50" : "border-[#1E2D30]"}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{g.emoji}</span>
                          <div>
                            <p className="text-[#F5F7F7] text-sm font-medium">{g.name}</p>
                            <p className="text-[#8C9A9E] text-xs">{fmt(g.saved)} of {fmt(g.target)}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteGoal(g.id)} className="text-[#8C9A9E] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                      <div className="w-full bg-[#1E2D30] rounded-full h-2 mb-2">
                        <div className="h-2 rounded-full bg-[#2D8F85] transition-all" style={{ width: `${pct * 100}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[#8C9A9E] text-xs">{done ? "🎉 Goal reached!" : `${Math.round(pct * 100)}% complete`}</p>
                        {!done && (
                          addingTo === g.id ? (
                            <div className="flex items-center gap-2">
                              <input type="number" placeholder="Amount" value={addAmount} onChange={e => setAddAmount(e.target.value)} className="bg-[#0B0F10] border border-[#1E2D30] text-[#F5F7F7] placeholder-[#8C9A9E] px-2 py-1 rounded-lg text-xs w-24 focus:outline-none focus:border-[#2D8F85]" />
                              <button onClick={() => handleAddToGoal(g.id)} className="text-[#2D8F85] text-xs hover:text-[#39A596]">Add</button>
                              <button onClick={() => setAddingTo(null)} className="text-[#8C9A9E] text-xs">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setAddingTo(g.id)} className="text-[#2D8F85] text-xs hover:text-[#39A596] transition-colors">+ Add money</button>
                          )
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      {activeTab === "score" && (() => {
        const savingsScore = Math.min(savingsRate * 2, 40)
        const budgetScore = budgets.length === 0 ? 0 : Math.round((budgets.filter(b => getSpentForCategory(b.category) <= b.limit).length / budgets.length) * 30)
        const goalScore = goals.length === 0 ? 0 : Math.round((goals.filter(g => g.saved >= g.target * 0.2).length / goals.length) * 20)
        const incomeScore = totalIncome > 0 ? 10 : 0
        const total = Math.min(Math.round(savingsScore + budgetScore + goalScore + incomeScore), 100)
        const label = total >= 80 ? "Excellent" : total >= 50 ? "Good" : "Needs Work"
        const color = total >= 80 ? "#2D8F85" : total >= 50 ? "#f59e0b" : "#ef4444"
        const ring = total >= 80 ? "text-[#2D8F85]" : total >= 50 ? "text-yellow-400" : "text-red-400"

        return (
          <div className="space-y-4">
            <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] p-6 text-center">
              <p className="text-[#8C9A9E] text-xs uppercase tracking-widest mb-4">Financial Health Score</p>
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="#1E2D30" strokeWidth="10" />
                  <circle cx="70" cy="70" r="60" fill="none" stroke={color} strokeWidth="10"
                    strokeDasharray={`${(total / 100) * 376} 376`}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{transition: "stroke-dasharray 1s ease"}}
                  />
                </svg>
                <div className="absolute text-center">
                  <p className={`text-4xl font-bold ${ring}`}>{total}</p>
                  <p className="text-[#8C9A9E] text-xs">/100</p>
                </div>
              </div>
              <p className={`text-xl font-semibold mb-1 ${ring}`}>{label}</p>
              <p className="text-[#8C9A9E] text-sm">Based on your savings, budget and goals</p>
            </div>

            <div className="bg-[#121A1C] rounded-2xl border border-[#1E2D30] p-5 space-y-4">
              <h3 className="text-[#F5F7F7] text-sm font-medium">Score Breakdown</h3>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[#8C9A9E] text-xs">Savings Rate (max 40)</p>
                  <p className="text-[#F5F7F7] text-xs font-medium">{Math.round(savingsScore)}/40</p>
                </div>
                <div className="w-full bg-[#1E2D30] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#2D8F85]" style={{width: `${(savingsScore/40)*100}%`}} />
                </div>
                <p className="text-[#8C9A9E] text-xs mt-1">Your savings rate is {savingsRate}%</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[#8C9A9E] text-xs">Budget Discipline (max 30)</p>
                  <p className="text-[#F5F7F7] text-xs font-medium">{budgetScore}/30</p>
                </div>
                <div className="w-full bg-[#1E2D30] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#2D8F85]" style={{width: `${(budgetScore/30)*100}%`}} />
                </div>
                <p className="text-[#8C9A9E] text-xs mt-1">{budgets.length === 0 ? "Set budgets to earn points" : `${budgets.filter(b => getSpentForCategory(b.category) <= b.limit).length} of ${budgets.length} budgets on track`}</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[#8C9A9E] text-xs">Goal Progress (max 20)</p>
                  <p className="text-[#F5F7F7] text-xs font-medium">{goalScore}/20</p>
                </div>
                <div className="w-full bg-[#1E2D30] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#2D8F85]" style={{width: `${(goalScore/20)*100}%`}} />
                </div>
                <p className="text-[#8C9A9E] text-xs mt-1">{goals.length === 0 ? "Create goals to earn points" : `${goals.filter(g => g.saved >= g.target * 0.2).length} of ${goals.length} goals have 20%+ saved`}</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[#8C9A9E] text-xs">Income Tracked (max 10)</p>
                  <p className="text-[#F5F7F7] text-xs font-medium">{incomeScore}/10</p>
                </div>
                <div className="w-full bg-[#1E2D30] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#2D8F85]" style={{width: `${(incomeScore/10)*100}%`}} />
                </div>
                <p className="text-[#8C9A9E] text-xs mt-1">{totalIncome === 0 ? "Add income to earn points" : "Income is being tracked"}</p>
              </div>
            </div>
          </div>
        )
      })()}

      </div>
    </main>
  )
}
