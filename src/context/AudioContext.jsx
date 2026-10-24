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

  const audioRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const webAudioCtxRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Synth Fallback Audio Generator
  const playSynthesizedTone = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!webAudioCtxRef.current) {
        webAudioCtxRef.current = new AudioContextClass();
      }
      const ctx = webAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [261.63, 329.63, 392.0, 523.25]; // C, E, G, High C chords
      const freq = notes[Math.floor(Math.random() * notes.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const targetVol = isMuted ? 0 : volume * 0.15;
      gain.gain.setValueAtTime(targetVol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Synth error:', e);
    }
  };

  const startSynthFallback = () => {
    stopSynthFallback();
    setDuration(30);
    synthIntervalRef.current = setInterval(() => {
      playSynthesizedTone();
      setCurrentTime((prev) => {
        if (prev >= 30) {
          nextTrack();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopSynthFallback = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      if (audio) audio.pause();
      stopSynthFallback();
      setIsPlaying(false);
    } else {
      if (audio && audio.src) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // If local or remote media is blocked, run synthesizer fallback
            startSynthFallback();
            setIsPlaying(true);
          });
      } else {
        startSynthFallback();
        setIsPlaying(true);
      }
    }
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    stopSynthFallback();
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            startSynthFallback();
            setIsPlaying(true);
          });
      }
    }, 50);
  };

  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIdx);
  };

  const prevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIdx);
  };

  const seek = (newTime) => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume) => {
    const vol = parseFloat(newVolume);
    setVolume(vol);
    if (vol > 0 && isMuted) setIsMuted(false);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (audioRef.current) {
        audioRef.current.volume = nextMuted ? 0 : volume;
      }
      return nextMuted;
    });
  };

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

  return (
    <AudioContext.Provider
      value={{
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
      }}
    >
      <audio
        ref={audioRef}
        src={currentTrack?.src}
        preload="auto"
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration || 0)}
        onEnded={nextTrack}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};