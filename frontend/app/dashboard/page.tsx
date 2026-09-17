"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Approved':       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Pending Review': 'bg-amber-500/10  text-amber-400  border-amber-500/20',
    'Processed':      'bg-blue-500/10   text-blue-400   border-blue-500/20',
    'Needs Attention':'bg-red-500/10    text-red-400    border-red-500/20',
    'Rejected':       'bg-red-500/10    text-red-400    border-red-500/20',
    'Uploading':      'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }
  const dots: Record<string, string> = {
    'Approved':       'bg-emerald-400',
    'Pending Review': 'bg-amber-400',
    'Processed':      'bg-blue-400',
    'Needs Attention':'bg-red-400',
    'Rejected':       'bg-red-400',
    'Uploading':      'bg-purple-400',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${styles[status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? 'bg-gray-400'}`} />
      {status}
    </span>
  )
}

// AI insights
const AI_INSIGHTS = [
  { type: 'success', msg: 'Dashboard successfully connected to backend.' },
  { type: 'info', msg: 'AI model configured to gemini-2.5-flash.' },
]

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const [recentDocs, setRecentDocs] = useState<any[]>([])
  
  useEffect(() => {
    async function fetchData() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://invoice-ops-bmmg.vercel.app' : 'http://localhost:8000')
        const [sumRes, docsRes] = await Promise.all([
          fetch(`${API_BASE}/api/reports/summary`).then(r => r.json()),
          fetch(`${API_BASE}/api/documents?limit=8`).then(r => r.json())
        ])
        setSummary(sumRes)
        setRecentDocs(docsRes.documents || [])
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8 text-white">Loading dashboard...</div>
  }

  const totalProcessed = summary?.total_documents || 0
  const pendingCount = summary?.pending_count || 0
  const approvedCount = summary?.approved_count || 0
  const rejectedCount = totalProcessed - pendingCount - approvedCount // approximation
  const totalExpenses = summary?.total_approved_amount || 0

  const PIPELINE = [
    { label: 'Uploaded',     count: totalProcessed,  color: 'bg-gray-500',  border: 'border-[#2a2c32]', text: 'text-white' },
    { label: 'Processing',   count: 0,               color: 'bg-gray-600',  border: 'border-[#2a2c32]', text: 'text-white' },
    { label: 'Needs Review', count: pendingCount,    color: 'bg-gray-500',  border: 'border-[#2a2c32]', text: 'text-white' },
    { label: 'Approved',     count: approvedCount,   color: 'bg-white',     border: 'border-[#2a2c32]', text: 'text-white' },
    { label: 'Rejected',     count: rejectedCount,   color: 'bg-gray-600',  border: 'border-[#2a2c32]', text: 'text-white' },
  ]
  
  const pendingApprovalsList = recentDocs.filter(d => d.status === 'Pending Review' || d.status === 'Needs Attention')

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning, Emmanuel 👋</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your invoices, receipts, and business expenses with AI.
          </p>
        </div>
        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/upload"
            className="flex items-center gap-2 bg-[#ff6b8b] hover:bg-[#e85577] text-black text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            Upload Invoice
          </Link>
          <Link href="/dashboard/upload"
            className="flex items-center gap-2 border border-[#23252a] hover:border-[#444] text-gray-300 hover:text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            Upload Receipt
          </Link>
          <Link href="/dashboard/approvals"
            className="flex items-center gap-2 border border-amber-500/30 text-amber-400 hover:bg-amber-500/5 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Review Pending
            {pendingCount > 0 && (
              <span className="bg-amber-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{pendingCount}</span>
            )}
          </Link>
          <Link href="/dashboard/reports"
            className="flex items-center gap-2 border border-[#23252a] hover:border-[#444] text-gray-300 hover:text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Report
          </Link>
        </div>
      </div>

      {/* ── Processing Status Pipeline ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Document Processing Pipeline</h3>
          <span className="text-xs text-gray-500">{totalProcessed} total documents</span>
        </div>
        <div className="flex items-stretch gap-0">
          {PIPELINE.map((p, i) => (
            <div key={p.label} className="flex-1 flex flex-col items-center relative">
              {/* connector line */}
              {i < PIPELINE.length - 1 && (
                <div className="absolute right-0 top-6 w-full h-px bg-[#23252a] -z-0" />
              )}
              <div className={`relative z-10 w-12 h-12 rounded-xl border ${p.border} bg-[#1a1c22] flex items-center justify-center mb-2`}>
                <span className={`text-base font-bold ${p.text}`}>{p.count}</span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${p.color} mb-1.5`} />
              <span className="text-xs text-gray-400 text-center leading-tight">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Summary Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Documents Processed', value: totalProcessed, suffix: '',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
            color: 'text-blue-400', bg: 'bg-blue-500/10', trend: 'Lifetime total',
          },
          {
            label: 'Pending Review', value: pendingCount, suffix: '',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
            color: 'text-amber-400', bg: 'bg-amber-500/10', trend: 'Action needed',
          },
          {
            label: 'Approved Expenses', value: approvedCount, suffix: '',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
            color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: 'Lifetime total',
          },
          {
            label: 'Total Approved Amount', value: `₵${totalExpenses.toLocaleString('en-GH', { minimumFractionDigits: 0 })}`, suffix: '',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
            color: 'text-[#ff6b8b]', bg: 'bg-[#ff6b8b]/10', trend: 'All time',
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">{s.label}</span>
              <span className={`${s.bg} ${s.color} p-2 rounded-lg`}>{s.icon}</span>
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-500">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* ── Main content grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* AI Insights */}
        <div className="lg:col-span-3 rounded-2xl border border-[#23252a] bg-[#0f1115] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff6b8b]/10 text-[#ff6b8b] p-1.5 rounded-lg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </span>
            <h3 className="text-white font-semibold text-sm">AI Insights</h3>
            <span className="ml-auto text-xs bg-[#ff6b8b]/10 text-[#ff6b8b] px-2 py-0.5 rounded-full">{AI_INSIGHTS.length} alerts</span>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {AI_INSIGHTS.map((insight, i) => {
              const icon = {
                warning: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                info:    { color: 'text-blue-400',  bg: 'bg-blue-500/10  border-blue-500/20' },
                alert:   { color: 'text-red-400',   bg: 'bg-red-500/10   border-red-500/20' },
                success: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              }[insight.type] ?? { color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' }

              return (
                <div key={i} className={`flex items-start gap-2.5 rounded-xl border p-3 ${icon.bg}`}>
                  <svg className={`flex-shrink-0 mt-0.5 ${icon.color}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {insight.type === 'success'
                      ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
                      : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
                    }
                  </svg>
                  <p className={`text-xs leading-relaxed ${icon.color}`}>{insight.msg}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Documents ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23252a]">
          <div>
            <h3 className="text-white font-semibold">Recent Documents</h3>
            <p className="text-gray-500 text-xs mt-0.5">Latest invoices and receipts uploaded</p>
          </div>
          <Link href="/dashboard/documents" className="text-xs text-[#ff6b8b] hover:text-white transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1c22]">
                {['Vendor', 'Type', 'Date', 'Amount', 'Category', 'Confidence', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 font-medium px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">No documents found. Upload one to get started!</td>
                </tr>
              ) : (
                recentDocs.map((doc: any) => (
                  <tr key={doc.id} className="border-b border-[#1a1c22] hover:bg-[#1a1c22]/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1a1c22] flex items-center justify-center flex-shrink-0">
                          <span className={`text-[10px] font-bold ${doc.file_type === 'PDF' ? 'text-red-400' : doc.file_type === 'JPG' ? 'text-blue-400' : 'text-green-400'}`}>
                            {doc.file_type || 'PDF'}
                          </span>
                        </div>
                        <span className="text-sm text-white font-medium">{doc.vendor || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{doc.doc_type || 'Invoice'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(doc.date || doc.uploaded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white font-semibold">₵{(doc.total_amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{doc.category || 'Other'}</td>
                    <td className="px-5 py-3.5">
                      {doc.confidence_total !== undefined ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-[#23252a] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${doc.confidence_total >= 95 ? 'bg-emerald-400' : doc.confidence_total >= 85 ? 'bg-amber-400' : 'bg-red-400'}`}
                              style={{ width: `${doc.confidence_total}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${doc.confidence_total >= 95 ? 'text-emerald-400' : doc.confidence_total >= 85 ? 'text-amber-400' : 'text-red-400'}`}>
                            {doc.confidence_total}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={doc.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(doc.status === 'Pending Review' || doc.status === 'Needs Attention') && (
                          <Link href="/dashboard/approvals"
                            className="text-xs text-[#ff6b8b] hover:text-white border border-[#ff6b8b]/30 hover:border-[#ff6b8b] px-2.5 py-1 rounded-lg transition-colors">
                            Review
                          </Link>
                        )}
                        <Link href="/dashboard/documents"
                          className="text-xs text-gray-400 hover:text-white border border-[#23252a] hover:border-gray-500 px-2.5 py-1 rounded-lg transition-colors">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Approval quick-look ─────────────────────────────────────────────── */}
      {pendingApprovalsList.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="text-amber-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <h3 className="text-white font-semibold text-sm">{pendingApprovalsList.length} Documents Awaiting Approval</h3>
            </div>
            <Link href="/dashboard/approvals"
              className="text-xs text-amber-400 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors">
              Review All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingApprovalsList.map((doc: any) => (
              <div key={doc.id} className="rounded-xl border border-[#23252a] bg-[#0f1115] p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium truncate">{doc.vendor || 'Unknown'}</span>
                  <StatusBadge status={doc.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{doc.doc_type || 'Invoice'}</span>
                  <span className="font-semibold text-white">₵{(doc.total_amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{doc.category || 'Other'}</span>
                  <span>{new Date(doc.date || doc.uploaded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
                {doc.confidence_total !== undefined && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-gray-500">AI confidence:</span>
                    <span className={`text-xs font-semibold ${doc.confidence_total >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {doc.confidence_total}%
                    </span>
                  </div>
                )}
                {doc.warnings && doc.warnings.length > 0 && (
                  <div className="text-xs text-amber-400 flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {doc.warnings[0]}
                  </div>
                )}
                <Link href="/dashboard/approvals"
                  className="mt-1 w-full text-center text-xs text-[#ff6b8b] border border-[#ff6b8b]/20 hover:border-[#ff6b8b]/50 py-1.5 rounded-lg transition-colors">
                  Review →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
