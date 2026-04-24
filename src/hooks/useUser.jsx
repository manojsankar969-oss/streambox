import { useFirebaseAuth } from './useFirebaseAuth'

export function useUser() {
  const { user, loading } = useFirebaseAuth()

  // Map uid to id to maintain compatibility with components expecting user.id
  const formattedUser = user ? {
    ...user,
    id: user.uid,
    user_metadata: {
      full_name: user.displayName,
      avatar_url: user.photoURL
    }
  } : null

  return { user: formattedUser, isLoading: loading }
}