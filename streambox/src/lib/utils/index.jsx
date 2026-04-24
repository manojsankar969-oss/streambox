import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString) {
  if (!dateString) return 'TBA'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatYear(dateString) {
  if (!dateString) return 'N/A'
  return dateString.split('-')[0]
}

export function formatRating(rating) {
  if (!rating) return 'N/A'
  return rating.toFixed(1)
}

export function formatRuntime(minutes) {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function truncate(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function getRatingColor(rating) {
  if (rating >= 8) return 'text-green-500'
  if (rating >= 6) return 'text-yellow-500'
  return 'text-red-500'
}