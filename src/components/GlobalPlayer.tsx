import { useMusic } from '../contexts/MusicContext';
import { Play, Pause, Square, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GlobalPlayer() {
  const { currentTrack, isPlaying, togglePlay, stopTrack } = useMusic();

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-[100px] left-4 right-4 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[2.5rem] p-4 flex items-center justify-between shadow-huge overflow-hidden"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
            <img src={currentTrack.artwork} alt={currentTrack.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold tracking-tight truncate">{currentTrack.name}</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest truncate">{currentTrack.artist}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-accent text-white rounded-full shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button 
            onClick={stopTrack}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-[#1a1a1a] text-gray-400 rounded-full hover:text-accent transition-colors"
          >
            <Square size={16} fill="currentColor" />
          </button>
          <button 
            onClick={stopTrack}
            className="w-8 h-8 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-gray-500 transition-colors ml-2"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
