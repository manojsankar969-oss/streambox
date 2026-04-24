import { tmdb } from '@/lib/tmdb'
import MovieGrid from '@/components/movies/MovieGrid'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
]

export default async function TvPage({ searchParams }) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const sort = params.sort || 'popular'
  const genreId = params.genre ? parseInt(params.genre) : null

  let data
  if (genreId) {
    data = await tmdb.tv.byGenre(genreId, page)
  } else if (sort === 'top_rated') {
    data = await tmdb.tv.topRated(page)
  } else if (sort === 'trending') {
    data = await tmdb.tv.trending(page)
  } else if (sort === 'on_the_air') {
    data = await tmdb.tv.onTheAir(page)
  } else {
    data = await tmdb.tv.popular(page)
  }

  const shows = data.results
  const totalPages = Math.min(data.total_pages, 500)

  const getPageUrl = (p) => {
    const q = new URLSearchParams()
    q.set('page', p)
    if (sort && sort !== 'popular') q.set('sort', sort)
    if (genreId) q.set('genre', genreId)
    return `/tv?${q.toString()}`
  }

  const pageTitle = genreId
    ? `${TV_GENRES.find(g => g.id === genreId)?.name || 'Genre'} TV Shows`
    : sort === 'top_rated' ? 'Top Rated TV Shows'
    : sort === 'trending' ? 'Trending TV Shows'
    : sort === 'on_the_air' ? 'On The Air'
    : 'Popular TV Shows'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-epilogue text-3xl font-bold text-white">{pageTitle}</h1>
          <p className="text-zinc-500 text-sm mt-1">Page {page} of {totalPages.toLocaleString()}</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <a href="/tv" className={`px-4 py-2 rounded-lg text-sm font-medium ${!sort || sort === 'popular' && !genreId ? 'bg-[#FFBF00] text-[#402d00] font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
            Popular
          </a>
          <a href="/tv?sort=top_rated" className={`px-4 py-2 rounded-lg text-sm font-medium ${sort === 'top_rated' && !genreId ? 'bg-[#FFBF00] text-[#402d00] font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
            Top Rated
          </a>
          <a href="/tv?sort=trending" className={`px-4 py-2 rounded-lg text-sm font-medium ${sort === 'trending' && !genreId ? 'bg-[#FFBF00] text-[#402d00] font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
            Trending
          </a>
          <a href="/tv?sort=on_the_air" className={`px-4 py-2 rounded-lg text-sm font-medium ${sort === 'on_the_air' && !genreId ? 'bg-[#FFBF00] text-[#402d00] font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
            On The Air
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {TV_GENRES.map(genre => (
          <a
            key={genre.id}
            href={genreId === genre.id ? '/tv' : `/tv?genre=${genre.id}`}
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

      <MovieGrid items={shows} mediaType="tv" />

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
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, Math.min(page - 2, totalPages - 4))
              return startPage + i
            })
              .filter(p => p >= 1 && p <= totalPages)
              .map(p => (
                <a
                  key={p}
                  href={getPageUrl(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-[#FFBF00] text-[#402d00] font-bold'
                      : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {p}
                </a>
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
    </div>
  )
}