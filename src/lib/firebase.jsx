import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

let app, auth, googleProvider, db

const isConfigured = () => {
  return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
         !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}

export const getFirebaseApp = () => {
  if (!isConfigured()) return null
  if (!app) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  }
  return app
}

export const getFirebaseAuth = () => {
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  if (!auth) auth = getAuth(firebaseApp)
  return auth
}

export const getGoogleProvider = () => {
  if (!googleProvider) googleProvider = new GoogleAuthProvider()
  return googleProvider
}

export const getFirebaseDb = () => {
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  if (!db) db = getFirestore(firebaseApp)
  return db
}

export const isFirebaseConfigured = isConfigured
export default getFirebaseApp