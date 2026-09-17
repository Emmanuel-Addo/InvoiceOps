"use client"
import React, { useState } from 'react'

const TEAM_MEMBERS = [
  { name: 'Emmanuel Addo', role: 'Admin', email: 'emmanuel@invoiceops.gh', status: 'Active' },
  { name: 'Abena Mensah', role: 'Accountant', email: 'abena@invoiceops.gh', status: 'Active' },
  { name: 'Kwame Boateng', role: 'Reviewer', email: 'kwame@invoiceops.gh', status: 'Pending' },
]

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('InvoiceOps Ghana')
  const [email, setEmail] = useState('admin@invoiceops.gh')
  const [industry, setIndustry] = useState('Retail')
  const [currency, setCurrency] = useState('GHS')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your company profile, preferences, and team access.</p>
      </div>

      {/* Toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500 text-white text-sm font-medium shadow-2xl">
          Settings saved ✓
        </div>
      )}

      {/* Company Profile */}
      <section className="rounded-2xl border border-[#23252a] bg-[#0f1115] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#23252a]">
          <h2 className="text-white font-semibold">Company Profile</h2>
          <p className="text-gray-500 text-xs mt-0.5">Basic information about your organisation.</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Company Name', value: companyName, onChange: setCompanyName },
            { label: 'Email Address', value: email, onChange: setEmail },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs text-gray-500 font-medium">{f.label}</label>
              <input
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="mt-1 w-full bg-[#1a1c22] border border-[#23252a] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b8b]/50"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-500 font-medium">Industry</label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="mt-1 w-full bg-[#1a1c22] border border-[#23252a] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b8b]/50">
              {['Retail', 'Manufacturing', 'Services', 'Agriculture', 'Technology', 'Healthcare', 'Education', 'Other'].map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Default Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 w-full bg-[#1a1c22] border border-[#23252a] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b8b]/50">
              {['GHS', 'USD', 'EUR', 'GBP', 'NGN'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Processing Preferences */}
      <section className="rounded-2xl border border-[#23252a] bg-[#0f1115] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#23252a]">
          <h2 className="text-white font-semibold">Processing Preferences</h2>
          <p className="text-gray-500 text-xs mt-0.5">Configure how AI processes your documents.</p>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 font-medium">Default Document Type</label>
            <select className="mt-1 w-full bg-[#1a1c22] border border-[#23252a] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b8b]/50">
              <option>Invoice</option>
              <option>Receipt</option>
              <option>Expense Document</option>
            </select>
          </div>
          {[
            { label: 'Require human approval before saving expense', defaultChecked: true },
            { label: 'Flag documents with confidence below 85%', defaultChecked: true },
            { label: 'Alert on possible duplicate invoices', defaultChecked: true },
            { label: 'Auto-categorise expenses using AI', defaultChecked: true },
          ].map((toggle) => (
            <label key={toggle.label} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-300">{toggle.label}</span>
              <div className="relative">
                <input type="checkbox" defaultChecked={toggle.defaultChecked} className="sr-only peer" />
                <div className="w-10 h-5 bg-[#23252a] rounded-full peer-checked:bg-[#ff6b8b] transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Team Members */}
      <section className="rounded-2xl border border-[#23252a] bg-[#0f1115] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#23252a] flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Team Members</h2>
            <p className="text-gray-500 text-xs mt-0.5">Manage who can access and process documents.</p>
          </div>
          <button className="text-xs text-[#ff6b8b] border border-[#ff6b8b]/30 hover:border-[#ff6b8b] px-3 py-1.5 rounded-lg transition-colors">
            + Invite
          </button>
        </div>
        <div className="divide-y divide-[#23252a]">
          {TEAM_MEMBERS.map((m) => (
            <div key={m.email} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ff6b8b]/20 flex items-center justify-center text-[#ff6b8b] text-sm font-bold">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 bg-[#1a1c22] px-2.5 py-1 rounded-lg">{m.role}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${m.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Save button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="bg-[#ff6b8b] hover:bg-[#e85577] text-black font-semibold text-sm px-8 py-3 rounded-xl transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}
