'use client'

import { useState } from 'react'

export default function BiographyText({ text }) {
  const [expanded, setExpanded] = useState(false)
  const limit = 600

  if (!text) return null

  const isLong = text.length > limit
  const displayed = expanded || !isLong ? text : text.slice(0, limit) + '...'

  return (
    <div>
      <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
        {displayed}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </button>
      )}
    </div>
  )
}
