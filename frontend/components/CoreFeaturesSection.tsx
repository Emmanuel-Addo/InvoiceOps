"use client"
import React from 'react'

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
    title: "Transaction Intelligence",
    description: "Analyze income, expenses, savings, and transaction patterns to build a complete financial picture.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    ),
    title: "AI Voice Assessment",
    description: "A conversational AI assistant gathers additional financial context through voice for deeper profiling.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
    ),
    title: "Explainable Credit Intelligence",
    description: "Understand exactly why a financial profile receives a particular score — no black-box decisions.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Financial Health Insights",
    description: "Identify strengths, risks, and cash-flow patterns to give a holistic view of financial wellbeing.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" x2="8" y1="13" y2="13"/>
        <line x1="16" x2="8" y1="17" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Lender-Ready Reports",
    description: "Generate structured, professional reports that help lenders make confident, informed decisions.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Alternative Credit Assessment",
    description: "Evaluate individuals without traditional credit histories using behavioural and transactional data.",
  },
];

const CoreFeaturesSection = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
        .cfs-section * { font-family: 'Geist', sans-serif; }
        .cfs-section h2 { font-family: 'Urbanist', sans-serif; }
        .feature-card {
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }
        .feature-card:hover {
          border-color: rgba(255, 107, 139, 0.35);
          background: rgba(255, 107, 139, 0.04);
          transform: translateY(-2px);
        }
        .feature-icon {
          transition: color 0.2s ease, background 0.2s ease;
        }
        .feature-card:hover .feature-icon {
          color: #ff6b8b;
          background: rgba(255, 107, 139, 0.12);
        }
      `}</style>

      <section className="cfs-section bg-[#0f1115] py-24 px-6 lg:px-12 border-b border-[#1f2125]" id="features">
        <div className="max-w-[1300px] mx-auto">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[#ff6b8b] text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
              Core Features
            </span>
            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] max-w-2xl">
              Everything You Need to Prove It.
            </h2>
            <p className="text-gray-400 text-lg mt-6 max-w-xl leading-relaxed">
              A full suite of AI-powered tools that turn raw financial data into trustworthy, lender-ready credit intelligence.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="feature-card bg-[#13151a] border border-[#23252a] rounded-2xl p-8 flex flex-col gap-5 cursor-default"
              >
                {/* Icon */}
                <div className="feature-icon w-12 h-12 rounded-xl bg-[#1c1f26] border border-[#2a2d35] flex items-center justify-center text-gray-400 shrink-0">
                  {feature.icon}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-semibold text-[17px] tracking-tight leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-[14px] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center mt-14">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#ff6b8b] hover:bg-[#ff6b8b]/90 text-[#0f1115] px-8 py-3.5 rounded-full text-sm font-bold transition-colors"
            >
              Start Building Your Profile
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

        </div>
      </section>
    </>
  )
}

export default CoreFeaturesSection
