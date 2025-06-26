'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

type NavItem = {
  name: string;
  link: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

export default function Navbar({ navItems }: { navItems: (NavItem & { onClick?: (e: React.MouseEvent) => void })[] }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup if component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-0 w-full border-b border-[#ececec] z-[1000] bg-white px-4 sm:px-10"
        >
          <div className="max-w-[1200px] mx-auto flex justify-between items-center">
            {/* Logo */}
            <div className='flex-1'>
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={150}
                  height={40}
                  className="align-middle max-w-full inline-block"
                />
              </Link>
            </div>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center justify-end flex-1">
              {navItems.map((item) => {
                const isGetStarted = item.name === 'Get Started';
                const isSignIn = item.name === 'Sign in';
                
                // Don't show Sign in if user is already signed in
                if (isSignIn && user) return null;
                
                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    onClick={item.onClick}
                    className={cn(
                      'transition duration-200 font-bold text-lg relative inline-flex items-center cursor-pointer',
                      isGetStarted
                        ? 'px-4 py-2 bg-black text-white rounded-full hover:bg-neutral-800'
                        : 'text-lg text-black hover:text-[#35b8be]',
                      !isGetStarted ? 'mr-6' : ''
                    )}
                  >
                    {item.name}
                    {!isGetStarted && pathname === item.link && (
                      <motion.span
                        layoutId="underline"
                        className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })}
              
              {/* User Menu */}
              {user && (
                <div className="flex items-center gap-4 ml-6">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} />
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-red-600 transition"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation"
                className='text-black hover:text-[#35b8be] transition pr-1 cursor-pointer'
              >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  key="overlay"
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1999]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMenuOpen(false)}
                />
                {/* Full-Screen Mobile Menu */}
                <motion.div
                  key="mobile-menu"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut'}}
                  className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-white/95 md:hidden"
                >
                  {/* Logo at top */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex justify-center">
                    <Image src="/logo.svg" alt="Logo" width={120} height={32} className="align-middle max-w-full inline-block" />
                  </div>
                  {/* Close button */}
                  <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close navigation"
                    className="absolute top-6 right-6 text-black text-3xl p-2 rounded-full hover:bg-neutral-200 transition cursor-pointer"
                  >
                    <X size={36} />
                  </button>
                  
                  {/* User Info */}
                  {user && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <User size={20} />
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Nav Items */}
                  <nav className="flex flex-col items-center justify-center gap-8 mt-24">
                    {navItems.map((item) => {
                      const isGetStarted = item.name === 'Get Started';
                      const isSignIn = item.name === 'Sign in';
                      
                      // Don't show Sign in if user is already signed in
                      if (isSignIn && user) return null;
                      
                      return (
                        <Link
                          key={item.link}
                          href={item.link}
                          onClick={item.onClick}
                          className={cn(
                            'text-2xl font-semibold transition duration-200 rounded-md px-6 py-3 cursor-pointer',
                            isGetStarted
                              ? 'bg-black text-white rounded-full hover:bg-neutral-800'
                              : 'text-black hover:text-[#35b8be]'
                          )}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                    
                    {/* Sign out button for mobile */}
                    {user && (
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-2xl font-semibold text-red-600 hover:text-red-700 transition px-6 py-3"
                      >
                        <LogOut size={24} />
                        Sign out
                      </button>
                    )}
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
