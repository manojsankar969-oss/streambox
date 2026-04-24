import { tmdb } from '@/lib/tmdb'
import PremiumMovieCard from '@/components/movies/PremiumMovieCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10749, name: 'Romance' },
  { id: 16, name: 'Animation' },
]

const MAX_TMDB_PAGES = 500

const parsePositiveInt = (value, fallback = 1) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const buildPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 1) return []

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
  if (currentPage <= 3) {
    pages.add(2)
    pages.add(3)
  }
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1)
    pages.add(totalPages - 2)
  }

  return [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)
}

export default async function MoviesPage({ searchParams }) {
  const params = await searchParams
  const requestedPage = parsePositiveInt(params.page || '1')
  const sort = params.sort || 'popular'
  const genreId = params.genre ? parsePositiveInt(params.genre, 0) : null
  const safePage = Math.min(requestedPage, MAX_TMDB_PAGES)

  let data
  if (genreId) {
    data = await tmdb.movies.byGenre(genreId, safePage)
  } else if (sort === 'top_rated') {
    data = await tmdb.movies.topRated(safePage)
  } else if (sort === 'trending') {
    data = await tmdb.movies.trending(safePage)
  } else if (sort === 'upcoming') {
    data = await tmdb.movies.upcoming(safePage)
  } else {
    data = await tmdb.movies.popular(safePage)
  }

  const movies = data.results
  const totalPages = Math.min(data.total_pages || 1, MAX_TMDB_PAGES)
  const page = Math.min(safePage, totalPages)
  const visiblePages = buildPageNumbers(page, totalPages)

  const getPageUrl = (p) => {
    const q = new URLSearchParams()
    q.set('page', p)
    if (sort && sort !== 'popular') q.set('sort', sort)
    if (genreId) q.set('genre', genreId)
    return `/movies?${q.toString()}`
  }

  const pageTitle = genreId
    ? `${GENRES.find(g => g.id === genreId)?.name || 'Genre'} Movies`
    : sort === 'top_rated' ? 'Top Rated Movies'
    : sort === 'trending' ? 'Trending Movies'
    : sort === 'upcoming' ? 'Upcoming Movies'
    : 'Popular Movies'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-epilogue text-3xl font-bold text-white">{pageTitle}</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Page {page} of {totalPages.toLocaleString()} - {data.total_results?.toLocaleString() || 0} total movies
          </p>
          <p className="text-zinc-600 text-xs mt-1">TMDB allows browsing up to {MAX_TMDB_PAGES} pages per list.</p>
        </div>
        {/* Sort Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'Popular', value: 'popular' },
            { label: 'Top Rated', value: 'top_rated' },
            { label: 'Trending', value: 'trending' },
            { label: 'Upcoming', value: 'upcoming' },
          ].map(tab => (
            <a
              key={tab.value}
              href={`/movies?sort=${tab.value}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sort === tab.value && !genreId
                  ? 'bg-[#FFBF00] text-[#402d00] font-bold'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>

      {/* Genre Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {GENRES.map(genre => (
          <a
            key={genre.id}
            href={genreId === genre.id ? '/movies' : `/movies?genre=${genre.id}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              genreId === genre.id
                ? 'bg-[#FFBF00] text-[#402d00] font-bold'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {genre.name}
          </a>
        ))}
      </div>

      {/* Movie Grid — consistent size with TV page */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <PremiumMovieCard key={movie.id} item={movie} mediaType="movie" />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-14">
          {page > 1 && (
            <a
              href={getPageUrl(page - 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-[#FFBF00] hover:text-[#FFBF00] transition-colors text-sm font-medium text-zinc-400"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </a>
          )}
          <div className="flex items-center gap-1">
            {visiblePages.map((p, index) => (
              <span key={p}>
                {index > 0 && visiblePages[index] - visiblePages[index - 1] > 1 && (
                  <span className="px-2 text-zinc-500">...</span>
                )}
                <a
                  href={getPageUrl(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-[#FFBF00] text-[#402d00] font-bold'
                      : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {p}
                </a>
              </span>
            ))}
          </div>
          {page < totalPages && (
            <a
              href={getPageUrl(page + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-[#FFBF00] hover:text-[#FFBF00] transition-colors text-sm font-medium text-zinc-400"
            >
              Next <ChevronRight className="h-4 w-4" />
            </a>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <a
            href={getPageUrl(Math.min(page + 10, totalPages))}
            className="px-5 py-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-[#FFBF00] transition-colors text-sm"
          >
            Jump +10 pages
          </a>
        </div>
      )}
    </div>
  )
}