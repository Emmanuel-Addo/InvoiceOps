"""
InvoiceOps FastAPI Backend — Supabase Edition
----------------------------------------------
All documents and expenses are persisted in Supabase.

Endpoints:
  GET  /api/health              — liveness check
  POST /api/upload-document     — upload invoice/receipt, AI extracts data, saves to DB
  GET  /api/documents           — list documents from Supabase
  POST /api/approve/{doc_id}    — approve a document (triggers expense creation)
  POST /api/reject/{doc_id}     — reject a document
  GET  /api/expenses            — list approved expenses from Supabase
  GET  /api/reports/summary     — financial summary from real data
"""

import os
import uuid
import random
import base64
import json
import pymupdf as fitz
from datetime import datetime, date
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# ── Supabase client ───────────────────────────────────────────────────────────
SUPABASE_URL     = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in backend/.env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
from google import genai
from google.genai import types
_gemini_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="InvoiceOps API",
    description="AI-Powered Invoice & Expense Operations — Supabase backend",
    version="2.1.0",
)

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

# ── Constants ─────────────────────────────────────────────────────────────────
EXPENSE_CATEGORIES = [
    "Office Supplies", "Transport", "Utilities", "Rent",
    "Food & Beverage", "Marketing", "Equipment",
    "Professional Services", "Inventory", "Other",
]



PAYMENT_METHODS = ["MTN MoMo", "Vodafone Cash", "Bank Transfer", "Cash", "Card", "Other"]


# ── Helper: AI extraction ──────────────────────────────────────────────────────
async def ai_extract(file_bytes: bytes, content_type: str, filename: str, doc_type: str) -> dict:
    """
    Real AI extraction using Google Gemini API (gemini-2.5-flash).
    """
    if not _gemini_client:
        raise ValueError("GEMINI_API_KEY is not set.")

    # Convert PDF to image if necessary
    if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        page = doc.load_page(0) # First page only
        pix = page.get_pixmap()
        img_bytes = pix.tobytes("jpeg")
        mime = "image/jpeg"
    else:
        img_bytes = file_bytes
        mime = content_type if content_type else "image/jpeg"
    
    prompt = f"""Extract information from this {doc_type}. 
Return ONLY a valid JSON object with exactly these keys:
- vendor (string, name of the vendor/merchant)
- invoice_number (string, the invoice or receipt number)
- date (string, ISO format YYYY-MM-DD)
- currency (string, e.g., GHS, USD)
- subtotal (float)
- tax_amount (float)
- total_amount (float)
- category (string from: Office Supplies, Transport, Utilities, Rent, Food & Beverage, Marketing, Equipment, Professional Services, Inventory, Other)
- payment_method (string from: MTN MoMo, Vodafone Cash, Bank Transfer, Cash, Card, Other)
- confidence_vendor (float between 0-100)
- confidence_date (float between 0-100)
- confidence_total (float between 0-100)
- confidence_category (float between 0-100)
- warnings (list of strings, any issues like missing tax, unclear amounts, etc.)

Do not include any markdown, explanation, or code blocks outside the JSON object.
"""

    try:
        response = _gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                prompt,
                types.Part.from_bytes(data=img_bytes, mime_type=mime)
            ]
        )
        
        raw_json = response.text.strip()
        start = raw_json.find("{")
        end = raw_json.rfind("}") + 1
        if start == -1 or end == 0:
            raise ValueError("No JSON found in response")
        return json.loads(raw_json[start:end])
    except Exception as e:
        print(f"[Gemini Vision] extraction failed: {e}")
        # fallback to empty dict structure
        return {
            "vendor": "Unknown",
            "invoice_number": "Unknown",
            "date": date.today().isoformat(),
            "currency": "GHS",
            "subtotal": 0.0,
            "tax_amount": 0.0,
            "total_amount": 0.0,
            "category": "Other",
            "payment_method": "Cash",
            "confidence_vendor": 0.0,
            "confidence_date": 0.0,
            "confidence_total": 0.0,
            "confidence_category": 0.0,
            "warnings": [f"AI extraction failed: {str(e)}"]
        }


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"message": "Welcome to the InvoiceOps API. The backend is running successfully!"}

@app.get("/api/health")
def health_check():
    # Quick connectivity test
    try:
        supabase.table("documents").select("id").limit(1).execute()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status":     "ok",
        "service":    "InvoiceOps API",
        "version":    "2.1.0",
        "database":   db_status,
        "ai_ready":   GEMINI_API_KEY is not None,
    }


# ── Upload & Extract ──────────────────────────────────────────────────────────
@app.post("/api/upload-document")
async def upload_document(
    file:     UploadFile = File(...),
    doc_type: str        = "Invoice",
):
    """
    Accept a PDF, JPG, PNG, WEBP, or HEIC file.
    Runs AI extraction, saves the document record to Supabase.
    Returns the full extracted document record.
    """
    allowed = {
        "application/pdf", "image/jpeg", "image/jpg",
        "image/png", "image/webp", "image/heic", "image/heif",
    }
    ct       = file.content_type or ""
    filename = file.filename or "document"

    if ct not in allowed and not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload a PDF, JPG, PNG, WEBP, or HEIC file.",
        )

    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum 20 MB.")

    # AI extraction
    extracted = await ai_extract(content, ct, filename, doc_type)

    doc_record = {
        "id":           str(uuid.uuid4()),
        "filename":     filename,
        "file_type":    ct.split("/")[-1].upper() if ct else "PDF",
        "file_size":    len(content),
        "doc_type":     doc_type,
        "status":       "Pending Review",
        "uploaded_at":  datetime.utcnow().isoformat() + "Z",
        **extracted,
    }

    # Save to Supabase
    try:
        result = supabase.table("documents").insert(doc_record).execute()
        saved  = result.data[0] if result.data else doc_record
    except Exception as e:
        # If DB fails, return extracted data anyway so the frontend still works
        print(f"[warn] Supabase insert failed: {e}")
        saved = doc_record

    # Normalise response for frontend
    saved["ai_confidence"] = {
        "vendor":   saved.get("confidence_vendor", 0),
        "date":     saved.get("confidence_date", 0),
        "total":    saved.get("confidence_total", 0),
        "category": saved.get("confidence_category", 0),
    }

    return {
        "success":     True,
        "document_id": saved["id"],
        "message":     "Document uploaded and processed. Ready for human review.",
        "data":        saved,
    }


# ── List Documents ────────────────────────────────────────────────────────────
@app.get("/api/documents")
def list_documents(
    status:   Optional[str] = Query(None),
    doc_type: Optional[str] = Query(None),
    limit:    int            = Query(50, ge=1, le=200),
):
    """Return documents from Supabase, filtered by status and/or type."""
    try:
        q = supabase.table("documents").select("*").order("uploaded_at", desc=True).limit(limit)
        if status:
            q = q.eq("status", status)
        if doc_type:
            q = q.eq("doc_type", doc_type)
        result = q.execute()
        docs   = result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"documents": docs, "total": len(docs)}


# ── Approve ───────────────────────────────────────────────────────────────────
@app.post("/api/approve/{doc_id}")
def approve_document(doc_id: str = Path(...)):
    """
    Mark a document as Approved.
    The Supabase trigger `on_document_approved` automatically creates
    a matching row in the `expenses` table.
    """
    try:
        result = supabase.table("documents").update({
            "status":      "Approved",
            "approved_at": datetime.utcnow().isoformat() + "Z",
        }).eq("id", doc_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Document not found.")

        return {"success": True, "message": "Document approved.", "document_id": doc_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ── Reject ────────────────────────────────────────────────────────────────────
@app.post("/api/reject/{doc_id}")
def reject_document(doc_id: str = Path(...)):
    """Mark a document as Rejected."""
    try:
        result = supabase.table("documents").update({
            "status":      "Rejected",
            "rejected_at": datetime.utcnow().isoformat() + "Z",
        }).eq("id", doc_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Document not found.")

        return {"success": True, "message": "Document rejected.", "document_id": doc_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ── Expenses ──────────────────────────────────────────────────────────────────
@app.get("/api/expenses")
def list_expenses(limit: int = Query(100, ge=1, le=500)):
    """Return all approved expenses from Supabase."""
    try:
        result = (
            supabase.table("expenses")
            .select("*")
            .order("approved_at", desc=True)
            .limit(limit)
            .execute()
        )
        expenses = result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    total = sum(e.get("amount", 0) for e in expenses)
    return {
        "expenses":     expenses,
        "total":        len(expenses),
        "total_amount": round(total, 2),
        "currency":     "GHS",
    }


# ── Reports ───────────────────────────────────────────────────────────────────
@app.get("/api/reports/summary")
def reports_summary():
    """Return a live financial summary from Supabase data."""
    try:
        all_docs = supabase.table("documents").select("status, total_amount, category").execute().data or []
        expenses = supabase.table("expenses").select("amount, category").execute().data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    approved = [d for d in all_docs if d.get("status") == "Approved"]
    pending  = [d for d in all_docs if d.get("status") == "Pending Review"]

    category_totals: dict[str, float] = {}
    for e in expenses:
        cat = e.get("category", "Other")
        category_totals[cat] = round(category_totals.get(cat, 0) + (e.get("amount") or 0), 2)

    return {
        "total_documents":      len(all_docs),
        "approved_count":       len(approved),
        "pending_count":        len(pending),
        "total_approved_amount": round(sum(d.get("total_amount") or 0 for d in approved), 2),
        "total_pending_amount":  round(sum(d.get("total_amount") or 0 for d in pending), 2),
        "currency":             "GHS",
        "category_breakdown":   category_totals,
    }


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
