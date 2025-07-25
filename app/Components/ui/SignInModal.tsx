import React, { useCallback, useMemo, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaXTwitter } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithGoogle, signInWithX, signInWithEmail } from '@/app/lib/supabase';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSignUpClick: () => void;
  onAuthSuccess: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ open, onClose, onSignUpClick, onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize social providers to prevent unnecessary re-renders
  const socialProviders = useMemo(() => [
    { name: 'Google', icon: <FcGoogle size={22} />, color: '', provider: 'google' },
    { name: 'X', icon: <FaXTwitter size={20} className="text-black" />, color: '', provider: 'x' },
    { name: 'Email', icon: <HiOutlineMail size={22} className="text-black" />, color: '', provider: 'email' },
  ], []);

  // Optimize event handlers
  const handleClose = useCallback(() => {
    onClose();
    setShowEmailForm(false);
    setEmail('');
    setPassword('');
    setError(null);
  }, [onClose]);

  const handleSignUpClick = useCallback(() => {
    onSignUpClick();
  }, [onSignUpClick]);

  const handleSocialSignIn = useCallback(async (provider: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
        onAuthSuccess();
      } else if (provider === 'x') {
        await signInWithX();
        onAuthSuccess();
      } else if (provider === 'email') {
        setShowEmailForm(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [onAuthSuccess]);

  const handleEmailSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        console.error('Sign in error:', error);
        setError(error.message || 'Sign in failed. Please check your credentials.');
      } else {
        onAuthSuccess();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, onAuthSuccess]);

  if (!open) return null;
  
  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="bg-white shadow-xl w-full h-full max-w-none rounded-none p-4 flex-1 flex flex-col justify-center sm:rounded-xl sm:max-w-xl sm:p-16 sm:h-auto sm:flex-none sm:justify-start relative animate-fadeIn gap-8"
        >
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-black text-2xl cursor-pointer"
            aria-label="Close"
          >
            X
          </button>
          <h2 id="signin-modal-title" className="text-2xl font-bold mb-0 text-center italic">Welcome Back.</h2>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {!showEmailForm ? (
            <>
              <div className="flex flex-col gap-4 mb-4">
                {socialProviders.map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => handleSocialSignIn(provider.provider)}
                    disabled={isLoading}
                    className={`w-full py-2 rounded-full border border-black text-black flex items-center justify-center gap-2 bg-transparent transition cursor-pointer ${provider.color} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    {provider.icon} <span>Sign in with {provider.name}</span>
                  </button>
                ))}
              </div>
              <div className="text-center text-sm mb-1 text-gray-500 font-normal">
                No account?{' '}
                <button onClick={handleSignUpClick} className="text-[#35b8be] font-semibold hover:underline bg-transparent p-0 m-0 border-0 cursor-pointer">Create one</button>
              </div>
              <div className="text-center text-xs text-gray-400 font-light">
                Forgot email or trouble signing in? <a href="/help" className="text-[#35b8be] hover:underline">Get Help</a>
              </div>
            </>
          ) : (
            <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="signin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35b8be] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="signin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35b8be] focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in with Email'}
              </button>
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="text-center text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to social options
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SignInModal; 