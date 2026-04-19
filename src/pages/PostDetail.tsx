import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import PostCard from '../components/PostCard';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { posts, addComment } = usePosts();
  const [commentText, setCommentText] = useState('');

  const post = posts.find(p => p.id === id);
  const [replyTo, setReplyTo] = useState<{ id: string, name: string } | null>(null);

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
    <div className="pt-12 max-w-xl mx-auto">
      <header className="mb-16">
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
      >
        <PostCard post={post} isDetail />
      </motion.div>

      <div className="mt-24 space-y-16">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em]">Echoes ({post.comments.length})</h3>
          <div className="h-px bg-black/5 dark:bg-white/5 flex-1 mx-8" />
        </div>
        
        <div className="space-y-12 px-2 pb-64">
          {post.comments.filter(c => !c.replyToId).map(comment => {
            const replies = post.comments.filter(c => c.replyToId === comment.id);
            return (
              <div key={comment.id} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-5"
                >
                  <div className="w-12 h-12 rounded-[1.2rem] bg-gray-50 dark:bg-[#1a1a1a] flex-shrink-0 border border-black/5 dark:border-white/5 overflow-hidden p-0.5">
                    <img src={comment.userPfp || `https://picsum.photos/seed/${comment.userId}/200`} className="w-full h-full object-cover rounded-[1.1rem]" />
                  </div>
                  <div className="space-y-1.5 flex-1 p-5 bg-gray-50 dark:bg-white/5 rounded-3xl rounded-tl-none border border-black/5 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold tracking-tight">{comment.userName}</span>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest pl-2">just in</span>
                       </div>
                       <button 
                         onClick={() => {
                           setReplyTo({ id: comment.id, name: comment.userName });
                           window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                         }}
                         className="text-[9px] font-bold text-accent uppercase tracking-widest hover:underline"
                       >
                         Reply
                       </button>
                    </div>
                    <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-normal">{comment.text}</p>
                  </div>
                </motion.div>

                {/* Replies */}
                <div className="pl-16 space-y-6">
                   {replies.map(reply => (
                     <motion.div 
                       key={reply.id} 
                       initial={{ opacity: 0, x: -5 }}
                       animate={{ opacity: 1, x: 0 }}
                       className="flex gap-4"
                     >
                        <div className="w-9 h-9 rounded-[0.9rem] bg-gray-50 dark:bg-[#1a1a1a] flex-shrink-0 border border-black/5 dark:border-white/5 overflow-hidden p-0.5">
                          <img src={reply.userPfp || `https://picsum.photos/seed/${reply.userId}/200`} className="w-full h-full object-cover rounded-[0.8rem]" />
                        </div>
                        <div className="space-y-1.5 flex-1 p-4 bg-gray-50/50 dark:bg-white/5 rounded-3xl rounded-tl-none border border-black/5 dark:border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[12px] font-bold tracking-tight">{reply.userName}</span>
                            <span className="text-[8px] text-gray-400 uppercase tracking-widest pl-1">response</span>
                          </div>
                          <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed font-normal">{reply.text}</p>
                        </div>
                     </motion.div>
                   ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-24 left-0 right-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 p-6 animate-in slide-in-from-bottom duration-500">
          <div className="max-w-xl mx-auto mb-4">
             <AnimatePresence>
               {replyTo && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="bg-accent/5 dark:bg-accent/10 p-3 rounded-2xl flex items-center justify-between mb-4 border border-accent/20"
                 >
                   <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Replying to <span className="underline">{replyTo.name}</span></span>
                   <button onClick={() => setReplyTo(null)} className="text-accent underline text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
          <form className="max-w-xl mx-auto relative group" onSubmit={handleSendComment}>
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add to the echo..."
              className="w-full bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-3xl pl-8 pr-16 py-5 text-sm focus:ring-4 focus:ring-accent/5 transition-all outline-none"
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-accent text-white rounded-2xl shadow-lg shadow-accent/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
