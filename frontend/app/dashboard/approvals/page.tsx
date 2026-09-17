"use client"
import React, { useState, useEffect } from 'react'
import { PENDING_APPROVALS, FinancialDocument, ExpenseCategory } from '@/lib/mockData'

const CATEGORIES: ExpenseCategory[] = [
  'Office Supplies', 'Transport', 'Utilities', 'Rent', 'Food & Beverage',
  'Marketing', 'Equipment', 'Professional Services', 'Inventory', 'Other'
]

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  const color = value >= 95 ? 'bg-emerald-400' : value >= 85 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className={`font-semibold ${value >= 95 ? 'text-emerald-400' : value >= 85 ? 'text-amber-400' : 'text-red-400'}`}>{value}%</span>
      </div>
      <div className="h-1.5 bg-[#23252a] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function ApprovalsPage() {
  const [queue, setQueue] = useState<FinancialDocument[]>(PENDING_APPROVALS)
  const [selected, setSelected] = useState<FinancialDocument | null>(queue[0] ?? null)
  const [editedCategory, setEditedCategory] = useState<ExpenseCategory>(queue[0]?.category ?? 'Other')
  const [editedTotal, setEditedTotal] = useState<string>(queue[0]?.amount.toString() ?? '0')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'reject' } | null>(null)

  // Fetch pending documents from backend
  useEffect(() => {
    async function fetchPending() {
      try {
        const API_BASE = process.env.NODE_ENV === 'production' ? 'https://invoice-ops-bmmg.vercel.app' : 'http://localhost:8000'
        const res = await fetch(`${API_BASE}/api/documents?limit=50`)
        const data = await res.json()
        const docs = data.documents || []
        
        const pendingDocs = docs.filter((d: any) => d.status === 'Pending Review' || d.status === 'Needs Attention')
        
        const mappedDocs: FinancialDocument[] = pendingDocs.map((d: any) => ({
          id: d.id,
          vendor: d.vendor || 'Unknown',
          type: (d.doc_type || 'Invoice') as FinancialDocument['type'],
          amount: d.total_amount || 0,
          currency: (d.currency || 'GHS'),
          date: d.date || d.uploaded_at,
          category: (d.category || 'Other') as ExpenseCategory,
          status: d.status,
          invoiceNumber: d.invoice_number,
          taxAmount: d.tax_amount,
          subtotal: d.subtotal,
          paymentMethod: (d.payment_method || 'Other') as FinancialDocument['paymentMethod'],
          fileName: d.file_name || 'unknown_file',
          fileType: ((d.file_type || 'PDF').toUpperCase() === 'PDF' ? 'PDF' : 'JPG') as FinancialDocument['fileType'],
          uploadedAt: d.uploaded_at,
          aiConfidence: {
            vendor: d.confidence_vendor || 0,
            date: d.confidence_date || 0,
            total: d.confidence_total || 0,
            category: d.confidence_category || 0,
          },
          warnings: d.warnings || [],
        }))

        setQueue(mappedDocs)
        if (mappedDocs.length > 0) {
          setSelected(mappedDocs[0])
          setEditedCategory(mappedDocs[0].category)
          setEditedTotal(mappedDocs[0].amount.toString())
        } else {
          setSelected(null)
        }
      } catch (err) {
        console.error("Failed to fetch pending documents", err)
      }
    }
    fetchPending()
  }, [])

  const showToast = (msg: string, type: 'success' | 'reject') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleSelect = (doc: FinancialDocument) => {
    setSelected(doc)
    setEditedCategory(doc.category)
    setEditedTotal(doc.amount.toString())
  }

  const removeFromQueue = async (id: string, action: 'approve' | 'reject' | 'correct') => {
    try {
      const API_BASE = process.env.NODE_ENV === 'production' ? 'https://invoice-ops-bmmg.vercel.app' : 'http://localhost:8000'
      if (action === 'approve') {
        await fetch(`${API_BASE}/api/approve/${id}`, { method: 'POST' })
      } else if (action === 'reject') {
        await fetch(`${API_BASE}/api/reject/${id}`, { method: 'POST' })
      }
    } catch (e) {
      console.error("Backend update failed", e)
    }

    const remaining = queue.filter(d => d.id !== id)
    setQueue(remaining)
    const next = remaining[0] ?? null
    setSelected(next)
    if (next) {
      setEditedCategory(next.category)
      setEditedTotal(next.amount.toString())
    }
    
    // Also remove from localStorage if it exists
    try {
      const stored = JSON.parse(localStorage.getItem('invoiceops_uploads') ?? '[]')
      const updated = stored.filter((d: any) => d.id !== id)
      localStorage.setItem('invoiceops_uploads', JSON.stringify(updated))
    } catch (e) {}

    const msgs = { approve: 'Document approved ✓', reject: 'Document rejected', correct: 'Sent back for correction' }
    const types: Record<string, 'success' | 'reject'> = { approve: 'success', reject: 'reject', correct: 'reject' }
    showToast(msgs[action], types[action])
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Approvals</h1>
        <p className="text-gray-400 text-sm mt-1">Review AI-extracted data and approve or reject each document.</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all
          ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {queue.length === 0 ? (
        <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] flex flex-col items-center justify-center py-24 gap-4">
          <svg className="text-emerald-400" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div className="text-center">
            <p className="text-white font-semibold text-lg">All caught up!</p>
            <p className="text-gray-500 text-sm mt-1">No documents are waiting for review.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Queue list */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider px-1">{queue.length} document{queue.length !== 1 ? 's' : ''} pending</p>
            {queue.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSelect(doc)}
                className={`text-left rounded-xl border p-4 transition-all ${selected?.id === doc.id ? 'border-[#ff6b8b]/50 bg-[#ff6b8b]/5' : 'border-[#23252a] bg-[#0f1115] hover:border-[#333]'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white font-medium">{doc.vendor}</span>
                  <span className="text-xs text-gray-500">{doc.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{new Date(doc.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  <span className="text-sm font-semibold text-white">₵{doc.amount.toLocaleString()}</span>
                </div>
                {doc.warnings && doc.warnings.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {doc.warnings.length} warning{doc.warnings.length !== 1 ? 's' : ''}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Review panel */}
          {selected && (
            <div className="lg:col-span-2 rounded-2xl border border-[#23252a] bg-[#0f1115] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#23252a] flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold">{selected.vendor}</h2>
                  <p className="text-gray-500 text-xs mt-0.5">{selected.fileName} · {selected.fileType}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400">Pending Review</span>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {/* Warnings */}
                {selected.warnings && selected.warnings.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {selected.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                        <svg className="text-amber-400 flex-shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p className="text-amber-300 text-xs">{w}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Editable fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Vendor Name', value: selected.vendor },
                    { label: 'Invoice Number', value: selected.invoiceNumber ?? '—' },
                    { label: 'Date', value: selected.date },
                    { label: 'Currency', value: selected.currency },
                    { label: 'Subtotal', value: selected.subtotal ? `₵${selected.subtotal.toLocaleString()}` : '—' },
                    { label: 'Tax', value: selected.taxAmount !== undefined ? `₵${selected.taxAmount.toLocaleString()}` : '—' },
                    { label: 'Payment Method', value: selected.paymentMethod },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs text-gray-500 font-medium">{f.label}</label>
                      <input
                        defaultValue={f.value}
                        className="mt-1 w-full bg-[#1a1c22] border border-[#23252a] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b8b]/50"
                      />
                    </div>
                  ))}

                  {/* Editable total */}
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Total Amount (GHS)</label>
                    <input
                      type="number"
                      value={editedTotal}
                      onChange={(e) => setEditedTotal(e.target.value)}
                      className="mt-1 w-full bg-[#1a1c22] border border-[#ff6b8b]/30 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b8b]"
                    />
                  </div>

                  {/* Editable category */}
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Expense Category</label>
                    <select
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value as ExpenseCategory)}
                      className="mt-1 w-full bg-[#1a1c22] border border-[#ff6b8b]/30 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b8b]"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* AI Confidence */}
                {selected.aiConfidence && (
                  <div className="border border-[#23252a] rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="text-[#ff6b8b]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">AI Confidence</p>
                    </div>
                    <ConfidenceBar label="Vendor Name" value={selected.aiConfidence.vendor} />
                    <ConfidenceBar label="Invoice Date" value={selected.aiConfidence.date} />
                    <ConfidenceBar label="Total Amount" value={selected.aiConfidence.total} />
                    <ConfidenceBar label="Category" value={selected.aiConfidence.category} />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => removeFromQueue(selected.id, 'approve')}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Approve
                  </button>
                  <button
                    onClick={() => removeFromQueue(selected.id, 'correct')}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#23252a] hover:border-amber-500/40 text-amber-400 hover:text-amber-300 text-sm font-medium px-5 py-3 rounded-xl transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Send for Correction
                  </button>
                  <button
                    onClick={() => removeFromQueue(selected.id, 'reject')}
                    className="flex-1 flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-300 text-sm font-medium px-5 py-3 rounded-xl transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
