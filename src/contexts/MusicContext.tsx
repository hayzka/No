import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track } from '../types';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => Promise<void>;
  pauseTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  togglePlay: () => Promise<void>;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, []);

  const playTrack = async (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    if (audioRef.current) {
      // If there's an existing play promise, we don't necessarily need to wait for it here
      // because we're changing the source anyway.
      audioRef.current.src = track.url;
      setCurrentTrack(track);
      setIsPlaying(true);
      
      try {
        playPromiseRef.current = audioRef.current.play();
        await playPromiseRef.current;
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          // Expected when play is interrupted by pause or source change
          return;
        }
        console.error("Playback initiation failed", e);
        setIsPlaying(false);
      } finally {
        playPromiseRef.current = null;
      }
    }
  };

  const pauseTrack = async () => {
    if (audioRef.current) {
      // Wait for any pending play promise to resolve before pausing
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (e) {
          // Ignore errors from the play promise when we're trying to pause
        }
      }
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stopTrack = async () => {
    if (audioRef.current) {
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (e) {}
      }
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!currentTrack) return;
    if (isPlaying) {
      await pauseTrack();
    } else {
      if (audioRef.current) {
        setIsPlaying(true);
        try {
          playPromiseRef.current = audioRef.current.play();
          await playPromiseRef.current;
        } catch (e) {
          if (e instanceof Error && e.name === 'AbortError') return;
          console.error("Toggle playback failed", e);
          setIsPlaying(false);
        } finally {
          playPromiseRef.current = null;
        }
      }
    }
  };

  return (
    <MusicContext.Provider value={{ currentTrack, isPlaying, playTrack, pauseTrack, stopTrack, togglePlay }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};
