'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, Bell, Menu, X, Heart, User, LogOut, Settings } from 'lucide-react'
import { useFirebaseAuth, useGoogleSignIn } from '@/hooks/useFirebaseAuth'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useFirebaseAuth()
  const { signOut } = useGoogleSignIn()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
    const handleSearch = (e) => {
      e.preventDefault()
      console.log('Search triggered with query:', searchQuery)
      if (searchQuery.trim()) {
        const url = `/search?q=${encodeURIComponent(searchQuery.trim())}`
        console.log('Navigating to:', url)
        window.location.href = url
        setSearchQuery('')
      }
    }
  
    const navLinks = [
      { href: '/movies', label: 'Movies' },
      { href: '/tv', label: 'TV Shows' },
      { href: '/actors', label: 'Actors' },
      { href: '/watchlist', label: 'My List' },
    ]
  
    return (
      <nav className="bg-[#0A0A0A]/80 backdrop-blur-2xl fixed top-0 w-full z-50 border-b border-white/5 h-20">
        <div className="flex justify-between items-center px-8 h-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black text-[#FFBF00] tracking-tighter uppercase font-epilogue">
              CINEMA
            </Link>
            <div className="hidden md:flex gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-epilogue tracking-tight text-sm uppercase transition-all duration-300 ${
                    pathname.startsWith(link.href)
                      ? 'text-[#FFBF00] font-bold border-b-2 border-[#FFBF00] pb-1'
                      : 'text-zinc-400 font-medium hover:text-[#FFBF00]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
  
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative hidden lg:block group">
              <input
                className="bg-zinc-800 border-none rounded-full px-6 py-2 w-64 text-sm focus:ring-1 focus:ring-[#FFBF00] transition-all placeholder:text-white/40"
                placeholder="Search movies, actors..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-[#FFBF00]" />
              </button>
            </form>
  
            <div className="flex items-center gap-4">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
              </button>
  
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse border border-white/5" />
              ) : !user ? (
                <Link
                  href="/login"
                  className="bg-[#FFBF00] text-[#402d00] px-6 py-2 rounded-lg font-bold text-sm active:scale-95 transition-transform duration-200"
                >
                  Sign In
                </Link>
              ) : (
              <div className="relative group">
                <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-[#FFBF00] transition-colors">
                  {user.photoURL ? (
                    <img
                      alt={user.displayName || 'User'}
                      className="w-full h-full object-cover"
                      src={user.photoURL}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-zinc-400" />
                    </div>
                  )}
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/5 bg-[#0A0A0A] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Signed in as</p>
                    <p className="text-xs text-white truncate font-medium">{user.displayName || user.email}</p>
                    {user.email && user.displayName && (
                      <p className="text-[10px] text-zinc-600 truncate">{user.email}</p>
                    )}
                  </div>
                  <Link href="/watchlist" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <Heart className="h-4 w-4" /> Watchlist
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}

            <button
              className="md:hidden text-zinc-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0A0A0A] border-b border-white/5 p-6 space-y-4 z-50">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-400 font-medium uppercase tracking-widest text-sm hover:text-[#FFBF00] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link href="/login" className="block text-[#FFBF00] font-bold uppercase tracking-widest text-sm">
              Sign In
            </Link>
          )}
          {user && (
            <Link href="/settings" className="block text-zinc-400 font-medium uppercase tracking-widest text-sm hover:text-[#FFBF00] transition-colors">
              Settings
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}