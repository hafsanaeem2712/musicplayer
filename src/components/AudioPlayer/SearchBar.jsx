import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { TRACK_CATEGORIES } from '../../data/trackCatalog';

export const SearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useAudio();

  return (
    <div className="search-filter-section">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search by song, artist, or genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          aria-label="Search music"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="category-pills" role="tablist" aria-label="Music categories">
        {TRACK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={selectedCategory === cat}
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;