import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Music, Users, Hash, Play, Compass, Flame, ArrowUpRight } from 'lucide-react';
import { useAuth, GLOBAL_MUSIC_LIBRARY } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { useMusic } from '../contexts/MusicContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import PostCard from '../components/PostCard';

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'music' | 'notes'>('all');
  const { allUsers, user: currentUser, followUser } = useAuth();
  const { posts } = usePosts();
  const { playTrack, currentTrack, isPlaying } = useMusic();
  const navigate = useNavigate();

  const filteredUsers = allUsers.filter(u => 
    u.id !== currentUser?.id &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPosts = posts.filter(p => 
    p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMusic = GLOBAL_MUSIC_LIBRARY.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingPosts = posts.slice(0, 3);
  const suggestedUsers = allUsers
    .filter(u => u.id !== currentUser?.id && !currentUser?.following.includes(u.id))
    .slice(0, 3);

  const showResults = searchQuery.trim() !== '' || activeTab !== 'all';

  return (
    <div className="pt-12 space-y-16 pb-32">
      <header className="space-y-8">
        <div className="flex flex-col">
          <h1 className="font-serif-italic text-5xl tracking-tighter">Discover.</h1>
          <p className="text-[11px] font-bold text-accent uppercase tracking-[0.5em] mt-3">Synthesizing the Path</p>
        </div>

        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search frequencies, seekers, or melodies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[2.5rem] pl-16 pr-8 py-6 text-base focus:ring-4 focus:ring-accent/5 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          {[
            { id: 'all', label: 'All Streams', icon: Compass },
            { id: 'users', label: 'Seekers', icon: Users },
            { id: 'music', label: 'Rhythms', icon: Music },
            { id: 'notes', label: 'Ciphers', icon: Hash },
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all",
                activeTab === t.id ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-400"
              )}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {!showResults ? (
        <div className="space-y-16">
          {/* Trending Rhythms */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-red-500">
                <Flame size={20} />
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">Resonating Now</h2>
              </div>
              <button 
                onClick={() => setActiveTab('music')}
                className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-accent"
              >
                View Archive
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {GLOBAL_MUSIC_LIBRARY.slice(0, 6).map((track, i) => (
                 <motion.div 
                   key={track.id}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.05 }}
                   className="group relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/5 cursor-pointer"
                   onClick={() => playTrack(track)}
                 >
                {track.artwork ? (
                    <img src={track.artwork} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/5 transition-transform duration-700 group-hover:scale-110">
                      <Music size={24} className="text-accent" />
                    </div>
                )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                       <p className="text-[9px] font-black text-white/60 uppercase tracking-widest truncate">{track.artist}</p>
                       <h4 className="text-white font-bold text-xs truncate mb-1">{track.name}</h4>
                       <div className="flex items-center justify-between">
                          <span className="text-[8px] px-1.5 py-0.5 bg-accent text-white rounded font-bold uppercase tracking-widest">{track.source || 'Path'}</span>
                          {currentTrack?.id === track.id && isPlaying ? <Play size={12} fill="white" className="text-white" /> : <ArrowUpRight size={12} className="text-white" />}
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
          </section>

          {/* Suggested Seekers */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
                <Users size={20} className="text-accent" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">Seekers for your Path</h2>
            </div>
            
            <div className="space-y-4">
               {suggestedUsers.map(u => (
                 <div key={u.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/profile/${u.username}`)}>
                       <div className="w-12 h-12 rounded-2xl overflow-hidden border border-accent/20">
                          {u.pfp ? (
                            <img src={u.pfp} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-accent bg-accent/5">
                              {u.name?.[0] || 'U'}
                            </div>
                          )}
                       </div>
                       <div>
                          <h4 className="text-sm font-bold tracking-tight">{u.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">@{u.username}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => followUser(u.username)}
                      className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                    >
                      Sync
                    </button>
                 </div>
               ))}
            </div>
          </section>

          {/* Featured Visuals */}
          <section className="space-y-8">
             <div className="flex items-center gap-3 px-2">
                <Compass size={20} className="text-gray-400" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">Visual Artifacts</h2>
            </div>
            <div className="grid grid-cols-1 gap-12">
               {posts.filter(p => p.type === 'image').slice(0, 2).map((p) => (
                  <div key={p.id}>
                    <PostCard post={p} />
                  </div>
                ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
           {activeTab === 'users' || activeTab === 'all' ? (
             <div className="space-y-6">
                {filteredUsers.length > 0 && <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Seekers Matching Found</h3>}
                {filteredUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl cursor-pointer transition-colors" onClick={() => navigate(`/profile/${u.username}`)}>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden">
                          {u.pfp ? (
                            <img src={u.pfp} className="w-10 h-10 rounded-xl object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-accent bg-accent/5">
                              {u.name?.[0] || 'U'}
                            </div>
                          )}
                        </div>
                        <div>
                           <p className="text-sm font-bold tracking-tight">{u.name}</p>
                           <p className="text-[10px] text-gray-400 uppercase tracking-widest">@{u.username}</p>
                        </div>
                     </div>
                     <ArrowUpRight size={14} className="text-gray-300" />
                  </div>
                ))}
             </div>
           ) : null}

           {activeTab === 'music' || activeTab === 'all' ? (
             <div className="space-y-6">
                {filteredMusic.length > 0 && <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Rhythms Found</h3>}
                <div className="grid grid-cols-1 gap-3">
                   {filteredMusic.map(track => (
                     <button 
                       key={track.id} 
                       onClick={() => playTrack(track)}
                       className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-colors text-left group"
                     >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            {track.artwork ? (
                               <img src={track.artwork} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center bg-accent/5">
                                 <Music size={16} className="text-accent" />
                               </div>
                            )}
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play size={16} fill="white" className="text-white" />
                           </div>
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[13px] font-bold tracking-tight truncate">{track.name}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{track.artist}</p>
                        </div>
                        <div className="text-[8px] font-black bg-accent text-white px-1.5 py-0.5 rounded uppercase tracking-widest">
                           {track.source || 'Path'}
                        </div>
                     </button>
                   ))}
                </div>
             </div>
           ) : null}

           {activeTab === 'notes' || activeTab === 'all' ? (
              <div className="space-y-8">
                 {filteredPosts.length > 0 && <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Frequencies Captured</h3>}
                 {filteredPosts.map((p) => (
                   <div 
                     key={p.id}
                     onClick={() => navigate(`/post/${p.id}`)}
                     className="cursor-pointer"
                   >
                     <PostCard post={p} />
                   </div>
                 ))}
              </div>
           ) : null}
        </div>
      )}
    </div>
  );
}
