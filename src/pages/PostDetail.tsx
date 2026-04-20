import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Heart, MessageCircle, Bookmark, Share2, X } from 'lucide-react';
import PostCard from '../components/PostCard';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { cn } from '../lib/utils';
import { Comment } from '../types';

interface CommentNodeProps {
  comment: Comment;
  depth?: number;
  onReply: (id: string, name: string) => void;
  key?: string | number;
}

const CommentNode = ({ comment, depth = 0, onReply }: CommentNodeProps) => (
  <div className={cn("space-y-6", depth > 0 && "mt-4")}>
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-5"
    >
      <div className={cn(
        "rounded-[1.2rem] bg-gray-50 dark:bg-[#1a1a1a] flex-shrink-0 border border-black/5 dark:border-white/5 overflow-hidden p-0.5",
        depth === 0 ? "w-12 h-12" : "w-10 h-10"
      )}>
        <img src={comment.userPfp || `https://picsum.photos/seed/${comment.userId}/200`} className="w-full h-full object-cover rounded-[1.1rem]" />
      </div>
      <div className={cn(
        "space-y-1.5 flex-1 p-5 bg-gray-50 dark:bg-white/5 rounded-3xl rounded-tl-none border border-black/5 dark:border-white/5 shadow-sm transition-all hover:shadow-md",
        depth > 0 && "p-4"
      )}>
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold tracking-tight">{comment.userName}</span>
              {depth > 0 && <span className="text-[8px] text-accent font-black uppercase tracking-widest px-1.5 py-0.5 bg-accent/10 rounded">Resonance</span>}
           </div>
           <button 
             onClick={() => onReply(comment.id, comment.userName)}
             className="text-[9px] font-bold text-accent uppercase tracking-widest hover:underline"
           >
             Reply
           </button>
        </div>
        <p className={cn("text-gray-600 dark:text-gray-400 leading-relaxed font-normal", depth > 0 ? "text-[14px]" : "text-[15px]")}>{comment.text}</p>
      </div>
    </motion.div>

    {comment.replies && comment.replies.length > 0 && (
      <div className={cn("space-y-6 border-l border-black/5 dark:border-white/10 py-2", depth === 0 ? "pl-10 ml-6" : "pl-6 ml-5")}>
        {comment.replies.map((reply: Comment) => (
          <CommentNode key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
        ))}
      </div>
    )}
  </div>
);

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { posts, addComment } = usePosts();
  const [commentText, setCommentText] = useState('');

  const post = posts.find(p => p.id === id);
  const [replyTo, setReplyTo] = useState<{ id: string, name: string } | null>(null);

  const handleReplyClick = (id: string, name: string) => {
    setReplyTo({ id, name });
    const form = document.querySelector('#comment-form');
    form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector<HTMLInputElement>('#comment-input')?.focus();
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user || !post) return;
    if (isGuest) {
      alert("Spectators cannot manifest echos. Please create an identity.");
      return;
    }
    
    addComment(post.id, commentText.trim(), replyTo?.id);
    setCommentText('');
    setReplyTo(null);
  };

  if (!post) {
    return (
      <div className="pt-32 text-center">
        <h1 className="font-serif-italic text-5xl tracking-tighter text-gray-200">Lost Echo.</h1>
        <button onClick={() => navigate('/')} className="mt-8 text-accent font-bold uppercase tracking-widest text-[10px]">Back to Archives</button>
      </div>
    );
  }

  return (
    <div className="pt-12 max-w-xl mx-auto pb-32">
      <header className="mb-16 px-2">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] hover:text-accent transition-all"
        >
          <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={14} />
          </div>
          Back to Archives
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-2"
      >
        <PostCard post={post} isDetail />
      </motion.div>

      <div className="mt-24 space-y-16">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em]">Echoes ({post.comments.length})</h3>
          <div className="h-px bg-black/5 dark:bg-white/5 flex-1 mx-8" />
        </div>
        
        <div className="space-y-16 px-2">
          {post.comments.map(comment => (
            <CommentNode key={comment.id} comment={comment} onReply={handleReplyClick} />
          ))}
        </div>

        <div id="comment-form" className="mt-12 bg-gray-50 dark:bg-white/5 rounded-[2rem] p-6 border border-black/5 dark:border-white/5 mx-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-4 flex items-center justify-between">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Manifest Resonance</h4>
               <AnimatePresence>
                {replyTo && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-accent/10 py-1 px-2.5 rounded-full flex items-center gap-2 border border-accent/20"
                  >
                    <span className="text-[7px] text-accent font-black uppercase tracking-widest">Replying to {replyTo.name}</span>
                    <button onClick={() => setReplyTo(null)} className="text-accent"><X size={8} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
          <form className="relative group" onSubmit={handleSendComment}>
            <textarea 
              id="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Manifest your echo..."
              rows={2}
              className="w-full bg-white dark:bg-black/20 border-none rounded-xl p-4 text-xs font-medium focus:ring-2 focus:ring-accent outline-none resize-none transition-all"
            />
            <div className="flex justify-end mt-3">
               <button 
                type="submit"
                disabled={!commentText.trim()}
                className="px-6 py-2.5 bg-accent text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
               >
                 Transmit <Send size={12} />
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
