import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, Calendar } from 'lucide-react'
import { tmdb, getImageUrl } from '@/lib/tmdb'
import { formatDate, formatRuntime, formatRating } from '@/lib/utils'
import PremiumMovieCard from '@/components/movies/PremiumMovieCard'
import MediaActions from '@/components/movies/MediaActions'
import ReviewsSection from '@/components/movies/ReviewsSection'
import CastSection from '@/components/movies/CastSection'
import WatchProvidersSection from '@/components/movies/WatchProvidersSection'

async function getMovieData(id) {
  try {
    const [movie, credits, similar, watchProviders] = await Promise.all([
      tmdb.movies.details(id),
      tmdb.movies.credits(id),
      tmdb.movies.similar(id),
      tmdb.movies.watchProviders(id),
    ])
    return {
      movie,
      credits,
      similar: similar.results.slice(0, 6),
      watchProviders: watchProviders.results ?? null,
    }
  } catch {
    return null
  }
}

export default async function MoviePage({ params }) {
  const { id } = await params
  const movieId = parseInt(id)

  if (isNaN(movieId)) return notFound()

  const data = await getMovieData(movieId)
  if (!data) return notFound()

  const { movie, credits, similar, watchProviders } = data
  const movieGenres = movie.genres || []

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
        </div>

        <div className="container relative mx-auto px-4 flex h-full items-end pb-8">
          <div className="flex gap-8">
            <div className="hidden md:block w-52 flex-shrink-0">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <Image
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                <span className="flex items-center gap-1 text-[#FFBF00] font-bold">
                  <Star className="h-5 w-5 fill-current" />
                  {formatRating(movie.vote_average)} / 10
                  <span className="text-zinc-500 font-normal ml-1">({movie.vote_count?.toLocaleString()} votes)</span>
                </span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  {formatDate(movie.release_date)}
                </span>
                {movie.runtime > 0 && (
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Clock className="h-4 w-4" />
                    {formatRuntime(movie.runtime)}
                  </span>
                )}
                {movie.adult && (
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-xs font-bold">18+</span>
                )}
              </div>

              {movieGenres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movieGenres.map(genre => (
                    <Link
                      key={genre.id}
                      href={`/movies?genre=${genre.id}`}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 hover:bg-[#FFBF00]/10 hover:border-[#FFBF00]/30 hover:text-[#FFBF00] transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}

              {movie.tagline && (
                <p className="text-base italic text-zinc-500 mb-3">"{movie.tagline}"</p>
              )}

              <div className="mb-5">
                <p className="text-zinc-300 leading-relaxed line-clamp-3">{movie.overview || 'No overview available.'}</p>
              </div>

              <MediaActions
                tmdbId={movie.id}
                mediaType="movie"
                title={movie.title}
                posterPath={movie.poster_path}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-12">
            <CastSection cast={credits.cast} crew={credits.crew} mediaType="movie" />

            {similar.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                  {similar.map(item => (
                    <PremiumMovieCard key={item.id} item={item} mediaType="movie" />
                  ))}
                </div>
              </section>
            )}

            <ReviewsSection tmdbId={movie.id} mediaType="movie" />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Where to Watch */}
            <WatchProvidersSection
              providers={watchProviders}
              mediaType="movie"
              id={movie.id}
            />

            {/* Movie Info */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-5">
              <h3 className="font-semibold mb-4">Movie Info</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Status</dt>
                  <dd className="font-medium text-right">{movie.status}</dd>
                </div>
                {movie.release_date && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Release</dt>
                    <dd className="font-medium text-right">{formatDate(movie.release_date)}</dd>
                  </div>
                )}
                {movie.runtime > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Runtime</dt>
                    <dd className="font-medium">{formatRuntime(movie.runtime)}</dd>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Budget</dt>
                    <dd className="font-medium">${movie.budget.toLocaleString()}</dd>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Revenue</dt>
                    <dd className="font-medium">${movie.revenue.toLocaleString()}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Rating</dt>
                  <dd className="font-medium">{formatRating(movie.vote_average)} / 10</dd>
                </div>
                {movie.spoken_languages?.length > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500 flex-shrink-0">Languages</dt>
                    <dd className="font-medium text-right">{movie.spoken_languages.map(l => l.english_name).join(', ')}</dd>
                  </div>
                )}
                {movie.production_companies?.length > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500 flex-shrink-0">Production</dt>
                    <dd className="font-medium text-right">{movie.production_companies.slice(0, 3).map(c => c.name).join(', ')}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}