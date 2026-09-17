"use client"
import React from 'react'
import { mockUser, mockSummary, mockAnalysisDetails, mockFinancialHealth } from '@/data/mockData'

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Lender-Ready Reports</h1>
          <p className="text-gray-400">Generate and share your structured financial intelligence report.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#23252a] hover:bg-[#333] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download
          </button>
          <button className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Share Report
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-xl overflow-hidden max-w-4xl mx-auto w-full shadow-2xl">
        
        {/* Report Header */}
        <div className="bg-[#0f1115] text-white p-8 md:p-12 border-b-4 border-[#10b981]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">CreditBridge</h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Financial Intelligence Report</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Date Generated</p>
              <p className="font-medium text-white">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-8 mt-12">
            <div>
              <p className="text-sm text-gray-400 mb-1">Applicant Profile</p>
              <h3 className="text-3xl font-bold mb-2">{mockUser.fullName}</h3>
              <p className="text-gray-300">{mockUser.occupation}</p>
              <p className="text-gray-400 text-sm mt-1">{mockUser.phone} • {mockUser.location}</p>
            </div>
            
            <div className="bg-[#1a1c22] p-6 rounded-xl min-w-[200px] border border-[#23252a]">
              <p className="text-sm text-gray-400 mb-2">Intelligence Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#10b981]">{mockUser.creditScore}</span>
                <span className="text-gray-500">/100</span>
              </div>
              <p className="text-[#10b981] text-sm font-medium mt-1">{mockUser.scoreDescription}</p>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-8 md:p-12 bg-[#fafafa]">
          
          {/* Financial Summary */}
          <div className="mb-10">
            <h4 className="text-black font-bold uppercase tracking-wider text-sm border-b border-gray-200 pb-2 mb-4">Monthly Financial Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Income</p>
                <p className="text-xl font-bold text-black">₵{mockSummary.totalIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Expenses</p>
                <p className="text-xl font-bold text-black">₵{mockSummary.totalExpenses.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Savings Rate</p>
                <p className="text-xl font-bold text-black">{mockAnalysisDetails.savingsRate}</p>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="mb-10">
            <h4 className="text-black font-bold uppercase tracking-wider text-sm border-b border-gray-200 pb-2 mb-4">Risk & Stability Metrics</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Income Stability</span>
                <span className="text-sm font-bold text-[#059669]">{mockFinancialHealth.incomeStability.value}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cash-Flow Risk</span>
                <span className="text-sm font-bold text-[#059669]">{mockAnalysisDetails.cashFlowStability}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expense Management</span>
                <span className="text-sm font-bold text-[#059669]">{mockFinancialHealth.expenseManagement.value}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Debt/Obligations</span>
                <span className="text-sm font-bold text-gray-900">{mockAnalysisDetails.debtIndicators}</span>
              </div>
            </div>
          </div>

          {/* AI Assessment Summary */}
          <div className="mb-6">
            <h4 className="text-black font-bold uppercase tracking-wider text-sm border-b border-gray-200 pb-2 mb-4">AI Assessment Summary</h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Based on transaction analysis and voice assessment, the applicant demonstrates consistent business income. Savings behaviour is regular, though discretionary expenses constitute a notable portion of outgoings. Cash flow remains positive month-over-month.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-800 font-medium italic">
                &quot;The applicant seeks financing to expand inventory for the upcoming holiday season. Transaction history supports the capacity to service the requested loan amount within standard terms.&quot;
              </p>
            </div>
          </div>

        </div>
        
        <div className="bg-white p-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">Powered by CreditBridge Intelligence API</p>
        </div>
      </div>
      
    </div>
  )
}
