"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import StatCard from '@/components/dashboard/StatCard'
import CashFlowChart from '@/components/dashboard/CashFlowChart'
import FinancialHealth from '@/components/dashboard/FinancialHealth'
import AIInsights from '@/components/dashboard/AIInsights'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import { mockUser, mockSummary, mockCashFlowData, mockFinancialHealth, mockTransactions, mockAIInsights } from '@/data/mockData'
import { loadProfile, CreditProfile } from '@/lib/api'

export default function OverviewDashboard() {
  const [realProfile, setRealProfile] = useState<CreditProfile | null>(null)

  // Load real profile from localStorage on mount
  useEffect(() => {
    const profile = loadProfile()
    setRealProfile(profile)
  }, [])

  // ── Decide which data to show ─────────────────────────────────────────────
  const isReal = realProfile !== null

  const creditScore    = isReal ? realProfile.overall_score          : mockUser.creditScore
  const scoreLabel     = isReal ? realProfile.score_label            : mockUser.scoreLabel
  const totalIncome    = isReal ? realProfile.summary.total_income   : mockSummary.totalIncome
  const totalExpenses  = isReal ? realProfile.summary.total_expenses : mockSummary.totalExpenses
  const totalSavings   = isReal ? realProfile.summary.total_savings  : mockSummary.totalSavings
  const incomeTrend    = isReal ? `${realProfile.summary.monthly_income_trend >= 0 ? '+' : ''}${realProfile.summary.monthly_income_trend}%` : "+5.2%"
  const cashFlowData   = isReal ? realProfile.cashflow_data          : mockCashFlowData
  const aiOverview     = isReal ? realProfile.ai_insights.overview   : mockAIInsights.overview
  const transactions   = isReal ? realProfile.transactions           : mockTransactions

  // Health data — map snake_case backend keys to camelCase used by the component
  const healthData = isReal
    ? {
        incomeStability:   realProfile.health_data.income_stability,
        savingsBehaviour:  realProfile.health_data.savings_behaviour,
        expenseManagement: realProfile.health_data.expense_management,
        cashFlowRisk:      realProfile.health_data.cash_flow_risk,
        repaymentCapacity: realProfile.health_data.repayment_capacity,
      }
    : mockFinancialHealth

  return (
    <div className="flex flex-col gap-8 pb-10">

      {/* ── Live Data Banner ─────────────────────────────────────────────── */}
      {isReal ? (
        <div className="flex items-center gap-3 bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl px-5 py-3">
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse flex-shrink-0" />
          <p className="text-sm text-[#10b981] font-medium flex-1">
            Showing <strong>live analysis</strong> from your uploaded MoMo transaction data
            — {realProfile.summary.num_months} months analysed
          </p>
          <Link href="/dashboard/upload" className="text-xs text-gray-500 hover:text-white transition-colors whitespace-nowrap">
            Update data →
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-[#23252a]/60 border border-[#2a2d35] rounded-xl px-5 py-3">
          <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
          <p className="text-sm text-gray-400 flex-1">
            Showing <strong className="text-gray-300">sample data</strong> — upload your MoMo transactions to see your real Credit Intelligence Profile
          </p>
          <Link href="/dashboard/upload" className="text-xs text-[#ff6b8b] hover:text-[#e85577] transition-colors font-semibold whitespace-nowrap">
            Upload now →
          </Link>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Good morning, {mockUser.name}
          </h1>
          <p className="text-gray-400">
            Here&apos;s an overview of your financial health and Credit Intelligence profile.
          </p>
        </div>
      </div>

      {/* ── Top Stats Grid ───────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex-1">
          <StatCard
            title="Credit Intelligence"
            value={`${creditScore} / 100`}
            trend={scoreLabel}
            trendPositive={creditScore >= 65}
          />
        </div>
        <div className="flex-1">
          <StatCard
            title="Total Income"
            value={`₵${totalIncome.toLocaleString()}`}
            trend={incomeTrend}
            trendPositive={true}
          />
        </div>
        <div className="flex-1">
          <StatCard
            title="Total Expenses"
            value={`₵${totalExpenses.toLocaleString()}`}
            trend="-1.4%"
            trendPositive={true}
          />
        </div>
        <div className="flex-1">
          <StatCard
            title="Total Savings"
            value={`₵${totalSavings.toLocaleString()}`}
            trend={isReal ? `${realProfile.summary.savings_rate}% rate` : "+8.1%"}
            trendPositive={true}
          />
        </div>
      </div>

      {/* ── Cash Flow + Health ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CashFlowChart data={cashFlowData} />
        </div>
        <div className="lg:col-span-1">
          <FinancialHealth healthData={healthData} />
        </div>
      </div>

      {/* ── AI Insights + CTA ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AIInsights
          insightText={aiOverview}
          actionLink="/dashboard/analysis"
          actionText="View Full Analysis"
        />

        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6 flex flex-col justify-center gap-4">
          {isReal ? (
            <>
              <h3 className="text-lg font-bold text-white">Update Your Profile</h3>
              <p className="text-sm text-gray-400">
                Upload a newer MoMo statement to refresh your Credit Intelligence Profile with the latest transactions.
              </p>
              <Link
                href="/dashboard/upload"
                className="bg-white text-black hover:bg-gray-200 transition-colors font-semibold text-sm px-6 py-3 rounded-xl w-max mt-2"
              >
                Upload New Statement
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-white">Build Your Credit Profile</h3>
              <p className="text-sm text-gray-400">
                Upload your MoMo transaction history to generate your real Credit Intelligence Profile — takes under 30 seconds.
              </p>
              <Link
                href="/dashboard/upload"
                className="bg-[#ff6b8b] text-black hover:bg-[#e85577] transition-colors font-semibold text-sm px-6 py-3 rounded-xl w-max mt-2"
              >
                Upload My Transactions
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Recent Transactions ──────────────────────────────────────────── */}
      <RecentTransactions transactions={transactions} />
    </div>
  )
}
