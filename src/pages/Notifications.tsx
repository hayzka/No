import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, UserPlus, BellOff } from 'lucide-react';

const NOTIFS = [
  { id: '1', type: 'like', user: 'Adnan', action: 'bookmarked your archive', timestamp: '2m' },
  { id: '2', type: 'follow', user: 'Archiver', action: 'started following your path', timestamp: '1h' },
  { id: '3', type: 'comment', user: 'Karlee', action: 'echoed in your journal', timestamp: '3h' },
  { id: '4', type: 'follow', user: 'Zain', action: 'observed your frequencies', timestamp: '5h' },
];

export default function Notifications() {
  return (
    <div className="pt-12 space-y-16 pb-20">
      <header className="flex flex-col mb-4">
        <h1 className="font-serif-italic text-5xl tracking-tighter">Echoes.</h1>
        <p className="text-[11px] font-bold text-accent uppercase tracking-[0.5em] mt-3">Recent Frequencies</p>
      </header>

      {NOTIFS.length > 0 ? (
        <div className="space-y-4">
          {NOTIFS.map((n, i) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] border border-black/5 dark:border-white/5 hover:scale-[1.01] transition-transform cursor-pointer"
            >
              <div className="w-14 h-14 rounded-[1.5rem] bg-white dark:bg-black/20 flex items-center justify-center text-accent shadow-sm">
                {n.type === 'like' && <Heart size={20} fill="currentColor" />}
                {n.type === 'follow' && <UserPlus size={20} />}
                {n.type === 'comment' && <MessageCircle size={20} />}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[14px] font-bold tracking-tight">
                  {n.user} <span className="font-normal text-gray-400 dark:text-gray-500">{n.action}</span>
                </span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{n.timestamp} ago</span>
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
