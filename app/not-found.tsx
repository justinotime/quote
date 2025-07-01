import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-[#191b22] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#191b22] mb-4">Page not found</h2>
        <p className="text-lg text-[#7e828f] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all duration-300"
        >
          Go home
        </Link>
      </div>
    </div>
  );
} 