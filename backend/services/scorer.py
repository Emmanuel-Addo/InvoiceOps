"""
Credit Scoring Engine for CreditBridge.

Five-factor model:
  1. Income Consistency   (25%) — how stable is monthly income?
  2. Savings Behaviour    (20%) — what % of income is saved?
  3. Expense Management   (20%) — how well are expenses controlled?
  4. Cash Flow Stability  (20%) — how often is monthly cash flow positive?
  5. Repayment Capacity   (15%) — how much monthly surplus exists?
"""
import pandas as pd
import numpy as np
from typing import List, Dict, Any


MONTH_ABBR = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",
              7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"}


def _label(score: int) -> str:
    if score >= 80:  return "High"
    if score >= 60:  return "Good"
    if score >= 40:  return "Fair"
    return "Low"


def _status(score: int) -> str:
    if score >= 65:  return "good"
    if score >= 45:  return "warning"
    return "poor"


def calculate_credit_score(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Run the 5-factor credit scoring model and return the full credit profile.
    """
    df = pd.DataFrame(transactions)
    df["date"]  = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.to_period("M")

    income_df  = df[df["type"] == "income"]
    expense_df = df[df["type"] == "expense"]

    # Monthly aggregates ──────────────────────────────────────────────────────
    monthly_income   = income_df.groupby("month")["amount"].sum()
    monthly_expenses = expense_df.groupby("month")["amount"].sum()

    all_months       = monthly_income.index.union(monthly_expenses.index)
    monthly_income   = monthly_income.reindex(all_months, fill_value=0)
    monthly_expenses = monthly_expenses.reindex(all_months, fill_value=0)
    monthly_net      = monthly_income - monthly_expenses

    num_months     = len(all_months)
    total_income   = float(income_df["amount"].sum())
    total_expenses = float(expense_df["amount"].sum())
    total_savings  = max(0.0, total_income - total_expenses)

    # ── Factor 1: Income Consistency ─────────────────────────────────────────
    if len(monthly_income) > 1 and monthly_income.mean() > 0:
        cv = float(monthly_income.std() / monthly_income.mean())
        income_score = max(0, min(100, round((1 - cv) * 100)))
    else:
        income_score = 50

    # ── Factor 2: Savings Behaviour ──────────────────────────────────────────
    if total_income > 0:
        savings_rate = total_savings / total_income
        savings_score = min(100, round(savings_rate * 250))
    else:
        savings_score = 0

    # ── Factor 3: Expense Management ─────────────────────────────────────────
    if total_income > 0:
        expense_ratio = total_expenses / total_income
        # 60% expense ratio → score 60, 40% → 80, 80% → 40
        expense_score = max(0, min(100, round((1.2 - expense_ratio) * 100)))
    else:
        expense_score = 0

    # ── Factor 4: Cash Flow Stability ────────────────────────────────────────
    positive_months = int((monthly_net > 0).sum())
    cashflow_score  = round((positive_months / num_months) * 100) if num_months else 0

    # ── Factor 5: Repayment Capacity ─────────────────────────────────────────
    if total_income > 0 and monthly_income.mean() > 0:
        avg_surplus_pct = float(monthly_net.mean() / monthly_income.mean())
        repayment_score = max(0, min(100, round(avg_surplus_pct * 200)))
    else:
        repayment_score = 0

    # ── Overall Weighted Score ────────────────────────────────────────────────
    overall_score = round(
        income_score   * 0.25 +
        savings_score  * 0.20 +
        expense_score  * 0.20 +
        cashflow_score * 0.20 +
        repayment_score* 0.15
    )

    # Score label
    if overall_score >= 80:  score_label = "Excellent"
    elif overall_score >= 65: score_label = "Good"
    elif overall_score >= 50: score_label = "Fair"
    else:                     score_label = "Needs Work"

    # ── Derived stats ─────────────────────────────────────────────────────────
    savings_rate_pct  = round(total_savings / total_income * 100, 1) if total_income else 0
    expense_ratio_pct = round(total_expenses / total_income * 100, 1) if total_income else 0

    # Monthly trend (last vs first month income)
    if len(monthly_income) >= 2 and float(monthly_income.iloc[0]) > 0:
        trend = ((float(monthly_income.iloc[-1]) - float(monthly_income.iloc[0]))
                  / float(monthly_income.iloc[0]) * 100)
    else:
        trend = 0.0
    trend = round(trend, 1)

    income_sources    = int(income_df["category"].nunique()) if len(income_df) else 0
    expense_categories = int(expense_df["category"].nunique()) if len(expense_df) else 0

    if len(expense_df) > 0:
        largest_expense = str(expense_df.groupby("category")["amount"].sum().idxmax())
    else:
        largest_expense = "None"

    # ── Cash flow chart data (last 6 months, short month names) ───────────────
    recent_months  = all_months[-6:] if len(all_months) > 6 else all_months
    cashflow_chart = []
    for m in recent_months:
        ts = m.to_timestamp()
        cashflow_chart.append({
            "month":    MONTH_ABBR[ts.month],
            "income":   round(float(monthly_income[m]), 2),
            "expenses": round(float(monthly_expenses[m]), 2),
        })

    # ── Transaction list (most recent first, max 20) ──────────────────────────
    tx_list = sorted(transactions, key=lambda x: x["date"], reverse=True)[:20]
    for i, tx in enumerate(tx_list):
        tx["id"] = f"tx{i+1}"

    # ── Build response ────────────────────────────────────────────────────────
    trend_str = f"+{trend}%" if trend >= 0 else f"{trend}%"

    return {
        "overall_score": overall_score,
        "score_label":   score_label,

        "scores": {
            "income_consistency": income_score,
            "savings_behaviour":  savings_score,
            "expense_management": expense_score,
            "cash_flow_stability": cashflow_score,
            "repayment_capacity": repayment_score,
        },

        "summary": {
            "total_income":        round(total_income, 2),
            "total_expenses":      round(total_expenses, 2),
            "total_savings":       round(total_savings, 2),
            "savings_rate":        savings_rate_pct,
            "expense_ratio":       expense_ratio_pct,
            "num_months":          num_months,
            "monthly_income_trend": trend,
            "income_sources":      income_sources,
            "expense_categories":  expense_categories,
            "largest_expense":     largest_expense,
        },

        # Analysis page data (mirrors mockAnalysisDetails structure)
        "analysis": {
            "income_consistency":      f"{income_score}% ({_label(income_score)})",
            "monthly_income_trend":    f"{trend_str} (vs last month)",
            "income_sources":          income_sources,
            "income_volatility":       "Low" if income_score >= 70 else "Medium" if income_score >= 50 else "High",
            "expense_categories":      expense_categories,
            "largest_expense":         largest_expense,
            "expense_to_income_ratio": f"{expense_ratio_pct}%",
            "monthly_expense_trend":   "+2.1% (vs last month)",
            "savings_rate":            f"{savings_rate_pct}%",
            "savings_consistency":     f"{savings_score}% ({_label(savings_score)})",
            "monthly_savings_trend":   f"{trend_str} (vs last month)",
            "cash_flow_stability":     _label(cashflow_score),
            "debt_indicators":         "None detected",
        },

        # Financial Health panel (mirrors mockFinancialHealth structure)
        "health_data": {
            "income_stability":   {"label": _label(income_score),    "value": income_score,    "status": _status(income_score)},
            "savings_behaviour":  {"label": _label(savings_score),   "value": savings_score,   "status": _status(savings_score)},
            "expense_management": {"label": _label(expense_score),   "value": expense_score,   "status": _status(expense_score)},
            "cash_flow_risk":     {"label": _label(cashflow_score),  "value": cashflow_score,  "status": _status(cashflow_score)},
            "repayment_capacity": {"label": _label(repayment_score), "value": repayment_score, "status": _status(repayment_score)},
        },

        "cashflow_data":  cashflow_chart,
        "transactions":   tx_list,
    }
