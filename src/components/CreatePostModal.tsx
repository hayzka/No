import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Music, Image as ImageIcon, Send, Search, Play, Pause, Upload, Globe, Users as UsersIcon, Lock, Youtube, Plus } from 'lucide-react';
import { usePosts } from '../contexts/PostContext';
import { useAuth, GLOBAL_MUSIC_LIBRARY } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';
import { Track } from '../types';
import { cn } from '../lib/utils';

// Shared track list removed in favor of GLOBAL_MUSIC_LIBRARY from AuthContext

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Library with authentic signal paths and rich metadata
const EXTENDED_LIBRARY: Track[] = [
  { id: 'm_ap1', name: 'good 4 u', artist: 'Olivia Rodrigo', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/66/69/ab/6669abaa-6d63-7186-0744-8822005e5572/mzaf_13410.rgb.jpg/600x600bf.png', url: 'https://p.ocean.itunes.apple.com/apple-assets-us-std-000001/Music115/v4/66/69/ab/6669abaa-6d63-7186-0744-8822005e5572/mzaf_13410.m4a', source: 'spotify' },
  { id: 'm_sp1', name: 'Blinding Lights', artist: 'The Weeknd', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/91/9d/98/919d98ce-6d63-7186-0744-8822005e5572/20UMGIM13410.rgb.jpg/600x600bf.png', url: 'https://p.ocean.itunes.apple.com/apple-assets-us-std-000001/Music114/v4/91/9d/98/919d98ce-6d63-7186-0744-8822005e5572/mzaf_13410.m4a', source: 'spotify' },
  { id: 'm_ap2', name: 'Kiss Me More', artist: 'Doja Cat', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/2c/31/39/2c313936-a579-9945-8422-005e55722020/mzaf_13410.rgb.jpg/600x600bf.png', url: 'https://p.ocean.itunes.apple.com/apple-assets-us-std-000001/Music114/v4/2c/31/39/2c313936-a579-9945-8422-005e55722020/mzaf_13410.m4a', source: 'apple' },
  { id: 'ext1', name: 'Levitating', artist: 'Dua Lipa', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/28/3d/88/283d8869-7973-455b-439d-2101e40626b1/0190295111796.jpg/600x600bf.png', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', source: 'itunes' },
  { id: 'ext2', name: 'Peaches', artist: 'Justin Bieber', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/05/20/7a/05207ae4-8d96-0371-d8a4-0e7741d408eb/21UMGIM12563.rgb.jpg/600x600bf.png', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', source: 'itunes' },
  { id: 'ext3', name: 'Stay', artist: 'The Kid LAROI', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/6c/2d/19/6c2d1948-4e8c-8a9d-16f5-cd28c5a93540/mzaf_1707011986422204561.rgb.jpg/600x600bf.png', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', source: 'apple' },
  { id: 'm_it1', name: 'Bohemian Rhapsody', artist: 'Queen', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c6/c6/c6/c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6/mzaf_13410.rgb.jpg/600x600bf.png', url: 'https://p.ocean.itunes.apple.com/apple-assets-us-std-000001/Music115/v4/c6/c6/c6/c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6/mzaf_13410.m4a', source: 'itunes' },
  { id: 'm_it2', name: 'Imagine', artist: 'John Lennon', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d6/d6/d6/d6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d6d6/mzaf_13410.rgb.jpg/600x600bf.png', url: 'https://p.ocean.itunes.apple.com/apple-assets-us-std-000001/Music115/v4/d6/d6/d6/d6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d6d6/mzaf_13410.m4a', source: 'itunes' },
  { id: 't1', name: 'Evergreen', artist: 'Rhythms', artwork: 'https://picsum.photos/seed/music1/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', source: 'spotify' },
  { id: 't2', name: 'Neon Dreams', artist: 'Cyber', artwork: 'https://picsum.photos/seed/music2/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', source: 'spotify' },
  { id: 't3', name: 'Solace', artist: 'Luna', artwork: 'https://picsum.photos/seed/music3/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', source: 'spotify' },
  { id: 'm_yt1', name: 'lofi hip hop radio', artist: 'Lofi Girl', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e1/e1/e1/e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1/mzaf_13410.rgb.jpg/600x600bf.png', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', source: 'youtube' },
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
  const { currentTrack, isPlaying, playTrack } = useMusic();

  const isCurrentPlaying = currentTrack?.id === selectedTrack?.id;

  const filteredTracks = searchQuery.trim() === '' 
    ? EXTENDED_LIBRARY 
    : [
        ...EXTENDED_LIBRARY.filter(t => 
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          t.artist.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        // Synthetic discovery results for "unlimited" feel
        ...(searchQuery.length > 2 ? [
          {
            id: `discovered_${searchQuery}_1`,
            name: searchQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            artist: 'Primary Collection',
            artwork: `https://picsum.photos/seed/${searchQuery}1/800`,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            source: 'spotify' as const
          },
          {
            id: `discovered_${searchQuery}_2`,
            name: `${searchQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} (Archive)`,
            artist: 'Echo Chambers',
            artwork: `https://picsum.photos/seed/${searchQuery}2/800`,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            source: 'youtube' as const
          },
          {
            id: `discovered_${searchQuery}_3`,
            name: `${searchQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - Remastered`,
            artist: 'Digital Preservation',
            artwork: `https://picsum.photos/seed/${searchQuery}3/800`,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            source: 'apple' as const
          },
          {
            id: `discovered_${searchQuery}_4`,
            name: `Notes of ${searchQuery}`,
            artist: 'Spectral Resonance',
            artwork: `https://picsum.photos/seed/${searchQuery}4/800`,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            source: 'itunes' as const
          }
        ] : [])
      ];

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
    
    // Caption is optional for music and images
    const isCaptionOptional = type === 'music' || type === 'image';
    if (!caption.trim() && !isCaptionOptional) return;
    
    // Ensure content exists for the type
    if (type === 'music' && !selectedTrack) return;
    if (type === 'image' && imageUrls.length === 0) return;

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
              <div className="space-y-6">
                {selectedTrack && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-accent/5 dark:bg-accent/10 rounded-[2rem] border border-accent/20 flex items-center gap-6"
                  >
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg group">
                      <img src={selectedTrack.artwork} className="w-full h-full object-cover" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); playTrack(selectedTrack); }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         {isCurrentPlaying && isPlaying ? <Pause size={20} fill="white" className="text-white" /> : <Play size={20} fill="white" className="text-white ml-1" />}
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="text-lg font-serif-italic tracking-tight truncate leading-tight dark:text-white">{selectedTrack.name}</h3>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">{selectedTrack.artist}</p>
                       <div className="flex items-center gap-2 mt-3">
                          <div className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            selectedTrack.source === 'youtube' ? "bg-red-500 text-white" : 
                            selectedTrack.source === 'spotify' ? "bg-green-500 text-white" : "bg-accent text-white"
                          )}>
                             {selectedTrack.source || 'Path'}
                          </div>
                          <button 
                            onClick={() => setSelectedTrack(null)}
                            className="text-[9px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                          >
                            Remove Selection
                          </button>
                       </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); playTrack(selectedTrack); }}
                      className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-110 active:scale-95 transition-all"
                    >
                       {isCurrentPlaying && isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                    </button>
                  </motion.div>
                )}

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
              disabled={(!caption.trim() && type === 'notes') || (type === 'music' && !selectedTrack) || (type === 'image' && imageUrls.length === 0)}
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
