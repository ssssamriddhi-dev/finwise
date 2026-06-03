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
