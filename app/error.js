'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Something went wrong
          </h2>

          <p className="text-gray-600 mb-6">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try again
            </Button>

            <Button
              onClick={() => (window.location.href = '/dashboard')}
              variant="outline"
              className="px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            If the problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
