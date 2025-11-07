'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.guidix.ai';

/**
 * AuthGuard Component
 * Protects routes by verifying authentication via API call
 * Uses cookies automatically - no localStorage checks
 */
export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Verify authentication by calling /users/me
        // Cookies are sent automatically
        const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
          method: 'GET',
          credentials: 'include',  // Send cookies
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Not authenticated - redirect to login
          router.push('/login?message=auth_required');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login?message=auth_required');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router])

  // Show loading state while validating
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FF'
      }}>
        <div style={{ textAlign: 'center' }}>
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
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Validating session...</p>
        </div>
      </div>
    )
  }

  // Only render children if authenticated
  return isAuthenticated ? children : null
}
