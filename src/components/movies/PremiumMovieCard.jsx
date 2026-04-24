'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Play, Heart } from 'lucide-react'
import { getImageUrl } from '@/lib/tmdb'
import { formatRating, formatYear, cn } from '@/lib/utils'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useUser } from '@/hooks/useUser'

export default function PremiumMovieCard({ item, mediaType }) {
  const { user } = useUser()
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist(user?.id)

  const isMovie = mediaType === 'movie'
  const title = isMovie ? item.title : item.name
  const date = isMovie ? item.release_date : item.first_air_date
  const posterPath = item.poster_path
  const rating = item.vote_average
  const id = item.id
  const detailsPath = mediaType === 'movie' ? `/movies/${id}` : `/tv/${id}`

  const inWatchlist = isInWatchlist(id, mediaType)

  const handleWatchlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Removed login check for testing
    if (inWatchlist) {
      removeFromWatchlist.mutate({ tmdbId: id, mediaType })
    } else {
      addToWatchlist.mutate({
        tmdbId: id,
        mediaType,
        title,
        posterPath,
      })
    }
  }

  return (
    <div className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 cursor-pointer shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <Link href={detailsPath} className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(posterPath, 'w342')}
          alt={title || 'Movie'}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </Link>
      
      <div className="movie-card-border absolute inset-0 rounded-xl z-20 pointer-events-none"></div>
      <div className="absolute inset-0 movie-card-overlay z-10 pointer-events-none"></div>

      {/* Watchlist Toggle Button */}
      <button
        onClick={handleWatchlistToggle}
        className={cn(
          'absolute top-3 right-3 p-2 rounded-full z-40 transition-all active:scale-90',
          inWatchlist 
            ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
            : 'bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60'
        )}
      >
        <Heart className={cn('h-4 w-4 transition-transform', inWatchlist && 'fill-current scale-110')} />
      </button>

      {/* Info overlay — slides up on hover */}
      <Link href={detailsPath} className="absolute inset-0 p-4 flex flex-col justify-end z-30 translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
        {/* Badges */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5 bg-[#FFBF00] text-[#402d00] px-1.5 py-0.5 rounded text-[9px] font-black">
            <Star className="h-2 w-2 fill-current" />
            {formatRating(rating)}
          </div>
          <span className="bg-white/10 backdrop-blur-md text-white/80 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide">
            {formatYear(date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-epilogue text-sm font-black text-white leading-tight tracking-tight uppercase line-clamp-2 mb-1.5">
          {title}
        </h3>

        {/* Play button — visible on hover */}
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-75">
          <div className="w-8 h-8 rounded-full bg-[#FFBF00] text-[#402d00] flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
            <Play className="h-4 w-4 fill-current" />
          </div>
        </div>
      </Link>
    </div>
  )
}
