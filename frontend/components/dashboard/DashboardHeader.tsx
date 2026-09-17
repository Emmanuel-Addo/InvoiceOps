"use client"
import React from 'react'

export default function DashboardHeader({ 
  onMenuClick, 
  title = "Dashboard" 
}: { 
  onMenuClick: () => void;
  title?: string;
}) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#0f1115] border-b border-[#23252a] sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <h1 className="text-lg font-semibold text-white hidden sm:block">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#ff6b8b] rounded-full border border-[#0f1115]"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b8b] to-[#d44d6e] flex items-center justify-center text-white font-bold text-xs">
          EA
        </div>
      </div>
    </header>
  )
}
