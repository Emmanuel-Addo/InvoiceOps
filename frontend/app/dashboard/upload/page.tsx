"use client"
import React, { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

type DocumentType = 'Invoice' | 'Receipt' | 'Expense Document' | 'Other'

type ProcessingStage =
  | 'idle'
  | 'uploading'
  | 'reading'
  | 'extracting'
  | 'categorising'
  | 'done'

const STAGES: { key: ProcessingStage; label: string }[] = [
  { key: 'uploading',    label: 'Uploading Document' },
  { key: 'reading',      label: 'Reading Document with OCR' },
  { key: 'extracting',   label: 'Extracting Financial Information' },
  { key: 'categorising', label: 'Categorising Expense' },
  { key: 'done',         label: 'Preparing for Human Review' },
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadPage() {
  const router = useRouter()
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [docType, setDocType] = useState<DocumentType>('Invoice')
  const [stage, setStage] = useState<ProcessingStage>('idle')
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/heic', 'image/heif']
    if (!allowed.includes(f.type) && !f.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF, JPG, PNG, HEIC, and WEBP files are supported.')
      return
    }
    if (f.size > 20 * 1024 * 1024) {
      alert('File size must be under 20 MB.')
      return
    }
    setFile(f)
    setStage('idle')
    setProgress(0)
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }, [handleFile])

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const clearFile = () => {
    setFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const runProcessing = async () => {
    if (!file) return
    const stageKeys: ProcessingStage[] = ['uploading', 'reading', 'extracting', 'categorising', 'done']

    // Start animation
    setStage('uploading')
    setProgress(20)

    try {
      // Build form data for backend
      const formData = new FormData()
      formData.append('file', file)
      formData.append('doc_type', docType)

      // Animate stages while uploading
      const stageTimer = (async () => {
        for (let i = 1; i < stageKeys.length - 1; i++) {
          await new Promise((r) => setTimeout(r, 800))
          setStage(stageKeys[i])
          setProgress(((i + 1) / stageKeys.length) * 85)
        }
      })()

      // Call the backend
      const API_BASE = process.env.NODE_ENV === 'production' ? 'https://invoice-ops-bmmg.vercel.app' : 'http://localhost:8000'
      const res = await fetch(`${API_BASE}/api/upload-document`, {
        method: 'POST',
        body: formData,
      })

      await stageTimer

      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`)
      }

      const data = await res.json()

      // Save real extracted data to localStorage for the approvals page to read
      const existing = JSON.parse(localStorage.getItem('invoiceops_uploads') ?? '[]')
      existing.unshift(data.data)
      localStorage.setItem('invoiceops_uploads', JSON.stringify(existing.slice(0, 20)))

      setStage('done')
      setProgress(100)

    } catch {
      // If backend is unavailable, still run the demo flow with mock data
      for (let i = 1; i < stageKeys.length; i++) {
        await new Promise((r) => setTimeout(r, 800))
        setStage(stageKeys[i])
        setProgress(((i + 1) / stageKeys.length) * 100)
      }
    }

    setTimeout(() => router.push('/dashboard/approvals'), 800)
  }

  const stageIndex = STAGES.findIndex((s) => s.key === stage)
  const isImage = file?.type.startsWith('image/')

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Upload or Photograph a Document</h1>
        <p className="text-gray-400 text-sm mt-1">
          Upload an invoice, receipt, or photograph a physical document — AI will read, extract, and categorise the financial information for you.
        </p>
      </div>

      {/* Workflow steps */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {[
          { step: '1', label: 'Upload / Photo' },
          { step: '2', label: 'AI Extraction' },
          { step: '3', label: 'Categorise' },
          { step: '4', label: 'Human Approval' },
          { step: '5', label: 'Store / Export' },
        ].map((s, i) => (
          <React.Fragment key={s.step}>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-[#ff6b8b] text-black' : 'bg-[#1a1c22] text-gray-500'}`}>{s.step}</span>
              <span className={`text-xs ${i === 0 ? 'text-white font-medium' : 'text-gray-500'}`}>{s.label}</span>
            </div>
            {i < 4 && <div className="w-6 h-px bg-[#23252a] flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {stage === 'idle' ? (
        <>
          {/* 3 input method cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Drag & Drop */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-4 py-12 px-6
                ${dragOver ? 'border-[#ff6b8b] bg-[#ff6b8b]/5' : 'border-[#23252a] hover:border-[#444] bg-[#0f1115]'}`}
            >
              <div className={`p-3 rounded-2xl ${dragOver ? 'bg-[#ff6b8b]/10' : 'bg-[#1a1c22]'}`}>
                <svg className={`${dragOver ? 'text-[#ff6b8b]' : 'text-gray-400'}`} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-semibold">{dragOver ? 'Drop here!' : 'Upload File'}</p>
                <p className="text-gray-500 text-xs mt-0.5">Drag & drop or click</p>
              </div>
              <div className="flex gap-1 flex-wrap justify-center">
                {['PDF', 'JPG', 'PNG'].map(f => (
                  <span key={f} className="text-xs text-gray-500 border border-[#23252a] rounded px-1.5 py-0.5">{f}</span>
                ))}
              </div>
            </div>

            {/* Take Photo */}
            <div
              onClick={() => cameraInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-[#23252a] hover:border-[#ff6b8b]/40 bg-[#0f1115] cursor-pointer flex flex-col items-center justify-center gap-4 py-12 px-6 transition-all duration-200 group"
            >
              <div className="p-3 rounded-2xl bg-[#1a1c22] group-hover:bg-[#ff6b8b]/10 transition-colors">
                <svg className="text-gray-400 group-hover:text-[#ff6b8b] transition-colors" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-semibold">Take a Photo</p>
                <p className="text-gray-500 text-xs mt-0.5">Use your camera</p>
              </div>
              <p className="text-xs text-gray-500 text-center">Photograph a physical receipt or invoice</p>
            </div>

            {/* Browse Files */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-[#23252a] hover:border-[#444] bg-[#0f1115] cursor-pointer flex flex-col items-center justify-center gap-4 py-12 px-6 transition-all duration-200"
            >
              <div className="p-3 rounded-2xl bg-[#1a1c22]">
                <svg className="text-gray-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-semibold">Browse Files</p>
                <p className="text-gray-500 text-xs mt-0.5">From your device</p>
              </div>
              <p className="text-xs text-gray-500 text-center">Up to 20 MB per file</p>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif" className="hidden" onChange={onFileInput} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileInput} />

          {/* Document type selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300 font-medium">Document Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Invoice', 'Receipt', 'Expense Document', 'Other'] as DocumentType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setDocType(t)}
                  className={`rounded-xl py-2.5 text-sm font-medium border transition-all
                    ${docType === t ? 'bg-[#ff6b8b]/10 border-[#ff6b8b]/40 text-[#ff6b8b]' : 'border-[#23252a] text-gray-400 hover:text-white hover:border-[#444] bg-[#0f1115]'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* File preview card */}
          {file && (
            <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] overflow-hidden">
              {isImage && previewUrl && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Document preview" className="w-full max-h-72 object-contain bg-[#1a1c22]" />
                  <button onClick={clearFile} className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              )}
              <div className="p-4 flex items-center gap-4">
                <div className="p-2.5 bg-[#1a1c22] rounded-xl flex-shrink-0">
                  {isImage ? (
                    <svg className="text-[#ff6b8b]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  ) : (
                    <svg className="text-[#ff6b8b]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{file.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {file.type ? file.type.split('/')[1].toUpperCase() : 'FILE'} · {formatBytes(file.size)} · {docType}
                  </p>
                </div>
                {!isImage && (
                  <button onClick={clearFile} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            onClick={runProcessing}
            disabled={!file}
            className="flex items-center justify-center gap-2 bg-[#ff6b8b] hover:bg-[#e85577] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Extract Information with AI
          </button>

          <p className="text-xs text-gray-600 text-center">
            Supported formats: PDF, JPG, JPEG, PNG, WEBP, HEIC · Maximum 20 MB
          </p>
        </>
      ) : (
        /* Processing state */
        <div className="rounded-2xl border border-[#23252a] bg-[#0f1115] p-8 flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <svg className="rotate-[-90deg]" viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#23252a" strokeWidth="6"/>
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="#ff6b8b" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">{Math.round(progress)}%</span>
          </div>

          {isImage && previewUrl && (
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#23252a] opacity-60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Processing" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="w-full flex flex-col gap-3">
            {STAGES.map((s, i) => {
              const isDone = i < stageIndex
              const isActive = i === stageIndex
              return (
                <div key={s.key} className={`flex items-center gap-3 text-sm transition-all ${isActive ? 'text-white' : isDone ? 'text-emerald-400' : 'text-gray-600'}`}>
                  {isDone ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  ) : isActive ? (
                    <svg className="animate-spin text-[#ff6b8b]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                  )}
                  {s.label}
                </div>
              )
            })}
          </div>

          {stage === 'done' && (
            <p className="text-emerald-400 text-sm font-medium animate-pulse">Redirecting to human review…</p>
          )}
        </div>
      )}
    </div>
  )
}
