import { NextResponse } from 'next/server'
import { tmdb } from '@/lib/tmdb'

export async function POST(request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body?.items) ? body.items : []

    if (items.length === 0) {
      return NextResponse.json({ results: [] })
    }

    const details = await Promise.all(
      items.map(async (item) => {
        if (!item?.tmdbId || !item?.mediaType) return null

        try {
          const mediaType = item.mediaType === 'movie' ? 'movie' : 'tv'
          const data =
            mediaType === 'movie'
              ? await tmdb.movies.details(item.tmdbId)
              : await tmdb.tv.details(item.tmdbId)
          return { ...data, mediaType }
        } catch {
          return null
        }
      })
    )

    return NextResponse.json({ results: details.filter(Boolean) })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to load watchlist details', results: [] },
      { status: 500 }
    )
  }
}
