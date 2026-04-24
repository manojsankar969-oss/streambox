'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase'
import { 
  collection, 
  query, 
  where, 
  setDoc,
  deleteDoc, 
  doc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore'

let cachedDb = null
let dbChecked = false

function getDb() {
  if (!dbChecked) {
    dbChecked = true
    cachedDb = isFirebaseConfigured() ? getFirebaseDb() : null
  }
  return cachedDb
}

export function useWatchlist(userId) {
  const queryClient = useQueryClient()
  const [guestId, setGuestId] = useState(() => {
    if (typeof window === 'undefined') return null
    let id = localStorage.getItem('streambox_guest_id')
    if (!id) {
      id = `guest_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('streambox_guest_id', id)
    }
    return id
  })

  const effectiveUserId = useMemo(() => userId || guestId || null, [userId, guestId])
  const queryKey = useMemo(() => ['watchlist', effectiveUserId], [effectiveUserId])

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!effectiveUserId) return []
      const db = getDb()
      if (!db) return []
      
      try {
        const q = query(
          collection(db, 'watchlist'),
          where('userId', '==', effectiveUserId)
        )
        const snapshot = await getDocs(q)
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        return items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      } catch {
        return []
      }
    },
    enabled: !!effectiveUserId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })

  const isInWatchlist = useCallback((tmdbId, mediaType) => {
    return watchlist.some(item => item.tmdbId === tmdbId && item.mediaType === mediaType)
  }, [watchlist])

  const addToWatchlist = useMutation({
    mutationFn: async ({ tmdbId, mediaType, title, posterPath }) => {
      const activeId = userId || guestId
      if (!activeId) return
      
      const db = getDb()
      if (!db) return

      const docId = `${activeId}_${tmdbId}_${mediaType}`
      await setDoc(doc(db, 'watchlist', docId), {
        userId: activeId,
        tmdbId,
        mediaType,
        title: title || null,
        posterPath: posterPath || null,
        createdAt: serverTimestamp(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const removeFromWatchlist = useMutation({
    mutationFn: async ({ tmdbId, mediaType }) => {
      const activeId = userId || guestId
      if (!activeId) return
      
      const db = getDb()
      if (!db) return

      const docId = `${activeId}_${tmdbId}_${mediaType}`
      await deleteDoc(doc(db, 'watchlist', docId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  }
}