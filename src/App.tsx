/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import Chat from './pages/Chat';
import Discover from './pages/Discover';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import GlobalPlayer from './components/GlobalPlayer';
import { Bell, Plus, Search } from 'lucide-react';
import { PostProvider } from './contexts/PostContext';
import CreatePostModal from './components/CreatePostModal';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function AppContent() {
  const { user, isGuest, loading } = useAuth();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      document.documentElement.classList.toggle('dark', user.isDarkMode);
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
      
      const isBlack = user.themeColor.toLowerCase() === '#000000' || user.themeColor.toLowerCase() === 'black';
      const isWhite = user.themeColor.toLowerCase() === '#ffffff' || user.themeColor.toLowerCase() === 'white';
      
      document.documentElement.classList.toggle('theme-white', isWhite);
      document.documentElement.classList.toggle('theme-black', isBlack);

      // Handle Font
      const fonts = ['serif', 'sans', 'mono', 'modern'];
      fonts.forEach(f => document.documentElement.classList.remove(`font-${f}`));
      if (user.selectedFont) {
        document.documentElement.classList.add(`font-${user.selectedFont}`);
      } else {
        document.documentElement.classList.add('font-sans');
      }
    }
  }, [user]);

  const isPostDetail = location.pathname.startsWith('/post/');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f0f]">
        <div className="animate-pulse font-serif-italic text-2xl text-accent">AmonsPath.</div>
      </div>
    );
  }

  // If not logged in and not guest, show AuthPage
  if (!user && !isGuest) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 selection:bg-accent/30 overflow-x-hidden">
      {/* Dynamic Style Injection for Custom User CSS */}
      {user?.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: user.customCSS }} />
      )}

      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 transition-all duration-500">
        <div className="max-w-xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-serif-italic text-3xl tracking-tighter hover:opacity-70 transition-opacity">
            AmonsPath.
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/discover" className="text-gray-400 hover:text-accent transition-colors">
               <Search size={22} />
            </Link>
            <Link to="/notifications" className="text-gray-400 hover:text-accent transition-colors relative">
               <Bell size={22} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-black" />
            </Link>
            <Link to={user ? `/profile/${user.username}` : '/settings'}>
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#1a1a1a] overflow-hidden border border-black/5 dark:border-white/10 p-0.5">
                {user?.pfp ? (
                  <img src={user.pfp} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-accent">
                    {user?.name?.[0] || 'G'}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-20 pb-32">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <GlobalPlayer />
      {!isPostDetail && <Navbar />}

      {/* Floating Plus Button - Only on Feed and if not guest and not on post detail */}
      {!isGuest && location.pathname === '/' && !isPostDetail && (
        <>
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="fixed bottom-28 right-6 z-40 w-16 h-16 bg-accent text-white rounded-[1.8rem] shadow-huge flex items-center justify-center hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            <Plus size={32} />
          </button>
          <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <PostProvider>
          <Router>
            <AppContent />
          </Router>
        </PostProvider>
      </MusicProvider>
    </AuthProvider>
  );
}

