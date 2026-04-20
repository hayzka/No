import { useMusic } from '../contexts/MusicContext';
import { Play, Pause, Square, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function GlobalPlayer() {
  const { currentTrack, isPlaying, togglePlay, stopTrack } = useMusic();
  const location = useLocation();

  if (!currentTrack) return null;

  const isPostDetail = location.pathname.startsWith('/post/');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="fixed top-20 left-0 right-0 z-40 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 h-12 flex items-center transition-all duration-500"
      >
        <div className="max-w-xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm flex-shrink-0 relative group">
              <img src={currentTrack.artwork} alt={currentTrack.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-accent/20 animate-pulse mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <span className="text-[10px] font-bold tracking-tight truncate uppercase text-gray-800 dark:text-gray-200">{currentTrack.name}</span>
              <span className="text-[10px] text-gray-400 font-medium px-1">—</span>
              <div className="flex items-center gap-1.5 min-w-0">
                 <div className="flex items-center gap-0.5 h-2 w-3">
                    <motion.div animate={{ height: isPlaying ? [2, 8, 2] : 4 }} transition={{ duration: 0.5, repeat: Infinity }} className="w-0.5 bg-accent/60" />
                    <motion.div animate={{ height: isPlaying ? [8, 2, 8] : 2 }} transition={{ duration: 0.7, repeat: Infinity }} className="w-0.5 bg-accent/60" />
                 </div>
                 <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">{currentTrack.artist}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={togglePlay}
              className="w-8 h-8 flex items-center justify-center text-accent dark:text-gray-100 hover:scale-110 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={stopTrack}
              className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
