import React from 'react';
import { useAudio } from '../../context/AudioContext';
import SearchBar from './SearchBar';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import Playlist from './Playlist';
import styles from './AudioPlayer.module.css';

export const AudioPlayer = () => {
  const { currentTrack, isPlaying } = useAudio();

  return (
    <div className={styles.appContainer}>
      <main className={styles.playerCard}>
        {/* Left Column: Now Playing Hero */}
        <section className={styles.nowPlayingSection}>
          <header className={styles.header}>
            <span className={styles.badge}>NOW PLAYING</span>
            <span className={styles.genreBadge}>{currentTrack?.category}</span>
          </header>

          <div className={styles.coverWrapper}>
            <img
              src={currentTrack?.cover}
              alt={`${currentTrack?.title} cover art`}
              className={`${styles.albumArt} ${isPlaying ? styles.rotating : ''}`}
            />
            <div className={styles.vinylCenterPin} aria-hidden="true" />
          </div>

          <div className={styles.metaData}>
            <h2 className={styles.songTitle}>{currentTrack?.title}</h2>
            <p className={styles.songArtist}>{currentTrack?.artist}</p>
          </div>

          <ProgressBar />
          <Controls />
        </section>

        {/* Right Column: Search & Playlist Library */}
        <section className={styles.librarySection}>
          <header className={styles.libraryHeader}>
            <h3>Track Library</h3>
          </header>
          <SearchBar />
          <Playlist />
        </section>
      </main>
    </div>
  );
};

export default AudioPlayer;