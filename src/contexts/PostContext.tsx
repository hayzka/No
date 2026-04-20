import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment, Track } from '../types';
import { useAuth } from './AuthContext';

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'zain_dev',
    user: { name: 'Zain', username: 'zain', pfp: 'https://share.google/HBKMyI3cIf8QFewZs' },
    type: 'image',
    images: ['https://share.google/MPAAzOEFsGBfblKc5'],
    caption: 'Hi, so this is Amon.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: [],
    mentions: [],
    visibility: 'public',
    comments: []
  },
  {
    id: 'p2',
    userId: 'zain_dev',
    user: { name: 'Zain', username: 'zain', pfp: 'https://share.google/HBKMyI3cIf8QFewZs' },
    type: 'notes',
    caption: 'Halo?',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: [],
    mentions: [],
    images: [],
    visibility: 'public',
    comments: []
  {
];

interface PostContextType {
  posts: Post[];
  addPost: (caption: string, type: 'music' | 'image' | 'notes', visibility: 'public' | 'friends' | 'private', music?: Track, images?: string[]) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string, replyToId?: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  reportPost: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | null>(null);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const { user, addActivity, addInteraction, addNotification, allUsers } = useAuth();

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

    // Notify mentioned users
    mentions.forEach(username => {
      const target = allUsers.find(u => u.username === username);
      if (target && target.id !== user.id) {
        addNotification(target.id, {
          type: 'mention',
          userId: user.id,
          userName: user.name,
          userPfp: user.pfp,
          postId: newPost.id
        });
      }
    });
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
       addNotification(post.userId, {
         type: 'like',
         userId: user.id,
         userName: user.name,
         userPfp: user.pfp,
         postId: post.id
       });
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
    
    // Recursive function to add reply to nested comments
    const addReplyToTree = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === replyToId) {
          return { ...c, replies: [...(c.replies || []), newComment] };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: addReplyToTree(c.replies) };
        }
        return c;
      });
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        if (replyToId) {
          return { ...p, comments: addReplyToTree(p.comments) };
        }
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    persistPosts(updated);
    
    // Notify
    if (post.userId !== user.id) {
      addInteraction(post.userId);
      
      // Dynamic target finding for notifications (simplified to parent or post owner)
      addNotification(post.userId, {
        type: replyToId ? 'reply' : 'comment',
        userId: user.id,
        userName: user.name,
        userPfp: user.pfp,
        postId: post.id
      });
    }
  };

  const deletePost = async (postId: string) => {
    const updated = posts.filter(p => p.id !== postId);
    persistPosts(updated);
    addActivity('delete', 'Removed a shared frequency from the archive');
    return true;
  };

  const reportPost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // In a real app, we'd flag it. In this prototype, let's hide it from the reporter
    const updated = posts.filter(p => p.id !== postId);
    persistPosts(updated);
    
    addActivity('report', `Reported post ${post.id} for spectral evaluation`);
    alert("Frequency reported. Our architects will evaluate this signal and it has been hidden from your path.");
  };

  return (
    <PostContext.Provider value={{ posts, addPost, likePost, addComment, deletePost, reportPost }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within PostProvider');
  return context;
};
