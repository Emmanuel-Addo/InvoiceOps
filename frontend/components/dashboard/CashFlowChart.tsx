import React from 'react'

export default function CashFlowChart({ data }: { data: any[] }) {
  // Mock visual representation using simple CSS heights
  const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expenses)));

  return (
    <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Cash Flow</h3>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>Income</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff6b8b]"></div>Expenses</div>
        </div>
      </div>
      
      <div className="flex-1 flex items-end justify-between gap-2 pt-4">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-full flex justify-center gap-1 items-end h-[150px] relative">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-[#333] px-2 py-1 rounded text-[10px] whitespace-nowrap transition-opacity pointer-events-none z-10">
                Inc: ₵{item.income} | Exp: ₵{item.expenses}
              </div>
              
              <div 
                className="w-1/3 bg-[#10b981] rounded-t-sm transition-all duration-500" 
                style={{ height: `${(item.income / maxVal) * 100}%` }}
              ></div>
              <div 
                className="w-1/3 bg-[#ff6b8b] rounded-t-sm transition-all duration-500" 
                style={{ height: `${(item.expenses / maxVal) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
