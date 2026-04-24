'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Film, Tv, User } from 'lucide-react'
import PremiumMovieCard from '@/components/movies/PremiumMovieCard'
import { tmdb, getImageUrl } from '@/lib/tmdb'

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [searchType, setSearchType] = useState('all')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const debouncedQuery = useDebounce(query)

  useEffect(() => {
    if (initialQuery) {
      handleSearch()
    }
  }, [])

  const handleSearch = async (searchPage = 1) => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      let data
      if (searchType === 'movie') {
        data = await tmdb.search.movies(query, searchPage)
      } else if (searchType === 'tv') {
        data = await tmdb.search.tv(query, searchPage)
      } else if (searchType === 'person') {
        data = await tmdb.search.persons(query, searchPage)
      } else {
        data = await tmdb.search.multi(query, searchPage)
      }
      setResults(data.results)
      setTotalPages(data.total_pages)
      setPage(searchPage)
      router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}&page=${searchPage}`, { scroll: false })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(1)
  }

  const renderResults = () => {
    if (results.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {query ? 'No results found' : 'Enter a search term to find movies, TV shows, or actors'}
        </div>
      )
    }

    if (searchType === 'person') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {results.map((person) => (
            <a 
              key={person.id} 
              href={`/actors/${person.id}`}
              className="group"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-3">
                {person.profile_path ? (
                  <img
                    src={getImageUrl(person.profile_path, 'w342')}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="font-medium">{person.name}</h3>
            </a>
          ))}
        </div>
      )
    }

    const movies = results.filter(r => 'title' in r)
    const shows = results.filter(r => 'name' in r && !('title' in r))

    return (
      <>
        {movies.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Film className="h-6 w-6" /> Movies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
              {movies.map(movie => (
                <PremiumMovieCard key={movie.id} item={movie} mediaType="movie" />
              ))}
            </div>
          </>
        )}
        {shows.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Tv className="h-6 w-6" /> TV Shows
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {shows.map(show => (
                <PremiumMovieCard key={show.id} item={show} mediaType="tv" />
              ))}
            </div>
          </>
        )}
      </>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, actors..."
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-input bg-background text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSearchType('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            searchType === 'all' ? 'bg-primary text-primary-foreground' : 'border'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSearchType('movie')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            searchType === 'movie' ? 'bg-primary text-primary-foreground' : 'border'
          }`}
        >
          <Film className="h-4 w-4" /> Movies
        </button>
        <button
          onClick={() => setSearchType('tv')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            searchType === 'tv' ? 'bg-primary text-primary-foreground' : 'border'
          }`}
        >
          <Tv className="h-4 w-4" /> TV Shows
        </button>
        <button
          onClick={() => setSearchType('person')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            searchType === 'person' ? 'bg-primary text-primary-foreground' : 'border'
          }`}
        >
          <User className="h-4 w-4" /> Actors
        </button>
      </div>

      {renderResults()}

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-12">
          {page > 1 && (
            <button
              onClick={() => handleSearch(page - 1)}
              className="px-6 py-3 rounded-lg border hover:bg-accent transition-colors"
            >
              Previous
            </button>
          )}
          <span className="px-4 py-3">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <button
              onClick={() => handleSearch(page + 1)}
              className="px-6 py-3 rounded-lg border hover:bg-accent transition-colors"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}