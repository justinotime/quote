'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/app/Components/ui/Navbar';
import FooterSection from '@/app/Components/FooterSection';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-[#7e828f]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar navItems={[]} />
      <main className="flex-1 pt-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#191b22] mb-8">Profile</h1>
          <div className="bg-white border border-[#ececec] rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#191b22] mb-4">Account Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#7e828f] mb-1">Email</label>
                    <p className="text-[#191b22]">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7e828f] mb-1">User ID</label>
                    <p className="text-[#191b22] font-mono text-sm">{user.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7e828f] mb-1">Member Since</label>
                    <p className="text-[#191b22]">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-[#ececec] pt-6">
                <h2 className="text-xl font-semibold text-[#191b22] mb-4">Writing Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-[#f5fbfc] rounded-lg">
                    <div className="text-2xl font-bold text-[#191b22]">0</div>
                    <div className="text-sm text-[#7e828f]">Posts Published</div>
                  </div>
                  <div className="text-center p-4 bg-[#f5fbfc] rounded-lg">
                    <div className="text-2xl font-bold text-[#191b22]">0</div>
                    <div className="text-sm text-[#7e828f]">Drafts</div>
                  </div>
                  <div className="text-center p-4 bg-[#f5fbfc] rounded-lg">
                    <div className="text-2xl font-bold text-[#191b22]">0</div>
                    <div className="text-sm text-[#7e828f]">Words Written</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
} 