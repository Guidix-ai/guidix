'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { loginUser } from '@/app/redux/actions/authActions'
import { clearError } from '@/app/redux/reducers/authSlice'

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
  showPasswordToggle = false,
  onTogglePassword,
  isPasswordVisible,
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
    <div style={{ position: "relative" }}>
      <input
        id={name}
        name={name}
        type={showPasswordToggle ? (isPasswordVisible ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 56,
          minHeight: 56,
          paddingLeft: 16,
          paddingRight: showPasswordToggle ? 48 : 16,
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
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colorTokens.paragraph,
          }}
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
        >
          {isPasswordVisible ? (
            // Eye slash icon (hide)
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            // Eye icon (show)
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      )}
    </div>
  </div>
);

const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState('')
  const [authMessage, setAuthMessage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // Check for redirect message
  useEffect(() => {
    const message = searchParams.get('message')
    if (message && MESSAGES[message]) {
      setAuthMessage(MESSAGES[message])
    }
  }, [searchParams])

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError('login'))
    }
  }, [dispatch])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('') // Clear local error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault()
    setLocalError('')
    setAuthMessage(null)

    // Validate fields
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields')
      return
    }

    try {
      // Dispatch Redux login action
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password,
        remember_me: false
      })).unwrap()

      // Success - redirect to home
      router.push('/')
    } catch (err) {
      // Error is already in Redux state
      console.error('Login failed:', err)

      // Handle specific error messages
      if (err && typeof err === 'string' && (
        err.toLowerCase().includes('verify') ||
        err.toLowerCase().includes('not verified') ||
        err.toLowerCase().includes('verification')
      )) {
        setLocalError('Please verify your email before logging in. Check your inbox for the verification link.')
      }
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
      className='hidden lg:flex'
        style={{
          flex: "1",
          maxWidth: "600px",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0px 12px 32px -4px rgba(35,112,255,0.4), 0px 2px 2px 0 rgba(0,19,88,0.1), 0px 4px 8px -2px rgba(0,19,88,0.4)",
          minHeight: "600px",
          position: "relative",
          // display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/Card.svg"
          alt="Welcome Back"
          fill
          style={{
            objectFit: "none",
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
              // width: 580,
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
              // width: 580,
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
            // width: 580,
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
            showPasswordToggle={true}
            isPasswordVisible={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          {/* Error Message */}
          {(error.login || localError) && (
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
                {error.login || localError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading.login}
              style={{
                display: 'inline-flex',
                width: '100%',
                padding: '12px 16px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                border: '1px solid rgba(35, 112, 255, 0.30)',
                background: loading.login ? '#94A3B8' : 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                color: '#FFFFFF',
                textAlign: 'center',
                textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '125%',
                letterSpacing: '-0.32px',
                cursor: loading.login ? "not-allowed" : "pointer",
                opacity: loading.login ? 0.7 : 1,
              }}
            >
              {loading.login ? "Signing in..." : "Sign In"}
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
