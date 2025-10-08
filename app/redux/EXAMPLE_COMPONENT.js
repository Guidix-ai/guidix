/**
 * =============================================================================
 * COMPLETE WORKING EXAMPLE - Login & Dashboard Component
 * =============================================================================
 * This file shows a complete example of how to use the JWT auth system
 * in a real component.
 */

'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
} from './actions/authActions';
import {
  clearError,
  clearSuccessMessage,
} from './reducers/authSlice';

/**
 * =============================================================================
 * LOGIN COMPONENT
 * =============================================================================
 */
export function LoginComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError('login'));
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch login action
      await dispatch(loginUser(formData)).unwrap();

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      // Error is already in Redux state
      console.error('Login failed:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login</h2>

      {error.login && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: '#fee',
          color: '#c00',
          borderRadius: '5px',
        }}>
          {error.login}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading.login}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading.login ? '#ccc' : '#2370FF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading.login ? 'not-allowed' : 'pointer',
          }}
        >
          {loading.login ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Don&apos;t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

/**
 * =============================================================================
 * REGISTER COMPONENT
 * =============================================================================
 */
export function RegisterComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError('register'));
      dispatch(clearSuccessMessage('register'));
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await dispatch(registerUser(userData)).unwrap();

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Register</h2>

      {error.register && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: '#fee',
          color: '#c00',
          borderRadius: '5px',
        }}>
          {error.register}
        </div>
      )}

      {success.register && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: '#efe',
          color: '#080',
          borderRadius: '5px',
        }}>
          {success.register}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading.register}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading.register ? '#ccc' : '#2370FF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading.register ? 'not-allowed' : 'pointer',
          }}
        >
          {loading.register ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

/**
 * =============================================================================
 * DASHBOARD COMPONENT (Protected)
 * =============================================================================
 */
export function DashboardComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch latest user profile on mount
    dispatch(getUserProfile());
  }, [isAuthenticated, dispatch, router]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const refreshProfile = async () => {
    try {
      await dispatch(getUserProfile()).unwrap();
      alert('Profile refreshed successfully!');
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  if (loading.profile) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  if (error.profile) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Error loading dashboard</h2>
        <p style={{ color: '#c00' }}>{error.profile}</p>
        <button onClick={refreshProfile}>Try Again</button>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
      }}>
        <h1>Dashboard</h1>
        <button
          onClick={handleLogout}
          disabled={loading.logout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#c00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading.logout ? 'not-allowed' : 'pointer',
          }}
        >
          {loading.logout ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h2>Welcome, {user.name}!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>

        <button
          onClick={refreshProfile}
          disabled={loading.profile}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#2370FF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading.profile ? 'Refreshing...' : 'Refresh Profile'}
        </button>
      </div>

      <div style={{
        backgroundColor: '#e8f4f8',
        padding: '20px',
        borderRadius: '8px',
      }}>
        <h3>🔒 This is a Protected Page</h3>
        <p>
          This page demonstrates:
        </p>
        <ul>
          <li>✅ Automatic authentication check</li>
          <li>✅ Redirect to login if not authenticated</li>
          <li>✅ Fetch user profile with automatic token handling</li>
          <li>✅ Automatic token refresh if expired</li>
          <li>✅ Logout functionality</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * =============================================================================
 * HOW TO USE THESE COMPONENTS
 * =============================================================================
 *
 * 1. Create page files:
 *
 * app/(pages)/login/page.js:
 * ---------------------------
 * 'use client';
 * import { LoginComponent } from '@/app/redux/EXAMPLE_COMPONENT';
 * export default function LoginPage() {
 *   return <LoginComponent />;
 * }
 *
 *
 * 2. Create page files:
 *
 * app/(pages)/register/page.js:
 * -----------------------------
 * 'use client';
 * import { RegisterComponent } from '@/app/redux/EXAMPLE_COMPONENT';
 * export default function RegisterPage() {
 *   return <RegisterComponent />;
 * }
 *
 *
 * 3. Create page files:
 *
 * app/(pages)/dashboard/page.js:
 * ------------------------------
 * 'use client';
 * import { DashboardComponent } from '@/app/redux/EXAMPLE_COMPONENT';
 * export default function DashboardPage() {
 *   return <DashboardComponent />;
 * }
 *
 *
 * That's it! The JWT authentication with automatic token refresh will work
 * automatically for all protected API calls.
 */
