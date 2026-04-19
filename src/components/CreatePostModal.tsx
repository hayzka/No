import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Music, Image as ImageIcon, Send, Search, Play, Pause, Upload, Globe, Users as UsersIcon, Lock, Youtube, Plus } from 'lucide-react';
import { usePosts } from '../contexts/PostContext';
import { useAuth, GLOBAL_MUSIC_LIBRARY } from '../contexts/AuthContext';
import { Track } from '../types';
import { cn } from '../lib/utils';

// Shared track list removed in favor of GLOBAL_MUSIC_LIBRARY from AuthContext

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Updated GLOBAL_MUSIC_LIBRARY with more sources
const EXTENDED_LIBRARY: Track[] = [
  ...GLOBAL_MUSIC_LIBRARY,
  { id: 't9', name: 'Synthwave Night', artist: 'Retro', artwork: 'https://picsum.photos/seed/music9/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', source: 'youtube' },
  { id: 't10', name: 'Lo-Fi Chill', artist: 'Study', artwork: 'https://picsum.photos/seed/music10/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', source: 'spotify' },
  { id: 't11', name: 'Electric Sky', artist: 'Storm', artwork: 'https://picsum.photos/seed/music11/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', source: 'apple' },
  { id: 't12', name: 'Underground Beat', artist: 'Hustle', artwork: 'https://picsum.photos/seed/music12/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', source: 'itunes' },
];

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [caption, setCaption] = useState('');
  const [type, setType] = useState<'music' | 'image' | 'notes'>('notes');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { addPost } = usePosts();
  const { isGuest } = useAuth();

  const filteredTracks = EXTENDED_LIBRARY.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newUrls = Array.from(files).map(file => URL.createObjectURL(file as Blob));
      setImageUrls(prev => [...prev, ...newUrls]);
    }
  };

  const addImageUrl = () => {
    if (currentUrl.trim()) {
      setImageUrls(prev => [...prev, currentUrl.trim()]);
      setCurrentUrl('');
    }
  };

  const removeImage = (idx: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) return;
    if (!caption.trim()) return;

    await addPost(caption, type, visibility, selectedTrack || undefined, imageUrls);
    setCaption('');
    setSelectedTrack(null);
    setImageUrls([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#121212] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <header className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <h2 className="font-serif-italic text-2xl tracking-tighter">New Frequency.</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex gap-3">
              {[
                { id: 'notes', label: 'Notes' },
                { id: 'music', label: 'Music' },
                { id: 'image', label: 'Visuals' },
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setType(t.id as any)}
                  className={cn(
                    "flex-1 py-3.5 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                    type === t.id ? "bg-accent text-white border-accent" : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-400"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What frequency are you resonating today?"
              className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-3xl p-6 text-[15px] min-h-[120px] focus:ring-4 focus:ring-accent/5 outline-none resize-none"
            />

            {type === 'music' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search music library (Spotify, YouTube, Apple)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-accent/5 outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2">
                  {filteredTracks.map(track => (
                    <button 
                      key={track.id}
                      onClick={() => setSelectedTrack(track)}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-2xl transition-all border text-left",
                        selectedTrack?.id === track.id
                          ? "bg-accent/10 border-accent/20"
                          : "bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10"
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shadow-sm relative">
                        <img src={track.artwork} alt={track.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                           {track.source === 'youtube' ? <Youtube size={12} className="text-white" /> : <Music size={12} className="text-white" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn("text-xs font-bold truncate", selectedTrack?.id === track.id ? "text-accent" : "text-gray-900 dark:text-gray-100")}>{track.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{track.artist} · <span className="opacity-60">{track.source || 'Path'}</span></p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {type === 'image' && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative flex gap-2">
                    <input 
                      type="text"
                      placeholder="Paste image URL..."
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addImageUrl()}
                      className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-accent/5 outline-none"
                    />
                    <button 
                      onClick={addImageUrl}
                      className="p-4 bg-accent text-white rounded-2xl"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <label className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Upload size={20} className="text-accent" />
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                  </label>
                </div>
                
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden group">
                        <img src={url} className="w-full h-full object-cover" />
                        <button 
                           onClick={() => removeImage(idx)}
                           className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/30 backdrop-blur-md rounded-full text-[8px] text-white font-bold">#{idx + 1}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-4">Audience Control</label>
              <div className="flex gap-2">
                {[
                  { id: 'public', label: 'Public', icon: Globe },
                  { id: 'friends', label: 'Friends', icon: UsersIcon },
                  { id: 'private', label: 'Only Me', icon: Lock },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVisibility(v.id as any)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[9px] font-bold uppercase tracking-widest transition-all",
                      visibility === v.id ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-400"
                    )}
                  >
                    <v.icon size={14} />
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <footer className="p-6 bg-gray-50/50 dark:bg-white/5 border-t border-black/5 dark:border-white/5">
            <button 
              onClick={handleSubmit}
              disabled={!caption.trim() || (type === 'music' && !selectedTrack) || (type === 'image' && imageUrls.length === 0)}
              className="w-full bg-accent text-white py-4.5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-huge hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:hover:scale-100"
            >
              Initialize Frequency
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
