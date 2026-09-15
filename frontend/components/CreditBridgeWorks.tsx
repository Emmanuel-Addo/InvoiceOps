"use client"
import React from "react";

const steps = [
  {
    number: "01",
    title: "Connect or Upload Financial Data",
    description: "Upload a transaction statement or financial records.",
  },
  {
    number: "02",
    title: "AI Analyzes Your Financial Activity",
    description: "Understand income, expenses, savings, and cash-flow patterns.",
  },
  {
    number: "03",
    title: "Tell Your Financial Story",
    description: "An AI voice assistant asks a few questions about your income, business, and loan needs.",
  },
  {
    number: "04",
    title: "Get Your Credit Intelligence Profile",
    description: "Receive an explainable financial profile that lenders can use for assessment.",
  },
];

const checklist = [
  { label: "CONNECT", text: "Upload your MoMo statements or financial records." },
  { label: "ANALYZE", text: "Identify income, expenses, and cash-flow patterns." },
  { label: "NARRATE", text: "Voice assistant gathers your unique business context." },
  { label: "DELIVER", text: "Receive an explainable profile lenders trust." },
];

const CreditBridgeWorks = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
        .cbw-section * { font-family: 'Geist', sans-serif; }
        .cbw-section h2, .cbw-section h3 { font-family: 'Urbanist', sans-serif; }
      `}</style>
      
      <section className="cbw-section bg-[#0f1115] min-h-screen py-24 px-6 lg:px-12 border-b border-[#1f2125]" id="how-it-works">
        <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Side */}
          <div className="flex-1 flex flex-col pt-4 lg:py-8">
            <span className="text-[#ff6b8b] text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
              How It Works
            </span>
            <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-8">
              How CreditBridge<br />Works.
            </h2>
            <p className="text-gray-400 text-lg max-w-md mb-16 leading-relaxed">
              Every transaction can become a complete credit profile: income evidence, cash-flow patterns, and repayment capacity, all grounded in one clear record.
            </p>
            
            <div className="flex flex-col border-t border-gray-800/60">
              {steps.map((step) => (
                <div 
                  key={step.number} 
                  className="flex items-start justify-between py-6 border-b border-gray-800/60 group cursor-pointer hover:bg-[#1c1f26] transition-colors rounded-xl px-2"
                >
                  <div className="flex gap-6 lg:gap-10 px-2">
                    <span className="text-gray-500 font-mono text-sm mt-1">{step.number}</span>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-white font-semibold text-[17px] tracking-wide">{step.title}</h3>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                    </div>
                  </div>
                  <span className="text-gray-600 group-hover:text-white transition-colors mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-10 px-2">
              <a href="/dashboard" className="text-white text-sm font-medium hover:text-gray-300 flex items-center gap-1 transition-colors">
                Start building your profile 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="flex-1 lg:max-w-[600px]">
            <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-10 lg:p-12 sticky top-24 shadow-2xl">
              <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-10">
                A complete profile, not just raw data.
              </h3>
              
              <ul className="flex flex-col gap-6">
                {checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-[#ff6b8b] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 w-full">
                      <span className="font-bold text-[11px] tracking-[0.15em] uppercase w-24 text-[#ff6b8b] shrink-0 mt-0.5">
                        {item.label}
                      </span>
                      <span className="text-[15px] text-gray-400 leading-relaxed">
                        {item.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-wrap items-center gap-4 mt-12 pt-8 border-t border-[#23252a]">
                <a href="/dashboard" className="bg-[#ff6b8b] hover:bg-[#ff6b8b]/90 text-[#0f1115] px-7 py-3.5 rounded-full text-sm font-bold transition flex items-center gap-2">
                  Build my profile
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <button className="bg-transparent border border-[#23252a] text-gray-400 hover:bg-white/5 hover:text-white px-7 py-3.5 rounded-full text-sm font-medium transition">
                  Use it in my AI
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
};

export default CreditBridgeWorks;
