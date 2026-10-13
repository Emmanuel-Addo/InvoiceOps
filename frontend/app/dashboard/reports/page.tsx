"use client"
import React, { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://invoice-ops-bmmg.vercel.app' : 'http://localhost:8000')

// Simple markdown-to-HTML renderer for headings, bold, bullets
function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-6 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-[#ff6b8b] mt-4 mb-1">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="text-gray-300 text-sm ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-gray-300 text-sm ml-4 list-decimal">$2</li>')
    .replace(/^(?!<[hlsi]).+$/gm, (line) => line.trim() ? `<p class="text-gray-300 text-sm leading-relaxed">${line}</p>` : '')
    .replace(/---/g, '<hr class="border-[#23252a] my-4" />')
}

export default function ReportsPage() {
  const [loading, setLoading]           = useState(true)
  const [summary, setSummary]           = useState<any>(null)
  const [documents, setDocuments]       = useState<any[]>([])
  const [generating, setGenerating]     = useState(false)
  const [reportContent, setReportContent] = useState<string | null>(null)
  const [reportDate, setReportDate]     = useState<string | null>(null)
  const [showModal, setShowModal]       = useState(false)
  const [genError, setGenError]         = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [sumRes, docsRes] = await Promise.all([
          fetch(`${API_BASE}/api/reports/summary`).then(r => r.json()),
          fetch(`${API_BASE}/api/documents?limit=100`).then(r => r.json())
        ])
        setSummary(sumRes)
        setDocuments(docsRes.documents || [])
      } catch (err) {
        console.error("Failed to load reports data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8 text-white">Loading reports...</div>
  }

  const totalProcessed = summary?.total_documents || 0
  const pendingCount   = summary?.pending_count || 0
  const approvedCount  = summary?.approved_count || 0
  const totalExpenses  = summary?.total_approved_amount || 0

  const handleExportCSV = () => {
    const headers = 'Vendor,Type,Date,Amount (GHS),Category,Status\n'
    const rows = documents.map(d =>
      `"${d.vendor || 'Unknown'}","${d.doc_type || 'Invoice'}","${d.date || d.uploaded_at}",${d.total_amount || 0},"${d.category || 'Other'}","${d.status}"`
    ).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'invoiceops_report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGenerateReport = async () => {
    setGenerating(true)
    setGenError(null)
    try {
      const res = await fetch(`${API_BASE}/api/reports/generate`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to generate report')
      }
      const data = await res.json()
      setReportContent(data.report)
      setReportDate(new Date(data.generated_at).toLocaleString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }))
      setShowModal(true)
    } catch (e: any) {
      setGenError(e.message || 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadReport = () => {
    if (!reportContent) return
    const header = `INVOICEOPS FINANCIAL REPORT\nGenerated: ${reportDate}\n${'='.repeat(60)}\n\n`
    const blob = new Blob([header + reportContent], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `invoiceops_report_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = () => {
    if (!reportContent) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>InvoiceOps Financial Report</title>
        <style>
          body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; color: #111; line-height: 1.7; }
          h1 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h2 { font-size: 18px; color: #222; margin-top: 28px; }
          h3 { font-size: 15px; color: #444; }
          p  { font-size: 14px; }
          li { font-size: 14px; margin: 4px 0; }
          .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
          hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <h1>InvoiceOps — Financial Report</h1>
        <p class="meta">Generated: ${reportDate}</p>
        <hr/>
        ${reportContent
          .replace(/^## (.+)$/gm, '<h2>$1</h2>')
          .replace(/^### (.+)$/gm, '<h3>$1</h3>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/^- (.+)$/gm, '<li>$1</li>')
          .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
          .replace(/---/g, '<hr/>')
          .replace(/^(?!<[hlip]).+$/gm, (l) => l.trim() ? `<p>${l}</p>` : '')
        }
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => { printWindow.print() }, 500)
  }

  const categoryStats = Object.entries(summary?.category_breakdown || {}).map(([category, amount]: [string, any]) => ({
    category, amount,
    count: documents.filter(d => d.category === category).length,
    percentage: totalExpenses ? Math.round((amount / totalExpenses) * 100) : 0
  })).sort((a, b) => b.amount - a.amount)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Financial summary, trends, and export options.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 border border-[#23252a] hover:border-[#ff6b8b]/50 text-gray-300 hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="flex items-center gap-2 bg-[#ff6b8b] hover:bg-[#e85577] disabled:opacity-60 disabled:cursor-not-allowed text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {generating ? (
              <>
                <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Generating...
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {genError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          ⚠ {genError}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Approved Expenses', value: `₵${totalExpenses.toLocaleString()}`, sub: 'All time',        color: 'text-[#ff6b8b]'  },
          { label: 'Approved Documents',      value: approvedCount.toString(),              sub: 'Approved',         color: 'text-emerald-400' },
          { label: 'Pending Review',           value: pendingCount.toString(),               sub: 'Awaiting action',  color: 'text-amber-400'   },
          { label: 'Documents Total',          value: totalProcessed.toString(),             sub: 'Total uploaded',   color: 'text-blue-400'    },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-5">
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
            <p className="text-xs text-gray-600">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Category + Vendor breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-6">
          <h3 className="text-white font-semibold mb-1">Expense by Category</h3>
          <p className="text-gray-500 text-xs mb-5">Current period breakdown</p>
          <div className="flex flex-col gap-4">
            {categoryStats.length === 0 ? <p className="text-gray-500 text-sm">No expenses found.</p> : null}
            {categoryStats.map((c) => (
              <div key={c.category}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300">{c.category}</span>
                  <div className="flex gap-3">
                    <span className="text-gray-500">{c.count} docs</span>
                    <span className="text-white font-semibold">₵{(c.amount || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 bg-[#23252a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#ff6b8b]" style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-6">
          <h3 className="text-white font-semibold mb-1">Top Vendors</h3>
          <p className="text-gray-500 text-xs mb-5">Highest spend this period</p>
          <div className="flex flex-col gap-3">
            {documents.length === 0 ? <p className="text-gray-500 text-sm">No documents found.</p> : null}
            {documents
              .filter(d => d.total_amount > 0)
              .sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0))
              .slice(0, 7)
              .map((doc, i) => (
                <div key={doc.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-4 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300 truncate">{doc.vendor || 'Unknown'}</span>
                      <span className="text-white font-semibold ml-2">₵{(doc.total_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-[#23252a] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff6b8b] to-[#e85577]"
                        style={{ width: `${((doc.total_amount || 0) / (documents[0].total_amount || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ── Report Modal ── */}
      {showModal && reportContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-[#23252a] bg-[#0f1115] shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#23252a] flex-shrink-0">
              <div>
                <h2 className="text-white font-bold text-lg">AI Financial Report</h2>
                <p className="text-gray-500 text-xs mt-0.5">Generated {reportDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center gap-1.5 border border-[#23252a] hover:border-[#ff6b8b]/50 text-gray-300 hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download .txt
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 bg-[#ff6b8b] hover:bg-[#e85577] text-black text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Download PDF
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="ml-1 text-gray-500 hover:text-white transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Report content */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(reportContent) }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
