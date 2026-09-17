"use client"
import React, { useState } from 'react'
import { MOCK_EXPENSES, MONTHLY_STATS, CATEGORY_STATS, ExpenseRecord, ExpenseCategory } from '@/lib/mockData'

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Approved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Needs Correction': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles[status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      {status}
    </span>
  )
}

const maxBar = Math.max(...MONTHLY_STATS.map(m => m.total))
const totalExpenses = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0)
const approvedTotal = MOCK_EXPENSES.filter(e => e.status === 'Approved').reduce((s, e) => s + e.amount, 0)
const pendingTotal = MOCK_EXPENSES.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0)
const avgExpense = totalExpenses / MOCK_EXPENSES.length

export default function ExpensesPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const filtered = MOCK_EXPENSES.filter((e) => {
    const matchSearch = e.vendor.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || e.category === categoryFilter
    const matchStatus = statusFilter === 'All' || e.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const handleExportCSV = () => {
    const headers = 'Date,Vendor,Description,Category,Amount (GHS),Payment Method,Status\n'
    const rows = filtered.map(e => `${e.date},"${e.vendor}","${e.description}","${e.category}",${e.amount},"${e.paymentMethod}","${e.status}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expenses.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const categories: (ExpenseCategory | 'All')[] = [
    'All', 'Office Supplies', 'Transport', 'Utilities', 'Rent', 'Food & Beverage',
    'Marketing', 'Equipment', 'Professional Services', 'Inventory', 'Other'
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-gray-400 text-sm mt-1">Track and manage all approved and pending business expenses.</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 border border-[#23252a] hover:border-[#ff6b8b]/50 text-gray-300 hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors w-fit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Expenses', value: `₵${totalExpenses.toLocaleString()}`, color: 'text-[#ff6b8b]', bg: 'bg-[#ff6b8b]/10' },
          { label: 'Approved', value: `₵${approvedTotal.toLocaleString()}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Pending', value: `₵${pendingTotal.toLocaleString()}`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Average Expense', value: `₵${avgExpense.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-5">
            <p className="text-xs text-gray-500 font-medium mb-2">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[#23252a] bg-[#0f1115] p-6">
          <h3 className="text-white font-semibold mb-1">Monthly Expenses</h3>
          <p className="text-gray-500 text-xs mb-6">Last 6 months — approved vs pending</p>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY_STATS.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '120px' }}>
                  <div className="w-full rounded-sm bg-amber-400/70" style={{ height: `${(m.pending / maxBar) * 110}px` }} title={`Pending: ₵${m.pending.toLocaleString()}`} />
                  <div className="w-full rounded-sm bg-emerald-400/70" style={{ height: `${(m.approved / maxBar) * 110}px` }} title={`Approved: ₵${m.approved.toLocaleString()}`} />
                </div>
                <span className="text-xs text-gray-500">{m.month}</span>
                <span className="text-xs text-gray-600">₵{(m.total / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-6">
          <h3 className="text-white font-semibold mb-1">By Category</h3>
          <p className="text-gray-500 text-xs mb-4">This month's breakdown</p>
          <div className="flex flex-col gap-3">
            {CATEGORY_STATS.slice(0, 6).map((c) => (
              <div key={c.category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 truncate max-w-[130px]">{c.category}</span>
                  <span className="text-white font-medium">₵{c.amount.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-[#23252a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#ff6b8b]" style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search vendor or description…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#0f1115] border border-[#23252a] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b8b]/50" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as ExpenseCategory | 'All')} className="bg-[#0f1115] border border-[#23252a] rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#ff6b8b]/50">
          {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#0f1115] border border-[#23252a] rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#ff6b8b]/50">
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Needs Correction">Needs Correction</option>
        </select>
      </div>

      {/* Expenses table */}
      <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#23252a]">
                {['Date', 'Vendor', 'Description', 'Category', 'Amount', 'Payment Method', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e: ExpenseRecord) => (
                <tr key={e.id} className="border-b border-[#1a1c22] hover:bg-[#1a1c22]/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">{new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-5 py-4 text-sm text-white font-medium">{e.vendor}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 max-w-xs truncate">{e.description}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{e.category}</td>
                  <td className="px-5 py-4 text-sm text-white font-semibold">₵{e.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{e.paymentMethod}</td>
                  <td className="px-5 py-4"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-500">{filtered.length} expense{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  )
}
