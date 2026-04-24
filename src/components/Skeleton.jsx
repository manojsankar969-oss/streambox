'use client'

export function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] bg-zinc-800 rounded-xl" />
      <div className="mt-3 h-4 bg-zinc-800 rounded w-3/4" />
      <div className="mt-2 h-3 bg-zinc-800 rounded w-1/2" />
    </div>
  )
}

export function MovieGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function DetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-8">
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="aspect-[2/3] bg-zinc-800 rounded-lg" />
        </div>
        <div className="flex-1">
          <div className="h-10 bg-zinc-800 rounded w-2/3 mb-4" />
          <div className="flex gap-4 mb-6">
            <div className="h-5 bg-zinc-800 rounded w-24" />
            <div className="h-5 bg-zinc-800 rounded w-24" />
            <div className="h-5 bg-zinc-800 rounded w-24" />
          </div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 bg-zinc-800 rounded-full w-16" />
            <div className="h-6 bg-zinc-800 rounded-full w-20" />
            <div className="h-6 bg-zinc-800 rounded-full w-24" />
          </div>
          <div className="h-6 bg-zinc-800 rounded w-1/3 mb-2" />
          <div className="h-4 bg-zinc-800 rounded w-full mb-1" />
          <div className="h-4 bg-zinc-800 rounded w-full mb-1" />
          <div className="h-4 bg-zinc-800 rounded w-2/3" />
        </div>
      </div>
    </div>
  )
}

export function ActorCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] bg-zinc-800 rounded-xl mb-3" />
      <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-800 rounded w-1/2" />
    </div>
  )
}

export function CastSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ActorCardSkeleton key={i} />
      ))}
    </div>
  )
}