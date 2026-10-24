import React from 'react';
import { useAudio } from '../../context/AudioContext';

export const Controls = () => {
  const {
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    volume,
    isMuted,
    handleVolumeChange,
    toggleMute,
  } = useAudio();

  const currentVolumeLevel = isMuted ? 0 : volume;

  return (
    <div className="player-controls-container">
      {/* Primary Playback Navigation */}
      <div className="playback-buttons">
        <button
          type="button"
          onClick={prevTrack}
          className="control-btn nav-btn"
          aria-label="Previous track"
          title="Previous Track"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className="control-btn play-pause-btn"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={nextTrack}
          className="control-btn nav-btn"
          aria-label="Next track"
          title="Next Track"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      {/* Volume & Mute Section */}
      <div className="volume-control-wrapper">
        <button
          type="button"
          onClick={toggleMute}
          className="volume-icon-btn"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || currentVolumeLevel === 0 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={currentVolumeLevel}
          onChange={(e) => handleVolumeChange(e.target.value)}
          className="volume-slider"
          aria-label="Volume slider"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${currentVolumeLevel * 100}%, rgba(255, 255, 255, 0.15) ${currentVolumeLevel * 100}%, rgba(255, 255, 255, 0.15) 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export default Controls;