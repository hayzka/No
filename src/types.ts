export type ThemeColor = string;

export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  pfp?: string;
  themeColor: string;
  isDarkMode: boolean;
  isPrivateAccount: boolean;
  headerImage?: string;
  customCSS?: string;
  following: string[];
  followers: string[];
  recentInteractions: { userId: string; timestamp: string }[]; 
  bookmarks: string[];
  savedPosts: string[];
  savedMessages: Message[];
  blockedUsers: string[];
  chatWallpapers: Record<string, string>; 
  activityLog: { id: string; type: string; detail: string; timestamp: string }[];
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  artwork: string;
  url: string;
  source?: 'spotify' | 'youtube' | 'apple' | 'itunes' | 'local';
}

export interface Post {
  id: string;
  userId: string;
  user: {
    name: string;
    username: string;
    pfp?: string;
  };
  music?: Track;
  images: string[];
  caption: string;
  timestamp: string;
  likes: string[]; // userIds
  mentions: string[]; // usernames
  comments: Comment[];
  type: 'music' | 'image' | 'notes';
  visibility: 'public' | 'friends' | 'private';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPfp?: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}


