'use client'

import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/hooks/useUser'
import { useWatchlist } from '@/hooks/useWatchlist'
import PremiumMovieCard from '@/components/movies/PremiumMovieCard'
import { Heart, Film, Tv, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import WatchlistAI from '@/components/movies/WatchlistAI'

export default function WatchlistPage() {
  const { user, isLoading: userLoading } = useUser()
  const { watchlist, isLoading: watchlistLoading, error: watchlistError } = useWatchlist(user?.id)
  const [activeType, setActiveType] = useState('all')
  const [search, setSearch] = useState('')

  const { data: mediaDetails = [], isLoading: detailsLoading, error: detailsError } = useQuery({
    queryKey: ['watchlist-details', watchlist.map(w => `${w.tmdbId}-${w.mediaType}`).join(',')],
    queryFn: async () => {
      if (!watchlist.length) return []
      const response = await fetch('/api/watchlist/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: watchlist.map((item) => ({
            tmdbId: item.tmdbId,
            mediaType: item.mediaType,
          })),
        }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch watchlist details')
      }
      const data = await response.json()
      return Array.isArray(data.results) ? data.results : []
    },
    enabled: watchlist.length > 0,
  })

  const detailsMap = useMemo(
    () =>
      new Map(
        mediaDetails.map((item) => [`${item.id}-${item.mediaType}`, item])
      ),
    [mediaDetails]
  )

  const mergedItems = useMemo(() => 
    watchlist.map((item) => {
      const details = detailsMap.get(`${item.tmdbId}-${item.mediaType}`)
      return details || {
        id: item.tmdbId,
        mediaType: item.mediaType,
        title: item.mediaType === 'movie' ? item.title || 'Untitled Movie' : undefined,
        name: item.mediaType === 'tv' ? item.title || 'Untitled TV Show' : undefined,
        poster_path: item.posterPath || null,
        vote_average: 0,
        release_date: '',
        first_air_date: '',
      }
    }),
    [watchlist, detailsMap]
  )

  if (userLoading || watchlistLoading || detailsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-zinc-500 text-sm animate-pulse">Loading your watchlist...</p>
        </div>
      </div>
    )
  }

  if (watchlistError || detailsError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h2>
          <p className="text-zinc-400 mb-6">{watchlistError?.message || detailsError?.message || 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Removed login check for testing

  const filteredItems = mergedItems.filter((item) => {
    const title = item.mediaType === 'movie' ? item.title : item.name
    const matchesSearch = !search.trim()
      ? true
      : (title || '').toLowerCase().includes(search.trim().toLowerCase())
    const matchesType = activeType === 'all' ? true : item.mediaType === activeType
    return matchesSearch && matchesType
  })

  const movies = filteredItems.filter(w => w.mediaType === 'movie')
  const tvShows = filteredItems.filter(w => w.mediaType === 'tv')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      
      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground mb-6">Start adding movies and TV shows you want to watch</p>
          <Link href="/movies" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          <WatchlistAI items={mergedItems} />
          
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter watchlist..."
              className="w-full md:w-96 bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-sm"
            />
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'movie', label: 'Movies' },
                { key: 'tv', label: 'TV Shows' },
              ].map((type) => (
                <button
                  key={type.key}
                  onClick={() => setActiveType(type.key)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                    activeType === type.key ? 'bg-primary text-primary-foreground' : 'bg-zinc-900 border border-white/10'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
              <p className="text-muted-foreground">No titles match your filter.</p>
            </div>
          )}

          {movies.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Film className="h-6 w-6" /> Movies ({movies.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map(movie => (
                  <PremiumMovieCard key={movie.id} item={movie} mediaType="movie" />
                ))}
              </div>
            </section>
          )}
          
          {tvShows.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Tv className="h-6 w-6" /> TV Shows ({tvShows.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {tvShows.map(show => (
                  <PremiumMovieCard key={show.id} item={show} mediaType="tv" />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}