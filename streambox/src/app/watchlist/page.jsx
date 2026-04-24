'use client'

import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/hooks/useUser'
import { useWatchlist } from '@/hooks/useWatchlist'
import PremiumMovieCard from '@/components/movies/PremiumMovieCard'
import { Heart, Film, Tv, Loader2 } from 'lucide-react'

async function getMediaDetails(tmdbId, mediaType) {
  const baseUrl = 'https://api.themoviedb.org/3'
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
  
  if (!apiKey) return null
  
  const type = mediaType === 'movie' ? 'movie' : 'tv'
  const res = await fetch(`${baseUrl}/${type}/${tmdbId}?api_key=${apiKey}&language=en-US`)
  if (!res.ok) return null
  return res.json()
}

export default function WatchlistPage() {
  const { user, isLoading: userLoading } = useUser()
  const { watchlist, isLoading: watchlistLoading, isInWatchlist } = useWatchlist(user?.id)

  const { data: mediaDetails = [], isLoading: detailsLoading } = useQuery({
    queryKey: ['watchlist-details', watchlist.map(w => `${w.tmdbId}-${w.mediaType}`).join(',')],
    queryFn: async () => {
      if (!watchlist.length) return []
      const results = await Promise.all(
        watchlist.map(async (item) => {
          const details = await getMediaDetails(item.tmdbId, item.mediaType)
          return details ? { ...details, mediaType: item.mediaType } : null
        })
      )
      return results.filter(Boolean)
    },
    enabled: watchlist.length > 0,
  })

  if (userLoading || watchlistLoading || detailsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Sign in to view your watchlist</h1>
        <p className="text-muted-foreground mb-6">Create a free account to save movies and TV shows</p>
        <a href="/login" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">
          Sign In
        </a>
      </div>
    )
  }

  const movies = mediaDetails.filter(w => w.mediaType === 'movie')
  const tvShows = mediaDetails.filter(w => w.mediaType === 'tv')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      
      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground mb-6">Start adding movies and TV shows you want to watch</p>
          <a href="/movies" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">
            Browse Movies
          </a>
        </div>
      ) : (
        <div className="space-y-12">
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