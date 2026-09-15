"use client"
import React from 'react'

const lackingItems = [
  {
    label: "MISSING PAYSLIPS",
    text: "No formal salary records to prove consistent income to lenders."
  },
  {
    label: "NO FORMAL REGISTRATION",
    text: "Many operate legitimate businesses without official government registration."
  },
  {
    label: "LACK OF CREDIT HISTORY",
    text: "Zero footprint in traditional credit bureaus despite years of transactions."
  },
  {
    label: "NO COLLATERAL",
    text: "Unable to provide physical assets required by traditional banks."
  }
];

const ProblemSection = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
        .problem-section * { font-family: 'Geist', sans-serif; }
        .problem-section h2, .problem-section h3 { font-family: 'Urbanist', sans-serif; }
      `}</style>
      
      <section className="problem-section bg-[#0f1115] min-h-screen py-24 px-6 lg:px-12 flex items-center border-b border-[#1f2125]">
        <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full">
          
          {/* Left Side */}
          <div className="flex-1 flex flex-col pt-4 lg:py-8">
            <span className="text-[#ff6b8b] text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
              The Problem
            </span>
            <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-8">
              Millions Earn.<br />Few Can Prove It.
            </h2>
            <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
              Informal workers across Africa generate real, consistent income every day. Yet, they remain locked out of formal credit because they lack the traditional paperwork lenders require.
            </p>
            
            {/* Checkmarks */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12">
               <div className="flex items-center gap-2 text-sm text-gray-300">
                 <svg className="w-4 h-4 text-[#ff6b8b]" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                 </svg>
                 Real Income
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-300">
                 <svg className="w-4 h-4 text-[#ff6b8b]" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                 </svg>
                 No Credit Score
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-300">
                 <svg className="w-4 h-4 text-[#ff6b8b]" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                 </svg>
                 Excluded by Banks
               </div>
            </div>

            <div>
              <a href="#how-it-works" className="inline-flex items-center justify-center bg-[#ff6b8b] hover:bg-[#ff6b8b]/90 text-[#0f1115] px-8 py-3.5 rounded-full text-sm font-bold transition-colors gap-2">
                Explore CreditBridge
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Right Side Card */}
          <div className="flex-1 lg:max-w-[550px] w-full">
            <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-8 lg:p-10 shadow-2xl">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-[#23252a] pb-6 mb-6">
                <span className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">
                  TRADITIONAL REQUIREMENTS
                </span>
                <svg className="w-5 h-5 text-[#ff6b8b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>

              {/* Chat bubble looking thing */}
              <div className="flex gap-5 mb-8">
                 <div className="w-10 h-10 rounded-full bg-[#1c1f26] flex items-center justify-center shrink-0 border border-[#2a2d35]">
                   <svg className="w-5 h-5 text-[#ff6b8b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                   </svg>
                 </div>
                 <p className="text-white text-[15px] leading-relaxed pt-1 font-medium">
                   "We need to see your payslips, business registration, and credit history before we can approve this loan."
                 </p>
              </div>

              {/* List of lacking items */}
              <div className="flex flex-col">
                {lackingItems.map((item, index) => (
                  <div key={index} className={`py-6 flex flex-col gap-2 ${index !== lackingItems.length - 1 ? 'border-b border-[#23252a]' : ''}`}>
                    <span className="text-[#ff6b8b] text-[10px] font-bold tracking-[0.15em] uppercase">
                      {item.label}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
          
        </div>
      </section>
    </>
  )
}

export default ProblemSection
