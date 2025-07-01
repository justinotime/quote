'use client';

import Navbar from '@/app/Components/ui/Navbar';
import FooterSection from '@/app/Components/FooterSection';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar navItems={[]} />
      <main className="flex-1 pt-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#191b22] mb-8">Blog</h1>
          <div className="text-center py-12">
            <p className="text-lg text-[#7e828f] mb-4">Writing insights and stories.</p>
            <p className="text-[#7e828f]">Coming soon.</p>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
} 