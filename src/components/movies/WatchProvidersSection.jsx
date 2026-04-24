import Image from 'next/image'
import { getImageUrl } from '@/lib/tmdb'
import { Tv2, ShoppingCart, Download, ExternalLink } from 'lucide-react'

const JUSTWATCH_BASE = 'https://www.justwatch.com'

function ProviderLogo({ provider }) {
  return (
    <div
      className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-primary transition-all hover:scale-110 cursor-default"
      title={provider.provider_name}
    >
      <Image
        src={getImageUrl(provider.logo_path, 'w92')}
        alt={provider.provider_name}
        fill
        className="object-cover"
      />
    </div>
  )
}

function ProviderGroup({ title, icon: Icon, providers, color }) {
  if (!providers?.length) return null
  return (
    <div className="mb-5">
      <div className={`flex items-center gap-2 mb-3`}>
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => (
          <ProviderLogo key={p.provider_id} provider={p} />
        ))}
      </div>
    </div>
  )
}

export default function WatchProvidersSection({ providers, mediaType, id }) {
  // Prefer US results, fall back to GB, then first available country
  const regionData =
    providers?.US ??
    providers?.GB ??
    providers?.[Object.keys(providers ?? {})[0]] ??
    null

  if (!regionData) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/2 p-5">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Tv2 className="h-5 w-5 text-primary" /> Where to Watch
        </h3>
        <p className="text-sm text-muted-foreground">
          No streaming data available for your region.
        </p>
      </div>
    )
  }

  const justWatchUrl = regionData.link ?? `${JUSTWATCH_BASE}/us/${mediaType === 'movie' ? 'movie' : 'tv-show'}/${id}`

  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Tv2 className="h-5 w-5 text-primary" /> Where to Watch
        </h3>
        <a
          href={justWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-400 hover:text-primary flex items-center gap-1 transition-colors"
        >
          JustWatch <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <ProviderGroup
        title="Stream"
        icon={Tv2}
        providers={regionData.flatrate}
        color="text-emerald-400"
      />
      <ProviderGroup
        title="Rent"
        icon={Download}
        providers={regionData.rent}
        color="text-sky-400"
      />
      <ProviderGroup
        title="Buy"
        icon={ShoppingCart}
        providers={regionData.buy}
        color="text-amber-400"
      />

      <p className="text-[10px] text-zinc-600 mt-3">
        Data provided by JustWatch via TMDB
      </p>
    </div>
  )
}
