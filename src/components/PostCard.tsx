import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ShieldAlert, UserMinus, Play, Pause, Download, Volume2, Youtube, Music as MusicIcon, ExternalLink, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Post } from '../types';
import { formatDate, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../contexts/MusicContext';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';

interface PostCardProps {
  post: Post;
  isDetail?: boolean;
}

const renderCaption = (caption: string, onUserClick: (username: string) => void) => {
  const parts = caption.split(/(@\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      const username = part.slice(1);
      return (
        <span 
          key={i} 
          onClick={(e) => { e.stopPropagation(); onUserClick(username); }}
          className="text-accent font-bold cursor-pointer hover:underline"
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

const SourceIcon = ({ source }: { source?: string }) => {
  switch (source) {
    case 'youtube': return <Youtube size={12} />;
    case 'spotify': return <div className="w-3 h-3 bg-[#1DB954] rounded-full flex items-center justify-center text-black text-[6px] font-bold">S</div>;
    case 'apple':
    case 'itunes': return <MusicIcon size={12} />;
    default: return <MusicIcon size={12} />;
  }
};

export default function PostCard({ post, isDetail }: PostCardProps) {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useMusic();
  const { user, isGuest, updateProfile, blockUser, savePost } = useAuth();
  const { likePost, deletePost, reportPost } = usePosts();
  const [showMenu, setShowMenu] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const isCurrentPlaying = currentTrack?.id === post.music?.id;
  const hasLiked = user ? post.likes.includes(user.id) : false;
  const isBookmarked = user ? (user.savedPosts || []).includes(post.id) : false;
  const isOwnPost = user?.id === post.userId;

  const handlePostClick = () => {
    if (!isDetail) {
      navigate(`/post/${post.id}`);
    }
  };

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const handleAction = async (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (isGuest) {
      alert(`Spectators cannot ${action}. Please create an identity.`);
      return;
    }

    if (action === 'report') {
      await reportPost(post.id);
    } else if (action === 'block') {
      if (user) {
        await blockUser(post.userId);
        alert(`Frequencies from ${post.user.name} will no longer reach you.`);
      }
    } else if (action === 'delete') {
      if (confirm("Permanently erase this frequency?")) {
        const success = await deletePost(post.id);
        if (success && isDetail) {
          navigate('/');
        }
      }
    } else if (action === 'share') {
      setShowShareModal(true);
    } else if (action === 'download') {
      const url = post.music?.url || (post.images && post.images[0]);
      if (url) {
        window.open(url, '_blank');
      } else {
        alert("No downloadable content found in this frequency.");
      }
    } else if (action === 'save') {
      if (user) {
        await savePost(post.id);
      }
    }
    setShowMenu(false);
  };

  if (user?.blockedUsers?.includes(post.userId)) return null;

  const isMusicPost = post.type === 'music';

  return (
    <article className={cn(
      "group select-none transition-all duration-500",
      isMusicPost && !isDetail && "max-w-md mx-auto"
    )}>
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowShareModal(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="relative w-full max-w-xl bg-white dark:bg-[#0f0f0f] rounded-t-[3rem] sm:rounded-[3rem] p-10 shadow-huge border-t sm:border border-black/5 dark:border-white/10"
             >
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-10 sm:hidden" />
                <h3 className="font-serif-italic text-4xl mb-2 text-center">Capture Frequency.</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] text-center mb-12">Share your Path with the world</p>
                
                <div className="space-y-6">
                   <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/5 flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                         <p className="text-[8px] font-black text-accent uppercase tracking-widest mb-1">Frequency Link</p>
                         <p className="text-[13px] font-medium truncate opacity-60">{window.location.origin}/post/{post.id}</p>
                      </div>
                      <button 
                         onClick={async () => {
                           await navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
                           alert("Path link captured.");
                         }}
                         className="px-6 py-3 bg-accent text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 active:scale-95 transition-transform"
                      >
                         Capture
                      </button>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] hover:bg-accent/10 transition-colors">
                         <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center text-accent">
                            <Send size={24} />
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Direct Message</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] hover:bg-accent/10 transition-colors">
                         <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center text-accent">
                            <ExternalLink size={24} />
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">External Path</span>
                      </button>
                   </div>
                </div>

                <button 
                  onClick={() => setShowShareModal(false)}
                  className="w-full mt-10 p-5 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-accent transition-colors"
                >
                  Close Archive
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between mb-8 px-1">
        <div 
          onClick={(e) => { e.stopPropagation(); handleUserClick(post.user.username); }}
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-11 h-11 rounded-full bg-gray-50 dark:bg-[#1a1a1a] overflow-hidden border border-black/5 dark:border-white/10 p-0.5">
            {post.user.pfp ? (
              <img src={post.user.pfp} alt={post.user.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-accent bg-accent/5">
                {post.user.name[0]}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold tracking-tight">{post.user.name}</span>
              {post.visibility !== 'public' && (
                <div className="text-[8px] bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded text-gray-400 font-bold uppercase tracking-widest">
                  {isOwnPost ? 'Myself' : post.visibility}
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mt-1">
              {formatDate(post.timestamp)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="text-gray-300 dark:text-gray-600 hover:text-accent transition-colors p-1"
          >
            <MoreHorizontal size={18} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#121212] rounded-2xl shadow-huge border border-black/5 dark:border-white/5 z-20 py-2 overflow-hidden"
              >
                {isOwnPost ? (
                  <button 
                    onClick={(e) => handleAction(e, 'delete')}
                    className="w-full px-6 py-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <ShieldAlert size={14} />
                    Erase Post
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={(e) => handleAction(e, 'report')}
                      className="w-full px-6 py-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-orange-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <ShieldAlert size={14} />
                      Report Post
                    </button>
                    <button 
                      onClick={(e) => handleAction(e, 'block')}
                      className="w-full px-6 py-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <UserMinus size={14} />
                      Block User
                    </button>
                  </>
                )}
                {(isMusicPost || (post.images && post.images.length > 0)) && (
                  <button 
                    onClick={(e) => handleAction(e, 'download')}
                    className="w-full px-6 py-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-accent hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Download size={14} />
                    Download Content
                  </button>
                )}
                <button 
                  onClick={(e) => handleAction(e, 'share')}
                  className="w-full px-6 py-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-t border-black/5 dark:border-white/5 mt-2"
                >
                  <Share2 size={14} />
                  Share frequency
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content Area */}
      {isMusicPost ? (
        <div className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-6 mb-10 flex items-center gap-6 group/music relative overflow-hidden">
           <div 
             className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg group-hover/music:scale-[1.05] transition-transform duration-500 cursor-pointer"
             onClick={(e) => { e.stopPropagation(); if (post.music) playTrack(post.music); }}
           >
              {post.music?.artwork ? (
                <img src={post.music?.artwork} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent/5">
                  <MusicIcon size={32} className="text-accent/40" />
                </div>
              )}
              <div className={cn(
                "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                isCurrentPlaying && isPlaying ? "opacity-100" : "opacity-0 group-hover/music:opacity-100"
              )}>
                {isCurrentPlaying && isPlaying ? <Pause size={24} fill="white" className="text-white" /> : <Play size={24} fill="white" className="text-white ml-1" />}
              </div>
              
              {isCurrentPlaying && isPlaying && (
                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 h-6">
                    <motion.div 
                      animate={{ height: [8, 20, 12, 18, 8] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1.5 bg-white rounded-full" 
                    />
                    <motion.div 
                      animate={{ height: [12, 8, 24, 10, 12] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1.5 bg-accent rounded-full" 
                    />
                    <motion.div 
                      animate={{ height: [18, 12, 8, 22, 18] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1.5 bg-white rounded-full" 
                    />
                    <motion.div 
                      animate={{ height: [8, 18, 14, 8, 8] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1.5 bg-white/60 rounded-full" 
                    />
                 </div>
              )}
           </div>
           
           <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                 <SourceIcon source={post.music?.source} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-accent">{post.music?.source || 'External'}</span>
              </div>
              <h3 className="font-serif-italic text-2xl tracking-tighter truncate leading-tight mb-1">{post.music?.name}</h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 truncate">{post.music?.artist}</p>
           </div>

           <div className="flex flex-col gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); if (post.music) playTrack(post.music); }}
                className={cn(
                  "p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all transition-colors",
                  isCurrentPlaying ? "bg-white text-accent" : "bg-accent text-white"
                )}
              >
                  {isCurrentPlaying && isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
           </div>
        </div>
      ) : post.type === 'image' && post.images && post.images.length > 0 ? (
        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-[#1a1a1a] mb-10 shadow-2xl shadow-black/5 group-hover:scale-[1.01] transition-transform duration-700 cursor-pointer">
           <div className="w-full h-full flex transition-transform duration-500" style={{ transform: `translateX(-${activeImageIdx * 100}%)` }}>
              {post.images.map((img, i) => (
                img ? (
                  <img key={i} src={img} className="w-full h-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                ) : null
              ))}
           </div>
           
           {post.images.length > 1 && (
             <>
               <button 
                 onClick={(e) => { e.stopPropagation(); setActiveImageIdx(prev => Math.max(0, prev - 1)); }}
                 className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors"
               >
                 <ChevronLeft size={20} />
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); setActiveImageIdx(prev => Math.min(post.images.length - 1, prev + 1)); }}
                 className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors"
               >
                 <ChevronRight size={20} />
               </button>
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {post.images.map((_, i) => (
                    <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === activeImageIdx ? "bg-white w-4" : "bg-white/40")} />
                  ))}
               </div>
             </>
           )}
        </div>
      ) : null}

      <div className="space-y-6 px-1">
        <div className="flex flex-col cursor-pointer" onClick={handlePostClick}>
          {post.type === 'notes' && !isDetail && (
             <p className="text-[10px] text-accent font-bold uppercase tracking-[0.4em] mb-3">Recorded Thought</p>
          )}
        </div>

        <p className={cn(
          "text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 font-normal",
          !isDetail && "line-clamp-4",
          post.type === 'notes' && "text-xl font-medium tracking-tight"
        )} onClick={handlePostClick}>
          {renderCaption(post.caption, handleUserClick)}
          {!isDetail && post.caption.length > 200 && (
            <span className="text-accent font-semibold ml-1 cursor-pointer">...expand</span>
          )}
        </p>

        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-8">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (isGuest) {
                  alert("Spectators cannot like frequencies. Please create an identity.");
                  return;
                }
                likePost(post.id);
              }}
              className={cn(
                "flex items-center gap-2 transition-colors group/btn",
                hasLiked ? "text-red-500" : "text-gray-400 dark:text-gray-500 hover:text-red-500"
              )}
            >
              <Heart size={20} fill={hasLiked ? "currentColor" : "none"} className="group-active/btn:scale-125 transition-transform" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">{post.likes?.length ?? 0}</span>
            </button>
            <button 
              onClick={handlePostClick}
              className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-accent transition-colors"
            >
              <MessageCircle size={20} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">{post.comments?.length ?? 0}</span>
            </button>
          </div>
          <button 
            onClick={(e) => handleAction(e, 'save')} 
            className={cn(
              "transition-colors",
              isBookmarked ? "text-accent" : "text-gray-400 dark:text-gray-500 hover:text-accent"
            )}
          >
            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}

// Re-importing cn here to ensure it's available in this scope
