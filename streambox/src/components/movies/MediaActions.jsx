'use client'

import { Heart, Share2, Link as LinkIcon } from 'lucide-react'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'

export default function MediaActions({ tmdbId, mediaType, title, posterPath }) {
  const { user } = useUser()
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist(user?.id)
  
  const inWatchlist = isInWatchlist(tmdbId, mediaType)

  const handleWatchlistToggle = () => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    if (inWatchlist) {
      removeFromWatchlist.mutate({ tmdbId, mediaType })
    } else {
      addToWatchlist.mutate({ tmdbId, mediaType })
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/${mediaType}/${tmdbId}`
    const text = `Check out ${title} on Cinema`
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
      } catch {
        // Fallback for older browsers
        prompt('Copy this link:', url)
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={handleWatchlistToggle}
        className={cn(
          'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all',
          inWatchlist 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary hover:bg-secondary/80'
        )}
      >
        <Heart className={cn('h-5 w-5', inWatchlist && 'fill-current')} />
        {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
      </button>
      
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-zinc-700 hover:bg-zinc-600 transition-all"
      >
        <Share2 className="h-5 w-5" />
        Share
      </button>
    </div>
  )
}