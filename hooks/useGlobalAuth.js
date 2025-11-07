'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '@/app/redux/actions/authActions'

/**
 * Global authentication hook
 *
 * Call this in your root layout to:
 * 1. Validate session on app load
 * 2. Refresh user data from /users/me
 * 3. Keep auth state in sync
 *
 * Usage:
 *   import { useGlobalAuth } from '@/hooks/useGlobalAuth'
 *
 *   export default function RootLayout({ children }) {
 *     useGlobalAuth()  // Add this line
 *     return <html>...</html>
 *   }
 */
export function useGlobalAuth() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    const validateSession = async () => {
      // Only validate if user appears to be authenticated
      const authFlag = typeof window !== 'undefined'
        ? localStorage.getItem('isAuthenticated') === 'true'
        : false

      if (authFlag) {
        try {
          // Call /users/me to validate session and refresh user data
          await dispatch(getUserProfile()).unwrap()
          console.log('✅ Session validated successfully')
        } catch (error) {
          // Session invalid - auth state will be cleared by getUserProfile
          console.log('❌ Session validation failed:', error)
        }
      }
    }

    validateSession()
  }, [dispatch])

  return { isAuthenticated }
}
