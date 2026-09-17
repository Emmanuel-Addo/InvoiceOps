"use client"
import React from 'react'
import { mockUser, mockFinancialHealth, mockProfileStrengths, mockProfileImprovements, mockAIInsights } from '@/data/mockData'
import CreditScore from '@/components/dashboard/CreditScore'
import AIInsights from '@/components/dashboard/AIInsights'

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Credit Intelligence Profile</h1>
          <p className="text-gray-400">Your financial history synthesized into an explainable profile.</p>
        </div>
        <button className="bg-[#10b981] hover:bg-[#10b981]/90 text-black px-6 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 whitespace-nowrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Generate Lender Report
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <svg className="text-blue-500 mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <p className="text-sm text-blue-200">
          <strong className="text-blue-400">Important:</strong> This is an AI-generated financial intelligence profile and is not an official credit score or loan approval decision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Area */}
        <div className="lg:col-span-1">
          <CreditScore 
            score={mockUser.creditScore} 
            label={mockUser.scoreDescription} 
          />
        </div>

        {/* Score Breakdown Area */}
        <div className="lg:col-span-2 bg-[#13151a] border border-[#23252a] rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Score Breakdown</h3>
          
          <div className="flex flex-col gap-6">
            {Object.entries(mockFinancialHealth).map(([key, item]: [string, any]) => {
              const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <div key={key}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-gray-300 font-medium">{title}</span>
                    <span className="text-sm font-bold text-white">{item.value}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#23252a] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.value >= 80 ? 'bg-[#10b981]' : item.value >= 75 ? 'bg-[#ff6b8b]' : 'bg-yellow-500'}`} 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Financial Strengths</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {mockProfileStrengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                <svg className="text-[#10b981] mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 12 12 14 14"></polyline></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Areas to Improve</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {mockProfileImprovements.map((improvement, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                <svg className="text-yellow-500 mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AIInsights 
        insightText={mockAIInsights.profile}
      />
      
    </div>
  )
}
