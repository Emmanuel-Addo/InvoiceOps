"""
CSV Parser for MoMo (Mobile Money) transaction statements.
Supports MTN, Vodafone, AirtelTigo formats and generic bank CSVs.
"""
import pandas as pd
import io
from typing import List, Dict, Any


# ── Column name aliases ────────────────────────────────────────────────────────
DATE_COLS   = ["date", "transaction_date", "trans_date", "value_date",
               "txn_date", "transaction date", "trans date"]
AMOUNT_COLS = ["amount", "trans_amount", "transaction_amount",
               "credit_debit_amount", "debit_credit_amount", "txn_amount"]
TYPE_COLS   = ["type", "transaction_type", "trans_type", "txn_type",
               "cr/dr", "credit_debit", "debit/credit", "dr/cr"]
DESC_COLS   = ["description", "narration", "details", "remarks",
               "particulars", "transaction_details", "memo", "note"]
CREDIT_COLS = ["credit", "credit_amount", "money_in", "received"]
DEBIT_COLS  = ["debit",  "debit_amount",  "money_out", "paid"]


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Lowercase and strip column names."""
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    return df


def _find_col(df: pd.DataFrame, aliases: List[str]) -> str | None:
    for alias in aliases:
        if alias in df.columns:
            return alias
    return None


def _parse_amount(val: Any) -> float:
    """Strip currency symbols / commas and convert to float."""
    s = str(val).replace(",", "").replace("GHS", "").replace("₵", "").strip()
    try:
        return abs(float(s))
    except ValueError:
        return 0.0


def categorize(description: str, tx_type: str) -> str:
    """Rule-based transaction categorisation."""
    d = description.lower()
    if tx_type == "income":
        if any(k in d for k in ["momo", "mobile money", "mm transfer", "received"]):
            return "Transfer"
        if any(k in d for k in ["sales", "shop", "market", "sold", "revenue"]):
            return "Sales"
        if any(k in d for k in ["salary", "wage", "payroll", "pay"]):
            return "Salary"
        if any(k in d for k in ["loan", "credit", "advance"]):
            return "Loan In"
        return "Other Income"
    else:
        if any(k in d for k in ["rent", "housing", "apartment", "landlord"]):
            return "Housing"
        if any(k in d for k in ["food", "grocery", "market", "restaurant", "chop",
                                  "provisions", "maize", "rice", "plantain"]):
            return "Food"
        if any(k in d for k in ["ecg", "electricity", "water", "internet",
                                  "bundle", "data", "wifi", "gwcl"]):
            return "Utilities"
        if any(k in d for k in ["transport", "trotro", "bus", "fuel", "petrol",
                                  "taxi", "uber", "bolt", "yango"]):
            return "Transport"
        if any(k in d for k in ["school", "education", "fees", "tuition"]):
            return "Education"
        if any(k in d for k in ["hospital", "clinic", "medical", "pharmacy",
                                  "drug", "nhis", "health"]):
            return "Healthcare"
        if any(k in d for k in ["loan repay", "repayment", "installment"]):
            return "Loan Repayment"
        return "Other Expense"


def parse_momo_csv(file_content: bytes) -> List[Dict[str, Any]]:
    """
    Parse a MoMo transaction CSV and return a clean list of transaction dicts.

    Accepted formats
    ----------------
    Format A (single amount + type column):
      Date | Reference | Description | Type(Credit/Debit) | Amount | Balance

    Format B (separate credit/debit columns):
      Date | Reference | Description | Credit | Debit | Balance

    Returns
    -------
    List of dicts with keys: date, description, type, amount, category
    """
    try:
        content_str = file_content.decode("utf-8", errors="replace")
        df = pd.read_csv(io.StringIO(content_str))
    except Exception as exc:
        raise ValueError(f"Could not read CSV: {exc}")

    df = _normalize_columns(df)

    date_col   = _find_col(df, DATE_COLS)
    amount_col = _find_col(df, AMOUNT_COLS)
    type_col   = _find_col(df, TYPE_COLS)
    desc_col   = _find_col(df, DESC_COLS)
    credit_col = _find_col(df, CREDIT_COLS)
    debit_col  = _find_col(df, DEBIT_COLS)

    if date_col is None:
        raise ValueError("No date column found. Expected a column named 'Date' or 'Transaction Date'.")

    transactions: List[Dict[str, Any]] = []

    for _, row in df.iterrows():
        # ── Date ──────────────────────────────────────────────────────────────
        try:
            date = pd.to_datetime(str(row[date_col]).strip()).strftime("%Y-%m-%d")
        except Exception:
            continue  # skip rows with unparseable dates

        # ── Description ───────────────────────────────────────────────────────
        description = str(row[desc_col]).strip() if desc_col else "Transaction"
        if description in ("nan", ""):
            description = "Transaction"

        # ── Amount + Type ─────────────────────────────────────────────────────
        if credit_col and debit_col:
            # Format B: separate credit / debit columns
            credit_val = _parse_amount(row[credit_col]) if pd.notna(row[credit_col]) else 0.0
            debit_val  = _parse_amount(row[debit_col])  if pd.notna(row[debit_col])  else 0.0
            if credit_val > 0:
                tx_type, amount = "income", credit_val
            elif debit_val > 0:
                tx_type, amount = "expense", debit_val
            else:
                continue

        elif amount_col and type_col:
            # Format A: single amount + type indicator
            amount    = _parse_amount(row[amount_col])
            type_str  = str(row[type_col]).lower().strip()
            if any(w in type_str for w in ["credit", "cr", "in", "received",
                                            "deposit", "money in", "c"]):
                tx_type = "income"
            else:
                tx_type = "expense"

        elif amount_col:
            # Signed amount only
            raw = str(row[amount_col]).replace(",", "").replace("GHS", "").replace("₵", "").strip()
            try:
                signed = float(raw)
            except ValueError:
                continue
            tx_type = "income" if signed > 0 else "expense"
            amount  = abs(signed)

        else:
            continue  # can't determine amount

        if amount == 0:
            continue

        transactions.append({
            "date":        date,
            "description": description,
            "type":        tx_type,
            "amount":      round(amount, 2),
            "category":    categorize(description, tx_type),
        })

    return transactions
