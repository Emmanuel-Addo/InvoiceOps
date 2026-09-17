"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Approved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Pending Review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Processed': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Needs Attention': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles[status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      {status}
    </span>
  )
}

const FILE_ICON = (type: string) => {
  const color = type === 'PDF' ? 'text-red-400' : type === 'JPG' || type === 'JPEG' ? 'text-blue-400' : 'text-green-400'
  return (
    <span className={`text-xs font-bold ${color} bg-[#1a1c22] px-1.5 py-0.5 rounded`}>{type}</span>
  )
}

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const API_BASE = process.env.NODE_ENV === 'production' ? 'https://invoice-ops-bmmg.vercel.app' : 'http://localhost:8000'
        const res = await fetch(`${API_BASE}/api/documents?limit=1000`)
        const data = await res.json()
        setDocuments(data.documents || [])
      } catch (err) {
        console.error("Failed to load documents data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  if (loading) {
    return <div className="p-8 text-white">Loading documents...</div>
  }

  const filtered = documents
    .filter((d) => {
      const matchSearch = (d.vendor || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.invoice_number || '').toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'All' || d.doc_type === typeFilter
      const matchStatus = statusFilter === 'All' || d.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
    .sort((a, b) => {
      const diff = new Date(b.date || b.uploaded_at).getTime() - new Date(a.date || a.uploaded_at).getTime()
      return sortOrder === 'newest' ? diff : -diff
    })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="text-gray-400 text-sm mt-1">All uploaded invoices and receipts in one place.</p>
        </div>
        <Link href="/dashboard/upload" className="flex items-center gap-2 bg-[#ff6b8b] hover:bg-[#e85577] text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors w-fit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Upload New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search vendor or invoice number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f1115] border border-[#23252a] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b8b]/50"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#0f1115] border border-[#23252a] rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#ff6b8b]/50"
        >
          <option value="All">All Types</option>
          <option value="Invoice">Invoice</option>
          <option value="Receipt">Receipt</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0f1115] border border-[#23252a] rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#ff6b8b]/50"
        >
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Needs Attention">Needs Attention</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="bg-[#0f1115] border border-[#23252a] rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#ff6b8b]/50"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <svg className="text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div className="text-center">
              <p className="text-white font-medium">No documents found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or upload a new document.</p>
            </div>
            <Link href="/dashboard/upload" className="text-sm text-[#ff6b8b] hover:underline">Upload a document →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#23252a]">
                  {['Document', 'Vendor', 'Type', 'Amount', 'Date', 'Category', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-500 font-medium px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc: any) => (
                  <tr key={doc.id} className="border-b border-[#1a1c22] hover:bg-[#1a1c22]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {FILE_ICON(doc.file_type || 'PDF')}
                        <span className="text-xs text-gray-400 max-w-[120px] truncate">{doc.file_name || 'unknown_file'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white font-medium">{doc.vendor || 'Unknown'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{doc.doc_type || 'Invoice'}</td>
                    <td className="px-5 py-4 text-sm text-white font-medium">₵{(doc.total_amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{new Date(doc.date || doc.uploaded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{doc.category || 'Other'}</td>
                    <td className="px-5 py-4"><StatusBadge status={doc.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/approvals`} className="text-xs text-gray-400 hover:text-white transition-colors px-2.5 py-1 rounded-lg border border-[#23252a] hover:border-gray-500">
                          Review
                        </Link>
                        {/* 
                        <button className="text-xs text-red-400 hover:text-red-300 transition-colors px-2.5 py-1 rounded-lg border border-[#23252a] hover:border-red-500/50">
                          Delete
                        </button>
                        */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row count */}
      <p className="text-xs text-gray-500">{filtered.length} document{filtered.length !== 1 ? 's' : ''} found</p>
    </div>
  )
}
