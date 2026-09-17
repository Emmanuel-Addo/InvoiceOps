"use client"
import React, { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { analyzeCSV, analyzeDemo, saveProfile, SAMPLE_CSV_URL } from "@/lib/api"

type Step = "idle" | "selected" | "uploading" | "success" | "error"

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [score, setScore] = useState<number | null>(null)
  const [scoreLabel, setScoreLabel] = useState("")
  const [progress, setProgress] = useState(0)

  // ── Drag-and-drop handlers ──────────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelected(file)
  }, [])

  const handleFileSelected = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setStep("error")
      setErrorMsg("Please upload a CSV file (.csv extension required).")
      return
    }
    setSelectedFile(file)
    setStep("selected")
    setErrorMsg("")
  }

  // ── Animate a fake progress bar while waiting for backend ──────────────────
  const animateProgress = () => {
    setProgress(0)
    const intervals = [
      setTimeout(() => setProgress(15), 300),
      setTimeout(() => setProgress(35), 800),
      setTimeout(() => setProgress(55), 1500),
      setTimeout(() => setProgress(70), 2400),
      setTimeout(() => setProgress(82), 3500),
    ]
    return intervals
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    setStep("uploading")
    const timers = animateProgress()

    try {
      const profile = await analyzeCSV(selectedFile)
      timers.forEach(clearTimeout)
      setProgress(100)
      saveProfile(profile)
      setScore(profile.overall_score)
      setScoreLabel(profile.score_label)
      setStep("success")
    } catch (err: unknown) {
      timers.forEach(clearTimeout)
      setStep("error")
      setErrorMsg(err instanceof Error ? err.message : "Analysis failed. Please try again.")
    }
  }

  const handleDemo = async () => {
    setStep("uploading")
    setSelectedFile(null)
    const timers = animateProgress()
    try {
      const profile = await analyzeDemo()
      timers.forEach(clearTimeout)
      setProgress(100)
      saveProfile(profile)
      setScore(profile.overall_score)
      setScoreLabel(profile.score_label)
      setStep("success")
    } catch (err: unknown) {
      timers.forEach(clearTimeout)
      setStep("error")
      setErrorMsg(err instanceof Error ? err.message : "Demo failed. Is the backend running?")
    }
  }

  const reset = () => {
    setStep("idle")
    setSelectedFile(null)
    setErrorMsg("")
    setScore(null)
    setProgress(0)
  }

  const scoreColor = (s: number) =>
    s >= 80 ? "#10b981" : s >= 65 ? "#3b82f6" : s >= 50 ? "#f59e0b" : "#ef4444"

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-2xl mx-auto w-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Your Transaction Data</h1>
        <p className="text-gray-400">
          Upload your MTN MoMo, Vodafone Cash, or AirtelTigo transaction CSV to generate your
          real Credit Intelligence Profile.
        </p>
      </div>

      {/* ── Main card ──────────────────────────────────────────────────────── */}
      <div className="bg-[#13151a] border border-[#23252a] rounded-2xl overflow-hidden">

        {/* ── IDLE / SELECTED: Drop zone ──────────────────────────────────── */}
        {(step === "idle" || step === "selected") && (
          <div className="p-8 flex flex-col gap-6">

            {/* Drop area */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center gap-4
                border-2 border-dashed rounded-2xl p-12 cursor-pointer
                transition-all duration-300 group
                ${isDragging
                  ? "border-[#ff6b8b] bg-[#ff6b8b]/5 scale-[1.01]"
                  : step === "selected"
                  ? "border-[#10b981] bg-[#10b981]/5"
                  : "border-[#2a2d35] hover:border-[#ff6b8b]/60 hover:bg-[#ff6b8b]/3"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFileSelected(e.target.files[0]) }}
              />

              {step === "selected" && selectedFile ? (
                <>
                  {/* File selected state */}
                  <div className="w-16 h-16 rounded-2xl bg-[#10b981]/10 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm mt-1">{(selectedFile.size / 1024).toFixed(1)} KB — ready to analyse</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); reset() }}
                    className="text-xs text-gray-500 hover:text-[#ff6b8b] transition-colors mt-1"
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  {/* Idle / drag state */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? "bg-[#ff6b8b]/20" : "bg-[#1c1f26]"}`}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragging ? "#ff6b8b" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">
                      {isDragging ? "Drop your CSV here" : "Drag & drop your CSV"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">or click to browse files</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["MTN MoMo", "Vodafone Cash", "AirtelTigo"].map((n) => (
                      <span key={n} className="px-3 py-1 rounded-full bg-[#1c1f26] text-xs text-gray-400 border border-[#2a2d35]">{n}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {step === "selected" ? (
                <button
                  onClick={handleAnalyze}
                  className="flex-1 bg-[#ff6b8b] hover:bg-[#e85577] text-black font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  Analyse My Transactions
                </button>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-[#ff6b8b] hover:bg-[#e85577] text-black font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                  Choose CSV File
                </button>
              )}

              <button
                onClick={handleDemo}
                className="flex-1 bg-[#1c1f26] hover:bg-[#23252a] text-white font-medium py-3.5 rounded-xl text-sm transition-colors border border-[#2a2d35]"
              >
                Try with Sample Data
              </button>
            </div>

            {/* Download sample link */}
            <div className="text-center">
              <a
                href={SAMPLE_CSV_URL}
                download
                className="text-sm text-gray-500 hover:text-[#ff6b8b] transition-colors inline-flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download sample CSV to see the expected format
              </a>
            </div>
          </div>
        )}

        {/* ── UPLOADING: Progress animation ───────────────────────────────── */}
        {step === "uploading" && (
          <div className="p-12 flex flex-col items-center gap-8">
            {/* Animated brain/AI icon */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-[#ff6b8b]/10 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-[#ff6b8b]/20 animate-pulse" />
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#1c1f26] border border-[#ff6b8b]/30 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff6b8b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/>
                  <path d="M8 13a4 4 0 0 0-4 4v1h16v-1a4 4 0 0 0-4-4H8z"/>
                  <line x1="12" y1="8" x2="12" y2="13"/>
                  <line x1="9" y1="10" x2="15" y2="10"/>
                </svg>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white font-bold text-xl mb-2">Analysing Your Transactions</p>
              <p className="text-gray-400 text-sm">AI is reading your income, expenses, and savings patterns…</p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-sm">
              <div className="h-2 bg-[#1c1f26] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff6b8b] to-[#ff9eb5] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Parsing transactions</span>
                <span>{progress}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-sm text-sm text-gray-500">
              {[
                { label: "Parsing transaction data", done: progress > 20 },
                { label: "Calculating income consistency", done: progress > 40 },
                { label: "Scoring savings behaviour", done: progress > 60 },
                { label: "Generating AI insights with Groq", done: progress > 80 },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2">
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-600 flex-shrink-0" />
                  )}
                  <span className={done ? "text-gray-300" : ""}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUCCESS ─────────────────────────────────────────────────────── */}
        {step === "success" && score !== null && (
          <div className="p-10 flex flex-col items-center gap-8">
            {/* Score ring */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1c1f26" strokeWidth="10"/>
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={scoreColor(score)} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 314} 314`}
                  style={{ transition: "stroke-dasharray 1s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{score}</span>
                <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-4 py-1.5 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="text-[#10b981] text-sm font-semibold">Analysis Complete</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Your Credit Intelligence Score: <span style={{ color: scoreColor(score) }}>{score}/100</span>
              </h2>
              <p className="text-gray-400">
                Your profile has been generated. Head to the dashboard to see the full breakdown.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-[#ff6b8b] hover:bg-[#e85577] text-black font-bold py-3.5 rounded-xl text-sm transition-colors"
              >
                View My Dashboard →
              </button>
              <button
                onClick={reset}
                className="flex-1 bg-[#1c1f26] hover:bg-[#23252a] text-white font-medium py-3.5 rounded-xl text-sm transition-colors border border-[#2a2d35]"
              >
                Upload Different File
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR ───────────────────────────────────────────────────────── */}
        {step === "error" && (
          <div className="p-10 flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-white font-bold text-lg mb-2">Something went wrong</h3>
              <p className="text-red-400 text-sm bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">{errorMsg}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="bg-[#ff6b8b] hover:bg-[#e85577] text-black font-bold py-3 px-6 rounded-xl text-sm transition-colors">
                Try Again
              </button>
              <button onClick={handleDemo} className="bg-[#1c1f26] hover:bg-[#23252a] text-white font-medium py-3 px-6 rounded-xl text-sm transition-colors border border-[#2a2d35]">
                Use Sample Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Format guide ───────────────────────────────────────────────────── */}
      {(step === "idle" || step === "selected") && (
        <div className="bg-[#13151a] border border-[#23252a] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b8b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Accepted CSV Format
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Your CSV must have at least a <strong className="text-gray-300">Date</strong> column and an <strong className="text-gray-300">Amount</strong> column.
            Common column names like <code className="text-[#ff6b8b]">Transaction Date</code>, <code className="text-[#ff6b8b]">Credit</code>, <code className="text-[#ff6b8b]">Debit</code>,
            and <code className="text-[#ff6b8b]">Narration</code> are all recognised automatically.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-400">
              <thead>
                <tr className="border-b border-[#23252a]">
                  {["Transaction Date","Reference","Description","Type","Amount","Balance"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 font-semibold text-gray-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 pr-4">2023-10-24</td>
                  <td className="py-2 pr-4">TRF001</td>
                  <td className="py-2 pr-4">Shop Sales</td>
                  <td className="py-2 pr-4">Credit</td>
                  <td className="py-2 pr-4">1200.00</td>
                  <td className="py-2 pr-4">5432.00</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">2023-10-25</td>
                  <td className="py-2 pr-4">TRF002</td>
                  <td className="py-2 pr-4">Electricity (ECG)</td>
                  <td className="py-2 pr-4">Debit</td>
                  <td className="py-2 pr-4">150.00</td>
                  <td className="py-2 pr-4">5282.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Not sure about the format?{" "}
            <a href={SAMPLE_CSV_URL} download className="text-[#ff6b8b] hover:underline">
              Download the sample CSV
            </a>{" "}
            — it works right out of the box.
          </p>
        </div>
      )}
    </div>
  )
}
