"""
CreditBridge FastAPI Backend
----------------------------
Endpoints:
  GET  /api/health       — liveness check
  POST /api/analyze      — upload a MoMo CSV, get credit profile + AI insights
  POST /api/analyze-demo — run analysis on built-in sample data (no upload needed)
  GET  /api/sample-csv   — download a ready-made sample MoMo CSV for testing
"""
import io
import csv
import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv

from services.parser import parse_momo_csv
from services.scorer import calculate_credit_score
from services.groq_client import generate_credit_insights
from services.auth import get_current_user
from data.sample_transactions import SAMPLE_TRANSACTIONS

load_dotenv()

app = FastAPI(
    title="CreditBridge API",
    description="AI-powered credit intelligence for Ghana's informal workers",
    version="1.0.0",
)

# ── CORS: allow the Next.js dev server ────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "CreditBridge API", "version": "1.0.0"}


# ── Upload & Analyse ──────────────────────────────────────────────────────────
@app.post("/api/analyze")
async def analyze_upload(file: UploadFile = File(...), user = Depends(get_current_user)):
    """
    Upload a MoMo transaction CSV.
    Returns a full Credit Intelligence Profile with Groq AI insights.
    Requires an authenticated user token.
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    content = await file.read()

    # Parse
    try:
        transactions = parse_momo_csv(content)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    if len(transactions) < 5:
        raise HTTPException(
            status_code=422,
            detail=(
                "Not enough transactions found (minimum 5 required). "
                "Please check that your CSV has a Date column and Amount column, "
                "or download the sample CSV to see the expected format."
            ),
        )

    # Score
    profile = calculate_credit_score(transactions)

    # AI insights via Groq
    try:
        profile["ai_insights"] = generate_credit_insights(profile)
    except Exception as exc:
        print(f"[warn] Groq failed, using fallback: {exc}")
        profile["ai_insights"] = _fallback_ai(profile)

    return profile


# ── Demo (no upload required) ─────────────────────────────────────────────────
@app.post("/api/analyze-demo")
def analyze_demo():
    """
    Run the full analysis pipeline on built-in sample data.
    Useful for demos, reviewers, and testing the frontend.
    """
    profile = calculate_credit_score(SAMPLE_TRANSACTIONS)
    try:
        profile["ai_insights"] = generate_credit_insights(profile)
    except Exception as exc:
        print(f"[warn] Groq failed, using fallback: {exc}")
        profile["ai_insights"] = _fallback_ai(profile)
    return profile


# ── Sample CSV download ───────────────────────────────────────────────────────
@app.get("/api/sample-csv")
def download_sample_csv():
    """Return a downloadable sample MoMo CSV the user can upload to test the app."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Transaction Date", "Reference", "Description", "Type", "Amount", "Balance"])

    balance = 2000.0
    for tx in SAMPLE_TRANSACTIONS:
        amount  = tx["amount"]
        balance = balance + amount if tx["type"] == "income" else balance - amount
        writer.writerow([
            tx["date"],
            f"REF{SAMPLE_TRANSACTIONS.index(tx)+1:04d}",
            tx["description"],
            "Credit" if tx["type"] == "income" else "Debit",
            f"{amount:.2f}",
            f"{max(balance, 0):.2f}",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sample_momo_transactions.csv"},
    )


# ── Helpers ───────────────────────────────────────────────────────────────────
def _fallback_ai(profile: dict) -> dict:
    score = profile["overall_score"]
    label = profile["score_label"]
    s     = profile["summary"]
    return {
        "overview": (
            f"Your Credit Intelligence Score is {score}/100 ({label}). "
            f"Your {s['num_months']}-month transaction history shows a savings rate "
            f"of {s['savings_rate']}% — a positive signal for lenders."
        ),
        "profile": (
            f"Applicant has generated GHS {s['total_income']:,.0f} in income over "
            f"{s['num_months']} months with a net savings of GHS {s['total_savings']:,.0f}. "
            "Cash flow analysis indicates capacity to service loan repayments."
        ),
        "strengths": [
            "Consistent mobile money transaction activity",
            "Positive net cash flow maintained across the review period",
            "Regular savings pattern visible in transaction history",
        ],
        "improvements": [
            f"Reduce spending in '{s['largest_expense']}' category to boost your savings rate",
            "Increase the diversity of income sources to strengthen your income consistency score",
        ],
    }


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
