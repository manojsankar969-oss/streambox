'use client'

import { useFirebaseAuth, useGoogleSignIn } from '@/hooks/useFirebaseAuth'
import { User, Shield, Bell, Globe, LogOut, Trash2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const SETTINGS_STORAGE_KEY = 'cinema_settings_v1'
const defaultPreferences = {
  notifications: true,
  autoplayTrailers: true,
  includeAdultContent: false,
  preferredLanguage: 'en-US',
}

export default function SettingsPage() {
  const { user } = useFirebaseAuth()
  const { signOut } = useGoogleSignIn()
  const [clearing, setClearing] = useState(false)
  const [prefs, setPrefs] = useState(defaultPreferences)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      setPrefs({
        ...defaultPreferences,
        ...parsed,
      })
    } catch {
      setPrefs(defaultPreferences)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(prefs))
  }, [prefs])

  const handleClearCache = () => {
    setClearing(true)
    setTimeout(() => {
      localStorage.removeItem(SETTINGS_STORAGE_KEY)
      setPrefs(defaultPreferences)
      setClearing(false)
      setAiPrompt('')
      setAiResult('')
      setAiError('')
      alert('Local settings cache has been cleared.')
    }, 1500)
  }

  const toggle = (key) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleAskGemini = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiError('')

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to get recommendation.')
      }

      setAiResult(data.text || 'No recommendation returned.')
    } catch (err) {
      setAiError(err.message || 'Gemini integration failed.')
      setAiResult('')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-16">
      <header className="mb-12">
        <h1 className="font-epilogue text-4xl font-black text-white mb-2">Settings</h1>
        <p className="text-zinc-500">Manage your cinematic experience and account preferences.</p>
      </header>

      {/* Account Section */}
      <section className="mb-12">
        <h2 className="text-zinc-400 font-epilogue text-xs font-black uppercase tracking-[0.2em] mb-6">Account Profile</h2>
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 backdrop-blur-xl flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 bg-zinc-800 flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="h-10 w-10 text-zinc-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white font-epilogue">{user?.displayName || (user ? 'Authenticated User' : 'Guest User')}</h3>
            <p className="text-zinc-500 text-sm">{user?.email || 'Sign in to sync your watchlist across devices'}</p>
          </div>
          {!user ? (
            <Link 
              href="/login" 
              className="bg-[#FFBF00] text-[#402d00] px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
            >
              Sign In
            </Link>
          ) : (
            <div className="px-4 py-2 rounded-lg border border-white/5 text-zinc-400 text-xs font-bold font-epilogue uppercase tracking-widest">
              Verified
            </div>
          )}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-zinc-400 font-epilogue text-xs font-black uppercase tracking-[0.2em] mb-6">Preferences</h2>
        <div className="space-y-4">
          {[
            {
              icon: Bell,
              label: 'Notifications',
              desc: 'Get release reminders and watchlist updates.',
              value: prefs.notifications,
              onToggle: () => toggle('notifications'),
            },
            {
              icon: Globe,
              label: 'Autoplay Trailers',
              desc: 'Auto-play trailers on movie detail pages.',
              value: prefs.autoplayTrailers,
              onToggle: () => toggle('autoplayTrailers'),
            },
            {
              icon: Shield,
              label: 'Include Adult Content',
              desc: 'Show mature titles in browse and search.',
              value: prefs.includeAdultContent,
              onToggle: () => toggle('includeAdultContent'),
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold font-epilogue">{item.label}</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={item.onToggle}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest ${
                    item.value ? 'bg-green-500/15 text-green-400' : 'bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {item.value ? 'On' : 'Off'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-zinc-400 font-epilogue text-xs font-black uppercase tracking-[0.2em] mb-6">Language</h2>
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
          <label htmlFor="language" className="block text-sm font-semibold mb-2">Preferred Language</label>
          <select
            id="language"
            value={prefs.preferredLanguage}
            onChange={(e) => setPrefs((prev) => ({ ...prev, preferredLanguage: e.target.value }))}
            className="w-full bg-zinc-800 border border-white/10 rounded-lg p-3 text-sm"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="ta-IN">Tamil (India)</option>
            <option value="hi-IN">Hindi (India)</option>
          </select>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-zinc-400 font-epilogue text-xs font-black uppercase tracking-[0.2em] mb-6">Gemini Assistant</h2>
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-[#FFBF00] mb-3">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest font-bold">Gemini 2.0 Flash</span>
          </div>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask for movie suggestions. Example: Sci-fi thrillers with strong female leads."
            rows={4}
            className="w-full bg-zinc-800 border border-white/10 rounded-lg p-3 text-sm"
          />
          <button
            onClick={handleAskGemini}
            disabled={aiLoading}
            className="mt-3 px-4 py-2 rounded-lg bg-[#FFBF00] text-[#402d00] font-bold text-sm disabled:opacity-60"
          >
            {aiLoading ? 'Thinking...' : 'Get Recommendations'}
          </button>
          {aiError && <p className="text-red-400 text-sm mt-3">{aiError}</p>}
          {aiResult && (
            <div className="mt-3 rounded-lg border border-white/10 bg-zinc-800/70 p-4 text-sm text-zinc-100">
              {aiResult}
            </div>
          )}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-zinc-400 font-epilogue text-xs font-black uppercase tracking-[0.2em] mb-6">Maintenance</h2>
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Trash2 className="h-5 w-5 text-zinc-400" />
            <div>
              <h3 className="text-white font-bold font-epilogue">Clear Local Settings Cache</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Reset settings saved on this browser.</p>
            </div>
          </div>
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-60"
          >
            {clearing ? 'Clearing...' : 'Clear Now'}
          </button>
        </div>
      </section>

      {user && (
        <button 
          onClick={signOut}
          className="w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/20 text-red-500 font-bold font-epilogue uppercase tracking-widest text-xs hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out from All Devices
        </button>
      )}
    </div>
  )
}
