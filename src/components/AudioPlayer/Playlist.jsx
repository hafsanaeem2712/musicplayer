import React from 'react';
import { useAudio } from '../../context/AudioContext';

export const Playlist = () => {
  const {
    tracks,
    filteredTracks,
    currentTrackIndex,
    isPlaying,
    playTrack,
  } = useAudio();

  if (filteredTracks.length === 0) {
    return (
      <div className="playlist-empty-state">
        <p>No tracks found matching your query.</p>
      </div>
    );
  }

  return (
    <div className="playlist-wrapper" role="region" aria-label="Track list">
      <ul className="track-list">
        {filteredTracks.map((track) => {
          // Find original index in master tracks catalog
          const originalIndex = tracks.findIndex((t) => t.id === track.id);
          const isCurrentActive = originalIndex === currentTrackIndex;

          return (
            <li
              key={track.id}
              className={`track-item ${isCurrentActive ? 'active' : ''}`}
              onClick={() => playTrack(originalIndex)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  playTrack(originalIndex);
                }
              }}
              aria-label={`Play ${track.title} by ${track.artist}`}
            >
              <div className="track-left">
                <div className="track-cover-thumbnail">
                  <img src={track.cover} alt={`${track.title} cover`} loading="lazy" />
                  {isCurrentActive && isPlaying && (
                    <div className="playing-pulse-indicator" aria-hidden="true">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>

                <div className="track-info">
                  <h4 className="track-title">{track.title}</h4>
                  <p className="track-artist">{track.artist}</p>
                </div>
              </div>

              <div className="track-right">
                <span className="track-category-badge">{track.category}</span>
                <span className="track-duration">{track.duration}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Playlist;