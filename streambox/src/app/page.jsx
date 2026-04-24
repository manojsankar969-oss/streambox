import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import MovieGrid from '@/components/movies/MovieGrid'
import { tmdb, getImageUrl } from '@/lib/tmdb'

async function getTrendingMovies() {
  try {
    const data = await tmdb.movies.trending(1)
    return data.results.slice(0, 6)
  } catch {
    return []
  }
}

async function getPopularMovies() {
  try {
    const data = await tmdb.movies.popular(1)
    return data.results.slice(0, 6)
  } catch {
    return []
  }
}

async function getTrendingTv() {
  try {
    const data = await tmdb.tv.trending(1)
    return data.results.slice(0, 6)
  } catch {
    return []
  }
}

async function getTopRatedMovies() {
  try {
    const data = await tmdb.movies.topRated(1)
    return data.results.slice(0, 6)
  } catch {
    return []
  }
}

async function getFeaturedMovie() {
  try {
    const data = await tmdb.movies.trending(1)
    const movie = data.results[0]
    if (!movie) return null
    const details = await tmdb.movies.details(movie.id)
    return { ...details, ...movie }
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [trendingMovies, popularMovies, trendingTv, topRated, featured] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTrendingTv(),
    getTopRatedMovies(),
    getFeaturedMovie(),
  ])

  return (
    <div className="min-h-screen">
      {featured && (
        <section className="relative h-[70vh] min-h-[500px]">
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(featured.backdrop_path || featured.poster_path, 'original')}
              alt={featured.title || 'Featured Movie'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          </div>
          
          <div className="container relative mx-auto px-4 flex h-full items-end pb-12">
            <div className="max-w-2xl">
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-sm">
                  Featured
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {featured.title}
              </h1>
              <div className="flex items-center gap-4 text-sm mb-4">
                <span className="text-green-400 font-semibold">
                  ⭐ {featured.vote_average.toFixed(1)} / 10
                </span>
                <span>{featured.release_date?.split('-')[0]}</span>
                {featured.runtime && <span>{Math.floor(featured.runtime / 60)}h {featured.runtime % 60}m</span>}
              </div>
              <p className="text-muted-foreground line-clamp-3 mb-6">
                {featured.overview}
              </p>
              <div className="flex gap-4">
                <Link
                  href={`/movies/${featured.id}`}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  View Details
                </Link>
                <Link
                  href="/movies"
                  className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Browse All
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Movies</h2>
          <Link href="/movies?sort=trending" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <MovieGrid items={trendingMovies} mediaType="movie" />
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Movies</h2>
          <Link href="/movies" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <MovieGrid items={popularMovies} mediaType="movie" />
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending TV Shows</h2>
          <Link href="/tv" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <MovieGrid items={trendingTv} mediaType="tv" />
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top Rated Movies</h2>
          <Link href="/movies?sort=top_rated" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <MovieGrid items={topRated} mediaType="movie" />
      </section>
    </div>
  )
}