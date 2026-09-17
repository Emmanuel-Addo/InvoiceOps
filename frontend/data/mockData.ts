export const mockUser = {
  name: "Emmanuel",
  fullName: "Emmanuel Addo",
  email: "emmanuel@example.com",
  phone: "+233 24 123 4567",
  occupation: "Informal Trader",
  location: "Accra, GH",
  creditScore: 78,
  scoreLabel: "Good",
  scoreDescription: "Good Financial Readiness",
};

export const mockSummary = {
  totalIncome: 8450,
  totalExpenses: 5120,
  totalSavings: 3330,
};

export const mockFinancialHealth = {
  incomeStability: { label: "High", value: 85, status: "good" },
  savingsBehaviour: { label: "Good", value: 72, status: "warning" },
  expenseManagement: { label: "Good", value: 81, status: "good" },
  cashFlowRisk: { label: "Low", value: 79, status: "good" },
  repaymentCapacity: { label: "Good", value: 76, status: "good" },
};

export const mockTransactions = [
  { id: "tx1", date: "2023-10-24", description: "MTN MoMo Receipt", type: "income", category: "Transfer", amount: 1200 },
  { id: "tx2", date: "2023-10-22", description: "Shop Sales (Cash Deposit)", type: "income", category: "Sales", amount: 850 },
  { id: "tx3", date: "2023-10-21", description: "Vodafone Cash Transfer", type: "income", category: "Transfer", amount: 450 },
  { id: "tx4", date: "2023-10-20", description: "Electricity Bill (ECG)", type: "expense", category: "Utilities", amount: 150 },
  { id: "tx5", date: "2023-10-18", description: "Transport (Trotro)", type: "expense", category: "Transport", amount: 40 },
  { id: "tx6", date: "2023-10-15", description: "Food Supplies (Market)", type: "expense", category: "Food", amount: 320 },
  { id: "tx7", date: "2023-10-10", description: "AirtelTigo Money Receipt", type: "income", category: "Transfer", amount: 500 },
  { id: "tx8", date: "2023-10-05", description: "Rent Payment", type: "expense", category: "Housing", amount: 800 },
  { id: "tx9", date: "2023-10-02", description: "Shop Sales", type: "income", category: "Sales", amount: 1100 },
  { id: "tx10", date: "2023-10-01", description: "Internet Data Bundle", type: "expense", category: "Utilities", amount: 100 },
];

export const mockCashFlowData = [
  { month: "May", income: 7200, expenses: 4800 },
  { month: "Jun", income: 7500, expenses: 5100 },
  { month: "Jul", income: 7100, expenses: 4900 },
  { month: "Aug", income: 8200, expenses: 5300 },
  { month: "Sep", income: 7900, expenses: 5000 },
  { month: "Oct", income: 8450, expenses: 5120 },
];

export const mockAIInsights = {
  overview: "Your income has remained relatively consistent over the last 6 months. Your savings behaviour is improving, while your expense-to-income ratio remains within a healthy range.",
  profile: "Your profile shows relatively stable income and positive cash flow. The strongest factor is income consistency, while savings behaviour has room for improvement."
};

export const mockProfileStrengths = [
  "Consistent income activity",
  "Positive monthly cash flow",
  "Regular savings behaviour"
];

export const mockProfileImprovements = [
  "Reduce high discretionary spending",
  "Maintain consistent savings",
  "Improve income diversification"
];

export const mockAnalysisDetails = {
  incomeConsistency: "85% (High)",
  monthlyIncomeTrend: "+4.2% (vs last month)",
  incomeSources: 3,
  incomeVolatility: "Low",
  expenseCategories: 5,
  largestExpense: "Housing (Rent)",
  expenseToIncomeRatio: "60.5%",
  monthlyExpenseTrend: "+2.4% (vs last month)",
  savingsRate: "39.5%",
  savingsConsistency: "72% (Medium)",
  monthlySavingsTrend: "+5.1% (vs last month)",
  cashFlowStability: "High",
  debtIndicators: "None detected"
};
