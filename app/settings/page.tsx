'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/app/Components/ui/Navbar';
import FooterSection from '@/app/Components/FooterSection';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

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
          <h1 className="text-4xl font-bold text-[#191b22] mb-8">Settings</h1>
          
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white border border-[#ececec] rounded-lg p-8">
              <h2 className="text-xl font-semibold text-[#191b22] mb-6">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#191b22]">Email Notifications</h3>
                    <p className="text-sm text-[#7e828f]">Receive updates about your posts and comments</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('email')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.email ? 'bg-[#35b8be]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#191b22]">Push Notifications</h3>
                    <p className="text-sm text-[#7e828f]">Get notified in your browser</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('push')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.push ? 'bg-[#35b8be]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#191b22]">Weekly Digest</h3>
                    <p className="text-sm text-[#7e828f]">Receive a weekly summary of activity</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('weekly')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.weekly ? 'bg-[#35b8be]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.weekly ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="bg-white border border-[#ececec] rounded-lg p-8">
              <h2 className="text-xl font-semibold text-[#191b22] mb-6">Account</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#7e828f] mb-2">Email</label>
                  <p className="text-[#191b22]">{user.email}</p>
                </div>
                <div>
                  <button className="text-[#35b8be] hover:text-[#269ba0] font-medium">
                    Change Password
                  </button>
                </div>
                <div>
                  <button className="text-red-600 hover:text-red-700 font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white border border-[#ececec] rounded-lg p-8">
              <h2 className="text-xl font-semibold text-[#191b22] mb-6">Privacy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-[#191b22] mb-2">Profile Visibility</h3>
                  <p className="text-sm text-[#7e828f] mb-3">Control who can see your profile and posts</p>
                  <select className="w-full px-3 py-2 border border-[#ececec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35b8be] focus:border-transparent">
                    <option>Public</option>
                    <option>Followers Only</option>
                    <option>Private</option>
                  </select>
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