# InvoiceOps — AI Invoice & Expense Assistant

**Automate your business expenses with AI document understanding, OCR, and human-in-the-loop approvals.**

[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4?logo=google)](https://ai.google.dev)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com)

---

## The Problem

Businesses manually process large numbers of invoices, receipts, and expenses. This creates massive administrative overhead, leads to poor record-keeping, and slows down accounting teams with repetitive data entry.

## The Solution

InvoiceOps is an AI-powered Invoice & Expense Operations platform that automates financial document processing end-to-end.

It helps finance teams by:
1. **Reading** invoices and receipts using AI-powered OCR (Google Gemini Vision).
2. **Extracting** structured financial information (Vendor, Amount, Tax, Date, Category, Payment Method).
3. **Categorising** expenses automatically with confidence scores.
4. **Detecting** anomalies (missing fields, unusual amounts) and flagging them for review.
5. **Enabling** humans to review, correct, and approve extracted records in a beautiful UI.
6. **Storing** all approved records in a persistent Supabase database.
7. **Exporting** approved records to CSV.

---

## Features

- **Document Upload**: Drag-and-drop interface for PDFs, JPGs, PNGs, HEIC, and WEBP files (up to 20MB).
- **AI Extraction**: Powered by Google Gemini 2.5 Flash — reads the document and extracts all key fields with confidence scores.
- **Human-in-the-loop Approvals**: A review queue where humans can verify, correct, and approve AI-extracted data before it is stored.
- **Expense Dashboard**: Visualise total spending, vendor distribution, category breakdowns, and document pipeline status.
- **Documents Page**: Full searchable, filterable list of all uploaded documents and their statuses.
- **Reports**: Monthly financial summaries with expense breakdowns.
- **Secure Database**: All approved data is persisted in Supabase (PostgreSQL).

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- **Styling**: Tailwind CSS with custom dark theme
- **Deployment**: [Vercel](https://vercel.com)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com) (Python)
- **AI Model**: [Google Gemini 2.5 Flash](https://ai.google.dev) — multimodal document understanding
- **PDF Processing**: PyMuPDF (fitz) — converts PDF pages to images for AI vision
- **Deployment**: [Vercel](https://vercel.com) (serverless Python)

### Database & Auth
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Auth**: Supabase Auth
- **Triggers**: Supabase database trigger automatically creates an `expenses` record whenever a document is approved

---

## Architecture

```
User uploads invoice (PDF/Image)
        │
        ▼
Next.js Frontend (localhost:3000 / Vercel)
        │  POST /api/upload-document
        ▼
FastAPI Backend (localhost:8000 / Vercel)
        │
        ├── Google Gemini 2.5 Flash  ← AI extraction
        │
        └── Supabase (documents table)
                │
                ▼  (on approval)
        Supabase Trigger → expenses table
                │
                ▼
        Dashboard pages read live data
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (for Gemini)

### 1. Clone the repository

```bash
git clone https://github.com/Emmanuel-Addo/InvoiceOps.git
cd InvoiceOps
```

### 2. Set up the Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor.
2. Copy the contents of `backend/supabase_schema.sql` and run it.
3. This creates the `documents` and `expenses` tables, and the auto-approval trigger.

### 3. Set up the Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Run the backend:
```bash
uvicorn main:app --reload
```

### 4. Set up the Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the frontend:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Deployment

- **Frontend**: Connect the GitHub repo to Vercel. Set Root Directory to `frontend`. Add environment variables.
- **Backend**: Connect the GitHub repo to Vercel. Set Root Directory to `backend`. Add environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`).

---

## License

MIT
