import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { Music, Image as ImageIcon, Send, X, Plus, Search } from 'lucide-react';

export default function Feed() {
  const { user, isGuest } = useAuth();
  const { posts } = usePosts();

  return (
    <div className="pt-12 space-y-20">
      <header className="flex flex-col mb-12 px-2">
        <h1 className="font-serif-italic text-6xl tracking-tighter leading-none mb-1">Archives.</h1>
        <div className="flex items-center justify-between mt-6">
          <p className="text-[11px] font-bold text-accent uppercase tracking-[0.5em]">Live Digital Stream</p>
        </div>
      </header>

      <div className="space-y-32">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx < 3 ? idx * 0.1 : 0 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>

      <footer className="py-24 text-center">
        <div className="w-1 h-12 bg-black/5 dark:bg-white/5 mx-auto rounded-full mb-8" />
        <p className="text-[10px] text-gray-300 dark:text-gray-700 uppercase tracking-[0.8em] font-bold">End of Archive</p>
      </footer>
    </div>
  );
}
