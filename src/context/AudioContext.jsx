import React, { createContext, useContext, useState, useRef, useEffect, useMemo } from 'react';
import { TRACKS } from '../data/trackCatalog';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [tracks] = useState(TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const audioRef = useRef(new Audio());

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Sync audio src when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack?.src) return;

    audio.src = currentTrack.src;
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Playback prevented by browser policy or network:', err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => nextTrack();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [volume, isMuted, tracks.length]);

  // Controls
  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.warn('Play error:', err));
    }
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const seek = (newTime) => {
    const audio = audioRef.current;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume) => {
    const vol = parseFloat(newVolume);
    setVolume(vol);
    if (vol > 0 && isMuted) setIsMuted(false);
    audioRef.current.volume = vol;
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      audioRef.current.volume = nextMuted ? 0 : volume;
      return nextMuted;
    });
  };

  // Filtered tracks based on category and search
  const filteredTracks = useMemo(() => {
    return tracks.filter((t) => {
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        t.title.toLowerCase().includes(query) ||
        t.artist.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [tracks, selectedCategory, searchQuery]);

  const value = {
    tracks,
    filteredTracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
    seek,
    handleVolumeChange,
    toggleMute,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};