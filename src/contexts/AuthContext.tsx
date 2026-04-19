import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'zain_dev',
    username: 'zain',
    name: 'Zain',
    bio: 'The Architect of AmonsPath. Finding beauty in the digital noise.',
    pfp: 'https://picsum.photos/seed/zain/400',
    headerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
    themeColor: '#6366f1',
    isDarkMode: true,
    isPrivateAccount: false,
    following: ['adnan_user'],
    followers: [],
    recentInteractions: [{ userId: 'adnan_user', timestamp: new Date().toISOString() }],
    bookmarks: [],
    savedPosts: [],
    savedMessages: [],
    blockedUsers: [],
    chatWallpapers: {},
    activityLog: [
      { id: 'act1', type: 'system', detail: 'Identity stabilized in the archive.', timestamp: new Date().toISOString() }
    ],
  },
  {
    id: 'adnan_user',
    username: 'adnan',
    name: 'Adnan',
    bio: 'Archiving every rhythm. Catching echoes.',
    pfp: 'https://picsum.photos/seed/adnan/400',
    headerImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop',
    themeColor: '#ec4899',
    isDarkMode: false,
    isPrivateAccount: false,
    following: [],
    followers: ['zain_dev'],
    recentInteractions: [{ userId: 'zain_dev', timestamp: new Date().toISOString() }],
    bookmarks: [],
    savedPosts: [],
    savedMessages: [],
    blockedUsers: [],
    chatWallpapers: {},
    activityLog: [],
  }
];

export const GLOBAL_MUSIC_LIBRARY = [
  { id: 't1', name: 'Evergreen', artist: 'Rhythms', artwork: 'https://picsum.photos/seed/music1/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 't2', name: 'Neon Dreams', artist: 'Cyber', artwork: 'https://picsum.photos/seed/music2/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 't3', name: 'Solace', artist: 'Luna', artwork: 'https://picsum.photos/seed/music3/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 't4', name: 'Vantage', artist: 'Aria', artwork: 'https://picsum.photos/seed/music4/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 't5', name: 'Midnight', artist: 'Echo', artwork: 'https://picsum.photos/seed/music5/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 't6', name: 'Vignette', artist: 'Archiver', artwork: 'https://picsum.photos/seed/music6/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 't7', name: 'Phase Shift', artist: 'Spectrum', artwork: 'https://picsum.photos/seed/music7/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 't8', name: 'Afterlight', artist: 'Bloom', artwork: 'https://picsum.photos/seed/music8/400', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  allUsers: User[];
  signIn: (username: string) => Promise<void>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  followUser: (targetUsername: string) => Promise<void>;
  unfollowUser: (targetUsername: string) => Promise<void>;
  blockUser: (targetId: string) => Promise<void>;
  unblockUser: (targetId: string) => Promise<void>;
  addActivity: (type: string, detail: string) => Promise<void>;
  addInteraction: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);

  useEffect(() => {
    const savedUser = localStorage.getItem('amons_user');
    const guestStatus = localStorage.getItem('amons_guest') === 'true';
    const savedAllUsers = localStorage.getItem('amons_all_users');

    if (savedAllUsers) {
      const parsed = JSON.parse(savedAllUsers);
      const sanitized = parsed.map((u: User) => ({
        ...u,
        following: u.following || [],
        followers: u.followers || [],
        recentInteractions: u.recentInteractions || [],
        bookmarks: u.bookmarks || [],
        savedPosts: u.savedPosts || [],
        savedMessages: u.savedMessages || [],
        blockedUsers: u.blockedUsers || [],
        chatWallpapers: u.chatWallpapers || {},
        activityLog: u.activityLog || [],
      }));
      setAllUsers(sanitized);
      
      if (savedUser) {
        const parsedMe = JSON.parse(savedUser);
        const mySanitized = sanitized.find((u: User) => u.id === parsedMe.id) || {
          ...parsedMe,
          following: parsedMe.following || [],
          followers: parsedMe.followers || [],
          recentInteractions: parsedMe.recentInteractions || [],
          bookmarks: parsedMe.bookmarks || [],
          savedPosts: parsedMe.savedPosts || [],
          savedMessages: parsedMe.savedMessages || [],
          blockedUsers: parsedMe.blockedUsers || [],
          chatWallpapers: parsedMe.chatWallpapers || {},
          activityLog: parsedMe.activityLog || [],
        };
        setUser(mySanitized);
        // Ensure current user is in allUsers
        if (!sanitized.find((u: User) => u.username === mySanitized.username)) {
           const updatedAll = [...sanitized, mySanitized];
           setAllUsers(updatedAll);
           localStorage.setItem('amons_all_users', JSON.stringify(updatedAll));
        }
      }
    } else if (savedUser) {
       const parsedMe = JSON.parse(savedUser);
       setUser(parsedMe);
       const initialAll = [...MOCK_USERS];
       if (!initialAll.find(u => u.username === parsedMe.username)) {
         initialAll.push(parsedMe);
       }
       persistUsers(initialAll);
    }
    setLoading(false);
  }, []);

  const persistUsers = (users: User[]) => {
    setAllUsers(users);
    localStorage.setItem('amons_all_users', JSON.stringify(users));
  };

  const signIn = async (username: string) => {
    const lowerUsername = username.toLowerCase();
    const existing = allUsers.find(u => u.username === lowerUsername);
    
    let loggedInUser: User;
    if (existing) {
      loggedInUser = existing;
    } else {
      loggedInUser = {
        id: `user_${Date.now()}`,
        username: lowerUsername,
        name: username,
        bio: 'Searching for meaning in melodies.',
        themeColor: '#ec4899',
        isDarkMode: false,
        isPrivateAccount: false,
        following: [],
        followers: [],
        recentInteractions: [],
        bookmarks: [],
        savedPosts: [],
        savedMessages: [],
        blockedUsers: [],
        chatWallpapers: {},
        activityLog: [],
      };
      persistUsers([...allUsers, loggedInUser]);
    }
    
    setUser(loggedInUser);
    setIsGuest(false);
    localStorage.setItem('amons_user', JSON.stringify(loggedInUser));
    localStorage.removeItem('amons_guest');
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.setItem('amons_guest', 'true');
    localStorage.removeItem('amons_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    
    const updatedAll = allUsers.map(u => u.id === user.id ? updated : u);
    persistUsers(updatedAll);
    localStorage.setItem('amons_user', JSON.stringify(updated));
  };

  const addActivity = async (type: string, detail: string) => {
    if (!user) return;
    const newAct = { id: Date.now().toString(), type, detail, timestamp: new Date().toISOString() };
    const updatedLog = [newAct, ...(user.activityLog || [])].slice(0, 50);
    await updateProfile({ activityLog: updatedLog });
  };

  const addInteraction = async (targetId: string) => {
    if (!user) return;
    const now = new Date();
    // Trace only stays for a day - we should filter old ones
    const limit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const existingInteractions = (user.recentInteractions || [])
      .filter(i => new Date(i.timestamp) > limit)
      .filter(i => i.userId !== targetId);
    
    const updated = [{ userId: targetId, timestamp: now.toISOString() }, ...existingInteractions];
    await updateProfile({ recentInteractions: updated });
  };

  const followUser = async (targetUsername: string) => {
    if (!user || isGuest) return;
    const target = allUsers.find(u => u.username === targetUsername);
    if (!target) return;

    const updatedMe = { ...user, following: [...user.following, target.id] };
    const updatedTarget = { ...target, followers: [...target.followers, user.id] };
    
    setUser(updatedMe);
    const updatedAll = allUsers.map(u => {
      if (u.id === user.id) return updatedMe;
      if (u.id === target.id) return updatedTarget;
      return u;
    });
    persistUsers(updatedAll);
    localStorage.setItem('amons_user', JSON.stringify(updatedMe));
    addActivity('follow', `Followed @${targetUsername}`);
    addInteraction(target.id);
  };

  const unfollowUser = async (targetUsername: string) => {
    if (!user || isGuest) return;
    const target = allUsers.find(u => u.username === targetUsername);
    if (!target) return;

    const updatedMe = { ...user, following: user.following.filter(id => id !== target.id) };
    const updatedTarget = { ...target, followers: target.followers.filter(id => id !== user.id) };
    
    setUser(updatedMe);
    const updatedAll = allUsers.map(u => {
      if (u.id === user.id) return updatedMe;
      if (u.id === target.id) return updatedTarget;
      return u;
    });
    persistUsers(updatedAll);
    localStorage.setItem('amons_user', JSON.stringify(updatedMe));
    addActivity('unfollow', `Unfollowed @${targetUsername}`);
  };

  const blockUser = async (targetId: string) => {
    if (!user) return;
    const updatedBlocked = [...(user.blockedUsers || []), targetId];
    // Also unfollow automatically
    const target = allUsers.find(u => u.id === targetId);
    const updatedFollowing = user.following.filter(id => id !== targetId);
    
    await updateProfile({ 
      blockedUsers: updatedBlocked,
      following: updatedFollowing
    });
    addActivity('block', `Blocked user ${target?.username || targetId}`);
  };

  const unblockUser = async (targetId: string) => {
    if (!user) return;
    const updatedBlocked = (user.blockedUsers || []).filter(id => id !== targetId);
    await updateProfile({ blockedUsers: updatedBlocked });
    addActivity('unblock', `Unblocked user ${allUsers.find(u => u.id === targetId)?.username || targetId}`);
  };

  const signOut = async () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('amons_user');
    localStorage.removeItem('amons_guest');
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, isGuest, allUsers, 
      signIn, continueAsGuest, signOut, updateProfile, 
      followUser, unfollowUser, blockUser, unblockUser, addActivity, addInteraction
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
