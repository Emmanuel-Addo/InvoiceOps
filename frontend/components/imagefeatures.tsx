"use client"
import Image from 'next/image'
import React from 'react'

const stats = [
  { value: "94%", label: "Profile Accuracy" },
  { value: "3x", label: "Faster Assessment" },
  { value: "10k+", label: "Profiles Generated" },
]

const highlights = [
  {
    tag: "INCOME VERIFIED",
    title: "Strengths Identified",
    text: "Real income and transaction data quantified and presented with measurable context.",
  },
  {
    tag: "AI INSIGHTS",
    title: "Improvement Suggestions",
    text: "Personalized patterns flagged to help lenders understand your full financial behaviour.",
  },
]

const ImageFeatures = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
        .imgf-section * { font-family: 'Geist', sans-serif; }
        .imgf-section h2 { font-family: 'Urbanist', sans-serif; }

        .imgf-card-back {
          transform: rotate(-4deg) translateY(12px);
          transform-origin: bottom center;
        }
        .imgf-card-mid {
          transform: rotate(-1.5deg) translateY(5px);
          transform-origin: bottom center;
        }
        .imgf-card-front {
          transform: rotate(0deg);
        }
      `}</style>

      <section className="imgf-section bg-[#0f1115] py-24 px-6 lg:px-12 border-b border-[#1f2125]" id="proof">
        <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left — Text */}
          <div className="flex-1 flex flex-col">
            <span className="text-[#ff6b8b] text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
              The Proof
            </span>
            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-6">
              See what lenders<br />see, before they do.
            </h2>
            <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
              Every profile runs through a structured AI review. It scores your financial data, flags patterns lenders care about, and proposes clear, evidence-backed narratives for your approval.
            </p>

            {/* Highlight bullets */}
            <div className="flex flex-col gap-5 mb-12">
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b8b] mt-2 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#ff6b8b] block mb-1">
                      {h.tag}
                    </span>
                    <span className="text-white font-semibold text-[15px] block mb-0.5">{h.title}</span>
                    <span className="text-gray-400 text-sm leading-relaxed">{h.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 border-t border-[#23252a] pt-8">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-white">{s.value}</span>
                  <span className="text-gray-500 text-xs tracking-wide uppercase">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Stacked image cards */}
          <div className="flex-1 lg:max-w-[560px] w-full flex items-center justify-center">
            <div className="relative w-full" style={{ height: '480px' }}>

              {/* Back card */}
              <div className="imgf-card-back absolute inset-x-4 top-6 bottom-0 bg-[#1c1f26] border border-[#2a2d35] rounded-2xl overflow-hidden shadow-xl" />

              {/* Mid card */}
              <div className="imgf-card-mid absolute inset-x-2 top-3 bottom-0 bg-[#13151a] border border-[#23252a] rounded-2xl overflow-hidden shadow-xl" />

              {/* Front card — main content */}
              <div className="imgf-card-front absolute inset-0 bg-[#13151a] border border-[#23252a] rounded-2xl overflow-hidden shadow-2xl flex flex-col">

                {/* Card top bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#23252a]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff6b8b]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#23252a]" />
                    <div className="w-3 h-3 rounded-full bg-[#23252a]" />
                  </div>
                  <span className="text-gray-500 text-xs tracking-widest uppercase">Credit Intelligence Profile</span>
                  <span className="text-[10px] font-bold text-[#ff6b8b] bg-[#ff6b8b]/10 border border-[#ff6b8b]/20 px-2.5 py-1 rounded-full">
                    AI Verified
                  </span>
                </div>

                {/* Bank image */}
                <div className="relative flex-1 w-full overflow-hidden">
                  <Image
                    src="/bank2.webp"
                    alt="Credit profile preview"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#13151a] to-transparent" />
                </div>

                {/* Card bottom overlay */}
                <div className="px-6 py-5 flex items-center justify-between bg-[#13151a]">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-semibold text-sm">Profile Score</span>
                    <span className="text-gray-500 text-xs">Based on 6-month transaction history</span>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-[#ff6b8b]/30 bg-[#1c1f26]">
                    <span className="text-[#ff6b8b] font-bold text-lg leading-none">74</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default ImageFeatures
