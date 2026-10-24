import React from 'react';
import { AudioProvider } from './context/AudioContext';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';

function App() {
  return (
    <AudioProvider>
      <AudioPlayer />
    </AudioProvider>
  );
}

export default App;