import React from 'react'
import Link from 'next/link'

export default function AIInsights({ insightText, actionLink, actionText }: { insightText: string, actionLink?: string, actionText?: string }) {
  return (
    <div className="bg-gradient-to-br from-[#13151a] to-[#0f1115] border border-[#23252a] rounded-2xl p-6 relative overflow-hidden group">
      {/* Subtle glow effect */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-[#10b981]/10 blur-3xl group-hover:bg-[#10b981]/20 transition-all"></div>
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="w-6 h-6 rounded bg-[#10b981]/20 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Intelligence</h3>
      </div>
      
      <p className="text-gray-300 text-sm leading-relaxed relative z-10 mb-4">
        &ldquo;{insightText}&rdquo;
      </p>

      {actionLink && actionText && (
        <Link href={actionLink} className="text-[#10b981] hover:text-[#0ea472] text-sm font-medium flex items-center gap-1 relative z-10 w-max transition-colors">
          {actionText} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </Link>
      )}
    </div>
  )
}
