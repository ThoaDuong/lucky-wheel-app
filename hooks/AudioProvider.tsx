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
  playSpin: () => Promise<void>;
  stopSpin: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  spin: 'https://assets.mixkit.co/active_storage/sfx/1344/1344-preview.mp3',
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const spinSound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    loadSettings();
    initializeSpinSound();
    return () => {
      if (spinSound.current) {
        spinSound.current.unloadAsync();
      }
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

  const initializeSpinSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: SOUNDS.spin },
        { isLooping: true, volume: isMuted ? 0 : volume }
      );
      spinSound.current = sound;
    } catch (e) {
      console.error('Failed to pre-load spin sound', e);
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
    if (spinSound.current) {
      spinSound.current.setVolumeAsync(isMuted ? 0 : val);
    }
  };

  const playClick = useCallback(async () => {
    if (isMuted) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: SOUNDS.click },
        { shouldPlay: true, volume }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {}
  }, [isMuted, volume]);

  const playWin = useCallback(async () => {
    if (isMuted) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: SOUNDS.win },
        { shouldPlay: true, volume }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {}
  }, [isMuted, volume]);

  const playSpin = useCallback(async () => {
    if (isMuted || !spinSound.current) return;
    try {
      await spinSound.current.setVolumeAsync(volume);
      await spinSound.current.playAsync();
    } catch (e) {}
  }, [isMuted, volume]);

  const stopSpin = useCallback(async () => {
    if (spinSound.current) {
      try {
        await spinSound.current.stopAsync();
      } catch (e) {}
    }
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        volume,
        toggleMute,
        setGlobalVolume,
        playClick,
        playWin,
        playSpin,
        stopSpin,
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
