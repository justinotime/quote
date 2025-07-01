'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-[#191b22] mb-4">Something went wrong</h1>
        <p className="text-lg text-[#7e828f] mb-8">
          We&apos;re sorry, but something unexpected happened. Please try again.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all duration-300"
          >
            Try again
          </button>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 border-2 border-black text-black rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            Go home
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-[#7e828f] mb-2">
              Error details (development only)
            </summary>
            <pre className="text-xs text-red-600 bg-red-50 p-4 rounded-lg overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
} 