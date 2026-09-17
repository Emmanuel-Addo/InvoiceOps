"use client"
import React, { useState } from 'react'

export default function VoiceAssessmentPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const questions = [
    "Tell us about your main sources of income. What type of work or business do you do?",
    "How long have you been involved in this business, and does your income change during different seasons?",
    "Do you have any existing loans or major monthly financial obligations?",
    "If you were to receive financing, what would you use it for and how much are you looking for?"
  ];

  const handleMicClick = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-3xl mx-auto w-full">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Voice Assessment</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Tell us more about your financial situation. Your transaction history shows what happened financially; this assessment helps us understand why.
        </p>
      </div>

      {/* Main Assessment Area */}
      <div className="bg-[#13151a] border border-[#23252a] rounded-3xl p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden mt-4">
        
        {/* Progress */}
        <div className="w-full flex items-center justify-between gap-2 mb-12">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full flex-1 ${i < step ? 'bg-[#10b981]' : i === step ? 'bg-[#23252a]' : 'bg-[#1a1c22]'}`}>
              {i === step - 1 && (
                <div className="w-full h-full bg-[#10b981] rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* Question */}
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-12 leading-relaxed">
          &quot;{questions[step - 1]}&quot;
        </h2>

        {/* Mic UI */}
        <div className="relative flex items-center justify-center mb-8">
          {isRecording && (
            <>
              <div className="absolute w-32 h-32 bg-[#ff6b8b]/20 rounded-full animate-ping"></div>
              <div className="absolute w-40 h-40 bg-[#ff6b8b]/10 rounded-full animate-pulse"></div>
            </>
          )}
          <button 
            onClick={handleMicClick}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-[#ff6b8b] text-white shadow-[0_0_30px_rgba(255,107,139,0.5)] scale-110' : 'bg-[#23252a] text-gray-400 hover:bg-[#333] hover:text-white'}`}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
          </button>
        </div>

        {/* Status */}
        <p className={`text-sm font-medium ${isRecording ? 'text-[#ff6b8b]' : 'text-gray-500'}`}>
          {isRecording ? 'Listening... Tap mic to stop' : 'Tap the microphone to start speaking'}
        </p>

        {/* Controls */}
        <div className="flex gap-4 mt-12 w-full justify-center">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || isRecording}
            className="px-6 py-2 rounded-full border border-[#333] text-gray-400 hover:text-white hover:bg-[#23252a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            onClick={() => setStep(Math.min(totalSteps, step + 1))}
            disabled={step === totalSteps || isRecording}
            className="px-8 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Question
          </button>
        </div>

      </div>

    </div>
  )
}
