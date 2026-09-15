"use client"
import React from 'react'

const benefits = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
    title: "Build From Real Activity",
    text: "Build a financial profile from real transaction activity — no traditional documents needed.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    ),
    title: "AI-Powered Voice Conversations",
    text: "Add rich context to your profile through natural, conversational AI voice interviews.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Know Your Financial Strengths",
    text: "Better understand your income patterns, savings habits, and areas where you excel financially.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Prepare for Lending Opportunities",
    text: "Arrive lender-ready with an explainable credit profile that speaks for your financial history.",
  },
]

const ForIndividualsSection = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
        .fi-section * { font-family: 'Geist', sans-serif; }
        .fi-section h2, .fi-section h3 { font-family: 'Urbanist', sans-serif; }

        @keyframes fi-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      <section className="fi-section bg-[#0f1115] py-24 px-6 lg:px-12 border-b border-[#1f2125]" id="for-individuals">
        <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left Side — Text & Benefits */}
          <div className="flex-1 flex flex-col">
            <span className="text-[#ff6b8b] text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
              For Individuals
            </span>
            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-6">
              Your Financial Story<br />Deserves to Be Heard.
            </h2>
            <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
              You've been working hard every day. Now let your financial activity speak for itself — and open doors that were once closed to you.
            </p>

            {/* Benefits List */}
            <div className="flex flex-col gap-4 mb-12">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="fi-benefit-card flex items-start gap-5 bg-[#13151a] border border-[#23252a] rounded-2xl p-5 cursor-pointer"
                >
                  <div className="fi-icon w-10 h-10 rounded-xl bg-[#1c1f26] border border-[#2a2d35] flex items-center justify-center text-gray-400 shrink-0">
                    {benefit.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-semibold text-[15px] tracking-tight">
                      {benefit.title}
                    </span>
                    <span className="text-gray-400 text-sm leading-relaxed">
                      {benefit.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-[#ff6b8b] hover:bg-[#ff6b8b]/90 text-[#0f1115] px-8 py-3.5 rounded-full text-sm font-bold transition-colors"
              >
                Build Your Profile
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Side — Visual Card */}
          <div className="flex-1 lg:max-w-[520px] w-full flex items-center justify-center">
            <div className="w-full bg-[#13151a] border border-[#23252a] rounded-2xl p-8 lg:p-10 shadow-2xl">

              {/* Profile header */}
              <div className="flex items-center justify-between border-b border-[#23252a] pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b8b] to-[#d44d6e] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    AK
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm">Ama Kofi</span>
                    <span className="text-gray-500 text-xs">Informal Trader · Accra, GH</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#ff6b8b] bg-[#ff6b8b]/10 border border-[#ff6b8b]/20 px-3 py-1 rounded-full">
                  Profile Ready
                </span>
              </div>

              {/* Score visual */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-[#ff6b8b]/30 bg-[#1c1f26] shrink-0">
                  <span className="text-[#ff6b8b] font-bold text-2xl leading-none">74</span>
                  <span className="text-gray-500 text-[10px] mt-0.5">Score</span>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  {[
                    { label: "Income Consistency", value: 82 },
                    { label: "Cash-Flow Pattern", value: 68 },
                    { label: "Repayment Capacity", value: 75 },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">{stat.label}</span>
                        <span className="text-white text-xs font-semibold">{stat.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#23252a] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#ff6b8b] to-[#d44d6e]"
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 border-t border-[#23252a] pt-6">
                {["Real Income ✓", "No Credit Score ✓", "MoMo Verified ✓", "Voice Assessed ✓"].map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] text-gray-400 bg-[#1c1f26] border border-[#2a2d35] px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default ForIndividualsSection
