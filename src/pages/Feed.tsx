import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { Music, Image as ImageIcon, Send, X, Plus, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Feed() {
  const { user, isGuest, allUsers } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();
  const [feedType, setFeedType] = useState<'foryou' | 'following'>('foryou');

  const filteredPosts = feedType === 'foryou' 
    ? posts 
    : posts.filter(p => user?.following.includes(p.userId) || p.userId === user?.id);

  return (
    <div className="pt-12 space-y-16">
      <header className="flex flex-col mb-12 px-2">
        <h1 className="font-serif-italic text-6xl tracking-tighter leading-none mb-1">Archives.</h1>
        
        <div className="flex items-center gap-8 mt-12 border-b border-black/5 dark:border-white/5 pb-4">
           <button 
             onClick={() => setFeedType('foryou')}
             className={cn(
               "text-[10px] font-black uppercase tracking-[0.3em] transition-all relative pb-4",
               feedType === 'foryou' ? "text-accent" : "text-gray-400 dark:text-gray-600 hover:text-gray-500"
             )}
           >
             For You
             {feedType === 'foryou' && <motion.div layoutId="feedTab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full" />}
           </button>
           <button 
             onClick={() => setFeedType('following')}
             className={cn(
               "text-[10px] font-black uppercase tracking-[0.3em] transition-all relative pb-4",
               feedType === 'following' ? "text-accent" : "text-gray-400 dark:text-gray-600 hover:text-gray-500"
             )}
           >
             Following
             {feedType === 'following' && <motion.div layoutId="feedTab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full" />}
           </button>
        </div>
      </header>

      <div className="space-y-32">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx < 3 ? idx * 0.1 : 0 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        ) : (
          <div className="py-40 text-center space-y-8">
             <Music size={48} className="mx-auto text-gray-100 dark:text-gray-800" strokeWidth={1} />
             <p className="text-[10px] text-gray-300 dark:text-gray-600 uppercase tracking-[0.6em]">Absolute Silence in this Path</p>
          </div>
        )}
      </div>

      <footer className="py-24 text-center">
        <div className="w-1 h-12 bg-black/5 dark:bg-white/5 mx-auto rounded-full mb-8" />
        <p className="text-[10px] text-gray-300 dark:text-gray-700 uppercase tracking-[0.8em] font-bold">End of Archive</p>
      </footer>
    </div>
  );
}
