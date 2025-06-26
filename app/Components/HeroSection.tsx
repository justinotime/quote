'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { WRITERS } from '@/app/lib/constants';
import TypewriterText from './ui/TypewriterText';
import { NotebookPen } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import ReadFreshModal from './ui/ReadFreshModal';
import Image from 'next/image';

// Declare Swiper global type
declare global {
  interface Window {
    Swiper: unknown;
  }
}

const HeroSection = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentWriterIndex, setCurrentWriterIndex] = useState(0);
  const [readFreshOpen, setReadFreshOpen] = useState(false);

  // Memoize the current writer to prevent unnecessary re-renders
  const currentWriter = useMemo(() => WRITERS[currentWriterIndex], [currentWriterIndex]);

  // Optimize carousel advancement
  const advanceCarousel = useCallback(() => {
    setCurrentWriterIndex((prev) => (prev + 1) % WRITERS.length);
  }, []);

  // Optimize modal handlers
  const handleReadFreshClick = useCallback(() => {
    setReadFreshOpen(true);
  }, []);

  const handleReadFreshClose = useCallback(() => {
    setReadFreshOpen(false);
  }, []);

  const handleSignInClick = useCallback(() => {
    setReadFreshOpen(false);
    // You can add sign in modal logic here
  }, []);

  useEffect(() => {
    // Trigger initial load animation
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Auto-advance carousel every 3 seconds
    const interval = setInterval(advanceCarousel, 3000);
    return () => clearInterval(interval);
  }, [advanceCarousel]);

  return (
    <>
      <section
        className={cn(
          'min-h-screen flex flex-col justify-center items-center px-[3%] md:pt-20 pt-32',
          isHome ? 'pb-0' : 'pb-24'
        )}
      >
        <div className="max-w-[1200px] w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          {/* Text and Button on Left */}
          <div className="md:w-1/2 text-center md:text-left w-full">
            <TypewriterText
              text={`Welcome to Quote.\nWrite hard. Write true. Everything else is noise.`}
              delay={40}
              className="whitespace-pre-line text-xl sm:text-2xl md:text-3xl leading-tight text-[#08090a] font-medium"
              highlightIndex={18}
            />
            <div className="mt-8">
              <button
                onClick={handleReadFreshClick}
                className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-3 text-white bg-black rounded-full font-semibold hover:bg-neutral-800 transition group cursor-pointer"
              >
                <span>Read fresh</span>
                <NotebookPen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Writer Display on Right */}
          <div 
            className={cn(
              "md:w-1/2 flex flex-col items-center gap-6 transition-all duration-1000 ease-out w-full",
              isLoaded 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 translate-x-10"
            )}
          >
            {/* Phone Frame */}
            <div className="relative max-w-[450px] w-full flex place-content-center">
              <div className="overflow-hidden">
                <div className="w-full h-[600px] md:h-[700px] rounded-[3rem] shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[3rem] overflow-hidden relative">
                    {/* Writer Content */}
                    <div className="w-full h-full flex flex-col">
                      {/* Writer Image */}
                      <div className="flex-1 relative overflow-hidden">
                        {currentWriter.width && currentWriter.height ? (
                          <Image
                            src={currentWriter.image}
                            alt={currentWriter.name}
                            width={currentWriter.width}
                            height={currentWriter.height}
                            className="w-full h-full object-cover transition-opacity duration-500"
                            priority={currentWriterIndex === 0}
                            loading={currentWriterIndex === 0 ? "eager" : "lazy"}
                          />
                        ) : (
                          <Image
                            src={currentWriter.image}
                            alt={currentWriter.name}
                            width={400}
                            height={600}
                            className="w-full h-full object-cover transition-opacity duration-500"
                          />
                        )}
                      </div>
                      {/* Writer Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-semibold text-xl md:text-2xl mb-2 transition-all duration-500 drop-shadow-lg">
                          {currentWriter.name}
                        </h3>
                        <p className="text-sm md:text-base italic leading-relaxed transition-all duration-500 drop-shadow-lg">
                          &ldquo;{currentWriter.quote}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ReadFreshModal 
        open={readFreshOpen} 
        onClose={handleReadFreshClose} 
        onSignInClick={handleSignInClick} 
      />
    </>
  );
};

export default HeroSection;
