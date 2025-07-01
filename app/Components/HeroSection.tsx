'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { ArrowRight, PenTool } from 'lucide-react';
import { useCallback } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  onSignUpClick: () => void;
}

const HeroSection = ({ onSignUpClick }: HeroSectionProps) => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { user } = useAuth();
  const router = useRouter();

  const handleCTAClick = useCallback(() => {
    if (user) {
      // User is authenticated, take them to writing interface
      router.push('/draft');
    } else {
      // User is not authenticated, open sign up modal
      onSignUpClick();
    }
  }, [user, router, onSignUpClick]);

  return (
    <section
      className={cn(
        'min-h-screen flex flex-col justify-center items-center px-6 md:px-12',
        isHome ? 'pb-0' : 'pb-24'
      )}
    >
      <div className="max-w-4xl w-full text-center">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#191b22] leading-[0.9] mb-8 tracking-tight">
          Write hard.
          <br />
          Write true.
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-[#7e828f] mb-12 leading-relaxed max-w-2xl mx-auto font-light">
          Everything else is noise.
        </p>
        
        {/* Dynamic CTA based on user state */}
        <button
          onClick={handleCTAClick}
          className="inline-flex items-center gap-3 px-8 py-4 text-white bg-black rounded-full font-medium hover:bg-neutral-800 transition-all duration-300 group cursor-pointer text-lg"
        >
          <span>{user ? 'Start Writing' : 'Get Started'}</span>
          {user ? (
            <PenTool className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          )}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
