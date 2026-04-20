import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Grid, Music, Users, Bookmark, Palette, Camera, X, MessageCircle, Lock, Image as ImageIcon, MoreHorizontal, ShieldAlert, ShieldX } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import PostCard from '../components/PostCard';

const TABS = (isOwn: boolean) => [
  { id: 'music', label: 'Music', icon: Music },
  { id: 'notes', label: 'Notes', icon: Grid },
  { id: 'people', label: isOwn ? 'Myself' : 'Add People', icon: Users },
];

const EmptyState = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="text-center py-40 text-gray-300 dark:text-gray-700">
    <Icon size={64} className="mx-auto mb-8 opacity-10" strokeWidth={1} />
    <p className="text-[11px] font-black uppercase tracking-[0.8em]">{label}</p>
  </div>
);

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser, allUsers, updateProfile, followUser, unfollowUser, isGuest, blockUser } = useAuth();
  const { posts } = usePosts();
  const [activeTab, setActiveTab] = useState('music');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', pfp: '', headerImage: '' });
  const [showSocialMenu, setShowSocialMenu] = useState(false);
  const navigate = useNavigate();

  const profileUser = allUsers.find(u => u.username?.toLowerCase() === username?.toLowerCase());
  const isOwnProfile = currentUser?.username?.toLowerCase() === username?.toLowerCase();
  const isFollowing = currentUser?.following?.includes(profileUser?.id || '') ?? false;

  const userPosts = posts.filter(p => p.userId === profileUser?.id);
  const musicPosts = userPosts.filter(p => p.type === 'music');
  const otherPosts = userPosts.filter(p => p.type !== 'music').filter(p => p.caption.trim().length > 0 || (p.images && p.images.length > 0)); 
  const savedPosts = posts.filter(p => currentUser?.bookmarks?.includes(p.id) ?? false);

  const isPrivateAndNoFollower = profileUser.isPrivateAccount && !isOwnProfile && !isFollowing;

  useEffect(() => {
    if (isOwnProfile && currentUser) {
      setEditForm({
        name: currentUser.name,
        bio: currentUser.bio,
        pfp: currentUser.pfp || '',
        headerImage: currentUser.headerImage || ''
      });
    }
  }, [currentUser, isOwnProfile]);

  const handleSaveProfile = async () => {
    await updateProfile(editForm);
    setIsEditing(false);
  };

  const handlePfpClick = () => {
    const url = prompt('Enter image URL for profile picture:', editForm.pfp);
    if (url !== null) setEditForm(prev => ({ ...prev, pfp: url }));
  };

  const handleHeaderClick = () => {
    const url = prompt('Enter image URL for profile header:', editForm.headerImage);
    if (url !== null) setEditForm(prev => ({ ...prev, headerImage: url }));
  };

  const handleSocialAction = async (action: () => Promise<void>) => {
    if (isGuest) {
      alert("Spectators cannot form connections. Create an identity to engage.");
      return;
    }
    await action();
  };

  if (!profileUser) {
    return (
      <div className="pt-32 text-center">
        <h1 className="font-serif-italic text-5xl tracking-tighter text-gray-200">Lost Echo.</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">The path you seek does not exist</p>
      </div>
    );
  }

  return (
    <div className="pt-0 min-h-screen">
      {/* Profile Header Image */}
      <div className="w-full h-64 bg-gray-100 dark:bg-[#1a1a1a] relative overflow-hidden transition-all duration-700">
        {profileUser.headerImage ? (
          <img src={profileUser.headerImage} alt="Header" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-transparent flex items-center justify-center opacity-30">
            <Music size={80} strokeWidth={0.5} className="text-accent" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <header className="flex flex-col items-center -mt-24 text-center px-4 relative z-10">
        <div className="relative w-40 h-40 mb-10 group">
          <div className="w-full h-full rounded-[3.5rem] bg-gray-100 dark:bg-[#1a1a1a] overflow-hidden shadow-huge border-[8px] border-white dark:border-[#0f0f0f] p-0.5 transition-transform group-hover:scale-105 duration-700">
            {profileUser.pfp ? (
              <img src={profileUser.pfp} alt={profileUser.name} className="w-full h-full object-cover rounded-[3.2rem]" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-serif-italic text-accent bg-accent/5">
                {profileUser.name?.[0] || 'U'}
              </div>
            )}
          </div>
          {isOwnProfile && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -top-2 -right-2 p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-black/5 dark:border-white/5 text-accent hover:scale-110 active:scale-95 transition-transform z-10"
            >
              <Palette size={20} />
            </button>
          )}
        </div>

        <h2 className="font-serif-italic text-6xl mb-4 tracking-tighter">{profileUser.name}</h2>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.5em]">
            @{profileUser.username}
          </span>
          {profileUser.username === 'zain' && (
            <span className="px-3 py-1 bg-accent/10 text-accent text-[8px] font-black uppercase tracking-widest rounded-full">Developer</span>
          )}
        </div>
        
        <p className="max-w-xs text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-12">
          {profileUser.bio || 'Searching for meaning in melodies.'}
        </p>

        <div className="flex items-center gap-12 mb-12">
           <div className="flex flex-col">
              <span className="text-2xl font-serif-italic">{profileUser.followers?.length ?? 0}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Followers</span>
           </div>
           <div className="h-4 w-px bg-black/5 dark:bg-white/5" />
           <div className="flex flex-col">
              <span className="text-2xl font-serif-italic">{profileUser.following?.length ?? 0}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Following</span>
           </div>
        </div>

        <div className="flex gap-4">
          {isOwnProfile ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-12 py-5 bg-accent text-white rounded-[2rem] text-[11px] font-extrabold uppercase tracking-[0.3em] shadow-2xl shadow-accent/30 hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300"
            >
              Modify Identity
            </button>
          ) : (
            <>
              <button 
                onClick={() => handleSocialAction(isFollowing ? () => unfollowUser(profileUser.username) : () => followUser(profileUser.username))}
                className={cn(
                  "px-12 py-5 rounded-[2rem] text-[11px] font-extrabold uppercase tracking-[0.3em] transition-all duration-300 shadow-xl",
                  isFollowing 
                    ? "bg-gray-50 dark:bg-[#1a1a1a] text-gray-400 border border-black/5 dark:border-white/5" 
                    : "bg-accent text-white shadow-accent/30 hover:shadow-accent/40 hover:-translate-y-1"
                )}
              >
                {isFollowing ? 'Connected' : 'Engage'}
              </button>
              <button 
                onClick={() => handleSocialAction(async () => navigate(`/chat?user=${profileUser.username}`))}
                className="p-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] text-gray-400 border border-black/5 dark:border-white/5 hover:text-accent transition-colors"
              >
                <MessageCircle size={22} />
              </button>
            </>
          )}
          {isOwnProfile && (
            <button 
              onClick={() => navigate('/settings')}
              className="p-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] text-gray-400 border border-black/5 dark:border-white/5 hover:text-accent transition-colors"
            >
              <SettingsIcon size={22} />
            </button>
          )}
          
          {!isOwnProfile && (
            <div className="relative">
               <button 
                onClick={() => setShowSocialMenu(!showSocialMenu)}
                className="p-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] text-gray-400 border border-black/5 dark:border-white/5 hover:text-accent transition-colors"
              >
                <MoreHorizontal size={22} />
              </button>
              
              <AnimatePresence>
                {showSocialMenu && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#121212] rounded-2xl shadow-huge border border-black/5 dark:border-white/5 z-20 py-2 overflow-hidden"
                  >
                    <button 
                      onClick={() => {
                        blockUser(profileUser.id);
                        setShowSocialMenu(false);
                        alert(`User @${profileUser.username} has been blocked.`);
                      }}
                      className="w-full px-6 py-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <ShieldX size={14} />
                      Block Seeker
                    </button>
                    <button 
                      onClick={() => {
                        setShowSocialMenu(false);
                        alert(`Signal reported. The archive will be reviewed.`);
                      }}
                      className="w-full px-6 py-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-orange-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <ShieldAlert size={14} />
                      Report Spectrum
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f0f0f] rounded-[3.5rem] p-10 shadow-huge border border-black/5 dark:border-white/5 overflow-hidden"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-8 right-8 p-2 text-gray-400 hover:text-accent transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-10">
                <header className="text-center">
                  <h3 className="font-serif-italic text-4xl mb-1 mt-2">Edit Path.</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Profile Configuration</p>
                </header>

                <div className="flex justify-center gap-6">
                  <button onClick={handlePfpClick} className="relative group">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-gray-50 dark:bg-[#1a1a1a] overflow-hidden border border-black/5 dark:border-white/5 shadow-huge">
                      {editForm.pfp ? (
                        <img src={editForm.pfp} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Camera size={32} />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera size={24} className="text-white" />
                    </div>
                  </button>

                  <button onClick={handleHeaderClick} className="relative group">
                    <div className="w-40 h-24 rounded-[2rem] bg-gray-50 dark:bg-[#1a1a1a] overflow-hidden border border-black/5 dark:border-white/5 shadow-huge">
                      {editForm.headerImage ? (
                        <img src={editForm.headerImage} alt="Header Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                           <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera size={24} className="text-white" />
                    </div>
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Display Name</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-[1.5rem] px-8 py-5 text-[15px] focus:ring-4 focus:ring-accent/5 outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Bio / Frequency</label>
                    <textarea 
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-[1.5rem] px-8 py-5 text-[15px] focus:ring-4 focus:ring-accent/5 outline-none h-32 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  className="w-full bg-accent text-white py-5 rounded-[1.8rem] text-[11px] font-extrabold uppercase tracking-widest shadow-2xl shadow-accent/40"
                >
                  Confirm Identity
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex justify-between items-center mb-16 border-b border-black/5 dark:border-white/5 sticky top-20 bg-white/10 dark:bg-black/10 backdrop-blur-3xl z-30">
        {TABS(isOwnProfile).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-3 pb-6 px-4 pt-4 transition-all relative overflow-hidden flex-1",
                isActive ? "text-accent" : "text-gray-300 dark:text-gray-600 hover:text-gray-400"
              )}
            >
              <Icon size={20} />
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">{tab.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-4 right-4 h-1 bg-accent rounded-full" 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="min-h-[400px] mb-32">
        {isPrivateAndNoFollower ? (
          <div className="text-center py-40 px-6 max-w-xs mx-auto space-y-8">
            <X size={64} className="mx-auto text-gray-200 dark:text-gray-800" strokeWidth={1} />
            <h4 className="font-serif-italic text-4xl tracking-tighter">Private Archive.</h4>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">The resonating frequencies of this spectrum are only accessible to trusted followers.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-24 px-4"
            >
              {activeTab === 'music' ? (
                musicPosts.length > 0 ? (
                  musicPosts.map(post => (
                    <div key={post.id}>
                      <PostCard post={post} />
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Music} label="Absolute Silence" />
                )
              ) : activeTab === 'notes' ? (
                otherPosts.length > 0 ? (
                  otherPosts.map(post => (
                    <div key={post.id}>
                      <PostCard post={post} />
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Grid} label="Empty Archive" />
                )
              ) : activeTab === 'people' ? (
                <div className="space-y-6">
                   {allUsers.filter(u => profileUser.following?.includes(u.id) ?? false).map(contact => (
                     <div 
                       key={contact.id}
                       onClick={() => navigate(`/profile/${contact.username}`)}
                       className="flex items-center justify-between p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] border border-black/5 dark:border-white/5 hover:scale-[1.01] transition-all cursor-pointer shadow-sm"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 p-0.5">
                              <img src={contact.pfp} className="w-full h-full object-cover rounded-[1.1rem]" referrerPolicy="no-referrer" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[13px] font-bold tracking-tight">{contact.name}</span>
                              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest line-clamp-1">@{contact.username}</span>
                           </div>
                        </div>
                        <SettingsIcon size={14} className="text-gray-300" />
                     </div>
                   ))}
                   {(profileUser.following?.length ?? 0) === 0 && <EmptyState icon={Users} label="Disconnected Path" />}
                </div>
              ) : activeTab === 'saved' ? (
                savedPosts.length > 0 ? (
                  savedPosts.map(post => <div key={post.id}><PostCard post={post} /></div>)
                ) : (
                  <div className="space-y-12">
                     <EmptyState icon={Bookmark} label="Nothing Preserved" />
                     {currentUser?.savedMessages && (currentUser.savedMessages.length ?? 0) > 0 && (
                       <div className="max-w-md mx-auto space-y-6">
                         <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent text-center">Preserved Ciphers</h5>
                         <div className="space-y-4">
                            {currentUser.savedMessages.map(msg => (
                              <div key={msg.id} className="p-6 bg-gray-50 dark:bg-white/5 rounded-[1.8rem] border border-black/5 dark:border-white/10">
                                 <p className="text-[13px] leading-relaxed mb-4">{msg.text}</p>
                                 <div className="flex items-center justify-between">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Saved Transmission</span>
                                    <button 
                                      onClick={() => navigate(`/chat?user=${allUsers.find(u => u.id === msg.senderId)?.username}`)}
                                      className="text-[9px] text-accent font-black uppercase tracking-widest"
                                    >
                                      Jump to Signal
                                    </button>
                                 </div>
                              </div>
                            ))}
                         </div>
                       </div>
                     )}
                  </div>
                )
              ) : activeTab === 'history' ? (
                <div className="space-y-8 max-w-md mx-auto">
                   <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-center text-gray-400">Recent Spectral Resonances</h5>
                   {(profileUser.recentInteractions || []).map(username => {
                     const u = allUsers.find(x => x.username === username);
                     if (!u) return null;
                     return (
                       <div 
                         key={username}
                         onClick={() => navigate(`/profile/${username}`)}
                         className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                       >
                          <div className="w-14 h-14 rounded-[1.5rem] overflow-hidden">
                             <img src={u.pfp} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[14px] font-bold">{u.name}</span>
                             <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-2">Recently Reached</span>
                          </div>
                       </div>
                     );
                   })}
                   {(!profileUser.recentInteractions || profileUser.recentInteractions.length === 0) && <EmptyState icon={SettingsIcon} label="No Recent Signals" />}
                </div>
              ) : (
                <EmptyState icon={Music} label="Archived Frequency" />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Custom CSS Injection - Specific to profile being viewed */}
      {profileUser.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: profileUser.customCSS }} />
      )}
    </div>
  );
}
