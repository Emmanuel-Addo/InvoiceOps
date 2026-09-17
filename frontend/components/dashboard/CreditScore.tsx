import React from 'react'

export default function CreditScore({ score, label, description }: { score: number, label: string, description?: string }) {
  // Determine color based on score
  const isGood = score >= 70;
  const isFair = score >= 50 && score < 70;
  const color = isGood ? 'text-[#10b981]' : isFair ? 'text-yellow-500' : 'text-red-500';
  const strokeColor = isGood ? '#10b981' : isFair ? '#eab308' : '#ef4444';
  
  const percentage = (score / 100) * 283; // 283 is approx circumference of r=45

  return (
    <div className="bg-gradient-to-b from-[#13151a] to-[#0a0a0c] border border-[#23252a] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Background glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl opacity-20 ${isGood ? 'bg-[#10b981]' : isFair ? 'bg-yellow-500' : 'bg-red-500'}`}></div>

      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 relative z-10">Credit Intelligence</h3>
      
      <div className="relative w-40 h-40 flex items-center justify-center mb-6 z-10">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r="45" fill="none" stroke="#23252a" strokeWidth="8" />
          <circle 
            cx="80" 
            cy="80" 
            r="45" 
            fill="none" 
            stroke={strokeColor} 
            strokeWidth="8" 
            strokeDasharray="283" 
            strokeDashoffset={283 - percentage}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-white">{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      
      <div className="relative z-10">
        <h4 className={`text-xl font-bold mb-1 ${color}`}>{label}</h4>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
    </div>
  )
}
