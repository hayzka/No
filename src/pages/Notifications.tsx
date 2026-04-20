import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, UserPlus, BellOff, AtSign, Reply } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDate, cn } from '../lib/utils';

export default function Notifications() {
  const { user, markNotificationsRead } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    markNotificationsRead();
  }, []);

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'like': return 'resonated with your frequency';
      case 'comment': return 'echoed on your archive';
      case 'mention': return 'invoked your digital presence';
      case 'follow': return 'began following your path';
      case 'reply': return 'responded to your echo';
      default: return 'signals directed to you';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={20} fill="currentColor" />;
      case 'comment': return <MessageCircle size={20} />;
      case 'mention': return <AtSign size={20} />;
      case 'follow': return <UserPlus size={20} />;
      case 'reply': return <Reply size={20} />;
      default: return null;
    }
  };

  const notifications = user?.notifications || [];

  return (
    <div className="pt-12 space-y-16 pb-20">
      <header className="flex flex-col mb-4">
        <h1 className="font-serif-italic text-5xl tracking-tighter">Echoes.</h1>
        <p className="text-[11px] font-bold text-accent uppercase tracking-[0.5em] mt-3">Recent Frequencies</p>
      </header>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((n, i) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => n.postId && navigate(`/post/${n.postId}`)}
              className={cn(
                "flex items-center gap-6 p-6 rounded-[2rem] border transition-all cursor-pointer",
                n.read ? "bg-gray-50 dark:bg-[#1a1a1a] border-black/5 dark:border-white/5 opacity-80" : "bg-accent/5 border-accent/20 border-2"
              )}
            >
              <div className="w-14 h-14 rounded-[1.5rem] bg-white dark:bg-black/20 flex items-center justify-center text-accent shadow-sm">
                {getIcon(n.type)}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[14px] font-bold tracking-tight">
                  {n.userName} <span className="font-normal text-gray-400 dark:text-gray-500">{getActionLabel(n.type)}</span>
                </span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{formatDate(n.timestamp)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center space-y-8">
           <BellOff size={64} className="mx-auto text-gray-100 dark:text-gray-800" strokeWidth={1} />
           <p className="text-[10px] font-extrabold text-gray-300 dark:text-gray-600 uppercase tracking-[0.6em]">Absolute Silence</p>
        </div>
      )}
    </div>
  );
}
