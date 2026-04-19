import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Grid, Music, Users, Bookmark, Palette, Camera, X, MessageCircle, Lock, Moon, Sun, Palette as PaletteIcon, Code, LogOut, ChevronRight, User, ShieldX, Activity, Send } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';

const COLORS = [
  { name: 'Rose', hex: '#ec4899' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Sky', hex: '#0ea5e9' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
];

export default function Settings() {
  const { user, signOut, updateProfile, isGuest, allUsers, unblockUser } = useAuth();
  const [cssCode, setCssCode] = useState(user?.customCSS || '');

  const handleToggleMode = () => {
    if (user) updateProfile({ isDarkMode: !user.isDarkMode });
  };

  const handleColorSelect = (hex: string) => {
    if (user) {
      updateProfile({ themeColor: hex });
      document.documentElement.style.setProperty('--accent-color', hex);
    }
  };

  const handleSaveCSS = () => {
    if (user) updateProfile({ customCSS: cssCode });
  };

  if (isGuest) {
    return (
      <div className="pt-12 text-center space-y-8">
        <h1 className="font-serif-italic text-5xl tracking-tighter">Observatory.</h1>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">You are currently observing as a guest. Settings are reserved for pathfinders.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-10 py-4 bg-accent text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-widest shadow-xl shadow-accent/20"
        >
          Create Identity
        </button>
      </div>
    );
  }

  return (
    <div className="pt-12 space-y-16 pb-20">
      <header className="flex flex-col mb-4">
        <h1 className="font-serif-italic text-5xl tracking-tighter">Settings.</h1>
        <p className="text-[11px] font-bold text-accent uppercase tracking-[0.5em] mt-3">Configure Your Path</p>
      </header>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em]">Appearance</h2>
          <div className="h-px bg-black/5 dark:bg-white/5 flex-1" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={handleToggleMode}
            className="flex items-center justify-between p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] border border-black/5 dark:border-white/5 group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center text-gray-500 group-hover:text-accent transition-colors">
                {user?.isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <span className="text-[13px] font-bold tracking-tight">System Appearance</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
               {user?.isDarkMode ? 'Night' : 'Day'}
            </span>
          </button>

          <div className={cn(
            "p-8 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] border border-black/5 dark:border-white/5 space-y-6"
          )}>
            <div className="flex items-center gap-4 text-gray-500">
              <Palette size={20} />
              <span className="text-[13px] font-bold tracking-tight text-gray-900 dark:text-gray-100">Accent Palette</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {COLORS.map(c => (
                <button 
                  key={c.hex} 
                  onClick={() => handleColorSelect(c.hex)}
                  className={cn(
                    "w-10 h-10 rounded-full transition-all hover:scale-110 active:scale-90 border-4",
                    user?.themeColor === c.hex ? "border-white dark:border-black shadow-xl ring-2 ring-accent" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em]">Privacy & Safety</h2>
          <div className="h-px bg-black/5 dark:bg-white/5 flex-1" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => user && updateProfile({ isPrivateAccount: !user.isPrivateAccount })}
            className="flex items-center justify-between p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] border border-black/5 dark:border-white/5 group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center text-gray-500 group-hover:text-accent transition-colors">
                <User size={20} />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[13px] font-bold tracking-tight text-gray-900 dark:text-gray-100">Private Archive</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Restrict spectral resonance</span>
              </div>
            </div>
            <div className={cn(
              "w-12 h-6 rounded-full relative transition-all duration-300",
              user?.isPrivateAccount ? "bg-accent" : "bg-gray-200 dark:bg-white/10"
            )}>
              <div className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                user?.isPrivateAccount ? "left-7" : "left-1"
              )} />
            </div>
          </button>

          <div className="p-8 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] border border-black/5 dark:border-white/5 space-y-6">
             <div className="flex items-center gap-4 text-gray-500">
                <ShieldX size={20} />
                <span className="text-[13px] font-bold tracking-tight text-gray-900 dark:text-gray-100">Silenced Frequencies</span>
             </div>
             {user?.blockedUsers && user.blockedUsers.length > 0 ? (
               <div className="space-y-3">
                 {allUsers.filter(u => user.blockedUsers.includes(u.id)).map(u => (
                   <div key={u.id} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl">
                     <div className="flex items-center gap-3">
                        <img src={u.pfp} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <span className="text-xs font-bold">@{u.username}</span>
                     </div>
                     <button 
                       onClick={() => unblockUser(u.id)}
                       className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
                     >
                       Restore Path
                     </button>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center py-4">No blocked entities in your path.</p>
             )}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em]">Activity Log</h2>
          <div className="h-px bg-black/5 dark:bg-white/5 flex-1" />
        </div>

        <div className="p-8 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] border border-black/5 dark:border-white/5 space-y-6 max-h-[300px] overflow-y-auto pr-2">
           {user?.activityLog && user.activityLog.length > 0 ? (
             <div className="space-y-6">
                {user.activityLog.map(log => (
                  <div key={log.id} className="flex gap-4 items-start">
                     <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                        <Activity size={14} />
                     </div>
                     <div>
                        <p className="text-[13px] font-medium leading-tight">{log.detail}</p>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{formatDate(log.timestamp)}</p>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center py-4">Your path remains silent.</p>
           )}
        </div>
      </section>

      <section className="space-y-8">

        <div className="p-8 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] border border-black/5 dark:border-white/5 space-y-6">
          <div className="flex items-center gap-4 text-gray-500">
            <Code size={20} />
            <span className="text-[13px] font-bold tracking-tight text-gray-900 dark:text-gray-100">Custom CSS Architecture</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">Modify your path's visual structure. This CSS will be visible to everyone who explores your profile.</p>
          <textarea 
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            placeholder=".profile-card { border: 2px solid var(--color-accent); }"
            className="w-full h-32 bg-white dark:bg-black/20 border-none rounded-2xl p-4 text-mono text-xs focus:ring-2 focus:ring-accent outline-none font-mono"
          />
          <button 
            onClick={handleSaveCSS}
            className="w-full py-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:text-accent transition-colors"
          >
            Apply Code
          </button>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em]">Support</h2>
          <div className="h-px bg-black/5 dark:bg-white/5 flex-1" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <a 
            href="https://t.me/sunlessr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] border border-black/5 dark:border-white/5 group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center text-gray-500 group-hover:text-accent transition-colors">
                <Send size={18} />
              </div>
              <span className="text-[13px] font-bold tracking-tight">Contact Developer (Zain)</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-gray-400">t.me/sunlessr</span>
               <ChevronRight size={18} className="text-gray-300" />
            </div>
          </a>

          <button 
            onClick={signOut}
            className="flex items-center justify-between p-6 bg-red-50/30 dark:bg-red-900/10 rounded-[2rem] border border-red-500/10 group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center text-red-500">
                <LogOut size={18} />
              </div>
              <span className="text-[13px] font-bold tracking-tight text-red-500">Sever Connection</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
