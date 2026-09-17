"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { mockAnalysisDetails } from '@/data/mockData'
import AIInsights from '@/components/dashboard/AIInsights'
import { loadProfile, CreditProfile } from '@/lib/api'

export default function AnalysisPage() {
  const [realProfile, setRealProfile] = useState<CreditProfile | null>(null)

  useEffect(() => {
    setRealProfile(loadProfile())
  }, [])

  const isReal = realProfile !== null
  const analysis = isReal ? realProfile.analysis : mockAnalysisDetails
  const aiText = isReal
    ? realProfile.ai_insights.overview
    : "Your income has remained consistent, mostly driven by daily shop sales. Your largest expense category is Housing, which accounts for over half of your monthly outgoing. Your savings rate is healthy, but could be improved by optimizing utility usage."

  return (
    <div className="flex flex-col gap-8 pb-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Financial Analysis</h1>
          <p className="text-gray-400">Deep dive into your income, expenses, and overall financial health.</p>
        </div>
        {!isReal && (
          <Link
            href="/dashboard/upload"
            className="flex-shrink-0 bg-[#ff6b8b] hover:bg-[#e85577] text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Upload Real Data
          </Link>
        )}
      </div>

      {/* Data source banner */}
      {isReal ? (
        <div className="flex items-center gap-2 text-sm text-[#10b981] bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl px-4 py-3">
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span>Showing live analysis from your uploaded MoMo data — {realProfile.summary.num_months} months</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Showing sample data — <Link href="/dashboard/upload" className="underline hover:text-yellow-400">upload your CSV</Link> to see your real analysis</span>
        </div>
      )}

      {/* AI Summary */}
      <AIInsights insightText={aiText} />

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Income Analysis */}
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Income Analysis</h3>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Consistency</span>
            <span className="text-sm font-semibold text-[#10b981]">{analysis.income_consistency}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Monthly Trend</span>
            <span className="text-sm font-semibold text-[#10b981]">{analysis.monthly_income_trend}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Income Sources</span>
            <span className="text-sm font-semibold text-white">{analysis.income_sources}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-gray-400">Income Volatility</span>
            <span className="text-sm font-semibold text-[#10b981]">{analysis.income_volatility}</span>
          </div>
        </div>

        {/* Expense Analysis */}
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#ff6b8b]/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b8b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Expense Analysis</h3>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Largest Category</span>
            <span className="text-sm font-semibold text-white">{analysis.largest_expense}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Expense-to-Income</span>
            <span className="text-sm font-semibold text-yellow-500">{analysis.expense_to_income_ratio}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Monthly Trend</span>
            <span className="text-sm font-semibold text-[#ff6b8b]">{analysis.monthly_expense_trend}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-gray-400">Total Categories</span>
            <span className="text-sm font-semibold text-white">{analysis.expense_categories}</span>
          </div>
        </div>

        {/* Savings Analysis */}
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Savings Analysis</h3>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Savings Rate</span>
            <span className="text-sm font-semibold text-[#10b981]">{analysis.savings_rate}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Consistency</span>
            <span className="text-sm font-semibold text-yellow-500">{analysis.savings_consistency}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-gray-400">Monthly Trend</span>
            <span className="text-sm font-semibold text-[#10b981]">{analysis.monthly_savings_trend}</span>
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Risk Indicators</h3>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Cash-Flow Stability</span>
            <span className="text-sm font-semibold text-[#10b981]">{analysis.cash_flow_stability}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#23252a]">
            <span className="text-sm text-gray-400">Debt/Obligation</span>
            <span className="text-sm font-semibold text-[#10b981]">{analysis.debt_indicators}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-gray-400">High Expense Periods</span>
            <span className="text-sm font-semibold text-white">Beginning of month</span>
          </div>
        </div>

      </div>

      {/* AI Strengths & Improvements (only when real data) */}
      {isReal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Your Strengths
            </h3>
            <div className="flex flex-col gap-3">
              {realProfile.ai_insights.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-[#10b981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#10b981] text-xs font-bold">{i + 1}</span>
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Areas to Improve
            </h3>
            <div className="flex flex-col gap-3">
              {realProfile.ai_insights.improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-500 text-xs font-bold">{i + 1}</span>
                  </div>
                  {imp}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
