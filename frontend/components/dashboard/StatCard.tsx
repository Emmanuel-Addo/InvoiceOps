import React from 'react'

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
}

export default function StatCard({ title, value, subtitle, trend, trendPositive }: StatCardProps) {
  return (
    <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6 flex flex-col gap-2">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-white">{value}</p>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendPositive ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-red-500/10 text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}
