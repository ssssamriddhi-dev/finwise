# Finwise — Personal Finance Dashboard

> A beautifully designed personal finance dashboard built with Next.js 16, TypeScript and Tailwind CSS.

🌐 **Live Demo:** [finwise-tan.vercel.app](https://finwise-tan.vercel.app)

---

## ✨ Features

**Core Finance**
- Track income and expenses with 10 categories
- Set monthly budget limits per category with real-time warnings
- Create savings goals with progress tracking
- Recurring expenses that auto-add every month
- Transaction search across all entries

**Analytics & Insights**
- Financial Health Score (0–100) based on savings rate, budget discipline and goal progress
- Pie chart: spending breakdown by category
- Bar chart: income vs expenses vs savings
- Line chart: daily spending throughout the current month
- Monthly report with highlights and category breakdown

**Experience**
- Animated card stack on the welcome screen
- Rotating financial quotes
- Onboarding flow with budget templates by profession (Student, Corporate, Freelancer, etc.)
- Demo data button — loads realistic sample data instantly
- Fully responsive dark UI

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | ShadCN UI |
| Charts | Recharts |
| Storage | localStorage (no backend) |
| Hosting | Vercel |

---

## 📸 Screenshots

> Add screenshots here after taking them from the live site.  
> Tip: Load demo data first for the best visuals.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/ssssamriddhi-dev/finwise.git
cd finwise

# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
app/
  page.tsx          → Welcome screen with animated card stack
  onboarding/       → 4-step onboarding flow
  dashboard/        → Main dashboard (6 tabs)
  report/           → Monthly financial report
  news/             → Financial news & market links
lib/
  data.ts           → All data functions (expenses, income, budgets, goals)
```

---

## 💡 How It Works

All data is stored in the browser's `localStorage` — no database or backend required. This makes the app completely free to run and deploy while still being fully functional for personal use.

The financial health score is calculated from four weighted components: savings rate (40 pts), budget discipline (30 pts), goal progress (20 pts) and income tracking (10 pts).

---

## 👩‍💻 Author

**Samriddhi Srivastava**  
[GitHub](https://github.com/ssssamriddhi-dev) · [Live App](https://finwise-tan.vercel.app)

---

*Built as a portfolio project to demonstrate full-stack UI development with React/Next.js.*
