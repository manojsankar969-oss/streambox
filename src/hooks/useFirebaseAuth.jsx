'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { 
  onAuthStateChanged, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { getFirebaseAuth, getGoogleProvider, isFirebaseConfigured } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)

export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false)
      return
    }
    
    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    // Safety timeout — if Firebase doesn't respond in 5s, unblock the app
    const timeout = setTimeout(() => setLoading(false), 5000)

    // Handle redirect result (from signInWithRedirect fallback)
    getRedirectResult(auth).catch(() => {
      // Ignore — no redirect in progress
    })

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      clearTimeout(timeout)
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider')
  return context
}

export function useGoogleSignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured. Please check your .env.local file.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const auth = getFirebaseAuth()
      const provider = getGoogleProvider()
      
      if (!auth || !provider) {
        setError('Failed to initialize Firebase. Please check your configuration.')
        setIsLoading(false)
        return
      }

      // Try popup first — fall back to redirect if blocked
      try {
        await signInWithPopup(auth, provider)
        router.push('/')
        router.refresh()
      } catch (popupErr) {
        const blocked = [
          'auth/popup-blocked',
          'auth/popup-closed-by-user',
          'auth/cancelled-popup-request',
        ]
        if (blocked.includes(popupErr.code)) {
          // Redirect fallback — page will reload to Google and come back
          await signInWithRedirect(auth, provider)
          return
        }
        throw popupErr
      }
    } catch (err) {
      console.error('Sign-in Error:', err)
      if (err.code === 'auth/configuration-not-found') {
        setError('Google Sign-In is not enabled in your Firebase Console. Go to Authentication → Sign-in method → Google → Enable.')
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorised in Firebase. Add "localhost" to Firebase Console → Authentication → Settings → Authorised domains.')
      } else {
        setError(err.message || 'Sign-in failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const auth = getFirebaseAuth()
      if (auth) {
        await firebaseSignOut(auth)
      }
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Sign-out Error:', err)
    }
  }

  return { signInWithGoogle, signOut, isLoading, error }
}