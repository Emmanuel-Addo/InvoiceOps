# AI Invoice & Expense Assistant

**Automate your business expenses with AI OCR, Document Understanding, and Human-in-the-loop Approvals.**

## The Problem

Businesses manually process large numbers of invoices, receipts, and expenses. This creates massive administrative overhead, leads to poor record-keeping, and slows down accounting teams with repetitive data entry.

## The Solution

This platform is an AI-powered Invoice & Expense Operations Assistant that automates the processing of financial documents. 

It helps finance teams by:
1. **Reading** invoices and receipts using OCR.
2. **Extracting** structured financial information (Vendor, Amount, Tax, Date).
3. **Categorising** expenses automatically.
4. **Detecting** anomalies (missing fields, unusual amounts).
5. **Enabling** humans to review and approve extracted records in a beautiful UI.
6. **Exporting** approved records to CSV or accounting software.

## Features

- **Document Upload**: Drag-and-drop interface for PDFs, JPGs, and PNGs.
- **AI Extraction Queue**: A "human-in-the-loop" review queue where AI extracts fields and assigns a confidence score, but a human approves it.
- **Expense Dashboard**: Visualise monthly spending, vendor distribution, and category breakdowns.
- **Secure Authentication**: Protected by Supabase Auth.

## Tech Stack

- **Frontend**: Next.js, App Router, TypeScript, Tailwind CSS
- **Authentication**: Supabase
- **UI Components**: Reusable Tailwind components with inline SVGs

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
