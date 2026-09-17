import React from 'react'

export default function RecentTransactions({ transactions }: { transactions: any[] }) {
  return (
    <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        <button className="text-sm text-[#ff6b8b] hover:text-white transition-colors">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#23252a] text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="pb-3 px-2 whitespace-nowrap">Date</th>
              <th className="pb-3 px-2">Description</th>
              <th className="pb-3 px-2">Type</th>
              <th className="pb-3 px-2">Category</th>
              <th className="pb-3 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map((tx, i) => (
              <tr key={i} className="border-b border-[#23252a]/50 hover:bg-[#1a1c22] transition-colors group">
                <td className="py-4 px-2 text-sm text-gray-400 whitespace-nowrap">{tx.date}</td>
                <td className="py-4 px-2 text-sm text-gray-100 font-medium">{tx.description}</td>
                <td className="py-4 px-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${tx.type === 'income' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#ff6b8b]/10 text-[#ff6b8b]'}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="py-4 px-2 text-sm text-gray-400">{tx.category}</td>
                <td className={`py-4 px-2 text-sm font-bold text-right whitespace-nowrap ${tx.type === 'income' ? 'text-[#10b981]' : 'text-white'}`}>
                  {tx.type === 'income' ? '+' : '-'}₵{tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
