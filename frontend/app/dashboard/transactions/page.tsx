"use client"
import React, { useState } from 'react'
import { mockTransactions } from '@/data/mockData'

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = Array.from(new Set(mockTransactions.map(t => t.category)));

  // Calculate mock stats
  const totalIncome = mockTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = mockTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || t.type === filterType;
    const matchCat = filterCategory === 'all' || t.category === filterCategory;
    return matchSearch && matchType && matchCat;
  });

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
        <p className="text-gray-400">Manage your transaction history and import new data.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-[#13151a] border border-[#23252a] border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#1a1c22] rounded-full flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Upload Transaction Data</h3>
        <p className="text-sm text-gray-400 max-w-md mb-6">
          Upload your Mobile Money or bank transaction history in CSV format. 
          This data will be used to generate your Credit Intelligence Profile.
        </p>
        <button className="bg-white text-black hover:bg-gray-200 transition-colors font-semibold text-sm px-6 py-2.5 rounded-xl">
          Select CSV File
        </button>
        <p className="text-xs text-gray-500 mt-4">or drag and drop your file here</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6">
          <h3 className="text-sm text-gray-400 font-medium mb-2">Total Income (Mock Data)</h3>
          <p className="text-3xl font-bold text-[#10b981]">₵{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6">
          <h3 className="text-sm text-gray-400 font-medium mb-2">Total Expenses (Mock Data)</h3>
          <p className="text-3xl font-bold text-[#ff6b8b]">₵{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6">
          <h3 className="text-sm text-gray-400 font-medium mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-white">{mockTransactions.length}</p>
        </div>
      </div>

      {/* Data Table & Filters */}
      <div className="bg-[#13151a] border border-[#23252a] rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#23252a] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#1a1c22]/50">
          <div className="relative w-full md:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#23252a] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#0a0a0c] border border-[#23252a] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-gray-500 appearance-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#0a0a0c] border border-[#23252a] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-gray-500 appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button className="bg-[#23252a] hover:bg-[#333] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              More Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#23252a] text-xs font-medium text-gray-500 uppercase tracking-wider bg-[#1a1c22]/20">
                <th className="py-4 px-6 whitespace-nowrap">Date</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? filteredTransactions.map((tx, i) => (
                <tr key={i} className="border-b border-[#23252a]/50 hover:bg-[#1a1c22] transition-colors group">
                  <td className="py-4 px-6 text-sm text-gray-400 whitespace-nowrap">{tx.date}</td>
                  <td className="py-4 px-6 text-sm text-gray-100 font-medium">{tx.description}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${tx.type === 'income' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#ff6b8b]/10 text-[#ff6b8b]'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">{tx.category}</td>
                  <td className={`py-4 px-6 text-sm font-bold text-right whitespace-nowrap ${tx.type === 'income' ? 'text-[#10b981]' : 'text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'}₵{tx.amount.toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 text-sm">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
