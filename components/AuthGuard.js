'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * AuthGuard Component - Client-side authentication protection
 * Wraps protected pages to ensure user is authenticated
 */
export default function AuthGuard({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Check authentication flag and user data
      // Actual token is in HTTP-only cookie (not accessible from JS)
      const isAuth = localStorage.getItem('isAuthenticated') === 'true'
      const user = localStorage.getItem('user')

      if (!isAuth || !user) {
        // Not authenticated - redirect to login
        const currentPath = window.location.pathname
        router.push(`/login?message=auth_required&redirect=${encodeURIComponent(currentPath)}`)
      } else {
        setIsAuthenticated(true)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FF'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E5E7EB',
            borderTopColor: '#2370FF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Only render children if authenticated
  return isAuthenticated ? children : null
}
