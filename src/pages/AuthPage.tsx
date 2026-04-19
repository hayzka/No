import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const { signIn, continueAsGuest } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      signIn(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0f0f0f]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-16 text-center"
      >
        <header className="space-y-4">
          <h1 className="font-serif-italic text-7xl tracking-tighter leading-none mb-1">AmonsPath.</h1>
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.6em]">The Sound Archive</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your unique path..."
              className="w-full bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-[2.5rem] px-10 py-6 text-[15px] focus:ring-4 focus:ring-accent/5 transition-all outline-none text-center font-bold tracking-tight shadow-huge"
            />
            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full bg-accent text-white rounded-[2.5rem] py-6 text-[11px] font-extrabold uppercase tracking-[0.4em] shadow-2xl shadow-accent/40 hover:shadow-accent/50 hover:-translate-y-1 transition-all disabled:opacity-30"
            >
              Commence Journey
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/5 dark:border-white/5" />
          </div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-bold bg-white dark:bg-[#0f0f0f] px-4 text-gray-400">
            or
          </div>
        </div>

        <button
          onClick={continueAsGuest}
          className="text-[11px] font-bold text-gray-400 dark:text-gray-500 hover:text-accent uppercase tracking-[0.3em] transition-colors"
        >
          Spectral Observation (Guest)
        </button>
      </motion.div>
      
      <footer className="fixed bottom-12 text-[9px] text-gray-300 dark:text-gray-700 uppercase tracking-[0.5em] font-extrabold">
        Archival v1.0.4
      </footer>
    </div>
  );
}
