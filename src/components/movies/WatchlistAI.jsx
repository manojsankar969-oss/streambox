'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Brain } from 'lucide-react'
import { analyzeWatchlist } from '@/lib/gemini'

export default function WatchlistAI({ items }) {
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    if (items.length === 0) return
    setIsLoading(true)
    const result = await analyzeWatchlist(items)
    setAnalysis(result)
    setIsLoading(false)
  }

  if (items.length === 0) return null

  return (
    <div className="bg-zinc-900/50 border border-[#FFBF00]/20 rounded-2xl p-6 mb-12 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFBF00]/10 flex items-center justify-center">
            <Brain className="h-6 w-6 text-[#FFBF00]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-epilogue">AI Watchlist Insights</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Powered by Gemini AI</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#FFBF00] text-[#402d00] rounded-lg font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {analysis ? 'Re-Analyze' : 'Analyze My Taste'}
        </button>
      </div>

      {analysis && !analysis.error && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="md:col-span-1 p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-[#FFBF00] text-[10px] uppercase tracking-widest font-black mb-2">My Current Vibe</h3>
            <p className="text-sm text-zinc-300 leading-relaxed italic">"{analysis.summary}"</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-[#FFBF00] text-[10px] uppercase tracking-widest font-black mb-2">Classic Gem</h3>
            <p className="text-sm font-bold text-white mb-1">{analysis.classicSuggestion}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-[#FFBF00] text-[10px] uppercase tracking-widest font-black mb-2">Modern Hit</h3>
            <p className="text-sm font-bold text-white mb-1">{analysis.recentSuggestion}</p>
          </div>
        </div>
      )}

      {analysis?.error && (
        <p className="text-red-400 text-sm italic">{analysis.error}</p>
      )}

      {!analysis && !isLoading && (
        <p className="text-zinc-500 text-sm italic">Click to get AI-powered insights and recommendations based on your current watchlist.</p>
      )}
    </div>
  )
}
