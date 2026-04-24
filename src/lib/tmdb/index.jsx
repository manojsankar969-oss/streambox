const API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

const checkApiKey = () => {
  if (!API_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('Missing NEXT_PUBLIC_TMDB_API_KEY environment variable')
  }
}

const fetchTMDB = async (endpoint) => {
  checkApiKey()
  if (!API_KEY) return { results: [], total_pages: 0, total_results: 0 }
  const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`
  const res = await fetch(url, {
    next: { revalidate: 3600 }
  })
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`)
  return res.json()
}

export const tmdb = {
  movies: {
    popular: (page = 1) => 
      fetchTMDB(`/movie/popular?language=en-US&page=${page}`),
    topRated: (page = 1) => 
      fetchTMDB(`/movie/top_rated?language=en-US&page=${page}`),
    nowPlaying: (page = 1) => 
      fetchTMDB(`/movie/now_playing?language=en-US&page=${page}`),
    upcoming: (page = 1) => 
      fetchTMDB(`/movie/upcoming?language=en-US&page=${page}`),
    trending: (page = 1) => 
      fetchTMDB(`/trending/movie/week?page=${page}`),
    details: (id) => 
      fetchTMDB(`/movie/${id}?language=en-US`),
    credits: (id) => 
      fetchTMDB(`/movie/${id}/credits?language=en-US`),
    similar: (id, page = 1) => 
      fetchTMDB(`/movie/${id}/similar?language=en-US&page=${page}`),
    recommendations: (id, page = 1) => 
      fetchTMDB(`/movie/${id}/recommendations?language=en-US&page=${page}`),
    byGenre: (genreId, page = 1) => 
      fetchTMDB(`/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`),
    watchProviders: (id) =>
      fetchTMDB(`/movie/${id}/watch/providers`),
  },

  tv: {
    popular: (page = 1) => 
      fetchTMDB(`/tv/popular?language=en-US&page=${page}`),
    topRated: (page = 1) => 
      fetchTMDB(`/tv/top_rated?language=en-US&page=${page}`),
    onTheAir: (page = 1) => 
      fetchTMDB(`/tv/on_the_air?language=en-US&page=${page}`),
    airingToday: (page = 1) => 
      fetchTMDB(`/tv/airing_today?language=en-US&page=${page}`),
    trending: (page = 1) => 
      fetchTMDB(`/trending/tv/week?page=${page}`),
    details: (id) => 
      fetchTMDB(`/tv/${id}?language=en-US`),
    credits: (id) => 
      fetchTMDB(`/tv/${id}/credits?language=en-US`),
    similar: (id, page = 1) => 
      fetchTMDB(`/tv/${id}/similar?language=en-US&page=${page}`),
    recommendations: (id, page = 1) => 
      fetchTMDB(`/tv/${id}/recommendations?language=en-US&page=${page}`),
    seasons: (id, seasonNumber) => 
      fetchTMDB(`/tv/${id}/season/${seasonNumber}?language=en-US`),
    byGenre: (genreId, page = 1) => 
      fetchTMDB(`/discover/tv?with_genres=${genreId}&language=en-US&page=${page}`),
    watchProviders: (id) =>
      fetchTMDB(`/tv/${id}/watch/providers`),
  },

  persons: {
    trending: (page = 1) => 
      fetchTMDB(`/trending/person/week?page=${page}`),
    details: (id) => 
      fetchTMDB(`/person/${id}?language=en-US`),
    movieCredits: (id) => 
      fetchTMDB(`/person/${id}/movie_credits?language=en-US`),
    tvCredits: (id) => 
      fetchTMDB(`/person/${id}/tv_credits?language=en-US`),
    images: (id) => 
      fetchTMDB(`/person/${id}/images`),
  },

  search: {
    multi: (query, page = 1) => 
      fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`),
    movies: (query, page = 1) => 
      fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`),
    tv: (query, page = 1) => 
      fetchTMDB(`/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}`),
    persons: (query, page = 1) => 
      fetchTMDB(`/search/person?query=${encodeURIComponent(query)}&page=${page}`),
  },

  genres: {
    movieList: () => 
      fetchTMDB('/genre/movie/list?language=en-US'),
    tvList: () => 
      fetchTMDB('/genre/tv/list?language=en-US'),
  },

  discover: {
    movies: (params = {}) => {
      const query = new URLSearchParams()
      if (params.sort_by) query.set('sort_by', params.sort_by)
      if (params.with_genres) query.set('with_genres', params.with_genres)
      if (params.year) query.set('primary_release_year', params.year.toString())
      if (params.vote_average_gte) query.set('vote_average.gte', params.vote_average_gte.toString())
      if (params.page) query.set('page', params.page.toString())
      return fetchTMDB(`/discover/movie?${query}&language=en-US`)
    },
  },
}

export const getImageUrl = (path, size = 'w342') => {
  if (!path) return 'https://placehold.co/342x513/18181b/FFFFFF?text=No+Image'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export default tmdb