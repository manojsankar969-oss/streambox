import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/tmdb'

function getKeyCrew(crew = [], mediaType = 'movie') {
  const moviePriorities = ['Director', 'Writer', 'Screenplay', 'Producer']
  const tvPriorities = ['Creator', 'Executive Producer', 'Producer', 'Writer']
  const priorities = mediaType === 'tv' ? tvPriorities : moviePriorities

  const picked = []
  for (const role of priorities) {
    const person = crew.find((member) => member.job === role || member.known_for_department === role)
    if (person && !picked.some((p) => p.id === person.id)) {
      picked.push({ ...person, displayRole: role })
    }
  }

  return picked.slice(0, 4)
}

export default function CastSection({ cast, crew, mediaType = 'movie' }) {
  const displayCast = cast?.slice(0, 20) || []
  const keyCrew = getKeyCrew(crew, mediaType)

  if (displayCast.length === 0) {
    return null
  }

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Top Cast</h2>
          <p className="text-sm text-zinc-500 mt-1">Main actors and their character names.</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 mb-6">
        {displayCast.map(person => (
          <Link
            key={person.id}
            href={`/actors/${person.id}`}
            className="flex-shrink-0 w-28 md:w-36 rounded-xl border border-white/10 bg-zinc-900/50 p-2.5 hover:border-[#FFBF00]/60 transition-colors"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-2">
              {person.profile_path ? (
                <Image
                  src={getImageUrl(person.profile_path, 'w185')}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center p-2 bg-muted">
                  <span className="text-xs text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
            <p className="text-sm font-semibold line-clamp-1">{person.name}</p>
            <p className="text-xs text-zinc-400 line-clamp-1">{person.character || 'Cast'}</p>
            {typeof person.order === 'number' && (
              <p className="text-[11px] text-zinc-500 mt-1">Order #{person.order + 1}</p>
            )}
          </Link>
        ))}
      </div>

      {keyCrew.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">Key Crew</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {keyCrew.map((member) => (
              <Link
                key={member.id}
                href={`/actors/${member.id}`}
                className="rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2.5 hover:border-[#FFBF00]/60 transition-colors"
              >
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-zinc-400">{member.displayRole}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}