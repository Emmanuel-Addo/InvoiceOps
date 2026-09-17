"use client"
import React, { useEffect, useState } from 'react'

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const API_BASE = process.env.NODE_ENV === 'production' ? 'https://invoice-ops-bmmg.vercel.app' : 'http://localhost:8000'
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
  const pendingCount = summary?.pending_count || 0
  const approvedCount = summary?.approved_count || 0
  const totalExpenses = summary?.total_approved_amount || 0

  const handleExportCSV = () => {
    const headers = 'Vendor,Type,Date,Amount (GHS),Category,Status\n'
    const rows = documents.map(d => `"${d.vendor || 'Unknown'}","${d.doc_type || 'Invoice'}","${d.date || d.uploaded_at}",${d.total_amount || 0},"${d.category || 'Other'}","${d.status}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'invoiceops_report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate category stats safely
  const categoryStats = Object.entries(summary?.category_breakdown || {}).map(([category, amount]: [string, any]) => {
    return { category, amount, count: documents.filter(d => d.category === category).length, percentage: totalExpenses ? Math.round((amount / totalExpenses) * 100) : 0 }
  }).sort((a, b) => b.amount - a.amount)

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
          <button className="flex items-center gap-2 bg-[#ff6b8b] hover:bg-[#e85577] text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Approved Expenses', value: `₵${totalExpenses.toLocaleString()}`, sub: 'All time', color: 'text-[#ff6b8b]' },
          { label: 'Approved Documents', value: approvedCount.toString(), sub: `Approved`, color: 'text-emerald-400' },
          { label: 'Pending Review', value: pendingCount.toString(), sub: 'Awaiting action', color: 'text-amber-400' },
          { label: 'Documents Total', value: totalProcessed.toString(), sub: 'Total uploaded', color: 'text-blue-400' },
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
        {/* Category breakdown */}
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

        {/* Top vendors */}
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
    </div>
  )
}
