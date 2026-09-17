import React from 'react'

export default function FinancialHealth({ healthData }: { healthData: any }) {
  return (
    <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6 h-full">
      <h3 className="text-lg font-bold text-white mb-6">Financial Health</h3>
      
      <div className="flex flex-col gap-5">
        {Object.entries(healthData).map(([key, item]: [string, any]) => {
          // format key from camelCase to Title Case
          const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{title}</span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${item.status === 'good' ? 'text-[#10b981]' : item.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {item.label}
                </span>
                {/* Visual bar */}
                <div className="w-20 h-1.5 bg-[#23252a] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.status === 'good' ? 'bg-[#10b981]' : item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
