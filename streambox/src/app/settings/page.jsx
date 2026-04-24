'use client'

import { useFirebaseAuth, useGoogleSignIn } from '@/hooks/useFirebaseAuth'
import { User, Shield, Bell, Globe, Monitor, LogOut, Trash2, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SettingsPage() {
  const { user } = useFirebaseAuth()
  const { signOut } = useGoogleSignIn()
  const [clearing, setClearing] = useState(false)

  const handleClearCache = () => {
    setClearing(true)
    setTimeout(() => {
      localStorage.clear()
      setClearing(false)
      alert('Local cache and preferences cleared.')
    }, 1500)
  }

  const sections = [
    {
      title: 'Preferences',
      items: [
        { icon: Monitor, label: 'Appearance', desc: 'Dark Mode, Glassmorphism, Animations', action: 'Customized' },
        { icon: Globe, label: 'Language & Region', desc: 'English (US), UTC+0', action: 'Change' },
        { icon: Bell, label: 'Notifications', desc: 'New releases, Watchlist updates', action: 'Manage' },
      ]
    },
    {
      title: 'Performance',
      items: [
        { 
          icon: Zap, 
          label: 'Hardware Acceleration', 
          desc: 'Use GPU for smoother transitions', 
          action: 'Enabled',
          type: 'toggle'
        },
        { 
          icon: Trash2, 
          label: 'Clear Local Cache', 
          desc: 'Remove stored images and temporary data', 
          action: clearing ? 'Clearing...' : 'Clear Now',
          onClick: handleClearCache
        },
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: Shield, label: 'Data Privacy', desc: 'Manage your data and account history', action: 'View' },
      ]
    }
  ]

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

      {/* Other Sections */}
      {sections.map((section) => (section.items && (
        <section key={section.title} className="mb-12">
          <h2 className="text-zinc-400 font-epilogue text-xs font-black uppercase tracking-[0.2em] mb-6">{section.title}</h2>
          <div className="space-y-4">
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <div 
                  key={item.label} 
                  onClick={item.onClick}
                  className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex items-center gap-6 group hover:bg-zinc-900/60 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-[#FFBF00] transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold font-epilogue">{item.label}</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                  <button 
                    className={`font-bold text-[10px] uppercase tracking-widest font-epilogue ${item.action === 'Enabled' ? 'text-green-500' : 'text-[#FFBF00]'}`}
                  >
                    {item.action}
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )))}

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
