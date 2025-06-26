'use client';
import Navbar from "@/app/Components/ui/Navbar";
import HeroSection from "./Components/HeroSection";
import FooterSection from "./Components/FooterSection";
import SignInModal from "./Components/ui/SignInModal";
import SignUpModal from "./Components/ui/SignUpModal";
import DraftModal from "./Components/ui/DraftModal";
import EditorsPickSection from "./Components/EditorsPickSection";
import { useState } from "react";

const navItems = [
  { name: 'Us', link: '/about'},
  { name: 'Draft', link: '#draft' },
  { name: 'Sign in', link: '#signin'},
  { name: 'Get Started', link: '#get-started' }
];

export default function Home() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [draftOpen, setDraftOpen] = useState(false);

  // Custom navItems with Sign in, Get Started, and Draft click handlers
  const customNavItems = navItems.map(item => {
    if (item.name === 'Sign in') {
      return { ...item, onClick: (e: React.MouseEvent) => { e.preventDefault(); setSignInOpen(true); } };
    }
    if (item.name === 'Get Started') {
      return { ...item, onClick: (e: React.MouseEvent) => { e.preventDefault(); setSignUpOpen(true); } };
    }
    if (item.name === 'Draft') {
      return { ...item, onClick: (e: React.MouseEvent) => { e.preventDefault(); setDraftOpen(true); } };
    }
    return item;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Navbar navItems={customNavItems}/>
        <HeroSection />
        <EditorsPickSection />
      </main>
      <FooterSection />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      <SignUpModal open={signUpOpen} onClose={() => setSignUpOpen(false)} onSignInClick={() => { setSignUpOpen(false); setSignInOpen(true); }} />
      <DraftModal open={draftOpen} onClose={() => setDraftOpen(false)} onSignInClick={() => { setDraftOpen(false); setSignInOpen(true); }} />
    </div>
  );
};

