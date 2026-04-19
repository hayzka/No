import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Users, Music, ChevronRight, Grid } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

import { usePosts } from '../contexts/PostContext';
import PostCard from '../components/PostCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'music' | 'users' | 'posts'>('posts');
  const { allUsers } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) || 
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPosts = posts.filter(p => 
    p.caption.toLowerCase().includes(query.toLowerCase()) ||
    p.user.name.toLowerCase().includes(query.toLowerCase()) ||
    (p.music && p.music.name.toLowerCase().includes(query.toLowerCase())) ||
    (p.music && p.music.artist.toLowerCase().includes(query.toLowerCase()))
  );

  const musicPosts = filteredPosts.filter(p => p.type === 'music');

  return (
    <div className="pt-12 space-y-12 pb-32">
      <header className="flex flex-col mb-4">
        <h1 className="font-serif-italic text-6xl tracking-tighter">Explore.</h1>
        <p className="text-[11px] font-bold text-accent uppercase tracking-[0.5em] mt-3">Connecting Frequencies</p>
      </header>

      <div className="relative group">
        <SearchIcon className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={28} />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for frequencies, pathfinders, or echoes..." 
          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-[3rem] pl-20 pr-10 py-7 text-[16px] focus:ring-4 focus:ring-accent/5 transition-all outline-none font-bold tracking-tight shadow-huge"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          { id: 'posts', label: 'All Echoes', icon: Grid },
          { id: 'music', label: 'Melodies', icon: Music },
          { id: 'users', label: 'Identity', icon: Users },
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={cn(
              "flex items-center gap-4 px-10 py-4.5 rounded-[1.8rem] border transition-all duration-500",
              filter === t.id 
                ? "bg-accent text-white border-accent shadow-2xl shadow-accent/30 scale-105" 
                : "bg-white dark:bg-[#0f0f0f] border-black/5 dark:border-white/5 text-gray-400"
            )}
          >
            <t.icon size={18} />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em]">{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="space-y-16"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em]">Synchronized Archives</h2>
              <div className="h-px bg-black/5 dark:bg-white/5 flex-1" />
            </div>
            
            <div className="grid grid-cols-1 gap-16">
              {filter === 'users' ? (
                filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <div 
                      key={u.id} 
                      onClick={() => handleUserClick(u.username)}
                      className="flex items-center gap-8 p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-[3rem] border border-black/5 dark:border-white/5 hover:scale-[1.01] transition-transform cursor-pointer group shadow-sm"
                    >
                      <div className="w-20 h-20 rounded-[2.2rem] bg-accent/5 overflow-hidden shadow-huge p-0.5">
                        <img src={u.pfp} alt={u.name} className="w-full h-full object-cover rounded-[2.1rem] group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <h3 className="font-serif-italic text-3xl tracking-tighter group-hover:text-accent transition-colors">{u.name}</h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] font-bold mt-1">@{u.username}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-black/20 text-gray-300 group-hover:text-accent transition-colors">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 py-20">No matching identities found</p>
                )
              ) : filter === 'music' ? (
                musicPosts.length > 0 ? (
                  musicPosts.map(p => (
                    <div key={p.id}>
                      <PostCard post={p} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 py-20">The spectrum remains silent</p>
                )
              ) : (
                filteredPosts.length > 0 ? (
                  filteredPosts.map(p => (
                    <div key={p.id}>
                      <PostCard post={p} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 py-20">No echoes resonated with your query</p>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[400px]">
        {query === '' && (
          <div className="py-32 text-center space-y-12">
            <div className="flex justify-center gap-12 opacity-[0.03]">
               <Music size={140} strokeWidth={1} />
               <Users size={140} strokeWidth={1} />
            </div>
            <p className="text-[11px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.8em]">Spectral Exploration</p>
          </div>
        )}
      </div>
    </div>
  );
}
