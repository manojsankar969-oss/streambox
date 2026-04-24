'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useUser } from '@/hooks/useUser'
import { getImageUrl } from '@/lib/tmdb'
import { formatRating, formatYear, cn } from '@/lib/utils'

export default function MovieCard({ 
  item, 
  mediaType, 
  showWatchlistButton = true,
  className 
}) {
  const { user } = useUser()
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist(user?.id)
  
  const isMovie = mediaType === 'movie'
  const title = isMovie ? item.title : item.name
  const date = isMovie ? item.release_date : item.first_air_date
  const id = item.id
  const posterPath = item.poster_path
  const rating = item.vote_average
  const detailsPath = mediaType === 'movie' ? `/movies/${id}` : `/tv/${id}`

  const inWatchlist = isInWatchlist(id, mediaType)

  const handleWatchlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      window.location.href = '/login'
      return
    }
    if (inWatchlist) {
      removeFromWatchlist.mutate({ tmdbId: id, mediaType })
    } else {
      addToWatchlist.mutate({ tmdbId: id, mediaType })
    }
  }

  return (
    <Link 
      href={detailsPath}
      className={cn(
        'group relative block overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg',
        className
      )}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-muted">
        <Image
          src={getImageUrl(posterPath)}
          alt={title || 'Untitled'}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {showWatchlistButton && (
          <button
            onClick={handleWatchlistToggle}
            className={cn(
              'absolute top-2 right-2 p-2 rounded-full transition-all',
              inWatchlist 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-black/50 text-white hover:bg-black/70'
            )}
            aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Heart 
              className={cn('h-4 w-4', inWatchlist && 'fill-current')} 
            />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-sm font-medium',
              rating >= 8 ? 'text-green-400' : rating >= 6 ? 'text-yellow-400' : 'text-red-400'
            )}>
              ⭐ {formatRating(rating)}
            </span>
            <span className="text-xs text-white/80">{formatYear(date)}</span>
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold line-clamp-2 text-sm">
          {title || 'Untitled'}
        </h3>
      </div>
    </Link>
  )
}