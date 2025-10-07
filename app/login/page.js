'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getApiUrl } from '@/lib/api-config'
import { setAuthTokens } from '@/lib/cookies'

const colorTokens = {
  title: "#002A79",
  paragraph: "#6477B4",
  bgLight: "#F8F9FF",
  secondary600: "#2370FF",
  secondary700: "#1B54CA",
  accent30: "rgba(35,112,255,0.3)",
};

// Message configurations
const MESSAGES = {
  auth_required: {
    type: 'info',
    text: 'Authentication Required',
    description: 'Please sign in to access this page'
  },
  session_expired: {
    type: 'warning',
    text: 'Session Expired',
    description: 'Your session has expired. Please sign in again'
  },
  logged_out: {
    type: 'success',
    text: 'Logged Out Successfully',
    description: 'You have been logged out of your account'
  },
  unauthorized: {
    type: 'error',
    text: 'Unauthorized Access',
    description: 'You do not have permission to access that page'
  }
}

const FormField = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  styleProps,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8, ...styleProps }}>
    <label
      htmlFor={name}
      style={{
        color: colorTokens.title,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: "Inter, sans-serif",
        lineHeight: "20px",
      }}
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        height: 56,
        minHeight: 56,
        paddingLeft: 16,
        paddingRight: 6,
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: colorTokens.bgLight,
        borderRadius: 16,
        boxShadow:
          "0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)",
        outline: "1px solid #C7D6ED",
        fontSize: 16,
        color: colorTokens.paragraph,
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        lineHeight: "125%",
        letterSpacing: "-0.32px",
      }}
    />
  </div>
);

const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState(null)

  // Check for redirect message
  useEffect(() => {
    const message = searchParams.get('message')
    if (message && MESSAGES[message]) {
      setAuthMessage(MESSAGES[message])
    }
  }, [searchParams])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setAuthMessage(null)

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.data?.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user))
          localStorage.setItem('userEmail', data.data.user.email)
        }

        localStorage.setItem('isAuthenticated', 'true')
        router.push('/')
      } else {
        if (data.message && (
          data.message.toLowerCase().includes('verify') ||
          data.message.toLowerCase().includes('not verified') ||
          data.message.toLowerCase().includes('verification')
        )) {
          setError('Please verify your email before logging in. Check your inbox for the verification link.')
        } else {
          setError(data.message || 'Invalid email or password')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        input::placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        input::-webkit-input-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        input::-moz-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        input:-ms-input-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
      `}</style>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
      <div
        style={{
          display: "flex",
          gap: 100,
          maxWidth: "1400px",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      {/* Image Container on left */}
      <div
        style={{
          flex: "1",
          maxWidth: "600px",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0px 12px 32px -4px rgba(35,112,255,0.4), 0px 2px 2px 0 rgba(0,19,88,0.1), 0px 4px 8px -2px rgba(0,19,88,0.4)",
          minHeight: "600px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/Card.svg"
          alt="Welcome Back"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "-30px center",
          }}
        />
        <div style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          zIndex: 1,
        }}>
          <Image
            src="/white guidix.ai logo .svg"
            alt="Guidix.ai"
            width={120}
            height={40}
            style={{
              height: "40px",
              width: "auto",
              mixBlendMode: "screen",
            }}
          />
        </div>
        <div style={{
          position: "relative",
          zIndex: 1,
          color: "#dbe2ff",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "48px 40px",
        }}>
          <div style={{ fontWeight: 500, fontSize: 48, lineHeight: "56px" }}>
            Welcome Back!
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 18,
              lineHeight: "28px",
              maxWidth: 384,
            }}
          >
            Sign in to continue your placement journey
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div
        style={{
          flex: "1",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          justifyContent: "center",
        }}
      >
        <div>
          <h1
            style={{
              width: 580,
              color: colorTokens.title,
              fontSize: 48,
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              lineHeight: "60px",
              margin: 0,
            }}
          >
            Sign In
          </h1>
          <p
            style={{
              marginTop: 12,
              width: 580,
              color: colorTokens.paragraph,
              fontSize: 16,
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
              lineHeight: "24px",
            }}
          >
            Enter your credentials to access your account
          </p>
        </div>

        {/* Authentication Message */}
        {authMessage && (
          <div
            style={{
              marginBottom: 16,
              padding: 16,
              borderRadius: 16,
              border: '1px solid',
              backgroundColor: authMessage.type === 'error' ? '#FEE2E2' :
                             authMessage.type === 'warning' ? '#FEF3C7' :
                             authMessage.type === 'success' ? '#D1FAE5' : '#DBEAFE',
              borderColor: authMessage.type === 'error' ? '#FCA5A5' :
                          authMessage.type === 'warning' ? '#FCD34D' :
                          authMessage.type === 'success' ? '#6EE7B7' : '#93C5FD'
            }}
          >
            <p style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 4,
              fontFamily: "Inter, sans-serif",
              color: authMessage.type === 'error' ? '#DC2626' :
                     authMessage.type === 'warning' ? '#D97706' :
                     authMessage.type === 'success' ? '#059669' : '#2563EB'
            }}>
              {authMessage.text}
            </p>
            <p style={{
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
              color: authMessage.type === 'error' ? '#991B1B' :
                     authMessage.type === 'warning' ? '#92400E' :
                     authMessage.type === 'success' ? '#065F46' : '#1E40AF'
            }}>
              {authMessage.description}
            </p>
          </div>
        )}

        <form
          onSubmit={handleLogin}
          autoComplete="off"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: 580,
          }}
        >
          <FormField
            name="email"
            label="Email address"
            type="email"
            placeholder="rajesh.sharma@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
          />

          {/* Error Message */}
          {error && (
            <div style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5'
            }}>
              <p style={{
                fontSize: 14,
                color: '#DC2626',
                fontFamily: "Inter, sans-serif",
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'inline-flex',
                width: '100%',
                padding: '12px 16px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                border: '1px solid rgba(35, 112, 255, 0.30)',
                background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                color: '#FFFFFF',
                textAlign: 'center',
                textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '125%',
                letterSpacing: '-0.32px',
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: "center" }}>
            <Link
              href="/forgot-password"
              style={{
                fontSize: 14,
                color: colorTokens.secondary600,
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign Up Link */}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <p
              style={{
                fontSize: 14,
                color: colorTokens.paragraph,
                fontFamily: "Inter, sans-serif",
                lineHeight: "20px",
                margin: 0,
              }}
            >
              Don&apos;t have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                style={{
                  color: colorTokens.secondary600,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
      </div>
    </div>
    </>
  )
}

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

export default LoginPage
