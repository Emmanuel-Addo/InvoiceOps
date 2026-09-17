/**
 * CreditBridge API client
 * Talks to the FastAPI backend at http://localhost:8000
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FactorScores {
  income_consistency: number;
  savings_behaviour: number;
  expense_management: number;
  cash_flow_stability: number;
  repayment_capacity: number;
}

export interface CreditSummary {
  total_income: number;
  total_expenses: number;
  total_savings: number;
  savings_rate: number;
  expense_ratio: number;
  num_months: number;
  monthly_income_trend: number;
  income_sources: number;
  expense_categories: number;
  largest_expense: string;
}

export interface AnalysisDetails {
  income_consistency: string;
  monthly_income_trend: string;
  income_sources: number;
  income_volatility: string;
  expense_categories: number;
  largest_expense: string;
  expense_to_income_ratio: string;
  monthly_expense_trend: string;
  savings_rate: string;
  savings_consistency: string;
  monthly_savings_trend: string;
  cash_flow_stability: string;
  debt_indicators: string;
}

export interface HealthMetric {
  label: string;
  value: number;
  status: "good" | "warning" | "poor";
}

export interface HealthData {
  income_stability: HealthMetric;
  savings_behaviour: HealthMetric;
  expense_management: HealthMetric;
  cash_flow_risk: HealthMetric;
  repayment_capacity: HealthMetric;
}

export interface CashFlowPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  category: string;
}

export interface AIInsights {
  overview: string;
  profile: string;
  strengths: string[];
  improvements: string[];
}

export interface CreditProfile {
  overall_score: number;
  score_label: string;
  scores: FactorScores;
  summary: CreditSummary;
  analysis: AnalysisDetails;
  health_data: HealthData;
  cashflow_data: CashFlowPoint[];
  transactions: Transaction[];
  ai_insights: AIInsights;
}

// ── Local storage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "creditbridge_profile";

export function saveProfile(profile: CreditProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

export function loadProfile(): CreditProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CreditProfile;
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** Upload a CSV file and receive a full credit profile. */
export async function analyzeCSV(file: File): Promise<CreditProfile> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail ?? "Analysis failed. Please try again.");
  }

  return res.json();
}

/** Run analysis on the built-in demo data — no file required. */
export async function analyzeDemo(): Promise<CreditProfile> {
  const res = await fetch(`${API_BASE}/api/analyze-demo`, { method: "POST" });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Demo failed" }));
    throw new Error(err.detail ?? "Demo analysis failed.");
  }

  return res.json();
}

/** Check the backend is running. */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

/** URL to download the sample CSV directly from the backend. */
export const SAMPLE_CSV_URL = `${API_BASE}/api/sample-csv`;
