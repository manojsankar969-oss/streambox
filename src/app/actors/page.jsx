import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { tmdb, getImageUrl } from '@/lib/tmdb'

export const metadata = {
  title: 'Popular Actors | Streambox',
  description: 'Explore trending and popular actors from movies and TV shows.',
}

export default async function ActorsPage({ searchParams }) {
  const params = await searchParams
  const page = parseInt(params.page || '1')

  const data = await tmdb.persons.trending(page)
  const actors = data.results
  const totalPages = Math.min(data.total_pages, 500)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 pb-0 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Popular Actors</h1>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Actor Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {actors.map((actor) => (
            <Link
              key={actor.id}
              href={`/actors/${actor.id}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted mb-3 ring-1 ring-border hover:ring-primary transition-all shadow-md hover:shadow-xl">
                <Image
                  src={getImageUrl(actor.profile_path, 'w342')}
                  alt={actor.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-xs text-white/90 font-medium">View Profile →</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {actor.name}
              </h3>
              {actor.known_for_department && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {actor.known_for_department}
                </p>
              )}
              {actor.known_for?.length > 0 && (
                <p className="text-xs text-muted-foreground/70 line-clamp-1 mt-0.5">
                  {actor.known_for.map(k => k.title || k.name).join(', ')}
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-14">
            {page > 1 && (
              <Link
                href={`/actors?page=${page - 1}`}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border bg-card hover:bg-accent transition-colors text-sm font-medium"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Link>
            )}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const startPage = Math.max(1, Math.min(page - 2, totalPages - 4))
                return startPage + i
              })
                .filter(p => p >= 1 && p <= totalPages)
                .map((p) => (
                  <Link
                    key={p}
                    href={`/actors?page=${p}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-primary text-primary-foreground'
                        : 'border hover:bg-accent'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
            </div>
            {page < totalPages && (
              <Link
                href={`/actors?page=${page + 1}`}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border bg-card hover:bg-accent transition-colors text-sm font-medium"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}