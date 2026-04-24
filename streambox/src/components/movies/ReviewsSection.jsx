'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { useReviews } from '@/hooks/useReviews'
import { useUser } from '@/hooks/useUser'
import { formatDate, cn } from '@/lib/utils'
import Image from 'next/image'

export default function ReviewsSection({ tmdbId, mediaType }) {
  const { user } = useUser()
  const { reviews, addReview, isLoading } = useReviews(tmdbId, mediaType)
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !content.trim()) return
    
    setIsSubmitting(true)
    try {
      await addReview.mutateAsync({
        userId: user.id,
        rating,
        content: content.trim(),
      })
      setContent('')
      setRating(5)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
      
      {user && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-lg border bg-card">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={cn(
                    'p-1 rounded hover:scale-110 transition-transform',
                    rating >= value ? 'text-yellow-400' : 'text-muted'
                  )}
                >
                  <Star className={cn('h-6 w-6', rating >= value && 'fill-current')} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share your thoughts about this title..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
      
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="p-6 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                    {user?.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={review.username || 'User'}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                        {(review.username || 'A')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{review.username || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt?.toDate ? review.createdAt.toDate() : review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">{review.rating}/10</span>
                </div>
              </div>
              <p className="text-muted-foreground">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}