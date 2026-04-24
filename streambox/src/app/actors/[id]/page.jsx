import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  Star,
  Film,
  Tv,
  Award,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react'
import { tmdb, getImageUrl } from '@/lib/tmdb'
import { formatDate } from '@/lib/utils'
import PremiumMovieCard from '@/components/movies/PremiumMovieCard'
import BiographyText from '@/components/actors/BiographyText'

async function getPersonData(id) {
  try {
    const [person, movieCredits, tvCredits, images] = await Promise.all([
      tmdb.persons.details(id),
      tmdb.persons.movieCredits(id),
      tmdb.persons.tvCredits(id),
      tmdb.persons.images(id),
    ])
    return {
      person,
      movieCredits: movieCredits.cast ?? [],
      tvCredits: tvCredits.cast ?? [],
      images: images.profiles ?? [],
    }
  } catch {
    return null
  }
}

function calculateAge(birthday, deathday) {
  if (!birthday) return null
  const end = deathday ? new Date(deathday) : new Date()
  const birth = new Date(birthday)
  let age = end.getFullYear() - birth.getFullYear()
  const m = end.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--
  return age
}

function StatBadge({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-[100px]">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}

export default async function ActorPage({ params }) {
  const { id } = await params
  const personId = parseInt(id)

  if (isNaN(personId)) return notFound()

  const data = await getPersonData(personId)
  if (!data) return notFound()

  const { person, movieCredits, tvCredits, images } = data

  const age = calculateAge(person.birthday, person.deathday)
  const popularity = person.popularity ? Math.round(person.popularity) : null

  // Sort credits by popularity / vote count
  const sortedMovies = [...movieCredits]
    .filter((m) => m.poster_path)
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    .slice(0, 18)

  const sortedTV = [...tvCredits]
    .filter((t) => t.poster_path)
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    .slice(0, 18)

  const galleryImages = images.slice(0, 8)

  const backdropPath = person.profile_path
    ? getImageUrl(person.profile_path, 'original')
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO / HEADER ───────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* blurred backdrop */}
        {backdropPath && (
          <div className="absolute inset-0 scale-110">
            <Image
              src={backdropPath}
              alt=""
              fill
              className="object-cover blur-2xl opacity-20 saturate-150"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
        )}

        <div className="relative container mx-auto px-4 pt-6 pb-12">
          {/* Back link */}
          <Link
            href="/actors"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Actors
          </Link>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Profile image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-52 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-primary/20">
                <Image
                  src={getImageUrl(person.profile_path, 'w500')}
                  alt={person.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {person.known_for_department && (
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                  {person.known_for_department}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 leading-tight">
                {person.name}
              </h1>

              {/* Quick stat badges */}
              <div className="flex flex-wrap gap-3 my-6">
                {age && (
                  <StatBadge
                    icon={Calendar}
                    label={person.deathday ? 'Age at death' : 'Age'}
                    value={age}
                  />
                )}
                {popularity && (
                  <StatBadge icon={Star} label="Popularity" value={popularity} />
                )}
                {movieCredits.length > 0 && (
                  <StatBadge icon={Film} label="Movies" value={movieCredits.length} />
                )}
                {tvCredits.length > 0 && (
                  <StatBadge icon={Tv} label="TV Shows" value={tvCredits.length} />
                )}
              </div>

              {/* Meta info */}
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                {person.birthday && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>
                      Born{' '}
                      <span className="text-foreground font-medium">
                        {formatDate(person.birthday)}
                      </span>
                      {person.deathday && (
                        <>
                          {' · '}Died{' '}
                          <span className="text-foreground font-medium">
                            {formatDate(person.deathday)}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{person.place_of_birth}</span>
                  </div>
                )}
                {person.homepage && (
                  <a
                    href={person.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline w-fit"
                  >
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    Official Website
                  </a>
                )}
              </div>

              {/* Biography */}
              {person.biography && (
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" /> Biography
                  </h2>
                  <BiographyText text={person.biography} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PHOTO GALLERY ───────────────────────────────────────── */}
      {galleryImages.length > 1 && (
        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full inline-block" />
            Photo Gallery
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted ring-1 ring-border hover:ring-primary transition-all"
              >
                <Image
                  src={getImageUrl(img.file_path, 'w185')}
                  alt={`${person.name} photo ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FILMOGRAPHY ─────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pb-16 space-y-14">
        {/* Movies */}
        {sortedMovies.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              <Film className="h-5 w-5 text-primary" />
              Movies
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({movieCredits.length} total)
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sortedMovies.map((movie) => (
                <PremiumMovieCard
                  key={`movie-${movie.id}`}
                  item={movie}
                  mediaType="movie"
                />
              ))}
            </div>
          </section>
        )}

        {/* TV Shows */}
        {sortedTV.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              <Tv className="h-5 w-5 text-primary" />
              TV Shows
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({tvCredits.length} total)
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sortedTV.map((show) => (
                <PremiumMovieCard key={`tv-${show.id}`} item={show} mediaType="tv" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}