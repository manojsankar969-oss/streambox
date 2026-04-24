'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  doc, 
  getDocs,
  serverTimestamp,
  getDoc
} from 'firebase/firestore'

export function useReviews(tmdbId, mediaType) {
  const queryClient = useQueryClient()

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['reviews', tmdbId, mediaType],
    queryFn: async () => {
      if (!tmdbId || !mediaType) return []
      if (!isFirebaseConfigured()) return []
      
      const db = getFirebaseDb()
      if (!db) return []

      const q = query(
        collection(db, 'reviews'),
        where('tmdbId', '==', tmdbId),
        where('mediaType', '==', mediaType),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const reviewsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data()
          let username = 'Anonymous'
          if (data.userId) {
            const userDoc = await getDoc(doc(db, `users/${data.userId}`))
            if (userDoc.exists()) {
              username = userDoc.data().displayName || 'Anonymous'
            }
          }
          return { id: docSnap.id, ...data, username }
        })
      )
      return reviewsData
    },
    enabled: !!tmdbId && !!mediaType,
  })

  const addReview = useMutation({
    mutationFn: async ({ userId, rating, content }) => {
      if (!tmdbId || !mediaType) throw new Error('Missing parameters')
      if (!isFirebaseConfigured()) throw new Error('Firebase not configured')
      
      const db = getFirebaseDb()
      if (!db) throw new Error('Firebase not initialized')
      
      await addDoc(collection(db, 'reviews'), {
        userId,
        tmdbId,
        mediaType,
        rating,
        content,
        createdAt: serverTimestamp(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  const updateReview = useMutation({
    mutationFn: async ({ reviewId, rating, content }) => {
      if (!isFirebaseConfigured()) return
      
      const db = getFirebaseDb()
      if (!db) return

      const reviewRef = doc(db, 'reviews', reviewId)
      await updateDoc(reviewRef, { 
        rating, 
        content, 
        updatedAt: serverTimestamp() 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  const deleteReview = useMutation({
    mutationFn: async ({ reviewId }) => {
      if (!isFirebaseConfigured()) return
      
      const db = getFirebaseDb()
      if (!db) return

      await deleteDoc(doc(db, 'reviews', reviewId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  return {
    reviews,
    isLoading,
    error,
    addReview,
    updateReview,
    deleteReview,
  }
}