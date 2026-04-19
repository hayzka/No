import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment, Track } from '../types';
import { useAuth } from './AuthContext';

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'zain_dev',
    user: { name: 'Zain', username: 'zain', pfp: 'https://picsum.photos/seed/zain/200' },
    type: 'music',
    music: {
      id: 'm1',
      name: 'Vignette',
      artist: 'Archiver',
      artwork: 'https://picsum.photos/seed/music1/600',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      source: 'spotify'
    },
    caption: 'Welcome to the path. This is a space for the echoes we leave behind. I created this for the ones who find meaning in the digital static.',
    timestamp: new Date().toISOString(),
    likes: ['adnan_user'],
    mentions: [],
    visibility: 'public',
    images: [],
    comments: [
      { id: 'c1', userId: 'adnan_user', userName: 'Adnan', text: 'This frequency feels right.', timestamp: new Date().toISOString(), replies: [] }
    ]
  },
  {
    id: 'p2',
    userId: 'adnan_user',
    user: { name: 'Adnan', username: 'adnan', pfp: 'https://picsum.photos/seed/adnan/200' },
    type: 'image',
    images: ['https://picsum.photos/seed/adnan_post/800/800'],
    caption: 'Found this while exploring the outskirts of the archive. @zain check this out.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: ['zain_dev'],
    mentions: ['zain'],
    visibility: 'public',
    comments: []
  },
];

interface PostContextType {
  posts: Post[];
  addPost: (caption: string, type: 'music' | 'image' | 'notes', visibility: 'public' | 'friends' | 'private', music?: Track, images?: string[]) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string, replyToId?: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | null>(null);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const { user, addActivity, addInteraction } = useAuth();

  useEffect(() => {
    const savedPosts = localStorage.getItem('amons_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const persistPosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('amons_posts', JSON.stringify(updatedPosts));
  };

  const addPost = async (caption: string, type: 'music' | 'image' | 'notes', visibility: 'public' | 'friends' | 'private', music?: Track, images?: string[]) => {
    if (!user) return;
    
    // Simple mention extraction
    const mentions = caption.match(/@(\w+)/g)?.map(m => m.slice(1)) || [];
    
    const newPost: Post = {
      id: `p_${Date.now()}`,
      userId: user.id,
      user: {
        name: user.name,
        username: user.username,
        pfp: user.pfp
      },
      type,
      caption,
      music,
      images: images || [],
      timestamp: new Date().toISOString(),
      likes: [],
      mentions,
      comments: [],
      visibility
    };
    
    persistPosts([newPost, ...posts]);
    addActivity('post', `Shared a new ${type} frequency`);
  };

  const likePost = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const updated = posts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likes.includes(user.id);
        return {
          ...p,
          likes: hasLiked ? p.likes.filter(id => id !== user.id) : [...p.likes, user.id]
        };
      }
      return p;
    });
    persistPosts(updated);
    
    const hasLiked = post.likes.includes(user.id);
    if (!hasLiked && post.userId !== user.id) {
       addInteraction(post.userId);
    }
  };

  const addComment = async (postId: string, text: string, replyToId?: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userPfp: user.pfp,
      text,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    const updated = posts.map(p => {
      if (p.id === postId) {
        if (replyToId) {
          const updatedComments = p.comments.map(c => {
            if (c.id === replyToId) {
              return { ...c, replies: [...c.replies, newComment] };
            }
            return c;
          });
          return { ...p, comments: updatedComments };
        }
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    persistPosts(updated);
    
    if (post.userId !== user.id) {
      addInteraction(post.userId);
    }
  };

  const deletePost = async (postId: string) => {
    const updated = posts.filter(p => p.id !== postId);
    persistPosts(updated);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, likePost, addComment, deletePost }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within PostProvider');
  return context;
};
