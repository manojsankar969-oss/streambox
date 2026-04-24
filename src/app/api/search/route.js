import { NextResponse } from 'next/server'
import { tmdb } from '@/lib/tmdb'

const searchMap = {
  all: 'multi',
  movie: 'movies',
  tv: 'tv',
  person: 'persons',
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') || '').trim()
  const type = searchParams.get('type') || 'all'
  const page = Number(searchParams.get('page') || 1)

  if (!query) {
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0 })
  }

  if (!searchMap[type]) {
    return NextResponse.json({ error: 'Invalid search type' }, { status: 400 })
  }

  try {
    const method = searchMap[type]
    const data = await tmdb.search[method](query, page)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Search failed', results: [], total_pages: 0, total_results: 0 },
      { status: 500 }
    )
  }
}
