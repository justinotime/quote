'use client';
import Navbar from "@/app/Components/ui/Navbar";
import HeroSection from "./Components/HeroSection";
import FooterSection from "./Components/FooterSection";
import SignInModal from "./Components/ui/SignInModal";
import SignUpModal from "./Components/ui/SignUpModal";
import { useState, useCallback } from "react";
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Us', link: '/about'},
  { name: 'Sign in', link: '#signin'},
  { name: 'Get Started', link: '#get-started' }
];

export default function Home() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const router = useRouter();

  // Handle successful authentication
  const handleAuthSuccess = useCallback(() => {
    setSignInOpen(false);
    setSignUpOpen(false);
    // Redirect to dashboard or writing interface
    router.push('/feed');
  }, [router]);

  // Custom navItems with Sign in and Get Started click handlers
  const customNavItems = navItems.map(item => {
    if (item.name === 'Sign in') {
      return { 
        ...item, 
        onClick: (e: React.MouseEvent) => { 
          e.preventDefault(); 
          setSignInOpen(true); 
        } 
      };
    }
    if (item.name === 'Get Started') {
      return { 
        ...item, 
        onClick: (e: React.MouseEvent) => { 
          e.preventDefault(); 
          setSignUpOpen(true); 
        } 
      };
    }
    return item;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Navbar navItems={customNavItems}/>
        <HeroSection 
          onSignUpClick={() => setSignUpOpen(true)}
        />
      </main>
      <FooterSection />
      <SignInModal 
        open={signInOpen} 
        onClose={() => setSignInOpen(false)}
        onSignUpClick={() => {
          setSignInOpen(false);
          setSignUpOpen(true);
        }}
        onAuthSuccess={handleAuthSuccess}
      />
      <SignUpModal 
        open={signUpOpen} 
        onClose={() => setSignUpOpen(false)}
        onSignInClick={() => {
          setSignUpOpen(false);
          setSignInOpen(true);
        }}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

