'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SignInModal from '../Components/ui/SignInModal';
import SignUpModal from '../Components/ui/SignUpModal';

export default function AboutPage() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  
  const handleAuthSuccess = () => {
    setSignInOpen(false);
    setSignUpOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="w-full border-b border-[#ececec] bg-white px-4 sm:px-10 py-1 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="Logo" width={120} height={32} className="align-middle max-w-full inline-block" />
        </Link>
        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setSignInOpen(true)}
            className="px-5 py-2 rounded-full bg-black text-white font-semibold hover:bg-neutral-800 transition text-sm cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => setSignUpOpen(true)}
            className="px-5 py-2 rounded-full bg-[#35b8be] text-white font-semibold hover:bg-[#269ba0] transition text-sm cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </header>

      {/* About Content */}
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl font-bold mb-4 text-[#191b22]">About Us</h1>
        <p className="text-lg text-[#7e828f] max-w-2xl text-center">
          Welcome to Quote! We believe in writing hard, writing true, and cutting through the noise. Our platform is inspired by the clarity and minimalism of Medium, aiming to provide a beautiful space for your words to shine.
        </p>
      </main>
      <SignInModal 
        open={signInOpen} 
        onClose={() => setSignInOpen(false)} 
        onSignUpClick={() => { setSignInOpen(false); setSignUpOpen(true); }}
        onAuthSuccess={handleAuthSuccess}
      />
      <SignUpModal 
        open={signUpOpen} 
        onClose={() => setSignUpOpen(false)} 
        onSignInClick={() => { setSignUpOpen(false); setSignInOpen(true); }} 
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
} 