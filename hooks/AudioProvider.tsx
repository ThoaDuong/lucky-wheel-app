import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AudioContextType {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setGlobalVolume: (val: number) => void;
  playClick: () => Promise<void>;
  playWin: () => Promise<void>;
  playTick: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const SOUNDS = {
  click: require('../assets/sounds/click.mp3'),
  win: require('../assets/sounds/win.mp3'),
  tick: require('../assets/sounds/tick.mp3'),
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const tickSound = useRef<Audio.Sound | null>(null);
  const clickSound = useRef<Audio.Sound | null>(null);
  const winSound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    loadSettings();
    initializeSounds();
    return () => {
      [tickSound, clickSound, winSound].forEach(ref => {
        if (ref.current) ref.current.unloadAsync();
      });
    };
  }, []);

  const loadSettings = async () => {
    try {
      const savedMute = await AsyncStorage.getItem('@audio_muted');
      const savedVolume = await AsyncStorage.getItem('@audio_volume');
      if (savedMute !== null) setIsMuted(JSON.parse(savedMute));
      if (savedVolume !== null) setVolume(JSON.parse(savedVolume));
    } catch (e) {
      console.error('Failed to load audio settings', e);
    }
  };

  const saveMute = async (val: boolean) => {
    try {
      await AsyncStorage.setItem('@audio_muted', JSON.stringify(val));
    } catch (e) {}
  };

  const saveVolume = async (val: number) => {
    try {
      await AsyncStorage.setItem('@audio_volume', JSON.stringify(val));
    } catch (e) {}
  };

  const initializeSounds = async () => {
    try {
      const { sound: tSound } = await Audio.Sound.createAsync(SOUNDS.tick, { shouldPlay: false, volume: isMuted ? 0 : volume });
      tickSound.current = tSound;
      
      const { sound: cSound } = await Audio.Sound.createAsync(SOUNDS.click, { shouldPlay: false, volume: isMuted ? 0 : volume });
      clickSound.current = cSound;

      const { sound: wSound } = await Audio.Sound.createAsync(SOUNDS.win, { shouldPlay: false, volume: isMuted ? 0 : volume });
      winSound.current = wSound;
    } catch (e) {
      console.error('Failed to pre-load sounds', e);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newVal = !prev;
      saveMute(newVal);
      return newVal;
    });
  };

  const setGlobalVolume = (val: number) => {
    setVolume(val);
    saveVolume(val);
    [tickSound, clickSound, winSound].forEach(ref => {
      if (ref.current) ref.current.setVolumeAsync(isMuted ? 0 : val);
    });
  };

  const playClick = useCallback(async () => {
    if (isMuted || !clickSound.current) return;
    try {
      await clickSound.current.setPositionAsync(0);
      await clickSound.current.playAsync();
    } catch (e) {}
  }, [isMuted]);

  const playWin = useCallback(async () => {
    if (isMuted || !winSound.current) return;
    try {
      await winSound.current.setPositionAsync(0);
      await winSound.current.playAsync();
    } catch (e) {}
  }, [isMuted]);

  const playTick = useCallback(async () => {
    if (isMuted || !tickSound.current) return;
    try {
      // For very rapid sounds, seek to 0 and play
      await tickSound.current.setPositionAsync(0);
      await tickSound.current.playAsync();
    } catch (e) {}
  }, [isMuted]);

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        volume,
        toggleMute,
        setGlobalVolume,
        playClick,
        playWin,
        playTick,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
