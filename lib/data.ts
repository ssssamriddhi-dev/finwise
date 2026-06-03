export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

export type Income = {
  id: string
  amount: number
  source: string
  date: string
}

export function getExpenses(): Expense[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("finwise_expenses")
  return data ? JSON.parse(data) : []
}

export function saveExpenses(expenses: Expense[]) {
  localStorage.setItem("finwise_expenses", JSON.stringify(expenses))
}

export function addExpense(expense: Omit<Expense, "id">): Expense {
  const expenses = getExpenses()
  const newExpense = { ...expense, id: Date.now().toString() }
  expenses.unshift(newExpense)
  saveExpenses(expenses)
  return newExpense
}

export function deleteExpense(id: string) {
  const expenses = getExpenses().filter(e => e.id !== id)
  saveExpenses(expenses)
}

export function getIncomes(): Income[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("finwise_incomes")
  return data ? JSON.parse(data) : []
}

export function saveIncomes(incomes: Income[]) {
  localStorage.setItem("finwise_incomes", JSON.stringify(incomes))
}

export function addIncome(income: Omit<Income, "id">): Income {
  const incomes = getIncomes()
  const newIncome = { ...income, id: Date.now().toString() }
  incomes.unshift(newIncome)
  saveIncomes(incomes)
  return newIncome
}

export function deleteIncome(id: string) {
  const incomes = getIncomes().filter(i => i.id !== id)
  saveIncomes(incomes)
}

export const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Rent & Housing",
  "Education",
  "Savings",
  "Investments",
  "Miscellaneous"
]

export type Budget = {
  category: string
  limit: number
}

export function getBudgets(): Budget[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("finwise_budgets")
  return data ? JSON.parse(data) : []
}

export function saveBudgets(budgets: Budget[]) {
  localStorage.setItem("finwise_budgets", JSON.stringify(budgets))
}

export type Goal = {
  id: string
  name: string
  target: number
  saved: number
  emoji: string
}

export function getGoals(): Goal[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("finwise_goals")
  return data ? JSON.parse(data) : []
}

export function saveGoals(goals: Goal[]) {
  localStorage.setItem("finwise_goals", JSON.stringify(goals))
}

export function loadDemoData() {
  const today = new Date()
  const m = String(today.getMonth() + 1).padStart(2, "0")
  const y = today.getFullYear()
  const pm = String(today.getMonth()).padStart(2, "0")
  const py = today.getMonth() === 0 ? y - 1 : y

  const expenses = [
    { id: "d1", amount: 4500, category: "Food & Dining", description: "Groceries", date: `${y}-${m}-02` },
    { id: "d2", amount: 800, category: "Transport", description: "Uber rides", date: `${y}-${m}-03` },
    { id: "d3", amount: 2200, category: "Entertainment", description: "Netflix + movies", date: `${y}-${m}-05` },
    { id: "d4", amount: 1500, category: "Shopping", description: "Clothes", date: `${y}-${m}-07` },
    { id: "d5", amount: 600, category: "Food & Dining", description: "Restaurant dinner", date: `${y}-${m}-09` },
    { id: "d6", amount: 3000, category: "Health", description: "Gym membership", date: `${y}-${m}-10` },
    { id: "d7", amount: 1200, category: "Transport", description: "Petrol", date: `${y}-${m}-12` },
    { id: "d8", amount: 5000, category: "Education", description: "Online course", date: `${y}-${m}-14` },
    { id: "d9", amount: 900, category: "Food & Dining", description: "Swiggy orders", date: `${y}-${m}-15` },
    { id: "d10", amount: 2500, category: "Shopping", description: "Amazon", date: `${y}-${m}-17` },
    { id: "d11", amount: 15000, category: "Rent & Housing", description: "Monthly rent", date: `${y}-${m}-01` },
    { id: "d12", amount: 700, category: "Miscellaneous", description: "Misc expenses", date: `${y}-${m}-19` },
    { id: "d13", amount: 3500, category: "Food & Dining", description: "Groceries", date: `${py}-${pm}-03` },
    { id: "d14", amount: 1800, category: "Entertainment", description: "Concert tickets", date: `${py}-${pm}-10` },
    { id: "d15", amount: 14000, category: "Rent & Housing", description: "Monthly rent", date: `${py}-${pm}-01` },
    { id: "d16", amount: 2000, category: "Transport", description: "Travel", date: `${py}-${pm}-15` },
    { id: "d17", amount: 4000, category: "Shopping", description: "Gadgets", date: `${py}-${pm}-20` },
  ]

  const incomes = [
    { id: "i1", amount: 55000, source: "Salary", date: `${y}-${m}-01` },
    { id: "i2", amount: 8000, source: "Freelance project", date: `${y}-${m}-10` },
    { id: "i3", amount: 55000, source: "Salary", date: `${py}-${pm}-01` },
  ]

  const budgets = [
    { category: "Food & Dining", limit: 8000 },
    { category: "Transport", limit: 3000 },
    { category: "Entertainment", limit: 2000 },
    { category: "Shopping", limit: 4000 },
    { category: "Rent & Housing", limit: 15000 },
    { category: "Health", limit: 3000 },
    { category: "Education", limit: 5000 },
  ]

  const goals = [
    { id: "g1", name: "Emergency Fund", target: 100000, saved: 35000, emoji: "🏦" },
    { id: "g2", name: "New Laptop", target: 80000, saved: 20000, emoji: "💻" },
    { id: "g3", name: "Vacation", target: 50000, saved: 48000, emoji: "✈️" },
  ]

  localStorage.setItem("finwise_expenses", JSON.stringify(expenses))
  localStorage.setItem("finwise_incomes", JSON.stringify(incomes))
  localStorage.setItem("finwise_budgets", JSON.stringify(budgets))
  localStorage.setItem("finwise_goals", JSON.stringify(goals))
  localStorage.setItem("finwise_name", "Samriddhi")
  localStorage.setItem("finwise_profile", JSON.stringify({
    currency: "₹ INR",
    profession: "Corporate Employee",
    depositDate: "1st",
    income: "55000"
  }))
}

export function clearDemoData() {
  localStorage.clear()
}
