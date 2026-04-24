'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore'

export function useWatchlist(userId) {
  const queryClient = useQueryClient()

  const { data: watchlist = [], isLoading, error } = useQuery({
    queryKey: ['watchlist', userId],
    queryFn: async () => {
      if (!userId) return []
      if (!isFirebaseConfigured()) return []
      
      const db = getFirebaseDb()
      if (!db) return []

      const q = query(
        collection(db, 'watchlist'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    },
    enabled: !!userId,
  })

  const addToWatchlist = useMutation({
    mutationFn: async ({ tmdbId, mediaType }) => {
      if (!userId) throw new Error('Not authenticated')
      if (!isFirebaseConfigured()) throw new Error('Firebase not configured')
      
      const db = getFirebaseDb()
      if (!db) throw new Error('Firebase not initialized')
      
      await addDoc(collection(db, 'watchlist'), {
        userId,
        tmdbId,
        mediaType,
        createdAt: serverTimestamp(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })

  const removeFromWatchlist = useMutation({
    mutationFn: async ({ tmdbId, mediaType }) => {
      if (!userId) throw new Error('Not authenticated')
      if (!isFirebaseConfigured()) return
      
      const db = getFirebaseDb()
      if (!db) return

      const q = query(
        collection(db, 'watchlist'),
        where('userId', '==', userId),
        where('tmdbId', '==', tmdbId),
        where('mediaType', '==', mediaType)
      )
      const snapshot = await getDocs(q)
      await Promise.all(snapshot.docs.map(d => deleteDoc(doc(db, 'watchlist', d.id))))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })

  const isInWatchlist = (tmdbId, mediaType) => {
    return watchlist.some(
      item => item.tmdbId === tmdbId && item.mediaType === mediaType
    )
  }

  return {
    watchlist,
    isLoading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  }
}