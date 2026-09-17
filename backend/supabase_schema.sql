-- Schema for CreditBridge/InvoiceOps

-- 1. Create Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY,
    filename TEXT,
    file_type TEXT,
    file_size BIGINT,
    doc_type TEXT,
    status TEXT DEFAULT 'Pending Review',
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    
    -- AI Extraction fields
    vendor TEXT,
    invoice_number TEXT,
    date DATE,
    currency TEXT,
    subtotal NUMERIC,
    tax_amount NUMERIC,
    total_amount NUMERIC,
    category TEXT,
    payment_method TEXT,
    
    -- Confidence scores
    confidence_vendor NUMERIC,
    confidence_date NUMERIC,
    confidence_total NUMERIC,
    confidence_category NUMERIC,
    
    -- Warnings (stored as JSON array)
    warnings JSONB DEFAULT '[]'::jsonb
);

-- 2. Create Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    vendor TEXT,
    amount NUMERIC,
    category TEXT,
    date DATE,
    payment_method TEXT,
    approved_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Trigger Function for Approval
CREATE OR REPLACE FUNCTION public.on_document_approved()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger when status changes to 'Approved'
    IF NEW.status = 'Approved' AND OLD.status != 'Approved' THEN
        INSERT INTO public.expenses (
            document_id,
            vendor,
            amount,
            category,
            date,
            payment_method,
            approved_at
        ) VALUES (
            NEW.id,
            NEW.vendor,
            NEW.total_amount,
            NEW.category,
            NEW.date,
            NEW.payment_method,
            NEW.approved_at
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach Trigger to Documents Table
DROP TRIGGER IF EXISTS document_approval_trigger ON public.documents;
CREATE TRIGGER document_approval_trigger
    AFTER UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.on_document_approved();
