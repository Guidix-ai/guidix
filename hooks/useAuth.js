'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth(redirectTo = '/login') {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true'

      if (!authStatus) {
        router.push(redirectTo)
      } else {
        setIsAuthenticated(true)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, redirectTo])

  return { isAuthenticated, isLoading }
}

export function logout() {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userEmail')
  window.location.href = '/login'
}
