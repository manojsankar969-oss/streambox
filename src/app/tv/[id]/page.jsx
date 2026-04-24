import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Calendar } from 'lucide-react'
import { tmdb, getImageUrl } from '@/lib/tmdb'
import { formatDate, formatRating } from '@/lib/utils'
import PremiumMovieCard from '@/components/movies/PremiumMovieCard'
import MediaActions from '@/components/movies/MediaActions'
import ReviewsSection from '@/components/movies/ReviewsSection'
import CastSection from '@/components/movies/CastSection'
import WatchProvidersSection from '@/components/movies/WatchProvidersSection'

async function getTvData(id) {
  try {
    const [tv, credits, similar, watchProviders] = await Promise.all([
      tmdb.tv.details(id),
      tmdb.tv.credits(id),
      tmdb.tv.similar(id),
      tmdb.tv.watchProviders(id),
    ])
    return {
      tv,
      credits,
      similar: similar.results.slice(0, 6),
      watchProviders: watchProviders.results ?? null,
    }
  } catch {
    return null
  }
}

export default async function TvDetailPage({ params }) {
  const { id } = await params
  const tvId = parseInt(id)

  if (isNaN(tvId)) return notFound()

  const data = await getTvData(tvId)
  if (!data) return notFound()

  const { tv, credits, similar, watchProviders } = data
  const tvGenres = tv.genres || []

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(tv.backdrop_path, 'original')}
            alt={tv.name}
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
                  src={getImageUrl(tv.poster_path, 'w500')}
                  alt={tv.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">{tv.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                <span className="flex items-center gap-1 text-[#FFBF00] font-bold">
                  <Star className="h-5 w-5 fill-current" />
                  {formatRating(tv.vote_average)} / 10
                  <span className="text-zinc-500 font-normal ml-1">({tv.vote_count?.toLocaleString()} votes)</span>
                </span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  {tv.first_air_date && formatDate(tv.first_air_date)}
                </span>
                <span className="text-zinc-400">{tv.number_of_seasons} Season{tv.number_of_seasons !== 1 ? 's' : ''}</span>
                <span className="text-zinc-400">{tv.number_of_episodes} Episodes</span>
              </div>

              {tvGenres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tvGenres.map(genre => (
                    <Link
                      key={genre.id}
                      href={`/tv?genre=${genre.id}`}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 hover:bg-[#FFBF00]/10 hover:border-[#FFBF00]/30 hover:text-[#FFBF00] transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mb-5">
                <p className="text-zinc-300 leading-relaxed line-clamp-3">{tv.overview || 'No overview available.'}</p>
              </div>

              <MediaActions
                tmdbId={tv.id}
                mediaType="tv"
                title={tv.name}
                posterPath={tv.poster_path}
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
            <CastSection cast={credits.cast} crew={credits.crew} mediaType="tv" />

            {similar.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Similar TV Shows</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                  {similar.map(item => (
                    <PremiumMovieCard key={item.id} item={item} mediaType="tv" />
                  ))}
                </div>
              </section>
            )}

            <ReviewsSection tmdbId={tv.id} mediaType="tv" />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Where to Watch */}
            <WatchProvidersSection
              providers={watchProviders}
              mediaType="tv"
              id={tv.id}
            />

            {/* TV Info */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-5">
              <h3 className="font-semibold mb-4">Show Info</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Status</dt>
                  <dd className="font-medium">{tv.status || (tv.in_production ? 'In Production' : 'Ended')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">First Aired</dt>
                  <dd className="font-medium">{formatDate(tv.first_air_date)}</dd>
                </div>
                {tv.last_air_date && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Last Aired</dt>
                    <dd className="font-medium">{formatDate(tv.last_air_date)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Seasons</dt>
                  <dd className="font-medium">{tv.number_of_seasons}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Episodes</dt>
                  <dd className="font-medium">{tv.number_of_episodes}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Rating</dt>
                  <dd className="font-medium">{formatRating(tv.vote_average)} / 10</dd>
                </div>
                {tv.networks?.length > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500 flex-shrink-0">Networks</dt>
                    <dd className="font-medium text-right">{tv.networks.map(n => n.name).join(', ')}</dd>
                  </div>
                )}
                {tv.spoken_languages?.length > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500 flex-shrink-0">Languages</dt>
                    <dd className="font-medium text-right">{tv.spoken_languages.map(l => l.english_name).join(', ')}</dd>
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