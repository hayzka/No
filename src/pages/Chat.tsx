import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, Image as ImageIcon, X, User, Bookmark, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, allUsers, isGuest, updateProfile } = useAuth();
  
  const initialChatId = searchParams.get('user');
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(initialChatId);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);

  // Find users for the chat list - everyone except the current user
  const contacts = allUsers.filter(u => u.username !== user?.username);
  
  const chatUserObj = allUsers.find(u => u.username === selectedChatUser);
  const wallpaper = user?.chatWallpapers[selectedChatUser || ''] || 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop';

  useEffect(() => {
    if (selectedChatUser) {
      // Mock history logic
      setHistory([
        { id: '1', senderId: selectedChatUser, text: "Welcome to the private archive.", timestamp: '1h ago' },
        { id: '2', senderId: user?.id || 'me', text: "Glad to be here.", timestamp: '45m ago' }
      ]);
    }
  }, [selectedChatUser, user?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (isGuest) {
      alert("Spectators cannot initiate frequencies. Please sign in.");
      return;
    }
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || 'me',
      text: message.trim(),
      timestamp: 'Just now'
    };
    
    setHistory(prev => [...prev, newMsg]);
    setMessage('');

    // Update recent interactions
    if (user && selectedChatUser) {
      const recent = user.recentInteractions || [];
      if (!recent.includes(selectedChatUser)) {
        await updateProfile({ 
          recentInteractions: [selectedChatUser, ...recent].slice(0, 10) 
        });
      }
    }
  };

  const handleSaveMessage = async (msg: ChatMessage) => {
    if (user) {
      // Logic for saved messages
      const alreadySaved = user.savedMessages?.some(m => m.id === msg.id);
      if (alreadySaved) {
        await updateProfile({
          savedMessages: user.savedMessages.filter(m => m.id !== msg.id)
        });
        alert("Cipher removed from saved archives.");
      } else {
        const fullMsg = { ...msg, receiverId: selectedChatUser || '' } as any;
        await updateProfile({ 
          savedMessages: [...(user.savedMessages || []), fullMsg] 
        });
        alert("Cipher preserved in your archive.");
      }
    }
  };

  const handleSetWallpaper = () => {
    if (!selectedChatUser) return;
    const url = prompt("Enter wallpaper image URL for this frequency:", wallpaper);
    if (url !== null && user) {
      updateProfile({
        chatWallpapers: { ...user.chatWallpapers, [selectedChatUser]: url }
      });
    }
  };

  if (isGuest && !selectedChatUser) {
    return (
      <div className="pt-32 text-center space-y-8 px-6">
        <h1 className="font-serif-italic text-5xl tracking-tighter">Cipher.</h1>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">Communication between spectra requires a verified identity. Guests can only observe the public echoes.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-10 py-4 bg-accent text-white rounded-[2rem] text-[11px] font-extrabold uppercase tracking-widest shadow-huge"
        >
          Initialize Path
        </button>
      </div>
    );
  }

  if (selectedChatUser && chatUserObj) {
    return (
      <div className="fixed inset-0 z-[60] bg-white dark:bg-[#0f0f0f] flex flex-col">
        <header className="px-6 py-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white/60 dark:bg-black/60 backdrop-blur-3xl z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                setSelectedChatUser(null);
                setSearchParams({});
              }} 
              className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl hover:text-accent transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div 
              onClick={() => navigate(`/profile/${chatUserObj.username}`)}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-[1.2rem] bg-gray-100 dark:bg-white/10 overflow-hidden border border-black/5 dark:border-white/10 p-0.5">
                <img src={chatUserObj.pfp} alt={chatUserObj.name} className="w-full h-full object-cover rounded-[1.1rem]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold tracking-tight group-hover:text-accent transition-colors">{chatUserObj.name}</span>
                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Resonating</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleSetWallpaper}
            className="p-3 text-gray-400 hover:text-accent transition-colors bg-gray-50 dark:bg-white/5 rounded-2xl"
          >
            <ImageIcon size={18} />
          </button>
        </header>

        <div 
          className="flex-1 overflow-y-auto p-8 space-y-8 bg-cover bg-center transition-all duration-1000"
          style={{ 
            backgroundImage: `linear-gradient(rgba(15,15,15,0.7), rgba(15,15,15,0.9)), url(${wallpaper})`,
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="flex flex-col gap-6 max-w-xl mx-auto">
              {history.map(msg => {
                const isMe = msg.senderId === user?.id;
                const isSaved = user?.savedMessages?.some(m => m.id === msg.id);
                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    key={msg.id} 
                    className={cn(
                      "group/msg relative max-w-[85%] p-5 text-sm leading-relaxed shadow-huge transition-all",
                      isMe 
                        ? "self-end bg-accent text-white rounded-[1.8rem] rounded-tr-[0.4rem]" 
                        : "self-start bg-white/5 dark:bg-black/40 backdrop-blur-2xl border border-white/5 dark:border-white/10 text-white rounded-[1.8rem] rounded-tl-[0.4rem]"
                    )}
                  >
                    <div className="flex flex-col">
                      {msg.text}
                      <div className={cn(
                        "text-[8px] font-bold uppercase tracking-widest mt-2 flex items-center justify-between",
                        isMe ? "text-white/50" : "text-gray-400"
                      )}>
                        <span>{msg.timestamp}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                           <button onClick={() => handleSaveMessage(msg)}>
                              <Bookmark size={10} fill={isSaved ? "currentColor" : "none"} />
                           </button>
                           <button onClick={() => alert("Capturing media from transit...")}>
                              <Download size={10} />
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
             })}
          </div>
        </div>

        <footer className="p-8 bg-white dark:bg-[#0f0f0f] border-t border-black/5 dark:border-white/5 shadow-2xl">
          <form className="max-w-xl mx-auto flex gap-4" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Transmit message..."
              className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-[1.8rem] px-8 py-5 text-[15px] focus:ring-4 focus:ring-accent/5 outline-none transition-all"
            />
            <button 
              type="submit"
              className="bg-accent text-white p-5 rounded-[1.5rem] shadow-2xl shadow-accent/40 hover:scale-105 active:scale-95 transition-transform"
            >
              <Send size={22} />
            </button>
          </form>
        </footer>
      </div>
    );
  }

  return (
    <div className="pt-12 space-y-16 pb-20">
      <header className="flex flex-col mb-4">
        <h1 className="font-serif-italic text-5xl tracking-tighter">Messages.</h1>
        <p className="text-[11px] font-bold text-accent uppercase tracking-[0.5em] mt-3">Private Frequencies</p>
      </header>

      <div className="space-y-4">
        {contacts.map((contact, i) => (
          <motion.button 
            key={contact.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedChatUser(contact.username)}
            className="w-full flex items-center justify-between p-7 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2.5rem] border border-black/5 dark:border-white/5 group hover:scale-[1.01] transition-all shadow-sm shadow-black/5"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.8rem] bg-white dark:bg-black/20 overflow-hidden border border-black/5 dark:border-white/5 p-0.5 shadow-md">
                <img src={contact.pfp} alt={contact.name} className="w-full h-full object-cover rounded-[1.7rem]" />
              </div>
              <div className="flex flex-col items-start px-2">
                <span className="text-[15px] font-bold tracking-tight mb-1">{contact.name}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest line-clamp-1">View Recent Transmission</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white dark:bg-black/20 flex items-center justify-center text-gray-300 group-hover:text-accent transition-colors">
               <ArrowLeft size={18} className="rotate-180" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
