import PremiumMovieCard from './PremiumMovieCard'
import { cn } from '@/lib/utils'

export default function MovieGrid({ items, mediaType, className }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500 font-medium">
        No content found in this category.
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6', className)}>
      {items.map(item => (
        <PremiumMovieCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </div>
  )
}