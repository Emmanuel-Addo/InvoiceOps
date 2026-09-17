"""
Groq LLM client — generates plain-language credit insights.
Model: llama-3.3-70b-versatile (fast, high quality).
"""
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_credit_insights(profile: dict) -> dict:
    """
    Call Groq to produce human-readable insights from a credit profile dict.

    Returns a dict with keys:
      overview       – 2-sentence encouraging score summary
      profile        – 2-sentence lender-ready description
      strengths      – list[str] of 3 observed strengths
      improvements   – list[str] of 2 actionable improvements
    """
    s      = profile["summary"]
    scores = profile["scores"]
    score  = profile["overall_score"]
    label  = profile["score_label"]

    prompt = f"""You are a friendly financial analyst at CreditBridge Ghana, helping informal workers access credit.

A user's mobile money transaction history has been analysed. Here are the results:

Credit Intelligence Score : {score}/100  ({label})
Period analysed           : {s['num_months']} months
Total Income (GHS)        : {s['total_income']:,.2f}
Total Expenses (GHS)      : {s['total_expenses']:,.2f}
Net Savings (GHS)         : {s['total_savings']:,.2f}
Savings Rate              : {s['savings_rate']}%
Expense-to-Income Ratio   : {s['expense_ratio']}%
Largest Expense Category  : {s['largest_expense']}
Income Sources            : {s['income_sources']}
Monthly Income Trend      : {s['monthly_income_trend']:+.1f}%

Factor Scores (out of 100):
  Income Consistency   : {scores['income_consistency']}
  Savings Behaviour    : {scores['savings_behaviour']}
  Expense Management   : {scores['expense_management']}
  Cash Flow Stability  : {scores['cash_flow_stability']}
  Repayment Capacity   : {scores['repayment_capacity']}

Please respond ONLY with a valid JSON object (no markdown, no explanation outside the JSON) with these four keys:

{{
  "overview": "...",
  "profile":  "...",
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "..."]
}}

Rules:
- "overview": 2 sentences. Be encouraging. Mention the score and the person's strongest quality.
- "profile": 2 sentences written for a lender to read. Professional and factual.
- "strengths": exactly 3 specific strengths drawn from the data (not generic).
- "improvements": exactly 2 concrete, actionable steps the user can take.
- Keep language simple — the user may be a market trader or small-business owner in Ghana.
- Use "GHS" for currency references in the profile field.
"""

    try:
        response = _client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.65,
            max_tokens=600,
        )
        raw = response.choices[0].message.content.strip()

        # Extract JSON even if the model wraps it in markdown fences
        start = raw.find("{")
        end   = raw.rfind("}") + 1
        if start == -1 or end == 0:
            raise ValueError("No JSON found in response")
        return json.loads(raw[start:end])

    except Exception as exc:
        print(f"[Groq] Insight generation failed: {exc}")
        return _fallback_insights(score, label, s, scores)


def _fallback_insights(score, label, s, scores):
    strongest = max(scores, key=scores.get)
    strength_map = {
        "income_consistency":   "consistent monthly income",
        "savings_behaviour":    "strong savings habit",
        "expense_management":   "disciplined expense control",
        "cash_flow_stability":  "stable positive cash flow",
        "repayment_capacity":   "healthy monthly surplus",
    }
    return {
        "overview": (
            f"Your Credit Intelligence Score is {score}/100 ({label}), "
            f"driven largely by your {strength_map.get(strongest, 'transaction activity')}. "
            f"Your financial data shows {s['num_months']} months of consistent activity — "
            f"a strong signal for lenders."
        ),
        "profile": (
            f"This applicant has maintained GHS {s['total_income']:,.0f} in income over "
            f"{s['num_months']} months with a {s['savings_rate']}% savings rate. "
            f"Cash flow has been positive, indicating capacity to service loan obligations."
        ),
        "strengths": [
            "Consistent mobile money transaction history",
            "Positive net cash flow maintained over the review period",
            "Regular savings pattern observed in transaction data",
        ],
        "improvements": [
            "Reduce spending in your largest expense category to increase your savings rate",
            "Diversify income sources to improve income consistency scores",
        ],
    }
