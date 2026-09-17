"use client"
import React from 'react'
import { MOCK_DOCUMENTS, MONTHLY_STATS, CATEGORY_STATS } from '@/lib/mockData'

const maxBar = Math.max(...MONTHLY_STATS.map(m => m.total))

export default function ReportsPage() {
  const totalExpenses = MOCK_DOCUMENTS.reduce((s, d) => s + d.amount, 0)
  const approvedDocs = MOCK_DOCUMENTS.filter(d => d.status === 'Approved')
  const pendingDocs = MOCK_DOCUMENTS.filter(d => d.status === 'Pending Review' || d.status === 'Needs Attention')
  const approvedTotal = approvedDocs.reduce((s, d) => s + d.amount, 0)

  const handleExportCSV = () => {
    const headers = 'Vendor,Type,Date,Amount (GHS),Category,Status\n'
    const rows = MOCK_DOCUMENTS.map(d => `"${d.vendor}","${d.type}","${d.date}",${d.amount},"${d.category}","${d.status}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'invoiceops_report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

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
          { label: 'Total Expenses', value: `₵${totalExpenses.toLocaleString()}`, sub: 'All documents', color: 'text-[#ff6b8b]' },
          { label: 'Approved Amount', value: `₵${approvedTotal.toLocaleString()}`, sub: `${approvedDocs.length} documents`, color: 'text-emerald-400' },
          { label: 'Pending Review', value: pendingDocs.length.toString(), sub: 'Awaiting action', color: 'text-amber-400' },
          { label: 'Documents Total', value: MOCK_DOCUMENTS.length.toString(), sub: 'This period', color: 'text-blue-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-5">
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
            <p className="text-xs text-gray-600">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly trend chart */}
      <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold">Monthly Expense Trend</h3>
            <p className="text-gray-500 text-xs mt-0.5">Last 6 months comparison</p>
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ff6b8b]" />Total</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />Approved</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />Pending</span>
          </div>
        </div>
        <div className="flex items-end gap-4 h-48">
          {MONTHLY_STATS.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '160px' }}>
                <div className="w-full rounded-t-sm bg-amber-400/70" style={{ height: `${(m.pending / maxBar) * 150}px` }} />
                <div className="w-full rounded-sm bg-emerald-400/70" style={{ height: `${(m.approved / maxBar) * 150}px` }} />
              </div>
              <span className="text-xs text-gray-500">{m.month}</span>
              <span className="text-xs text-gray-600 font-medium">₵{(m.total / 1000).toFixed(1)}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category + Vendor breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-6">
          <h3 className="text-white font-semibold mb-1">Expense by Category</h3>
          <p className="text-gray-500 text-xs mb-5">Current period breakdown</p>
          <div className="flex flex-col gap-4">
            {CATEGORY_STATS.map((c) => (
              <div key={c.category}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300">{c.category}</span>
                  <div className="flex gap-3">
                    <span className="text-gray-500">{c.count} docs</span>
                    <span className="text-white font-semibold">₵{c.amount.toLocaleString()}</span>
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
            {MOCK_DOCUMENTS
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 7)
              .map((doc, i) => (
                <div key={doc.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-4 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300 truncate">{doc.vendor}</span>
                      <span className="text-white font-semibold ml-2">₵{doc.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-[#23252a] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff6b8b] to-[#e85577]"
                        style={{ width: `${(doc.amount / MOCK_DOCUMENTS[0].amount) * 100}%` }}
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
