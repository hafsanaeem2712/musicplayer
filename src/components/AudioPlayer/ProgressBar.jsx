import React from 'react';
import { useAudio } from '../../context/AudioContext';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const ProgressBar = () => {
  const { currentTime, duration, seek } = useAudio();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    seek(Number(e.target.value));
  };

  return (
    <div className="progress-container">
      <span className="time-display current-time" aria-label="Current time">
        {formatTime(currentTime)}
      </span>

      <div className="range-wrapper">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar"
          aria-label="Track progress slider"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${progressPercent}%, rgba(255, 255, 255, 0.15) ${progressPercent}%, rgba(255, 255, 255, 0.15) 100%)`,
          }}
        />
      </div>

      <span className="time-display total-time" aria-label="Total duration">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;